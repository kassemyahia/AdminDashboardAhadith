// ===== تبديل الثيم مع حفظ الاختيار =====
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

// ====== بقية وظائف اللوحة ======
const baseURL = "http://127.0.0.1:8000/api";

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
    if (resource === "hadiths") loadHadiths();
    if (resource === "books") loadBooks();
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

async function loadBooks() {
  const sel = document.getElementById("bookSelect");
  if (!sel) return;
  const books = await request("GET", "/books");
  sel.innerHTML = '<option value="">— اختر كتاب —</option>';
  books.forEach((b) => {
    const o = document.createElement("option");
    o.value = b.id;
    o.textContent = b.book_name;
    sel.appendChild(o);
  });
}

async function loadHadiths() {
  const box = document.getElementById("hadith-list");
  if (!box) return;
  box.innerHTML = "...";
  try {
    const list = await request("GET", "/hadiths");
    box.innerHTML = list.length
      ? list
          .map(
            (h) =>
              `<div class='card'><div><b>${h.hadith_type || ""}</b> - ${
                h.hadith_text || ""
              }</div></div>`
          )
          .join("")
      : '<div class="hint">لا توجد أحاديث.</div>';
  } catch (e) {
    box.innerHTML = "خطأ في التحميل";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  loadHadiths();
});
