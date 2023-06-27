const loginForm = document.getElementById("login-form");

import { backend_URL } from "./constant.js";
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email,
    password,
  };
  try {
    let data = await fetch(`${backend_URL}` + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const res = await data.json();
    console.log(res);
    if (data.ok) {
      window.location.href =
        "http://127.0.0.1:5501/frontend/chat.html?q=" + res.username;
    } else {
      throw new Error(res.message);
    }
  } catch (err) {
    alert("err", err.message);
  }
});
