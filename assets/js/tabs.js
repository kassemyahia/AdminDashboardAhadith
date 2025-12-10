// ======================================
// Navigation Between Sections (Tabs)
// ======================================

document.getElementById("nav").addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-btn");
  if (!btn) return;

  // remove active state
  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.dataset.active = "false";
  });

  // set active
  btn.dataset.active = "true";

  const tabId = btn.dataset.tab;

  // show section
  document.querySelectorAll(".tab").forEach((section) => {
    section.setAttribute(
      "aria-hidden",
      section.id === tabId ? "false" : "true"
    );
  });

  // if the tab is related to deletion/load operations
  const resource = btn.dataset.resource;
  if (resource) loadResource(resource);
});
