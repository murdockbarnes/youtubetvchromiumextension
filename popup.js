// YouTube TV Mode — Popup Controller

const dot = document.getElementById("dot");
const statusText = document.getElementById("statusText");
const toggleBtn = document.getElementById("toggleBtn");
const openBtn = document.getElementById("openBtn");

function render(enabled) {
  if (enabled) {
    dot.classList.remove("off");
    statusText.textContent = "Active";
    toggleBtn.textContent = "Disable";
    toggleBtn.className = "toggle-btn on";
  } else {
    dot.classList.add("off");
    statusText.textContent = "Disabled";
    toggleBtn.textContent = "Enable";
    toggleBtn.className = "toggle-btn off";
  }
}

// Load current state
chrome.storage.local.get({ enabled: true }, ({ enabled }) => render(enabled));

// Toggle
toggleBtn.addEventListener("click", async () => {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  const newState = !enabled;
  await chrome.storage.local.set({ enabled: newState });

  // Update ruleset
  const TV_RULESET_ID = "tv_ua_rules";
  try {
    if (newState) {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: [TV_RULESET_ID],
      });
    } else {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: [TV_RULESET_ID],
      });
    }
  } catch (e) {
    console.warn("Ruleset toggle error", e);
  }

  render(newState);
});

// Open YouTube TV
openBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: "https://www.youtube.com/tv" });
  window.close();
});
