// YouTube TV Mode — Content Script
// Injects UA spoof into page world via web_accessible_resources (bypasses CSP)

(function () {
  "use strict";

  // Inject page-world script via src (not inline — avoids CSP block)
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("inject-ua.js");
  (document.head || document.documentElement).prepend(script);
  script.onload = () => script.remove();

  // Force full animations via URL hash parameter
  function ensureAnimations() {
    const url = new URL(location.href);
    if (url.pathname.startsWith('/tv')) {
      const hash = url.hash || '';
      if (!hash.includes('env_forceFullAnimation=true')) {
        const newHash = hash
          ? hash + '&env_forceFullAnimation=true'
          : '#/?env_forceFullAnimation=true';
        location.hash = newHash;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureAnimations);
  } else {
    ensureAnimations();
  }

  // Prevent YouTube from redirecting away from /tv
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      if (
        !location.pathname.startsWith("/tv") &&
        document.referrer.includes("/tv")
      ) {
        history.replaceState(null, "", "/tv");
        location.replace("https://www.youtube.com/tv#/?env_forceFullAnimation=true");
      }
    }
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
