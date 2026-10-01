// YouTube TV Mode — HD Thumbnails
// Upgrades low-res YouTube thumbnails to highest available resolution

(function () {
  "use strict";

  // Thumbnail quality tiers (best to worst)
  // maxresdefault (1920x1080) > sddefault (640x480) > hqdefault (480x360) > mqdefault (320x180) > default (120x90)
  const LOW_RES = /\/(default|mqdefault|hqdefault|sddefault|hq720)\.(jpg|webp)/;
  const YTIMG_HOST = /i\.ytimg\.com\/vi\//;

  function upgradeThumbnail(img) {
    const src = img.src || img.getAttribute("src") || "";
    if (!YTIMG_HOST.test(src) || !LOW_RES.test(src)) return;

    // Already maxres
    if (src.includes("maxresdefault")) return;
    // Already processed
    if (img.dataset.yttvHd) return;
    img.dataset.yttvHd = "1";

    const ext = src.includes(".webp") ? ".webp" : ".jpg";
    const maxRes = src.replace(LOW_RES, `/maxresdefault${ext}`);

    // Try maxresdefault, fall back to original if 404
    const test = new Image();
    test.onload = () => {
      if (test.naturalWidth > 120) {
        img.src = maxRes;
        // Also update srcset if present
        if (img.srcset) {
          img.srcset = maxRes;
        }
      }
    };
    test.onerror = () => {
      // maxres not available, try hq720
      const hq = src.replace(LOW_RES, `/hq720${ext}`);
      const test2 = new Image();
      test2.onload = () => {
        if (test2.naturalWidth > 120) {
          img.src = hq;
          if (img.srcset) img.srcset = hq;
        }
      };
      test2.src = hq;
    };
    test.src = maxRes;
  }

  // Also handle CSS background-image thumbnails
  function upgradeBackgrounds(el) {
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === "none") return;
    const match = bg.match(/url\(["']?(https?:\/\/i\.ytimg\.com\/vi\/[^"')]+)["']?\)/);
    if (!match) return;
    const src = match[1];
    if (!LOW_RES.test(src) || src.includes("maxresdefault")) return;
    if (el.dataset.yttvHd) return;
    el.dataset.yttvHd = "1";

    const ext = src.includes(".webp") ? ".webp" : ".jpg";
    const maxRes = src.replace(LOW_RES, `/maxresdefault${ext}`);
    const test = new Image();
    test.onload = () => {
      if (test.naturalWidth > 120) {
        el.style.backgroundImage = `url(${maxRes})`;
      }
    };
    test.src = maxRes;
  }

  function processAll() {
    document.querySelectorAll("img").forEach(upgradeThumbnail);
    document.querySelectorAll("[style*='background']").forEach(upgradeBackgrounds);
  }

  // Run on load
  if (document.body) processAll();
  else document.addEventListener("DOMContentLoaded", processAll);

  // Watch for new thumbnails
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.tagName === "IMG") upgradeThumbnail(node);
        else {
          node.querySelectorAll?.("img").forEach(upgradeThumbnail);
          if (node.style?.backgroundImage) upgradeBackgrounds(node);
        }
      }
      // Handle src attribute changes on existing images
      if (m.type === "attributes" && m.target.tagName === "IMG") {
        m.target.dataset.yttvHd = "";
        upgradeThumbnail(m.target);
      }
    }
  });

  const start = () => {
    observer.observe(document.body, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ["src"],
    });
  };

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
