use dht_embedded::{Dht22, DhtSensor, NoopInterruptControl};
use esp_idf_hal::{
    delay::Ets,
    gpio::{PinDriver, Pins},
};
use esp_idf_sys as _; // If using the `binstart` feature of `esp-idf-sys`, always keep this module imported
use std::{thread, time};

// mod tiny_mqtt;
mod http;
mod wifi;

static ONE_SEC: time::Duration = time::Duration::from_millis(1000);
const SSID: &str = env!("SSID");
const PASSWORD: &str = env!("PASSWORD");
const DEVICE_NAME: &str = env!("DEVICE_NAME");
const TOKEN: &str = env!("TOKEN");
const URL: &str = env!("URL");

fn c_to_f(c: f32) -> f32 {
    (c * (9.0 / 5.0)) + 32.0
}

fn main() -> anyhow::Result<()> {
    // Temporary. Will disappear once ESP-IDF 4.4 is released, but for now it is necessary to call this function once,
    // or else some patches to the runtime implemented by esp-idf-sys might not link properly.
    esp_idf_sys::link_patches();

    // Hold onto wifi so that we don't drop our wifi connection unexpectedly
    let _wifi = wifi::wifi(SSID, PASSWORD)?;

    http::get("http://neverssl.com/")?;

    println!("Hello, world!");
    println!("I will report data as {}", DEVICE_NAME);

    let pins;
    unsafe {
        pins = Pins::new();
    }

    let pin_driver = PinDriver::input_output(pins.gpio4)?;
    let mut sensor = Dht22::new(NoopInterruptControl, Ets, pin_driver);

    let mut i = 0;
    loop {
        thread::sleep(ONE_SEC);
        i += 1;

        match sensor.read() {
            Ok(reading) => {
                println!(
                    "{}°C, {}% RH, iteration: {}",
                    reading.temperature(),
                    reading.humidity(),
                    i
                );
                http::post(URL, reading.humidity(), c_to_f(reading.temperature()))?;
            }
            Err(e) => eprintln!("Error: {}", e),
        }
    }
}
