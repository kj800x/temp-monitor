# ESP32 Rust Temperature Probe

**Remember to `. $HOME/export-esp.sh` before doing any dev**

Build and release with `cargo espflash flash --release --monitor --port /dev/ttyUSB0`, remember to set enviornment variables before building as documented below

## Build environment variables:

**Required**:
* `SSID`: WiFi network name
* `PASSWORD`: WiFi network password
* `TOKEN`: JWT token for the temperature server (generate with `npm run cli generate-token` in the `server` directory)
* `URL`: Graphql endpoint for the temperature server (i.e. `http://apps.coolkev.com/temp/graphql`)
* `DEVICE_NAME`: Name of the temperature sensor (submitted alongside the readings to identify which sensor took them)

**Optional**:
* `LOOP_DELAY`: Measurement interval in ms, defaults to `60000` (1 minute) if unset