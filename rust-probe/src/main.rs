use dht_embedded::{Dht22, DhtSensor, NoopInterruptControl};
use esp_idf_hal::{
    delay::Ets,
    gpio::{PinDriver, Pins},
};
use esp_idf_sys as _; // If using the `binstart` feature of `esp-idf-sys`, always keep this module imported
use std::{thread, time};

mod tiny_mqtt;

static ONE_SEC: time::Duration = time::Duration::from_millis(1000);
const SSID: &str = env!("SSID");
const PASSWORD: &str = env!("PASSWORD");
const DEVICE_NAME: &str = env!("DEVICE_NAME");

fn main() -> anyhow::Result<()> {
    // Temporary. Will disappear once ESP-IDF 4.4 is released, but for now it is necessary to call this function once,
    // or else some patches to the runtime implemented by esp-idf-sys might not link properly.
    esp_idf_sys::link_patches();

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
            Ok(reading) => println!(
                "{}°C, {}% RH, iteration: {}",
                reading.temperature(),
                reading.humidity(),
                i
            ),
            Err(e) => eprintln!("Error: {}", e),
        }
    }
}
