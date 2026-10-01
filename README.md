# YouTube TV for Chromium-based Browsers

A lightweight Chromium extension that forces YouTube's **Leanback (TV) UI** when you visit youtube.com/tv, injects Xbox/PlayStation controller support, and forces maximum 4K playback.

## How It Works

YouTube serves its TV/Leanback interface based on the browser's User-Agent string. This extension:

1. **Spoofs the User-Agent** to a Samsung Tizen Smart TV via declarativeNetRequest (zero-overhead, runs at the network layer)
2. **Patches 
avigator.userAgent** in the page context so YouTube's JavaScript also detects a TV browser
3. **Hides "unsupported device" banners** and optimizes the viewport for fullscreen TV UI
4. **Forces 4K 60fps Playback** by overriding MediaCapabilities and fetch requests
5. **Gamepad Integration** seamlessly maps connected Xbox/PlayStation controllers to TV UI navigation

## Note on Ad-Blocking (Why it's excluded)

This extension does **not** include built-in ad-blocking features. We explicitly chose not to implement ad-blocking natively for two critical reasons:

1. **Manifest V3 Constraints:** This extension is built using modern Manifest V3 standards. MV3 significantly restricts the background network interception (webRequest API) that ad-blockers historically relied on. While declarativeNetRequest exists, maintaining a complex, dynamic database of ad-filter rules natively inside this extension is outside its scope and would dramatically bloat performance.
2. **YouTube's Server-Side Ads (SSAI):** YouTube increasingly stitches ads directly into the video stream. Attempting to block these streams aggressively often results in the video player breaking entirely (e.g., infinite buffering or black screens).

**Recommendation:** For an ad-free experience, simply install a dedicated, purpose-built adblocker (like **uBlock Origin Lite** or **AdBlock**) alongside this extension. They will work together perfectly.

## Install

1. Open Chrome/Helium -> chrome://extensions/
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select this youtube-tv-extension folder
5. Navigate to **youtube.com/tv** - enjoy the TV UI!
