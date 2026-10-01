// Injected into page's MAIN world via web_accessible_resources
// Patches navigator for TV UA spoofing

(function(){
  const TV_UA = "Mozilla/5.0 (Linux; Android 12) Cobalt/22.2.3-gold (PS4)";
  try {
    Object.defineProperty(navigator, 'userAgent', {
      get: () => TV_UA, configurable: true
    });
    Object.defineProperty(navigator, 'appVersion', {
      get: () => TV_UA.substring(TV_UA.indexOf('/') + 1), configurable: true
    });
    Object.defineProperty(navigator, 'platform', {
      get: () => 'PlayStation 4', configurable: true
    });
  } catch(e) {}
})();
