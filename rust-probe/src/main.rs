use dht_embedded::{Dht22, DhtSensor, NoopInterruptControl};
use esp_idf_hal::{
    delay::Ets,
    gpio::{PinDriver, Pins},
};
use esp_idf_sys as _; // If using the `binstart` feature of `esp-idf-sys`, always keep this module imported
use std::{thread, time};

mod http;
mod wifi;

const SSID: &str = env!("SSID");
const PASSWORD: &str = env!("PASSWORD");
const DEVICE_NAME: &str = env!("DEVICE_NAME");
const TOKEN: &str = env!("TOKEN");
const URL: &str = env!("URL");

fn c_to_f(c: f32) -> f32 {
    (c * (9.0 / 5.0)) + 32.0
}

fn run() -> anyhow::Result<()> {
    let loop_delay_str: &str = option_env!("LOOP_DELAY").unwrap_or("60000");
    let loop_delay: time::Duration = time::Duration::from_millis(loop_delay_str.parse()?);

    // Hold onto the EspWifi reference so that we don't drop our wifi connection unexpectedly
    let _wifi = wifi::wifi(SSID, PASSWORD)?;

    println!();
    println!("Connected to wifi and ready to start reporting data!");
    println!("I will report data as {}", DEVICE_NAME);
    println!("I wait {}ms between measurements", loop_delay.as_millis());
    println!();

    let pins = unsafe { Pins::new() };
    let pin_driver = PinDriver::input_output(pins.gpio4)?;
    let mut sensor = Dht22::new(NoopInterruptControl, Ets, pin_driver);

    loop {
        match sensor.read() {
            Ok(reading) => {
                let c = reading.temperature();
                let h = reading.humidity();
                let f = c_to_f(reading.temperature());
                println!("{}°C, {}% RH", c, h);
                // Propagate errors here so that we reboot if the POST fails
                http::post_reading(URL, h, f, DEVICE_NAME, TOKEN)?;
            }
            // Sensor errors are usually transient and not worth rebooting over: This error is logged and swallowed
            Err(e) => eprintln!("Error: {}", e),
        }

        thread::sleep(loop_delay);
    }
}

fn main() -> anyhow::Result<()> {
    // Temporary. Will disappear once ESP-IDF 4.4 is released, but for now it is necessary to call this function once,
    // or else some patches to the runtime implemented by esp-idf-sys might not link properly.
    esp_idf_sys::link_patches();

    match run() {
        Ok(_) => Ok(()),
        Err(e) => {
            println!(
                "\n\n{}\n---FAULT DETECTED - GOING DOWN FOR A REBOOT ---\n\n\n",
                e
            );
            esp_idf_hal::reset::restart();
            Ok(())
        }
    }
}
