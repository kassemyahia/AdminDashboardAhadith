const API_URL = "https://apibykassem.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../index.html";
}

async function loadUsers() {
  const usersBody = document.getElementById("usersBody");

  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      usersBody.innerHTML = `<tr><td colspan="5" style="text-align:center">خطأ في التحميل</td></tr>`;
      return;
    }

    usersBody.innerHTML = "";

    data.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.usertype}</td>
        <td style="display:flex; gap:10px;">
            <button 
              class="btn edit"
              onclick="openEditModal(${user.id}, '${user.name}', '${user.email}', '${user.usertype}')">
              تعديل
            </button>

            <button 
              class="btn delete"
              onclick="deleteUser(${user.id}, '${user.usertype}')">
              حذف
            </button>
        </td>
      `;

      usersBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

async function deleteUser(id, type) {
  if (type === "admin") {
    alert("لا يمكن حذف مستخدم من نوع Admin ❌");
    return;
  }

  if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("تم حذف المستخدم ✔");
      loadUsers();
    } else {
      alert("فشل حذف المستخدم ❌");
    }
  } catch (err) {
    console.error(err);
    alert("خطأ في الاتصال بالخادم");
  }
}

loadUsers();

function openEditModal(id, name, email, type) {
  document.getElementById("editUserId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editType").value = type;

  document.getElementById("editModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

document
  .getElementById("editForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("editUserId").value;

    const updatedUser = {
      name: document.getElementById("editName").value,
      email: document.getElementById("editEmail").value,
      usertype: document.getElementById("editType").value,
    };

    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        alert("تم تحديث بيانات المستخدم ✔");
        closeModal();
        loadUsers();
      } else {
        alert("فشل تحديث المستخدم ❌");
      }
    } catch (error) {
      console.error(error);
      alert("خطأ في الاتصال بالخادم");
    }
  });
