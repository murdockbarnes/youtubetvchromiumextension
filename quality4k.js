// YouTube TV Mode — 4K Quality Loader
// Injects 4K capability script into page world via web_accessible_resources

(function () {
  "use strict";

  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("inject-4k.js");
  (document.head || document.documentElement).prepend(script);
  script.onload = () => script.remove();
})();
