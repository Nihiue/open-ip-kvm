# Open IP-KVM

This project provides an open-source IP-KVM solution.

Related article:

[DIY 一个运维神器 Open IP-KVM](https://zhuanlan.zhihu.com/p/578602475)

[English Version By Google Translate](https://zhuanlan-zhihu-com.translate.goog/p/578602475?_x_tr_sl=zh-CN&_x_tr_tl=en)

## What is IP-KVM

KVM Over IP (IP-KVM) is a hardware based solution for remote access to your computer or server.

The unit plugs into the Keyboard, Video and Mouse ports of a computer or server and transmits those to a connected user through a network.

<!-- ![kvm](https://user-images.githubusercontent.com/5763301/198827953-2509f245-0274-4556-9f3e-969b4b33a728.png) -->

### IP-KVM vs RD software(VNC/RDP/TeamViewer)

* RD software requires a working OS, and must be pre-configured. It often fails in an emergency situation
* IP-KVM is out-of-band, so it can be used to install OS, setup BIOS or fix low-level issues

## Features

* Web browser as client
* 1080P 30fps video stream
* Full mouse & keyboard support
* UI Indicator
* Remote Paste: Input ASCII sequence

![screenshot](https://user-images.githubusercontent.com/5763301/198885015-f1cd83d7-6717-410c-8837-68b347f4b29c.png)

## System Diagram

![diagram](https://user-images.githubusercontent.com/5763301/198833599-87af1bec-92c7-4c87-80cf-8658b842cff5.jpg)

## Hardware Requirements

* HDMI-USB capture device
  * Recommendation: `MS2109` [link](https://item.jd.com/100021347850.html)
  * Input: Up to 4K 30FPS
  * Output: Up to 1080P 30FPS @ MJPEG
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


## Deploy and Run

### 1. Clone Repo
```
git clone https://github.com/Nihiue/open-ip-kvm.git
```

### 2. Prepare Arduino Leonardo

<details>

<summary>Upload program</summary>


1. Download and install [Arduino IDE](https://www.arduino.cc/en/software/)
2. Connect leonardo to computer via USB
3. Open `open-ip-kvm/virt-hid-arduino/virt-hid-arduino.ino`,  click `Sketch/Upload (Ctrl + U)`
4. Disconnect USB

</details>

<details>

<summary>Connect serial port</summary>

![image](https://user-images.githubusercontent.com/5763301/198872791-cbac6e09-562a-43ae-82fb-a5533461d36b.png)

![serial](https://user-images.githubusercontent.com/5763301/198873347-8bade4fc-e682-4f46-a115-ec6dc4e09d22.jpg)

</details>

### 3. Prepare Linux SBC

<details>

<summary>Install Dependency</summary>

* Build and Install [MJPG-Streamer](https://github.com/jacksonliam/mjpg-streamer)
  * [How to build MJPG-Streamer](https://www.acmesystems.it/video_streaming)
* Install Node.js 14.x+
  * [Install NodeJS on Armbian](https://www.autoptr.top/htmls/i12bretro/0507)
* Install node app dependency
  * `cd open-ip-kvm && npm install`
</details>


<details>

<summary>Connect IO and edit config</summary>

* Connect IO
  * HDMI-USB capture device via USB
  * Arduino Leonardo via native serial port or USB-TTL adapter
* Edit `open-ip-kvm/server/config.json`
  * `mjpg_streamer.device`: path of HDMI-USB capture device
  * `serialport`: path of serial port

</details>


### 4. Run

1. Connect HDMI output of target computer to HDMI-USB capture device
2. Connect target computer to leonardo via USB
3. Run `cd open-ip-kvm && npm run start` on linux SBC
4. Turn on target computer
5. Open `http://[IP of Linux SBC]:8000` in web browser

How to control

* Mouse
  * Click anywhere to enter `pointer capture` mode
  * Press `ESC` to exit
* Keyboard
  * Press `Enter` to enter `key capture` mode
  * press `Shift + ESC` to exit

## License

MIT

## Credits

Video stream is powered by [mjpg_streamer](https://github.com/jacksonliam/mjpg-streamer)

