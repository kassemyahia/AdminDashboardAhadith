console.log("login.js loaded");

window.adminlogin = async function (event) {
  event.preventDefault();

  const btnText = document.getElementById("loginText");
  const loader = document.getElementById("loginLoader");
  const btn = document.getElementById("loginBtn");

  const loginValue = document.querySelector('input[name="login"]').value.trim();
  const password = document
    .querySelector('input[name="password"]')
    .value.trim();

  if (!loginValue || !password) {
    alert("يرجى إدخال البريد الإلكتروني أو اسم المستخدم وكلمة المرور");
    return false;
  }

  // إظهار التحميل
  btnText.style.display = "none";
  loader.style.display = "inline-block";
  btn.disabled = true;

  try {
    const response = await fetch("https://apibykassem.onrender.com/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: loginValue,
        password: password,
      }),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok) {
      throw new Error(data.message || "خطأ في تسجيل الدخول");
    }

    if (!data.user || data.user.usertype !== "admin") {
      throw new Error("غير مصرح لك بالدخول ❌");
    }

    localStorage.setItem("token", data.token);

    window.location.href = "pages/main.html";
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "فشل الاتصال بالخادم");

    // إعادة الزر لوضعه الطبيعي
    btnText.style.display = "inline";
    loader.style.display = "none";
    btn.disabled = false;
  }

  return false;
};
