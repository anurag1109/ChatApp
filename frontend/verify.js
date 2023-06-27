import { backend_URL } from "./constant.js";

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get("q");
  try {
    let data = await fetch(`${backend_URL}` + "/verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ myParam }),
    });
    const res = await data.json();

    if (data.ok) {
      const head = document.getElementById("head");
      setTimeout(() => (head.innerHTML = res.message), 500);

      setTimeout(
        () =>
          (window.location.href = "http://127.0.0.1:5501/frontend/login.html"),
        1000
      );
    } else {
      throw new Error(res.message);
    }
  } catch (err) {
    console.log("err", err.message);
  }
};
