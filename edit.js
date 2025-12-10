// ======================================
// EDIT + LOAD Resource Tables (with modal)
// ======================================

// ------------ Helper: filter sidebar buttons -------------
function filterNav(q) {
  document.querySelectorAll("#nav .nav-btn").forEach((btn) => {
    btn.style.display = !q || btn.textContent.includes(q) ? "flex" : "none";
  });
}

// ------------ Resource → ID & display text maps ------------

const resourceIdMap = {
  rawis: (item) => item.id,
  books: (item) => item.id,
  hadiths: (item) => item.id,
  muhaddiths: (item) => item.id,
  ruling_of_hadiths: (item) => item.id,
  topics: (item) => item.id,
  explainings: (item) => item.id,
  fakehadiths: (item) => item.id,
};

const resourceDisplayMap = {
  rawis: (item) => item.name,
  books: (item) => item.book_name,
  hadiths: (item) => item.HadithText,
  muhaddiths: (item) => item.name,
  ruling_of_hadiths: (item) => item.RulingText,
  topics: (item) => item.TopicName,
  explainings: (item) => item.ETEXT,
  fakehadiths: (item) => item.text || item.FakeHadithText,
};

// ------------ Dynamic edit config per resource ------------
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

      // 👇 this is the SubValid column in DB
      { name: "sub_valid", label: "SubValid (ID)", type: "number" },

      { name: "Sanad", label: "تسلسل السند", type: "text" },
    ],
    mapData: (d) => ({
      HadithText: d.HadithText || "",
      HadithType: d.HadithType || "",
      HadithNumber: d.HadithNumber ?? "",

      // Rawi ID
      Rawi: d.Rawi ?? d.rawi?.id ?? "",

      // Book ID
      Source: d.Source ?? d.book?.id ?? "",

      // Ruling of Muhaddith ID
      RulingOfMuhaddith: d.ruling_of_muhaddith?.id ?? d.RulingOfMuhaddith ?? "",

      // Final ruling ID
      FinalRuling: d.final_ruling?.id ?? d.FinalRuling ?? "",

      // Explaining ID
      Explaining: d.Explaining ?? d.explaining?.id ?? "",

      // ⭐ SubValid value:
      // 1) if API sends raw column: sub_valid
      // 2) or camel/case variant: SubValid
      // 3) or relation: subvalid: { id: 51, ... } OR [ { id: 51 } ]
      sub_valid:
        d.sub_valid ??
        d.SubValid ??
        (Array.isArray(d.subvalid) ? d.subvalid[0]?.id : d.subvalid?.id) ??
        "",

      // Sanad
      Sanad: d.sanad || d.Sanad || "",
    }),
  },

  // ... (rest of editConfigs unchanged)

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

  explainings: {
    title: "تعديل شرح حديث",
    fields: [{ name: "ETEXT", label: "نص الشرح", type: "textarea" }],
    mapData: (d) => ({
      ETEXT: d.ETEXT || d.text || "",
    }),
  },

  fakehadiths: {
    title: "تعديل حديث غير صحيح",
    fields: [
      {
        name: "FakeHadithText",
        label: "نص الحديث غير الصحيح",
        type: "textarea",
      },
      {
        name: "sub_valid",
        label: "الحديث الصحيح البديل (SubValid ID)",
        type: "number",
      },
      {
        name: "Ruling",
        label: "حكم الحديث (Ruling ID)",
        type: "number",
      },
    ],
    mapData: (d) => ({
      FakeHadithText: d.FakeHadithText || d.text || "",
      sub_valid: d.sub_valid ?? d.sub_valid?.id ?? "",
      Ruling: d.Ruling ?? d.ruling?.id ?? "",
    }),
  },
};

// ------------ Load table data per resource ------------

async function loadResource(resource) {
  try {
    const response = await apiGet(`/${resource}`);
    const list = Array.isArray(response) ? response : response.data || [];
    displayResource(resource, list);
  } catch (err) {
    console.error("Error loading resource:", err);
  }
}

function displayResource(resource, list) {
  const tbody = document.querySelector(`[data-body="${resource}"]`);
  if (!tbody) return;

  tbody.innerHTML = "";

  const getId = resourceIdMap[resource];
  const getDisplayText = resourceDisplayMap[resource];

  list.forEach((item) => {
    const tr = document.createElement("tr");
    const id = getId(item);
    const text = getDisplayText(item) || "—";

    tr.innerHTML = `
      <td>${id}</td>
      <td>${text}</td>
      <td>
        <button class="btn-edit" onclick="openEdit('${resource}', ${id})">
          تعديل
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ------------ EDIT MODAL LOGIC ------------

async function openEdit(resource, id) {
  const config = editConfigs[resource];
  if (!config) {
    alert("لا يوجد إعداد للتعديل لهذا القسم");
    return;
  }

  const modal = document.getElementById("editModal");
  const titleEl = document.getElementById("editTitle");
  const idInput = document.getElementById("editId");
  const fieldsContainer = document.getElementById("editFields");

  modal.dataset.resource = resource;
  idInput.value = id;
  titleEl.textContent = config.title || "تعديل";

  // حالة تحميل مبدئية
  fieldsContainer.innerHTML = '<div class="hint">جارِ تحميل البيانات...</div>';
  modal.style.display = "flex";

  try {
    const response = await apiGet(`/${resource}/${id}`);

    // لو الرد في شكل { data: {...} } (Laravel Resource)
    const data = response && response.data ? response.data : response;

    const values = config.mapData ? config.mapData(data) : data;

    // بناء الحقول الديناميكية
    buildEditFields(config.fields, values);
  } catch (err) {
    console.error(err);
    fieldsContainer.innerHTML = '<div class="hint">فشل تحميل البيانات</div>';
  }
}

// إنشاء حقول الفورم داخل المودال
function buildEditFields(fields, values) {
  const container = document.getElementById("editFields");
  container.innerHTML = "";

  fields.forEach((field) => {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.textContent = field.label;
    wrapper.appendChild(label);

    let input;

    if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.className = "input";
      input.rows = 3;
      input.value = values[field.name] ?? "";
    } else if (field.type === "select") {
      input = document.createElement("select");
      input.className = "input";
      (field.options || []).forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        input.appendChild(o);
      });
      input.value = values[field.name] ?? "";
    } else {
      input = document.createElement("input");
      input.className = "input";
      input.type = field.type || "text";
      input.value = values[field.name] ?? "";
    }

    input.name = field.name;
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  });
}

// حفظ التعديل
async function saveEdit() {
  const modal = document.getElementById("editModal");
  const resource = modal.dataset.resource;
  const id = document.getElementById("editId").value;
  const form = document.getElementById("editForm");

  if (!resource || !id) {
    alert("بيانات غير صالحة");
    return;
  }

  const formData = new FormData(form);

  try {
    await apiPut(`/${resource}/${id}`, formData);
    toast("تم التعديل بنجاح ✔");
    modal.style.display = "none";
    loadResource(resource);
  } catch (err) {
    alert("❌ فشل التعديل:\n" + err.message);
  }
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// ------------ Initial load ------------
window.addEventListener("DOMContentLoaded", () => {
  const activeBtn = document.querySelector('.nav-btn[data-active="true"]');
  if (activeBtn && activeBtn.dataset.resource) {
    loadResource(activeBtn.dataset.resource);
  }
});
