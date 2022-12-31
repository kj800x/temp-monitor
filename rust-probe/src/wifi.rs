// based on https://github.com/ferrous-systems/espressif-trainings/blob/1ec7fd78660c58739019b4c146634077a08e3d5e/common/lib/esp32-c3-dkc02-bsc/src/wifi.rs
// based on https://github.com/ivmarkov/rust-esp32-std-demo/blob/main/src/main.rs

use std::{net::Ipv4Addr, time::Duration};

use anyhow::{bail, Ok};
use embedded_svc::{
    ipv4,
    wifi::{AuthMethod, ClientConfiguration, Configuration, Wifi},
};
use esp_idf_svc::{
    eventloop::EspEventLoop,
    netif::{EspNetif, EspNetifWait},
    ping,
    wifi::{EspWifi, WifiWait},
};
use log::info;

fn ping(ip: ipv4::Ipv4Addr) -> anyhow::Result<()> {
    info!("About to do some pings for {:?}", ip);

    let ping_summary = ping::EspPing::default().ping(ip, &Default::default())?;
    if ping_summary.transmitted != ping_summary.received {
        bail!("Pinging IP {} resulted in timeouts", ip);
    }

    info!("Pinging done");

    Ok(())
}

pub fn wifi<'a>(ssid: &'a str, psk: &'a str) -> anyhow::Result<EspWifi<'a>> {
    let mut auth_method = AuthMethod::WPA2Personal; // Todo: add this setting - router dependent
    if ssid.is_empty() {
        anyhow::bail!("missing WiFi name")
    }
    if psk.is_empty() {
        auth_method = AuthMethod::None;
        println!("Wifi password is empty");
    }

    println!("Test Point A - before WifiModem creation");

    let modem;
    unsafe {
        modem = esp_idf_hal::modem::WifiModem::new();
    };

    println!("Test Point B - before EspEventLoop<System> creation");

    let sysloop = EspEventLoop::take()?;
    // let partition = EspNvsPartition::take();
    // let default_nvs = EspDefaultNvs::new(partition, "wifi", true)?;

    println!("Test Point C - before EspWifi creation");

    let mut wifi = EspWifi::new(modem, sysloop.clone(), None)?;

    println!("Searching for Wifi network {}", ssid);

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

    println!("setting Wifi configuration");
    let conf = Configuration::Client(ClientConfiguration {
        ssid: ssid.into(),
        password: psk.into(),
        channel,
        auth_method,
        ..Default::default()
    });

    wifi.set_configuration(&conf)?;

    println!("getting Wifi status");

    wifi.start()?;

    if !WifiWait::new(&sysloop)?
        .wait_with_timeout(Duration::from_secs(20), || wifi.is_started().unwrap())
    {
        bail!("Wifi did not start");
    }

    wifi.connect()?;

    if !EspNetifWait::new::<EspNetif>(wifi.sta_netif(), &sysloop)?.wait_with_timeout(
        Duration::from_secs(20),
        || {
            wifi.is_connected().unwrap()
                && wifi.sta_netif().get_ip_info().unwrap().ip != Ipv4Addr::new(0, 0, 0, 0)
        },
    ) {
        bail!("Wifi did not connect or did not receive a DHCP lease");
    }

    let ip_info = wifi.sta_netif().get_ip_info()?;

    info!("Wifi DHCP info: {:?}", ip_info);

    ping(ip_info.subnet.gateway)?;

    // let netif = wifi.sta_netif_mut();

    // netif.
    // let ipv4_conf = embedded_svc::ipv4::Configuration::Client(
    //     embedded_svc::ipv4::ClientConfiguration::DHCP(DHCPClientSettings {
    //         hostname: Some("TEST-ESP32".into()),
    //     }),
    // );

    // println!("MAC={:?}", &netif.get_mac());
    // println!("HOSTNAME={:?}", &netif.get_hostname());
    // println!("NAME={:?}", &netif.get_name());
    // println!("IP_INFO={:?}", &netif.get_ip_info());
    // println!("DNS={:?}", &netif.get_dns());

    Ok(wifi)
}
