# Open IP-KVM

This project provides an open-source IP-KVM solution.

## What is IP-KVM

KVM Over IP (IP-KVM) is a hardware based solution for remote access to your computer or server.

The unit plugs into the Keyboard, Video and Mouse ports of a computer or server and transmits those to a connected user through a network.

<!-- ![kvm](https://user-images.githubusercontent.com/5763301/198827953-2509f245-0274-4556-9f3e-969b4b33a728.png) -->

### KVM vs RD software(VNC/RDP/TeamViewer)

* RD software requires a working OS, and must be pre-configured. It often fails in an emergency situation
* KVM is out-of-band, so it can be used to install OS, setup BIOS or fix low-level issues

## Features

* Web browser as client
* 1080P 30fps video stream
* Full mouse & keyboard support
* Low latency
* Highly customizable

![Untitled](https://user-images.githubusercontent.com/5763301/198835717-8bb81f27-1a05-46c1-a0b0-1006a6ce29e7.png)

## System Diagram

![diagram](https://user-images.githubusercontent.com/5763301/198833599-87af1bec-92c7-4c87-80cf-8658b842cff5.jpg)

## Hardware Requirements

* HDMI-USB capture device
  * Recommendation: `MS2109` [link](https://item.jd.com/100021347850.html)
  * HDMI-input: Up to 3840*2160 30 FPS
  * Output: Up to 1080P 30 FPS @ MJPEG
* Linux single-board computer
  * Recommendation: [Raspberry Pi 4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/), `Phicomm N1`
  * Recent linux kernel
  * 2+ USB ports
* Arduino Leonardo [link](https://docs.arduino.cc/hardware/leonardo)
  * Emulate HID (mouse and keyboard)
* Optional
  * USB-to-TTL Adapter
    * If linux sbc has no built-in serial port
    * Recommendation: `PL2302`
  * USB Wi-Fi Adapter
    * If linux sbc has no built-in Wi-Fi


## Deployment and Usage

### 1. Clone Repo
```
git clone https://github.com/Nihiue/open-ip-kvm.git
```

### 2. Program Arduino Leonardo

* Download and install [Arduino IDE](https://www.arduino.cc/en/software/)
* Connect leonardo to computer via USB
* Open `open-ip-kvm/virt-hid-arduino/virt-hid-arduino.ino`, compile and upload the program

### 3. Prepare Linux SBC

* Build and Install MJPG-Streamer
  * See [mjpg_streamer](https://github.com/jacksonliam/mjpg-streamer)
* Install Node.js 14.x+
* Install dependency
  * `cd open-ip-kvm && npm install`
* Connect IO
  * HDMI-USB capture device via USB
  * Arduino Leonardo via serial port or USB-to-TTL Adapter
* Edit `open-ip-kvm/server/config.json`
  * `mjpg_streamer.device`: path of HDMI-USB capture device
  * `serialport`: path of serial port


### 4. Run

1. Connect HDMI output of target computer to HDMI-USB capture device
2. Connect target computer to leonardo via USB
3. Run `cd open-ip-kvm && npm run start` on linux SBC
4. Turn on target computer
5. Open `http://[IP of Linux SBC]:8000` in web browser

How to control

* Mouse
  * Click anywhere to enter pointer capture mode
  * Press `ESC` to exit
* Keyboard
  * Press `Enter` to enter key capture mode
  * press `Shift + Esc` to exit

## License

MIT

## Credits

Video stream is powered by [mjpg_streamer](https://github.com/jacksonliam/mjpg-streamer)

