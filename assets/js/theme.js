const root = document.documentElement;
const toggleBtn = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.setAttribute("data-theme", savedTheme);

updateToggleText();

toggleBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateToggleText();
});

function updateToggleText() {
  const isLight = root.getAttribute("data-theme") === "light";
  toggleBtn.textContent = isLight ? "الوضع الليلي 🌙" : "الوضع الفاتح 🌞";
}
