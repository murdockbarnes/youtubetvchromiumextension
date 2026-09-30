# YouTube TV Desktop (Custom Build v1.0.6)

A dedicated, ad-free desktop client for YouTube's TV interface (Leanback), engineered for seamless 1080p to 4K media playback and full controller support.

## Features \& Customizations

* **1080p/4K DRM Playback:** Uses a custom Electron engine (Castlabs) to bypass YouTube's Widevine L3 restrictions that normally cap desktop extensions at 720p.
* **Double-Layer Ad-Skipper:**

  * Network-level blocking powered by the Ghostery engine.
  * Zero-flash DOM Ad-Skipper that instantly fast-forwards and mutes unskippable server-injected ads in milliseconds.
* **Enhanced Controller Support:** Perfectly scaled toast notifications for 1080p/4K TVs with friendly hardware parsing (e.g., identifies "Xbox Controller" or "PlayStation 5 DualSense" instead of raw HID strings).
* **Cinematic Default:** Automatically launches into borderless full screen (toggleable via F11).

## Credits \& Acknowledgements

This customized build stands on the shoulders of several fantastic open-source projects. Due credit goes to:

* **Marcos Rodríguez Yáclamo (@marcosrg9):** For creating the original base YouTube TV Electron wrapper that this project was forked and heavily modified from.
* **Castlabs:** For their specialized DRM-enabled Electron builds.
* **Ghostery:** For the underlying @ghostery/adblocker-electron tracking and blocking network engine.

## Installation

Simply run YouTube TV Setup 1.0.6.exe. The app will install and automatically launch in full screen.

