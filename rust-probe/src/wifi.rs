// based on https://github.com/ferrous-systems/espressif-trainings/blob/1ec7fd78660c58739019b4c146634077a08e3d5e/common/lib/esp32-c3-dkc02-bsc/src/wifi.rs
// based on https://github.com/ivmarkov/rust-esp32-std-demo/blob/main/src/main.rs

use anyhow::{bail, Ok};
use embedded_svc::wifi::{AuthMethod, ClientConfiguration, Configuration, Wifi};
use esp_idf_svc::{
    eventloop::EspEventLoop,
    netif::{EspNetif, EspNetifWait},
    wifi::{EspWifi, WifiWait},
};
use log::info;
use std::{net::Ipv4Addr, time::Duration};

// use crate::DEVICE_NAME;

pub fn wifi<'a>(ssid: &'a str, psk: &'a str) -> anyhow::Result<EspWifi<'a>> {
    let mut auth_method = AuthMethod::WPA2Personal;
    if ssid.is_empty() {
        anyhow::bail!("Missing WiFi name")
    }
    if psk.is_empty() {
        auth_method = AuthMethod::None;
        println!("WiFi password is empty");
    }

    let modem = unsafe { esp_idf_hal::modem::WifiModem::new() };
    let sysloop = EspEventLoop::take()?;

    let mut wifi = EspWifi::new(modem, sysloop.clone(), None)?;
    println!("Searching for WiFi network {}", ssid);

    let ap_infos = wifi.scan()?;
    let ours = ap_infos.into_iter().find(|a| a.ssid == ssid);
    let channel = if let Some(ours) = ours {
        println!(
            "Found configured access point {} on channel {}",
            ssid, ours.channel
        );
        Some(ours.channel)
    } else {
        println!(
            "Configured access point {} not found during scanning, will go with unknown channel",
            ssid
        );
        None
    };

    println!("Setting WiFi configuration");

    // let dhcpConfig = ipv4::ClientConfiguration::DHCP(ipv4::DHCPClientSettings {
    //     hostname: Some(heapless::String::from("Asdf")),
    // });

    let conf = Configuration::Client(ClientConfiguration {
        ssid: ssid.into(),
        password: psk.into(),
        channel,
        auth_method,
        ..Default::default()
    });

    wifi.set_configuration(&conf)?;
    // let netif = wifi.sta_netif_mut();
    // let hostname = format!("temp-probe-{}", DEVICE_NAME);
    // println!("Setting hostname to {}", hostname);
    // netif.set_hostname(&hostname).unwrap();

    println!("Getting WiFi status");

    wifi.start()?;
    if !WifiWait::new(&sysloop)?
        .wait_with_timeout(Duration::from_secs(20), || wifi.is_started().unwrap())
    {
        bail!("WiFi did not start");
    }

    wifi.connect()?;

    if !EspNetifWait::new::<EspNetif>(wifi.sta_netif(), &sysloop)?.wait_with_timeout(
        Duration::from_secs(10),
        || {
            // println!("isConnected {}", wifi.is_connected().unwrap());
            // println!("ip {:?}", wifi.sta_netif().get_ip_info().unwrap().ip);
            wifi.is_connected().unwrap()
                && wifi.sta_netif().get_ip_info().unwrap().ip != Ipv4Addr::new(0, 0, 0, 0)
        },
    ) {
        bail!("WiFi did not connect or did not receive a DHCP lease");
    }

    let ip_info = wifi.sta_netif().get_ip_info()?;
    info!("WiFi DHCP info: {:?}", ip_info);

    Ok(wifi)
}
