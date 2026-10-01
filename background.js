// YouTube TV Mode — Background Service Worker
// Lightweight: all UA spoofing is handled by declarativeNetRequest (rules.json).
// This service worker only manages the enabled/disabled toggle state.

const TV_RULESET_ID = "tv_ua_rules";

// Toggle the extension on/off
chrome.action.onClicked.addListener(async (tab) => {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  const newState = !enabled;
  await chrome.storage.local.set({ enabled: newState });
  await updateRuleset(newState);
  updateIcon(newState);
});

async function updateRuleset(enabled) {
  try {
    if (enabled) {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: [TV_RULESET_ID],
      });
    } else {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: [TV_RULESET_ID],
      });
    }
  } catch (e) {
    console.warn("YouTube TV Mode: ruleset update error", e);
  }
}

function updateIcon(enabled) {
  const path = enabled
    ? { 16: "icons/icon16.png", 48: "icons/icon48.png", 128: "icons/icon128.png" }
    : { 16: "icons/icon16-off.png", 48: "icons/icon48-off.png", 128: "icons/icon128-off.png" };
  chrome.action.setIcon({ path }).catch(() => {
    // Fallback — disabled icons may not exist
  });
  chrome.action.setTitle({
    title: enabled ? "YouTube TV Mode (ON)" : "YouTube TV Mode (OFF)",
  });
}

// Restore state on startup
chrome.runtime.onStartup.addListener(async () => {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  await updateRuleset(enabled);
  updateIcon(enabled);
});

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ enabled: true });
  updateIcon(true);
});
