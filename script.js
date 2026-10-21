
"use strict";

/* ScholarFinder: frontend demo.
   Verify all scheme rules and deadlines at official portals. */

const $ = (id) => document.getElementById(id);

const scholarships = [
  {
    id: "up-postmatric",
    name: "UP Post Matric Scholarship",
    provider: "Uttar Pradesh Scholarship Portal",
    category: "government",
    level: "undergraduate",
    state: "Uttar Pradesh",
    icon: "🏛️",
    amount: "Varies by scheme",
    incomeLimit: null,
    minMarks: 0,
    description: "For eligible students pursuing post-matric education in Uttar Pradesh. Conditions depend on the applicable scheme and category.",
    criteria: ["Eligible course and institution", "Applicable income and category conditions", "Required documents and valid application"],
    url: "https://scholarship.up.gov.in/"
  },
  {
    id: "nsp-central",
    name: "National Scholarship Portal",
    provider: "Government of India",
    category: "government",
    level: "undergraduate",
    state: "All India",
    icon: "🇮🇳",
    amount: "Depends on scheme",
    incomeLimit: null,
    minMarks: 0,
    description: "Explore central-sector and other participating scholarship schemes. Each scheme has its own rules.",
    criteria: ["Check the individual scheme guidelines", "Confirm course and institution eligibility", "Meet its income and academic requirements"],
    url: "https://scholarships.gov.in/"
  },
  {
    id: "pm-usp",
    name: "PM-USP Central Sector Scheme",
    provider: "Ministry of Education",
    category: "merit",
    level: "undergraduate",
    state: "All India",
    icon: "🎓",
    amount: "See current official guidelines",
    incomeLimit: 450000,
    minMarks: 0,
    description: "A central scholarship scheme for eligible college and university students. Board merit position and other conditions matter.",
    criteria: ["Qualifying board merit criteria", "Family income within the applicable limit", "Regular course and other official conditions"],
    url: "https://scholarships.gov.in/"
  },
  {
    id: "pg-india",
    name: "Postgraduate Scholarship Search",
    provider: "Official scheme directory",
    category: "education",
    level: "postgraduate",
    state: "All India",
    icon: "📚",
    amount: "Varies by scheme",
    incomeLimit: null,
    minMarks: 0,
    description: "Explore postgraduate funding opportunities through official scholarship directories.",
    criteria: ["Eligible postgraduate course", "Scheme-specific academic criteria", "Applicable application conditions"],
    url: "https://scholarships.gov.in/"
  },
  {
    id: "school-support",
    name: "School Scholarship Search",
    provider: "Official scheme directory",
    category: "government",
    level: "school",
    state: "All India",
    icon: "📖",
    amount: "Varies by scheme",
    incomeLimit: null,
    minMarks: 0,
    description: "Find school-level scholarship schemes and verify the eligibility rules for each programme.",
    criteria: ["Eligible school and class", "Scheme-specific marks and income rules", "Required documents"],
    url: "https://scholarships.gov.in/"
  },
  {
    id: "merit-search",
    name: "Merit-Based Scholarship Search",
    provider: "Participating institutions",
    category: "merit",
    level: "undergraduate",
    state: "All India",
    icon: "🏆",
    amount: "Check individual programme",
    incomeLimit: null,
    minMarks: 75,
    description: "Explore merit-based funding opportunities. The percentage shown is only a demo filter, not a universal scholarship rule.",
    criteria: ["Verify the actual marks threshold", "Confirm course and institution", "Review official award and renewal rules"],
    url: "https://scholarships.gov.in/"
  },
  {
    id: "private-search",
    name: "Private Scholarship Search",
    provider: "Private foundations",
    category: "private",
    level: "undergraduate",
    state: "All India",
    icon: "💡",
    amount: "Check provider's website",
    incomeLimit: null,
    minMarks: 0,
    description: "Explore independently administered scholarship programmes and verify the provider before sharing information.",
    criteria: ["Provider-specific requirements", "Confirm application dates", "Never pay an unverified application fee"],
    url: "https://scholarships.gov.in/"
  },
  {
    id: "up-education",
    name: "UP Education Support Search",
    provider: "Uttar Pradesh",
    category: "education",
    level: "undergraduate",
    state: "Uttar Pradesh",
    icon: "📍",
    amount: "Depends on scheme",
    incomeLimit: null,
    minMarks: 0,
    description: "Browse relevant education support programmes and check whether your institution and course qualify.",
    criteria: ["Confirm current scheme availability", "Check domicile and course requirements", "Verify the official deadline"],
    url: "https://scholarship.up.gov.in/"
  }
];

const documents = [
  ["income", "Income certificate", "Check validity and current income details."],
  ["marksheet", "Previous examination marksheet", "Use the marksheet requested by the scheme."],
  ["identity", "Identity document", "Follow the portal's official requirements."],
  ["bank", "Bank account details", "Confirm account holder and scheme requirements."],
  ["admission", "Admission or bonafide certificate", "Check whether the institution must issue it."],
  ["photo", "Recent photograph", "Follow the portal's specified format."],
  ["domicile", "Domicile certificate", "If required by the scheme."],
  ["category", "Category certificate", "If applicable to the scheme."]
];

const STORE = {
  saved: "scholarFinder.saved.v1",
  checklist: "scholarFinder.checklist.v1",
  profile: "scholarFinder.profile.v1"
};

function loadArray(key, fallback = []) {
  try {
    const result = JSON.parse(localStorage.getItem(key));
    return Array.isArray(result) ? result : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    toast("Browser storage is unavailable.");
    return false;
  }
}

let saved = loadArray(STORE.saved).filter(id =>
  scholarships.some(s => s.id === id)
);

let checked = loadArray(STORE.checklist).filter(id =>
  documents.some(d => d[0] === id)
);

let profile = {};
try {
  profile = JSON.parse(localStorage.getItem(STORE.profile)) || {};
} catch {
  profile = {};
}

let currentView = "discover";
let toastTimer;

const categoryNames = {
  government: "Government",
  merit: "Merit-based",
  private: "Private",
  education: "Education support"
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

function updateStats() {
  $("totalStat").textContent = scholarships.length;
  $("savedStat").textContent = saved.length;
  $("savedCount").textContent = saved.length;

  const percent = Math.round(checked.length / documents.length * 100);
  $("progressStat").textContent = percent + "%";
  $("checklistPercent").textContent = percent + "%";
  $("checklistText").textContent =
    `${checked.length} of ${documents.length} completed`;
  $("progressBar").style.width = percent + "%";
}

function cardHTML(s) {
  const isSaved = saved.includes(s.id);

  return `
    <article class="scholarship-card">
      <div class="card-heading">
        <div class="scheme-icon">${s.icon}</div>
        <div>
          <h3>${escapeHTML(s.name)}</h3>
          <p>${escapeHTML(s.provider)}</p>
        </div>
        <button class="save-btn ${isSaved ? "is-saved" : ""}"
          data-save="${escapeHTML(s.id)}"
          aria-label="${isSaved ? "Remove saved scholarship" : "Save scholarship"}"
          aria-pressed="${isSaved}">${isSaved ? "♥" : "♡"}</button>
      </div>
      <div class="card-tags">
        <span class="tag tag-category">${escapeHTML(categoryNames[s.category])}</span>
        <span class="tag">${escapeHTML(s.level)}</span>
        <span class="tag">${escapeHTML(s.state)}</span>
      </div>
      <p class="card-description">${escapeHTML(s.description)}</p>
      <div class="card-footer">
        <div><span class="award-label">AWARD / FUNDING</span>
          <span class="award-value">${escapeHTML(s.amount)}</span></div>
        <button class="details-btn" data-details="${escapeHTML(s.id)}">View details ↗</button>
      </div>
    </article>`;
}

function renderCards(list, targetId, emptyId) {
  $(targetId).innerHTML = list.map(cardHTML).join("");
  $(emptyId).classList.toggle("hidden", list.length !== 0);
}

function getFiltered() {
  const query = $("searchInput").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const level = $("levelFilter").value;
  const state = $("stateFilter").value;

  return scholarships.filter(s => {
    const searchable = [
      s.name, s.provider, s.description, s.state,
      s.level, categoryNames[s.category]
    ].join(" ").toLowerCase();

    return (!query || searchable.includes(query)) &&
      (category === "all" || s.category === category) &&
      (level === "all" || s.level === level) &&
      (state === "all" || s.state === state);
  });
}

function renderDiscover() {
  const list = getFiltered();
  renderCards(list, "scholarshipGrid", "emptyState");
  $("resultCount").textContent =
    `${list.length} ${list.length === 1 ? "opportunity" : "opportunities"}`;
  updateStats();
}

function renderSaved() {
  const list = scholarships.filter(s => saved.includes(s.id));
  renderCards(list, "savedGrid", "savedEmpty");
  updateStats();
}

function renderDocuments() {
  $("documentList").innerHTML = documents.map(([id, name, desc]) => `
    <label class="document-item">
      <input type="checkbox" data-document="${id}"
        ${checked.includes(id) ? "checked" : ""}>
      <span><b>${escapeHTML(name)}</b><small>${escapeHTML(desc)}</small></span>
    </label>
  `).join("");
  updateStats();
}

const viewTitles = {
  discover: ["Discover", "Make education <span>more accessible.</span>",
    "Discover scholarships, understand eligibility and organize your applications."],
  saved: ["Saved Scholarships", "Your <span>shortlist.</span>",
    "Keep track of opportunities worth exploring."],
  eligibility: ["Eligibility Checker", "Find your <span>starting point.</span>",
    "Check basic criteria and identify schemes to investigate."],
  documents: ["Documents", "Get <span>application-ready.</span>",
    "Keep your document preparation organized."]
};

function showView(view) {
  if (!viewTitles[view]) return;
  currentView = view;

  document.querySelectorAll(".view").forEach(el => el.classList.add("hidden"));
  $(view + "View").classList.remove("hidden");

  document.querySelectorAll(".nav-link").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.view === view)
  );

  $("breadcrumb").textContent = viewTitles[view][0];
  $("pageTitle").innerHTML = viewTitles[view][1];
  $("pageSubtitle").textContent = viewTitles[view][2];

  if (view === "saved") renderSaved();
  if (view === "documents") renderDocuments();

  $("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openDetails(id) {
  const s = scholarships.find(item => item.id === id);
  if (!s) return;

  $("modalContent").innerHTML = `
    <p class="eyebrow">${escapeHTML(categoryNames[s.category])}</p>
    <h2 id="modalTitle">${escapeHTML(s.name)}</h2>
    <p>${escapeHTML(s.provider)} · ${escapeHTML(s.level)}</p>
    <div class="card-tags">
      <span class="tag">${escapeHTML(s.state)}</span>
      <span class="tag">${escapeHTML(s.amount)}</span>
    </div>
    <p>${escapeHTML(s.description)}</p>
    <h3>What to verify</h3>
    <ul>${s.criteria.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
    <p><b>Income limit:</b> ${
      s.incomeLimit === null
        ? "Check official scheme guidelines"
        : "Demo screening limit: ₹" + s.incomeLimit.toLocaleString("en-IN")
    }</p>
    <p><b>Deadline:</b> Not verified in this demo. Check the official portal.</p>
    <p><b>Important:</b> This listing does not confirm your eligibility or guarantee an award.</p>
    <button class="btn btn-primary" id="modalSave">${saved.includes(id) ? "Remove from saved" : "Save scholarship"}</button>
    <a class="btn btn-outline" href="${s.url}" target="_blank" rel="noopener noreferrer">Official portal ↗</a>
  `;

  $("modalSave").addEventListener("click", () => toggleSave(id));
  $("modalBackdrop").classList.remove("hidden");
  $("closeModal").focus();
}

function toggleSave(id) {
  if (!scholarships.some(s => s.id === id)) return;

  const wasSaved = saved.includes(id);
  const next = wasSaved ? saved.filter(item => item !== id) : [...saved, id];

  if (!save(STORE.saved, next)) return;
  saved = next;

  renderDiscover();
  if (currentView === "saved") renderSaved();

  if (!$("modalBackdrop").classList.contains("hidden")) {
    const s = scholarships.find(item => item.id === id);
    if (s) openDetails(id);
  }

  toast(wasSaved ? "Removed from saved scholarships." : "Scholarship saved.");
}

function resetFilters() {
  $("searchInput").value = "";
  $("categoryFilter").value = "all";
  $("levelFilter").value = "all";
  $("stateFilter").value = "all";
  renderDiscover();
}

function checkEligibility(event) {
  event.preventDefault();

  const level = $("studentLevel").value;
  const state = $("studentState").value;
  const income = Number($("income").value);
  const course = $("studentCourse").value;
  const category = $("studentCategory").value;
  const marks = Number($("marks").value);

  if (
    !Number.isFinite(income) || income < 0 ||
    !Number.isFinite(marks) || marks < 0 || marks > 100
  ) {
    toast("Enter valid income and marks.");
    return;
  }

  // These are preliminary catalogue filters, not official decisions.
  const matches = scholarships.filter(s => {
    const levelMatch = s.level === level;
    const stateMatch = s.state === "All India" || s.state === state;
    const incomeMatch =
      s.incomeLimit === null || income <= s.incomeLimit;
    const marksMatch = marks >= s.minMarks;
    return levelMatch && stateMatch && incomeMatch && marksMatch;
  });

  const panel = $("eligibilityResults");
  panel.classList.remove("hidden");

  const courseNote = course === "B.Tech"
    ? "B.Tech selected. Confirm that the specific scheme covers your course and institution."
    : "Course selected: " + escapeHTML(course) + ". Confirm course eligibility with the scheme.";

  panel.innerHTML = `
    <h3>Preliminary screening results</h3>
    <p>${courseNote}</p>
    <p>Category selected: ${escapeHTML(category)}. This demo does not validate category-specific rules or documents.</p>
    <p><b>${matches.length}</b> catalogue entries match the basic filters you entered. This is not a confirmed eligibility result.</p>
    ${matches.length ? matches.map(s => `
      <div class="result-item">
        <h4>${escapeHTML(s.name)}</h4>
        <p>${escapeHTML(s.description)}</p>
        <button class="details-btn" data-details="${escapeHTML(s.id)}">Review requirements ↗</button>
      </div>`).join("") : `
      <p>No catalogue entries match those filters. This does not mean you are ineligible for every scholarship.</p>
    `}
  `;

  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeModal() {
  $("modalBackdrop").classList.add("hidden");
}

document.querySelectorAll(".nav-link").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

$("searchInput").addEventListener("input", renderDiscover);
$("searchBtn").addEventListener("click", renderDiscover);
["categoryFilter", "levelFilter", "stateFilter"].forEach(id =>
  $(id).addEventListener("change", renderDiscover)
);

$("resetFilters").addEventListener("click", resetFilters);
$("emptyReset").addEventListener("click", resetFilters);
$("heroExplore").addEventListener("click", () => showView("discover"));
$("helpBtn").addEventListener("click", () => showView("discover"));
$("savedExplore").addEventListener("click", () => showView("discover"));
$("menuBtn").addEventListener("click", () => $("sidebar").classList.toggle("open"));

$("profileBtn").addEventListener("click", () => {
  const current = profile.name || "";
  const name = window.prompt("Enter your display name:", current);
  if (name === null) return;

  const trimmed = name.trim().slice(0, 50);
  profile.name = trimmed;

  if (!save(STORE.profile, profile)) return;

  $("profileBtn").textContent = trimmed
    ? Array.from(trimmed)[0].toUpperCase()
    : "S";
  toast(trimmed ? "Display name saved on this device." : "Display name cleared.");
});

$("eligibilityForm").addEventListener("submit", checkEligibility);

$("eligibilityForm").addEventListener("reset", () => {
  $("eligibilityResults").classList.add("hidden");
});

$("clearChecklist").addEventListener("click", () => {
  if (!window.confirm("Reset all document checklist items?")) return;
  if (!save(STORE.checklist, [])) return;

  checked = [];
  renderDocuments();
  toast("Checklist reset.");
});

document.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    toggleSave(saveButton.dataset.save);
    return;
  }

  const detailsButton = event.target.closest("[data-details]");
  if (detailsButton) {
    openDetails(detailsButton.dataset.details);
  }
});

$("documentList").addEventListener("change", event => {
  const checkbox = event.target.closest("[data-document]");
  if (!checkbox) return;

  const id = checkbox.dataset.document;
  const next = checkbox.checked
    ? [...new Set([...checked, id])]
    : checked.filter(item => item !== id);

  if (!save(STORE.checklist, next)) {
    checkbox.checked = !checkbox.checked;
    return;
  }

  checked = next;
  updateStats();
});

$("closeModal").addEventListener("click", closeModal);

$("modalBackdrop").addEventListener("click", event => {
  if (event.target === $("modalBackdrop")) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
    $("sidebar").classList.remove("open");
  }
});

if (profile.name) {
  $("profileBtn").textContent = Array.from(profile.name)[0].toUpperCase();
}

renderDiscover();
renderDocuments();
updateStats();
    
