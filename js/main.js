// ===========================================================
// CollegeSeva — main.js
// Loads college data, handles search/filter, and the enquiry
// form (submits leads to a Google Sheet via Apps Script).
// ===========================================================

// 1) PASTE your Google Apps Script Web App URL here once you deploy it
//    (see google-apps-script.gs + README.md for setup steps).
//    Leave blank to just log submissions to the browser console for now.
const LEAD_ENDPOINT_URL = ""; // e.g. "https://script.google.com/macros/s/XXXX/exec"

let ALL_COLLEGES = [];

async function loadColleges() {
  try {
    const res = await fetch("data/colleges.json");
    ALL_COLLEGES = await res.json();
  } catch (e) {
    console.error("Could not load college data", e);
    ALL_COLLEGES = [];
  }
  populateFilters();
  renderColleges(ALL_COLLEGES);
}

function populateFilters() {
  const cities = [...new Set(ALL_COLLEGES.map(c => c.city))].sort();
  const streams = [...new Set(ALL_COLLEGES.flatMap(c => c.streams))].sort();

  const citySel = document.getElementById("cityFilter");
  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySel.appendChild(opt);
  });

  const streamSel = document.getElementById("streamFilter");
  streams.forEach(stream => {
    const opt = document.createElement("option");
    opt.value = stream;
    opt.textContent = stream;
    streamSel.appendChild(opt);
  });
}

function renderColleges(list) {
  const grid = document.getElementById("collegeGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("resultCount");
  grid.innerHTML = "";

  count.textContent = `${list.length} college${list.length === 1 ? "" : "s"} found`;

  if (list.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.forEach(college => {
    const card = document.createElement("div");
    card.className = "college-card";
    card.innerHTML = `
      <span class="badge ${college.verified ? "" : "unverified"}">
        ${college.verified ? "Verified" : "Sample data"}
      </span>
      <h3>${college.name}</h3>
      <div class="meta">${college.city}, ${college.state} &middot; ${college.type}</div>
      <div class="chip-row">
        ${college.streams.slice(0, 3).map(s => `<span class="chip">${s}</span>`).join("")}
      </div>
      <div class="fee">${college.fee_range}</div>
      <div class="meta">${college.highlight || ""}</div>
      <div class="card-actions">
        <button class="btn btn-primary" data-enquire="${college.id}">Send Enquiry</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // wire up enquiry buttons
  grid.querySelectorAll("[data-enquire]").forEach(btn => {
    btn.addEventListener("click", () => openEnquiryModal(btn.getAttribute("data-enquire")));
  });
}

function applyFilters() {
  const city = document.getElementById("cityFilter").value;
  const stream = document.getElementById("streamFilter").value;
  const keyword = document.getElementById("keywordFilter").value.trim().toLowerCase();

  const filtered = ALL_COLLEGES.filter(c => {
    const matchCity = !city || c.city === city;
    const matchStream = !stream || c.streams.includes(stream);
    const matchKeyword = !keyword || c.name.toLowerCase().includes(keyword);
    return matchCity && matchStream && matchKeyword;
  });

  renderColleges(filtered);
}

document.getElementById("searchBtn").addEventListener("click", applyFilters);
document.getElementById("keywordFilter").addEventListener("keyup", e => {
  if (e.key === "Enter") applyFilters();
});

// ---------- Enquiry modal ----------
const overlay = document.getElementById("enquiryOverlay");
const modalCollegeName = document.getElementById("modalCollegeName");
const collegeIdField = document.getElementById("collegeIdField");
const collegeNameField = document.getElementById("collegeNameField");
const formStatus = document.getElementById("formStatus");

function openEnquiryModal(collegeId) {
  const college = ALL_COLLEGES.find(c => c.id === collegeId);
  if (!college) return;
  modalCollegeName.textContent = `Enquire — ${college.name}`;
  collegeIdField.value = college.id;
  collegeNameField.value = college.name;
  formStatus.textContent = "";
  formStatus.className = "form-status";
  overlay.classList.add("open");
}

document.getElementById("closeModal").addEventListener("click", () => {
  overlay.classList.remove("open");
});
overlay.addEventListener("click", e => {
  if (e.target === overlay) overlay.classList.remove("open");
});

document.getElementById("enquiryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  data.timestamp = new Date().toISOString();

  formStatus.textContent = "Submitting...";
  formStatus.className = "form-status";

  try {
    if (LEAD_ENDPOINT_URL) {
      await fetch(LEAD_ENDPOINT_URL, {
        method: "POST",
        mode: "no-cors", // Apps Script web apps typically require no-cors from browser fetch
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(data)
      });
    } else {
      console.log("LEAD (no endpoint configured yet):", data);
    }
    formStatus.textContent = "Thanks! Your enquiry has been sent.";
    formStatus.className = "form-status success";
    form.reset();
    setTimeout(() => overlay.classList.remove("open"), 1400);
  } catch (err) {
    console.error(err);
    formStatus.textContent = "Something went wrong. Please try again or call us directly.";
    formStatus.className = "form-status error";
  }
});

loadColleges();
