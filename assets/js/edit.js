function filterNav(q) {
  document.querySelectorAll("#nav .nav-btn").forEach((btn) => {
    btn.style.display = !q || btn.textContent.includes(q) ? "flex" : "none";
  });
}

/* ===============================
   Resource ID & Display Maps
================================ */

const resourceIdMap = {
  rawis: (item) => item.id,
  books: (item) => item.id,
  hadiths: (item) => item.id,
  muhaddiths: (item) => item.id,
  ruling_of_hadiths: (item) => item.id,
  topics: (item) => item.id,
  explainings: (item) => item.id,
  fakehadiths: (item) => item.id,
  topic_classes: (item) => item.id,
};

const resourceDisplayMap = {
  rawis: (item) => item.name,
  books: (item) => item.name || item.book_name,
  hadiths: (item) => item.HadithText,
  muhaddiths: (item) => item.name,
  ruling_of_hadiths: (item) => item.RulingText,
  topics: (item) => item.TopicName,
  explainings: (item) => item.ETEXT,
  fakehadiths: (item) => item.text || item.FakeHadithText,
};

/* ===============================
   Edit Configs
================================ */

const editConfigs = {
  hadiths: {
    title: "تعديل حديث",
    fields: [
      { name: "HadithText", label: "نص الحديث", type: "textarea" },
      {
        name: "HadithType",
        label: "نوع الحديث",
        type: "select",
        options: [
          { value: "", label: "— اختر —" },
          { value: "مرفوع", label: "مرفوع" },
          { value: "قدسي", label: "قدسي" },
          { value: "موقوف", label: "موقوف" },
          { value: "أثر", label: "أثر" },
        ],
      },
      { name: "HadithNumber", label: "رقم الحديث", type: "number" },
      { name: "Rawi", label: "الراوي (ID)", type: "number" },
      { name: "Source", label: "الكتاب (ID)", type: "number" },
      {
        name: "RulingOfMuhaddith",
        label: "حكم المحدّث (ID)",
        type: "number",
      },
      {
        name: "FinalRuling",
        label: "الحكم النهائي (ID)",
        type: "number",
      },
      { name: "Explaining", label: "الشرح (ID)", type: "number" },

      { name: "sub_valid", label: "SubValid (ID)", type: "number" },

      // { name: "SubValid", label: "SubValid (ID)", type: "number" },

      { name: "Sanad", label: "تسلسل السند", type: "text" },
    ],
    mapData: (d) => ({
      HadithText: d.HadithText || "",
      HadithType: d.HadithType || "",
      HadithNumber: d.HadithNumber ?? "",

      Rawi: d.Rawi ?? d.rawi?.id ?? "",

      Source: d.Source ?? d.book?.id ?? "",

      RulingOfMuhaddith: d.ruling_of_muhaddith?.id ?? d.RulingOfMuhaddith ?? "",

      FinalRuling: d.final_ruling?.id ?? d.FinalRuling ?? "",

      Explaining: d.Explaining ?? d.explaining?.id ?? "",

      sub_valid:
        d.sub_valid ??
        d.SubValid ??
        (Array.isArray(d.subvalid) ? d.subvalid[0]?.id : d.subvalid?.id) ??
        "",

      Sanad: d.sanad || d.Sanad || "",
    }),
  },

  books: {
    title: "تعديل كتاب",
    fields: [
      { name: "book_name", label: "اسم الكتاب", type: "text" },
      { name: "muhaddith", label: "المحدّث", type: "text" },
    ],
    mapData: (d) => ({
      book_name: d.name || d.book_name || "",
      muhaddith: d.muhaddith || "",
    }),
  },

  rawis: {
    title: "تعديل راوي",
    fields: [
      { name: "name", label: "الاسم", type: "text" },
      {
        name: "gender",
        label: "الجنس",
        type: "select",
        options: [
          { value: "", label: "— اختر —" },
          { value: "M", label: "ذكر" },
          { value: "F", label: "أنثى" },
        ],
      },
      { name: "halalrawi", label: "حال الراوي", type: "text" },
    ],
    mapData: (d) => ({
      name: d.name || "",
      gender: d.gender || "",
      halalrawi: d.halalrawi || "",
    }),
  },

  muhaddiths: {
    title: "تعديل محدث",
    fields: [
      { name: "name", label: "الاسم", type: "text" },
      {
        name: "gender",
        label: "الجنس",
        type: "select",
        options: [
          { value: "", label: "— اختر —" },
          { value: "M", label: "ذكر" },
          { value: "F", label: "أنثى" },
        ],
      },
      { name: "about", label: "نبذة", type: "text" },
    ],
    mapData: (d) => ({
      name: d.name || "",
      gender: d.gender || "",
      about: d.about || "",
    }),
  },

  ruling_of_hadiths: {
    title: "تعديل حكم حديث",
    fields: [{ name: "RulingText", label: "نص الحكم", type: "text" }],
    mapData: (d) => ({
      RulingText: d.RulingText || "",
    }),
  },

  topics: {
    title: "تعديل موضوع حديث",
    fields: [{ name: "TopicName", label: "اسم الموضوع", type: "text" }],
    mapData: (d) => ({
      TopicName: d.TopicName || "",
    }),
  },

  topic_classes: {
    title: "تعديل ربط موضوع بحديث",
    fields: [
      { name: "TopicID", label: "ID الموضوع", type: "number" },
      { name: "HadithID", label: "ID الحديث", type: "number" },
    ],
    mapData: (d) => ({
      TopicID: d.TopicID ?? "",
      HadithID: d.HadithID ?? "",
    }),
  },

  explainings: {
    title: "تعديل شرح حديث",
    fields: [{ name: "ETEXT", label: "نص الشرح", type: "textarea" }],
    mapData: (d) => ({
      ETEXT: d.ETEXT || "",
    }),
  },

  fakehadiths: {
    title: "تعديل حديث غير صحيح",
    fields: [
      { name: "FakeHadithText", label: "نص الحديث", type: "textarea" },
      { name: "SubValid", label: "الحديث الصحيح البديل (ID)", type: "number" },
      { name: "Ruling", label: "حكم الحديث (ID)", type: "number" },
    ],
    mapData: (d) => ({
      FakeHadithText: d.FakeHadithText || "",
      SubValid: d.SubValid ?? "",
      Ruling: d.Ruling ?? "",
    }),
  },
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

    if (resource === "topic_classes") {
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.TopicID}</td>
        <td>${item.HadithID}</td>
        <td>
          <button class="btn-edit" onclick="openEdit('${resource}', ${item.id})">
            تعديل
          </button>
        </td>
      `;
    } else {
      tr.innerHTML = `
        <td>${getId(item)}</td>
        <td>${getText(item) || "—"}</td>
        <td>
          <button class="btn-edit" onclick="openEdit('${resource}', ${getId(
        item
      )})">
            تعديل
          </button>
        </td>
      `;
    }

    tbody.appendChild(tr);
  });
}

/* ===============================
   Edit Modal
================================ */

async function openEdit(resource, id) {
  const config = editConfigs[resource];
  if (!config) return alert("لا يوجد إعداد للتعديل");

  document.getElementById("editTitle").textContent = config.title;
  document.getElementById("editId").value = id;
  document.getElementById("editModal").dataset.resource = resource;
  document.getElementById("editModal").style.display = "flex";

  const res = await apiGet(`/${resource}/${id}`);
  const data = res.data || res;

  buildEditFields(config.fields, config.mapData(data));
}

function buildEditFields(fields, values) {
  const container = document.getElementById("editFields");
  container.innerHTML = "";

  fields.forEach((f) => {
    const div = document.createElement("div");
    div.className = "field";

    const label = document.createElement("label");
    label.textContent = f.label;
    div.appendChild(label);

    let input;
    if (f.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 3;
    } else if (f.type === "select") {
      input = document.createElement("select");
      f.options.forEach((o) => {
        const opt = document.createElement("option");
        opt.value = o.value;
        opt.textContent = o.label;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement("input");
      input.type = f.type;
    }

    input.className = "input";
    input.name = f.name;
    input.value = values[f.name] ?? "";

    div.appendChild(input);
    container.appendChild(div);
  });
}

async function saveEdit() {
  const modal = document.getElementById("editModal");
  const resource = modal.dataset.resource;
  const id = document.getElementById("editId").value;
  const formData = new FormData(document.getElementById("editForm"));

  await apiPut(`/${resource}/${id}`, formData);
  modal.style.display = "none";
  loadResource(resource);
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
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
