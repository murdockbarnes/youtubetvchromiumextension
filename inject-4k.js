// Injected into page's MAIN world via web_accessible_resources
// Forces 4K 60fps playback capabilities

(function(){
  "use strict";

  // 1. Override screen properties to report 4K
  try {
    Object.defineProperty(screen, 'width',  { get: () => 3840, configurable: true });
    Object.defineProperty(screen, 'height', { get: () => 2160, configurable: true });
    Object.defineProperty(screen, 'availWidth',  { get: () => 3840, configurable: true });
    Object.defineProperty(screen, 'availHeight', { get: () => 2160, configurable: true });
    Object.defineProperty(window, 'devicePixelRatio', { get: () => 1, configurable: true });
  } catch(e) {}

  // 2. Override MediaSource to support all 4K codecs
  if (typeof MediaSource !== 'undefined') {
    const origIsTypeSupported = MediaSource.isTypeSupported.bind(MediaSource);
    MediaSource.isTypeSupported = function(mimeType) {
      if (
        mimeType.includes('vp9') || mimeType.includes('vp09') ||
        mimeType.includes('av01') ||
        mimeType.includes('avc1.6400') || mimeType.includes('avc1.640028') ||
        mimeType.includes('avc1.640033') || mimeType.includes('avc1.640034') ||
        mimeType.includes('hev1') || mimeType.includes('hvc1')
      ) {
        return true;
      }
      return origIsTypeSupported(mimeType);
    };
  }

  // 3. Override MediaCapabilities for 4K60
  if (navigator.mediaCapabilities) {
    const origDecode = navigator.mediaCapabilities.decodingInfo.bind(navigator.mediaCapabilities);
    navigator.mediaCapabilities.decodingInfo = async function(config) {
      try {
        const result = await origDecode(config);
        result.supported = true;
        result.smooth = true;
        result.powerEfficient = true;
        return result;
      } catch(e) {
        return { supported: true, smooth: true, powerEfficient: true };
      }
    };
  }

  // 4. Intercept fetch to inject 4K capabilities
  const origFetch = window.fetch;
  window.fetch = async function(input, init) {
    const url = (typeof input === 'string') ? input : input?.url || '';

    if (url.includes('/youtubei/v1/player') ||
        url.includes('/youtubei/v1/browse') ||
        url.includes('/youtubei/v1/next')) {
      try {
        if (init && init.body) {
          let body = JSON.parse(init.body);
          if (body.context && body.context.client) {
            body.context.client.screenWidthPoints = 3840;
            body.context.client.screenHeightPoints = 2160;
            body.context.client.screenPixelDensity = 1;
            body.context.client.screenDensityFloat = 1;
          }
          init.body = JSON.stringify(body);
        }
      } catch(e) {}
    }

    return origFetch.apply(this, arguments);
  };

  // 5. Force max quality once player is ready
  function forceMaxQuality() {
    const player = document.querySelector('#movie_player') ||
                   document.querySelector('.html5-video-player');
    if (player && typeof player.getAvailableQualityLevels === 'function') {
      const levels = player.getAvailableQualityLevels();
      if (levels && levels.length > 0) {
        const highest = levels[0];
        try { player.setPlaybackQualityRange(highest, highest); } catch(e) {}
        try { player.setPlaybackQuality(highest); } catch(e) {}
        return true;
      }
    }
    return false;
  }

  let attempts = 0;
  const qi = setInterval(() => {
    if (forceMaxQuality() || attempts++ > 30) clearInterval(qi);
  }, 1000);

  const obs = new MutationObserver(() => setTimeout(forceMaxQuality, 2000));
  document.addEventListener('DOMContentLoaded', () => {
    obs.observe(document.body, { childList: true, subtree: true });
  });
})();
