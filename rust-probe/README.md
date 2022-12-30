# ESP32 Rust Temperature Probe

Uses the dht-embedded crate with a few extra commits to make it support the new alpha of embedded-hal.

Remember to `. $HOME/export-esp.sh` before doing any dev

Build and release with `cargo espflash flash --release --monitor --port /dev/ttyUSB0`
