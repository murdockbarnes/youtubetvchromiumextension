// YouTube TV Mode — Xbox One Controller Support
// Maps Xbox One gamepad inputs to keyboard events for Leanback UI navigation

(function () {
  "use strict";

  // Xbox One controller button mapping (Standard Gamepad layout)
  const BUTTON_MAP = {
    0:  "Enter",      // A — Select
    1:  "Escape",     // B — Back
    2:  null,         // X
    3:  null,         // Y
    4:  "MediaTrackPrevious",  // LB
    5:  "MediaTrackNext",      // RB
    6:  null,         // LT (analog)
    7:  null,         // RT (analog)
    8:  "Escape",     // View — Back
    9:  "Escape",     // Menu
    10: null,         // Left Stick Press
    11: null,         // Right Stick Press
    12: "ArrowUp",    // D-Pad Up
    13: "ArrowDown",  // D-Pad Down
    14: "ArrowLeft",  // D-Pad Left
    15: "ArrowRight", // D-Pad Right
    16: "GoHome",     // Xbox Button
  };

  const KEY_CODES = {
    "Enter": 13, "Escape": 27,
    "ArrowUp": 38, "ArrowDown": 40, "ArrowLeft": 37, "ArrowRight": 39,
    "MediaTrackPrevious": 177, "MediaTrackNext": 176,
    "GoHome": 36,
  };

  const STICK_THRESHOLD = 0.5;
  const REPEAT_DELAY = 400;
  const REPEAT_INTERVAL = 120;

  const btnState = {};
  const stickState = { dir: null };
  const repeatTimers = {};

  function fireKey(key, type) {
    if (!key) return;
    const evt = new KeyboardEvent(type, {
      key, code: key,
      keyCode: KEY_CODES[key] || 0,
      which: KEY_CODES[key] || 0,
      bubbles: true, cancelable: true,
    });
    (document.activeElement || document).dispatchEvent(evt);
  }

  function startRepeat(id, key) {
    stopRepeat(id);
    fireKey(key, "keydown");
    repeatTimers[id] = {
      timeout: setTimeout(() => {
        repeatTimers[id].interval = setInterval(() => fireKey(key, "keydown"), REPEAT_INTERVAL);
      }, REPEAT_DELAY),
    };
  }

  function stopRepeat(id) {
    const t = repeatTimers[id];
    if (t) { clearTimeout(t.timeout); clearInterval(t.interval); delete repeatTimers[id]; }
  }

  function handleStick(gp) {
    const lx = gp.axes[0] || 0;
    const ly = gp.axes[1] || 0;

    let dir = null;
    if (ly < -STICK_THRESHOLD) dir = "ArrowUp";
    else if (ly > STICK_THRESHOLD) dir = "ArrowDown";
    else if (lx < -STICK_THRESHOLD) dir = "ArrowLeft";
    else if (lx > STICK_THRESHOLD) dir = "ArrowRight";

    if (dir !== stickState.dir) {
      if (stickState.dir) { stopRepeat("stick"); fireKey(stickState.dir, "keyup"); }
      stickState.dir = dir;
      if (dir) startRepeat("stick", dir);
    }
  }

  function pollGamepads() {
    const gamepads = navigator.getGamepads();
    for (const gp of gamepads) {
      if (!gp) continue;

      for (let i = 0; i < gp.buttons.length; i++) {
        const pressed = gp.buttons[i].pressed;
        const key = BUTTON_MAP[i];
        if (!key) continue;
        const sid = `b${i}`;

        if (pressed && !btnState[sid]) {
          btnState[sid] = true;
          if (i >= 12 && i <= 15) {
            startRepeat(sid, key);
          } else {
            fireKey(key, "keydown");
          }
        } else if (!pressed && btnState[sid]) {
          btnState[sid] = false;
          if (i >= 12 && i <= 15) stopRepeat(sid);
          fireKey(key, "keyup");
        }
      }

      handleStick(gp);
    }
    requestAnimationFrame(pollGamepads);
  }

  let polling = false;
  function startPolling() {
    if (!polling) { polling = true; requestAnimationFrame(pollGamepads); }
  }

  // --- Toast notification ---
  function showToast(message, icon) {
    // Remove existing toast
    const old = document.getElementById("yttv-gamepad-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.id = "yttv-gamepad-toast";
    toast.innerHTML = `
      <div style="
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(24, 24, 24, 0.92);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 12px;
        padding: 14px 28px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        color: #e8e8e8;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        animation: yttv-toast-in 0.3s ease forwards;
        pointer-events: none;
      ">
        <span style="font-size: 18px; vertical-align: middle; margin-top: -2px; display: inline-block;">${icon}</span>
        <span style="vertical-align: middle; display: inline-block;">${message}</span>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes yttv-toast-in {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      @keyframes yttv-toast-out {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to   { opacity: 0; transform: translateX(-50%) translateY(20px); }
      }
    `;
    toast.appendChild(style);
    document.body.appendChild(toast);

    // Auto-dismiss after 3s
    setTimeout(() => {
      const inner = toast.querySelector("div");
      if (inner) inner.style.animation = "yttv-toast-out 0.3s ease forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  window.addEventListener("gamepadconnected", (e) => {
    console.log("[YT TV Mode] Controller: " + e.gamepad.id);
    showToast(`Controller connected: ${e.gamepad.id}`, "🎮");
    startPolling();
  });

  window.addEventListener("gamepaddisconnected", (e) => {
    console.log("[YT TV Mode] Controller disconnected: " + e.gamepad.id);
    showToast(`Controller disconnected`, "🎮");
  });

  if (navigator.getGamepads().some((g) => g !== null)) startPolling();
})();
