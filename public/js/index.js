// console.log("Hello from parcel")
import { displayMap } from "./mapbox";
import "@babel/polyfill";
import { login, logout } from "./login";

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector("form");
const logOutBtn = document.querySelector(".nav__el--logout");
// VALUES
// DELEGATION



if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (mapBox) {
    try {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
    } catch (error) {
        console.log(error)
    }
}
