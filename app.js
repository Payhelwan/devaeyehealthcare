/**
 * Deva Eye Healthcare - In-Store Surprise Reward Experience
 * Production-ready mobile logic: Canvas Wheel, Easing Physics, WhatsApp Encoder
 */

// Clinic Brand & Store Configuration
const CLINIC_CONFIG = {
  name: "Deva Eye Healthcare",
  tagline: "Professional Eye Care & Premium Optical Studio",
  phone: "+919876543210",
  displayPhone: "+91 98765 43210",
  address: "Station Road, Near Post Office, Sarvat Khani, Chedibeer, Bhadohi, Piyari, Uttar Pradesh 221401",
  hours: "Open Everyday: 9:00 AM – 8:00 PM",
  googleReviewUrl: "https://maps.google.com", // Replace with clinic's direct Google Maps Place review link
};

// Prize Wheel Segments (Requested 8 options)
const SEGMENTS = [
  {
    text: "FREE SPECTACLE CLEANING",
    shortText: "FREE CLEANING",
    desc: "Complete ultrasonic clean, screw tightening & frame sanitization",
    bg: "#0F172A", // Deep Navy
    textColor: "#FFFFFF",
    badgeColor: "#14B8A6"
  },
  {
    text: "FREE EYE CHECK-UP",
    shortText: "FREE CHECK-UP",
    desc: "Comprehensive computerised vision assessment by optometrist",
    bg: "#F8FAFC", // Off-white linen
    textColor: "#0F172A",
    badgeColor: "#0D9488"
  },
  {
    text: "₹100 OFF",
    shortText: "₹100 OFF",
    desc: "Instant discount voucher applicable on complete spectacles",
    bg: "#0D9488", // Soft Optical Teal
    textColor: "#FFFFFF",
    badgeColor: "#F59E0B"
  },
  {
    text: "FREE FRAME ADJUSTMENT",
    shortText: "FRAME FIT",
    desc: "Bespoke nose-pad tuning, temple alignment & comfort contouring",
    bg: "#F1F5F9", // Crisp surface
    textColor: "#0F172A",
    badgeColor: "#0284C7"
  },
  {
    text: "10% OFF SELECTED FRAMES",
    shortText: "10% OFF FRAMES",
    desc: "10% privilege discount on our selected designer eyewear collection",
    bg: "#1E293B", // Slate Navy
    textColor: "#FFFFFF",
    badgeColor: "#F59E0B"
  },
  {
    text: "FREE CLEANING KIT",
    shortText: "CLEANING KIT",
    desc: "Complimentary anti-fog lens spray & microfiber cleaning cloth",
    bg: "#F8FAFC", // Crisp surface
    textColor: "#0F172A",
    badgeColor: "#10B981"
  },
  {
    text: "LENS UPGRADE OFFER",
    shortText: "LENS UPGRADE",
    desc: "Special concession on Anti-Reflective / Blue-Block lens coatings",
    bg: "#0284C7", // Optical Cobalt
    textColor: "#FFFFFF",
    badgeColor: "#F8FAFC"
  },
  {
    text: "SURPRISE GIFT",
    shortText: "SURPRISE GIFT",
    desc: "Exclusive optical accessory gift package waiting at the reception",
    bg: "#FEF3C7", // Champagne Glow
    textColor: "#92400E",
    badgeColor: "#D97706"
  }
];

// State
let currentRotation = 0;
let isSpinning = false;
let activeReward = null;
let activeClaimCode = null;

// DOM Elements
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const centerSpinBtn = document.getElementById("centerSpinBtn");
const spinBtnText = document.getElementById("spinBtnText");
const wheelStatus = document.getElementById("wheelStatus");
const wheelSection = document.getElementById("wheelSection");
const rewardSection = document.getElementById("rewardSection");

// High-DPI Canvas Setup for Razor-Sharp Text on Mobile
function setupCanvasResolution() {
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = 320;
  const displayHeight = 320;

  canvas.style.width = displayWidth + "px";
  canvas.style.height = displayHeight + "px";
  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;

  ctx.scale(dpr, dpr);
}

// Draw Wheel with Retina Precision
function renderWheel() {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width / 2 - 4;
  const total = SEGMENTS.length;
  const arc = (2 * Math.PI) / total;

  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < total; i++) {
    const seg = SEGMENTS[i];
    const angle = i * arc;

    // Wedge Shape
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + arc);
    ctx.closePath();
    ctx.fillStyle = seg.bg;
    ctx.fill();

    // Subtle divider lines
    ctx.strokeStyle = "rgba(226, 232, 240, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Delicate bezel accent dot
    const midAngle = angle + arc / 2;
    const dotX = centerX + Math.cos(midAngle) * (radius - 10);
    const dotY = centerY + Math.sin(midAngle) * (radius - 10);
    ctx.beginPath();
    ctx.arc(dotX, dotY, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = seg.badgeColor;
    ctx.fill();

    // Radial Typography
    ctx.translate(centerX, centerY);
    ctx.rotate(midAngle);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = seg.textColor;

    // Font selection based on segment text length
    const words = seg.text.split(" ");
    if (words.length > 2 && seg.text.length > 15) {
      ctx.font = "700 9.5px 'Plus Jakarta Sans', system-ui, sans-serif";
      const line1 = words.slice(0, 2).join(" ");
      const line2 = words.slice(2).join(" ");
      ctx.fillText(line1, radius - 22, -6);
      ctx.fillText(line2, radius - 22, 6);
    } else {
      ctx.font = "700 10.5px 'Plus Jakarta Sans', system-ui, sans-serif";
      ctx.fillText(seg.text, radius - 20, 0);
    }

    ctx.restore();
  }

  // Outer bezel border
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 2.5;
  ctx.stroke();
}

// Synthesized subtle haptic/audio tick during spin
function playSubtleTick() {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(8);
    } catch (e) {
      // Ignore vibration restrictions
    }
  }
}

// Generate Unique Verification Code (Format: DEVA-XXXX)
function generateClaimCode() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `DEVA-${randomNum}`;
}

// Main Spin Action
function spinWheel() {
  if (isSpinning) return;

  isSpinning = true;
  spinBtn.disabled = true;
  centerSpinBtn.disabled = true;
  spinBtn.classList.add("opacity-80", "cursor-not-allowed");
  spinBtnText.textContent = "DISCOVERING REWARD...";
  
  wheelStatus.innerHTML = `
    <span class="inline-block animate-spin mr-1">🌀</span> 
    <span class="text-teal-700 font-semibold">Calibrating your in-store privilege...</span>
  `;

  // Select target prize segment
  const total = SEGMENTS.length;
  const targetIndex = Math.floor(Math.random() * total);
  activeReward = SEGMENTS[targetIndex];

  // Mathematical alignment:
  // In canvas, 0 radians is 3 o'clock (90 deg clockwise from 12 o'clock).
  // The top indicator is at 12 o'clock (270 degrees in canvas space).
  // The center of segment i is at (i * arc + arc/2).
  const arcDeg = 360 / total;
  const targetCenterDeg = (targetIndex * arcDeg) + (arcDeg / 2);
  
  // Calculate the rotation needed to bring targetCenterDeg to 270 deg
  // (270 - targetCenterDeg + 360) % 360
  const normalizedAlignment = (270 - targetCenterDeg + 360) % 360;
  
  // Add 6 complete rotations (2160 deg) for suspenseful, natural deceleration
  const totalRotations = 360 * 6;
  const spinDelta = totalRotations + normalizedAlignment;
  
  // Accumulate rotation so wheel doesn't jump backwards
  currentRotation += spinDelta;

  canvas.classList.add("spinning");
  canvas.style.transform = `rotate(${currentRotation}deg)`;

  // Subtle tick during spin
  playSubtleTick();

  // Natural stop after 5.2 seconds
  setTimeout(() => {
    isSpinning = false;
    canvas.classList.remove("spinning");
    revealReward(activeReward);
  }, 5200);
}

// Reveal Screen 2: Reward Reveal Card
function revealReward(reward) {
  activeClaimCode = generateClaimCode();

  // Save to localStorage for session persistence
  try {
    localStorage.setItem("deva_saved_reward", JSON.stringify({
      reward: reward,
      claimCode: activeClaimCode,
      timestamp: new Date().toISOString()
    }));
  } catch (e) {
    // Ignore storage quota
  }

  // Populate UI values
  document.getElementById("revealedRewardTitle").textContent = reward.text;
  document.getElementById("revealedRewardDesc").textContent = reward.desc;
  document.getElementById("revealedClaimCode").textContent = activeClaimCode;
  document.getElementById("waRewardText").textContent = reward.text;
  document.getElementById("waCodeText").textContent = activeClaimCode;

  // Build WhatsApp URL with clean URI encoding
  const waMessage = 
`Hi! I won a surprise offer from ${CLINIC_CONFIG.name}.

My reward: ${reward.text}
My claim code: ${activeClaimCode}

I’d like to claim my offer.`;

  const phoneSanitized = CLINIC_CONFIG.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${phoneSanitized}?text=${encodeURIComponent(waMessage)}`;
  document.getElementById("whatsappLink").setAttribute("href", whatsappUrl);

  // Trigger Tasteful Celebration Particles
  launchTastefulConfetti();

  // Smooth screen transition
  wheelSection.classList.add("opacity-0", "scale-95");
  setTimeout(() => {
    wheelSection.classList.add("hidden");
    rewardSection.classList.remove("hidden");
    rewardSection.classList.remove("opacity-0");
    rewardSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 350);
}

// Tasteful, Subdued Particles (Optical Aesthetic - Not Casino Fireworks)
function launchTastefulConfetti() {
  const container = document.getElementById("confettiContainer");
  container.innerHTML = "";
  const colors = ["#0D9488", "#0284C7", "#D97706", "#10B981", "#38BDF8"];

  for (let i = 0; i < 24; i++) {
    const p = document.createElement("div");
    p.className = "confetti-particle";
    p.style.left = `${Math.random() * 88 + 6}%`;
    p.style.top = "-10px";
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = `${Math.random() * 0.4}s`;
    p.style.animationDuration = `${2.0 + Math.random() * 1.2}s`;
    container.appendChild(p);
  }
}

// Reset view back to Screen 1 for another spin or review
function resetWheelView() {
  rewardSection.classList.add("hidden");
  wheelSection.classList.remove("hidden", "opacity-0", "scale-95");

  spinBtn.disabled = false;
  centerSpinBtn.disabled = false;
  spinBtn.classList.remove("opacity-80", "cursor-not-allowed");
  spinBtnText.textContent = "SPIN & DISCOVER";
  
  wheelStatus.innerHTML = `
    <svg class="w-3.5 h-3.5 text-teal-600 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>Tap button below or center hub to spin</span>
  `;

  wheelSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Copy Claim Code to Clipboard
function copyClaimCode() {
  const code = document.getElementById("revealedClaimCode").textContent.trim();
  const copyBtn = document.getElementById("copyBtn");
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showCopiedSuccess(copyBtn);
    }).catch(() => {
      fallbackCopy(code, copyBtn);
    });
  } else {
    fallbackCopy(code, copyBtn);
  }
}

function fallbackCopy(text, btn) {
  const input = document.createElement("input");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand("copy");
    showCopiedSuccess(btn);
  } catch (e) {
    alert(`Your claim code is: ${text}`);
  }
  document.body.removeChild(input);
}

function showCopiedSuccess(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = `<span class="text-emerald-700">✓ Copied</span>`;
  btn.classList.add("bg-emerald-50", "border-emerald-300");
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.classList.remove("bg-emerald-50", "border-emerald-300");
  }, 2000);
}

// Check for existing saved reward on initial load
function checkSavedReward() {
  try {
    const raw = localStorage.getItem("deva_saved_reward");
    if (raw) {
      const data = JSON.parse(raw);
      // Optional restore if user refreshes
      // We keep Screen 1 as default landing, but provide a banner if a previous code exists
      if (data && data.claimCode && data.reward) {
        const resumeBanner = document.getElementById("previousClaimBanner");
        if (resumeBanner) {
          resumeBanner.classList.remove("hidden");
          document.getElementById("savedRewardSnippet").textContent = `${data.reward.text} (${data.claimCode})`;
        }
      }
    }
  } catch (e) {
    // Ignore storage check
  }
}

function restoreSavedReward() {
  try {
    const raw = localStorage.getItem("deva_saved_reward");
    if (raw) {
      const data = JSON.parse(raw);
      activeReward = data.reward;
      activeClaimCode = data.claimCode;
      revealReward(activeReward);
    }
  } catch (e) {
    // Ignore
  }
}

// Initialize on Load
window.addEventListener("DOMContentLoaded", () => {
  setupCanvasResolution();
  renderWheel();
  checkSavedReward();

  // Populate dynamic clinic config elements
  const clinicNameEls = document.querySelectorAll(".clinic-name-text");
  clinicNameEls.forEach(el => el.textContent = CLINIC_CONFIG.name);

  const phoneEls = document.querySelectorAll(".clinic-phone-text");
  phoneEls.forEach(el => el.textContent = CLINIC_CONFIG.displayPhone);

  const phoneLinks = document.querySelectorAll(".clinic-phone-link");
  phoneLinks.forEach(el => el.setAttribute("href", `tel:${CLINIC_CONFIG.phone}`));

  const googleReviewLink = document.getElementById("googleReviewLink");
  if (googleReviewLink) {
    googleReviewLink.setAttribute("href", CLINIC_CONFIG.googleReviewUrl);
  }
});

// Resize listener to maintain crisp canvas DPI
window.addEventListener("resize", () => {
  setupCanvasResolution();
  renderWheel();
});
