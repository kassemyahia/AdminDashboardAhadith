// ==========================
// Theme Toggle (Light / Dark)
// ==========================

const root = document.documentElement;
const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.setAttribute("data-theme", savedTheme);

updateToggleText();

// Toggle theme
toggleBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateToggleText();
});

// Update toggle button
function updateToggleText() {
  const isLight = root.getAttribute("data-theme") === "light";
  toggleBtn.textContent = isLight ? "الوضع الليلي 🌙" : "الوضع الفاتح 🌞";
}
