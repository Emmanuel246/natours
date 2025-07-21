// const axios = require('axios');
import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login", // Use relative URL
      data: {
        email,
        password,
      },
      credentials: "include",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    if ((res.data.status = "success")) location.reload(true);
  } catch (err) {
    showAlert("error", "Error Logging out! Try Again!");
  }
};

// const login = (email, password) => {
//     alert(email, password)
// }
