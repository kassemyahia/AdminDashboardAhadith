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
  const form = e.target;
  const data = new FormData(form);

  try {
    await request("POST", `/${resource}`, data);
    toast("✅ تم الحفظ بنجاح");
    form.reset();
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
