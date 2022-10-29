# Open IP-KVM

This project provides an open-source IP-KVM solution.

## What is IP-KVM

> KVM Over IP (IP-KVM) is a hardware based solution for remote access to your computer or server.
> The unit plugs into the Keyboard, Video and Mouse ports of a computer or server and transmits those to a connected user through a network.

![kvm](https://user-images.githubusercontent.com/5763301/198827953-2509f245-0274-4556-9f3e-969b4b33a728.png)


## Features

* Web browser as client
* 1080P 30fps video stream and full mouse & keyboard support
* Highly customizable

## System Diagram


## Hardware Requirements

* HDMI-USB capture device
  * Recommendation: `MS2109` [link](https://item.jd.com/100021347850.html)
  * HDMI-input: Up to 3840*2160 30 FPS
  * Output: Up to 1080P 30 FPS @ MJPEG
* Linux single-board computer
  * Recommendation: [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/), `Phicomm N1`
  * Network connection
  * Recent linux kernel version
  * 2+ USB ports
* Arduino Leonardo [link](https://docs.arduino.cc/hardware/leonardo)
  * to emulate HID (mouse and keyboard) device
* Optional
  * USB-to-TTL Adapter
    * if linux sbc has no built-in serial port
    * Recommendation: `PL2302`
  * USB Wi-Fi Adapter
    * if linux sbc has no built-in Wi-Fi


## How to Deploy

### Arduino Leonardo

TODO

### Linux SBC

* Install MJPG-Streamer
  * [mjpg_streamer](https://github.com/jacksonliam/mjpg-streamer)
* Install Node.js 14.x+
* Clone repo and install dependency
  * `git clone https://github.com/Nihiue/open-ip-kvm.git`
  * `cd open-ip-kvm && npm install`
* Edit `open-ip-kvm/server/config.json`
* Connect IO
  * HDMI-USB capture device via USB
  * Arduino Leonardo via serial port or USB-to-TTL Adapter