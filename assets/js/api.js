// ======================================
// UNIVERSAL API SYSTEM (GET/POST/PUT/DELETE)
// ======================================

const API_BASE = "https://apibykassem.onrender.com/api";
// const API_BASE = "http://127.0.0.1:8000/api";
async function api(method, endpoint, data = null) {
  const options = { method, headers: { Accept: "application/json" } };

  if (data instanceof FormData) {
    options.body = data;
  } else if (data) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, options);

  let json = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok) throw new Error(JSON.stringify(json || res.statusText));

  return json;
}

// Shortcuts
const apiGet = (url) => api("GET", url);
const apiPost = (url, data) => api("POST", url, data);
const apiDelete = (url) => api("DELETE", url);
const apiPut = (url, data) => api("PUT", url, data);

// Toast
function toast(msg) {
  const t = document.getElementById("toast");
  const b = document.getElementById("toastBox");
  b.textContent = msg;
  t.style.display = "flex";
  setTimeout(() => (t.style.display = "none"), 2000);
}

async function apiGet(url) {
  return await fetch("https://apibykassem.onrender.com/api" + url, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  }).then((res) => res.json());
}

const token = localStorage.getItem("token");

if (!token) {
  // Not logged in → redirect to login page
  window.location.href = "../index.html";
}
