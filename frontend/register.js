const signupForm = document.getElementById("signup-form");

import { backend_URL } from "./constant.js";

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the form input values
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const registrationData = {
    username,
    email,
    password,
  };
  try {
    let data = await fetch(`${backend_URL}` + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });
    const res = await data.json();
    console.log(res);
  } catch (err) {
    console.log("err", err);
  }
});
