use core::str;
use embedded_svc::{
    http::{client::Client, Status},
    io::{Read, Write},
};
use esp_idf_svc::http::client::{Configuration, EspHttpConnection};
use esp_idf_sys as _;

pub fn post_reading(
    url: impl AsRef<str>,
    humidity: f32,
    temperature: f32,
    device_name: &str,
    token: &str,
) -> anyhow::Result<()> {
    // 0. Prepare the payload
    let payload = format!("{{\"operationName\":null,\"variables\":{{}},\"query\":\"mutation {{ record(source: \\\"{}\\\", humidity: {}, temperature: {}) {{ id }} }}\"}}", device_name, humidity, temperature);
    let content_length = payload.as_bytes().len().to_string();

    // 1. Prepare the connection
    let connection = EspHttpConnection::new(&Configuration {
        ..Default::default()
    })?;
    let mut client = Client::wrap(connection);

    // 2. Open a POST request to `url`
    let headers = [
        ("Authorization", token),
        ("Content-Type", "application/json"),
        ("Content-Length", content_length.as_str()),
    ];
    let mut request = client.post(url.as_ref(), &headers)?;

    // 3. Write the payload. It's important that we also send the Content-Length header which we did earlier
    request.write_all(payload.as_bytes())?;
    request.flush()?;

    // 4. Submit our write request and check the status code of the response.
    // Successful http status codes are in the 200..=299 range.
    let response = request.submit()?;
    let status = response.status();

    // 5. If the status is OK, we're good! Otherwise, read the response body, print it out, and then raise an error.
    match status {
        200..=299 => Ok(()),
        _ => {
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
            anyhow::bail!("Unexpected response code: {}", status)
        }
    }
}
