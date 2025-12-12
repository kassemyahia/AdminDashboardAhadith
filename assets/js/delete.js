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
  books: (item) => item.name,
  hadiths: (item) => item.HadithText,
  muhaddiths: (item) => item.name,
  ruling_of_hadiths: (item) => item.RulingText,
  topics: (item) => item.TopicName,
  explainings: (item) => item.ETEXT,
  fakehadiths: (item) => item.text,
};

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

    const id = getId ? getId(item) : "---";
    const text = getDisplayText ? getDisplayText(item) : "---";

    tr.innerHTML = `
      <td>${id}</td>
      <td>${text}</td>
      <td>
        <button class="btn-delete" onclick="deleteItem('${resource}', ${id})">
          حذف
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

async function deleteItem(resource, id) {
  if (!confirm("هل تريد الحذف؟")) return;

  try {
    await apiDelete(`/${resource}/${id}`);
    toast("🗑️ تم الحذف بنجاح");
    loadResource(resource);
  } catch (err) {
    alert("❌ فشل الحذف:\n" + err.message);
  }
}
