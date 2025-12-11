document.getElementById("nav").addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-btn");
  if (!btn) return;

  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.dataset.active = "false";
  });
  btn.dataset.active = "true";

  const tabId = btn.dataset.tab;
  document.querySelectorAll(".tab").forEach((section) => {
    section.setAttribute(
      "aria-hidden",
      section.id === tabId ? "false" : "true"
    );
  });
  const resource = btn.dataset.resource;
  if (resource) loadResource(resource);
});
