function filterNav(q) {
  document.querySelectorAll("#nav .nav-btn").forEach((btn) => {
    btn.style.display = !q || btn.textContent.includes(q) ? "flex" : "none";
  });
}

/* ===============================
   Resource Maps
================================ */

const resourceIdMap = {
  rawis: (i) => i.id,
  books: (i) => i.id,
  hadiths: (i) => i.id,
  muhaddiths: (i) => i.id,
  ruling_of_hadiths: (i) => i.id,
  topics: (i) => i.id,
  explainings: (i) => i.id,
  fakehadiths: (i) => i.id,
  topic_classes: (i) => i.id,
};

const resourceDisplayMap = {
  rawis: (i) => i.name,
  books: (i) => i.name || i.book_name,
  hadiths: (i) => i.HadithText,
  muhaddiths: (i) => i.name,
  ruling_of_hadiths: (i) => i.RulingText,
  topics: (i) => i.TopicName,
  explainings: (i) => i.ETEXT,
  fakehadiths: (i) => i.text || i.FakeHadithText,
};

/* ===============================
   Load & Display
================================ */

async function loadResource(resource) {
  try {
    const res = await apiGet(`/${resource}`);
    const list = Array.isArray(res) ? res : res.data || [];
    displayResource(resource, list);
  } catch (e) {
    console.error(e);
  }
}

function displayResource(resource, list) {
  const tbody = document.querySelector(`[data-body="${resource}"]`);
  if (!tbody) return;

  const getId = resourceIdMap[resource];
  const getText = resourceDisplayMap[resource];

  if (!getId) return;

  tbody.innerHTML = "";

  list.forEach((item) => {
    const tr = document.createElement("tr");

    // 🔗 topic_classes (عرض خاص)
    if (resource === "topic_classes") {
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.TopicID}</td>
        <td>${item.HadithID}</td>
        <td>
          <button class="btn danger" onclick="deleteItem('${resource}', ${item.id})">
            حذف
          </button>
        </td>
      `;
    } else {
      tr.innerHTML = `
        <td>${getId(item)}</td>
        <td>${getText(item) || "—"}</td>
        <td>
          <button class="btn danger" onclick="deleteItem('${resource}', ${getId(
        item
      )})">
            حذف
          </button>
        </td>
      `;
    }

    tbody.appendChild(tr);
  });
}

/* ===============================
   Delete Logic
================================ */

async function deleteItem(resource, id) {
  if (!confirm("⚠️ هل أنت متأكد من الحذف؟")) return;

  try {
    await apiDelete(`/${resource}/${id}`);
    toast("تم الحذف بنجاح ✅");
    loadResource(resource);
  } catch (e) {
    alert("❌ فشل الحذف");
  }
}

/* ===============================
   Initial Load
================================ */

window.addEventListener("DOMContentLoaded", () => {
  const active = document.querySelector('.nav-btn[data-active="true"]');
  if (active?.dataset.resource) {
    loadResource(active.dataset.resource);
  }
});
