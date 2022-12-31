use core::str;

use embedded_svc::{
    http::{client::Client, Status},
    io::{Read, Write},
};

use esp_idf_svc::http::client::{Configuration, EspHttpConnection};
use esp_idf_sys as _;

use crate::{DEVICE_NAME, TOKEN};

pub fn post(url: impl AsRef<str>, humidity: f32, temperature: f32) -> anyhow::Result<()> {
    let connection = EspHttpConnection::new(&Configuration {
        ..Default::default()
    })?;

    let mut client = Client::wrap(connection);

    let payload = format!("{{\"operationName\":null,\"variables\":{{}},\"query\":\"mutation {{ record(source: \\\"{}\\\", humidity: {}, temperature: {}) {{ id }} }}\"}}", DEVICE_NAME, humidity, temperature);
    // println!("{}", payload);

    let content_length = payload.as_bytes().len().to_string();

    let headers = [
        ("Authorization", TOKEN),
        ("Content-Type", "application/json"),
        ("Content-Length", content_length.as_str()),
    ];

    // 2. Open a GET request to `url`
    let mut request = client.post(url.as_ref(), &headers)?;

    // FIXME: Somehow this payload is not getting written as the post body
    request.write_all(payload.as_bytes())?;
    request.flush()?;

    // 4. Submit our write request and check the status code of the response.
    // Successful http status codes are in the 200..=299 range.

    let response = request.submit()?;
    let status = response.status();

    println!("response code: {}\n", status);

    let mut buf = [0_u8; 256];
    let mut reader = response;
    loop {
        if let Ok(size) = Read::read(&mut reader, &mut buf) {
            if size == 0 {
                break;
            }
            // 6. try converting the bytes into a Rust (UTF-8) string and print it
            let response_text = str::from_utf8(&buf[..size])?;
            println!("{}", response_text);
        }
    }

    // 5. if the status is OK, read response data chunk by chunk into a buffer and print it until done
    match status {
        200..=299 => {}
        _ => anyhow::bail!("unexpected response code: {}", status),
    }

    Ok(())
}

pub fn get(url: impl AsRef<str>) -> anyhow::Result<()> {
    let connection = EspHttpConnection::new(&Configuration {
        ..Default::default()
    })?;

    let mut client = Client::wrap(connection);

    // 2. Open a GET request to `url`
    let request = client.get(url.as_ref())?;

    // 3. Requests *may* send data to the server. Turn the request into a writer, specifying 0 bytes as write length
    // (since we don't send anything - but have to do the writer step anyway)
    // https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/protocols/esp_http_client.html
    // If this were a POST request, you'd set a write length > 0 and then writer.do_write(&some_buf);

    // asdfasdfasdf has been updated now just use the request object directly

    // 4. Submit our write request and check the status code of the response.
    // Successful http status codes are in the 200..=299 range.

    let response = request.submit()?;
    let status = response.status();

    println!("response code: {}\n", status);

    match status {
        200..=299 => {
            // 5. if the status is OK, read response data chunk by chunk into a buffer and print it until done
            let mut buf = [0_u8; 256];
            let mut reader = response;
            loop {
                if let Ok(size) = Read::read(&mut reader, &mut buf) {
                    if size == 0 {
                        break;
                    }
                    // 6. try converting the bytes into a Rust (UTF-8) string and print it
                    let response_text = str::from_utf8(&buf[..size])?;
                    println!("{}", response_text);
                }
            }
        }
        _ => anyhow::bail!("unexpected response code: {}", status),
    }

    Ok(())
}