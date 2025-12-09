// ======================================
// Add / Create forms ONLY
// ======================================

// Handle form submission for Add operations
async function handleSubmit(e, resource) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  try {
    await apiPost(`/${resource}`, data);
    toast("تم الحفظ بنجاح ✔");

    form.reset();

    // If list should update after adding
    const tableExists = document.querySelector(`[data-body="${resource}"]`);
    if (tableExists) loadResource(resource);

  } catch (err) {
    alert("❌ فشل الحفظ:\n" + err.message);
  }
}
