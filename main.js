// ===== تبديل الثيم =====
const root = document.documentElement;
const toggleBtn = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  root.setAttribute("data-theme", savedTheme);
}

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

// ===== إرسال الطلبات =====
const baseURL = "https://apibykassem.onrender.com/api";

async function request(method, path, body) {
  const opts = { method, headers: { Accept: "application/json" } };
  if (body instanceof FormData) {
    opts.body = body;
  } else if (body) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${baseURL}${path}`, opts);
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) throw new Error(JSON.stringify(data || res.statusText));
  return data;
}

async function handleSubmit(e, resource) {
  e.preventDefault();
  const f = e.target;
  const data = new FormData(f);
  try {
    await request("POST", `/${resource}`, data);
    toast("✅ تم الحفظ بنجاح");
    f.reset();
  } catch (err) {
    alert("❌ فشل الحفظ:\n" + err.message);
  }
}

function toast(msg) {
  const t = document.getElementById("toast");
  const b = document.getElementById("toastBox");
  b.textContent = msg;
  t.style.display = "flex";
  setTimeout(() => (t.style.display = "none"), 2000);
}

function filterNav(q) {
  document.querySelectorAll("#nav .nav-btn").forEach((btn) => {
    btn.style.display = btn.textContent.includes(q) || !q ? "flex" : "none";
  });
}

document.getElementById("nav").addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-btn");
  if (!btn) return;
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => (b.dataset.active = "false"));
  btn.dataset.active = "true";
  const id = btn.dataset.tab;
  document
    .querySelectorAll(".tab")
    .forEach((t) =>
      t.setAttribute("aria-hidden", t.id === id ? "false" : "true")
    );
});
