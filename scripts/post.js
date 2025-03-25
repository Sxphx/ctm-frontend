const API_BASE_URL =
  window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://127.0.0.1:3001"
    : "https://ctm-api.vercel.app/";

function showAlertServer(type, topic, message) {
  const toastrOptions = {
    closeButton: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: true,
    showDuration: 300,
    hideDuration: 1000,
    timeOut: 3000,
    extendedTimeOut: 1000,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  toastr.options = toastrOptions;

  console.log(`[NOTIFY ${type}] ${topic}: ${message}`);

  if (type === "success") {
    toastr.success(message, topic);
  } else if (type === "error") {
    toastr.error(message, topic);
  } else if (type === "info") {
    toastr.info(message, topic);
  } else if (type === "warning") {
    toastr.warning(message, topic);
  } else {
    toastr.info(message, topic);
  }
}

async function loadAllLeaderboard() {
  console.log("Loading all leaderboard...");
  try {
    const response = await fetch(`${API_BASE_URL}/allleaderboard`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      data.sort((a, b) => b.score - a.score);
      return data;
    } else {
      console.error("Error:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function loadLeaderboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      updateLeaderboard(data);
      return data;
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "No error message" }));
      console.error("Error loading leaderboard:", errorData);
      showAlertServer(
        "error",
        "Error loading leaderboard",
        errorData.message || "An error occurred while loading the leaderboard."
      );
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    showAlertServer(
      "error",
      "Error loading leaderboard",
      "An unexpected error occurred. Please try again later."
    );
    return null;
  }
}

function updateLeaderboard(data) {
  const sortedData = [...data].sort((a, b) => b.score - a.score);
  console.log(sortedData);

  sortedData.slice(0, 3).forEach((player, index) => {
    document.getElementById(`player${index + 1}-name`).textContent = player.username;
    document.getElementById(`player${index + 1}-score`).textContent = player.score;
  });
}

async function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!username || !password) {
    showAlertServer(
      "error",
      "Registration Failed",
      "Please fill in all fields."
    );
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlertServer("success", "Registration Successful", data.message);
      $("#registerModal").modal("hide");
      document.getElementById("registerForm").reset();
    } else {
      showAlertServer("error", "Registration Failed", data.error);
    }
  } catch (error) {
    showAlertServer(
      "error",
      "Registration Failed",
      `${data.message || "An unexpected error occurred. Please try again."}`
    );
  }
}

async function login() {
  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showAlertServer("error", "Login Failed", "Please fill in all fields");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      showAlertServer("success", "Login Successful", data.message);
      $("#loginModal").modal("hide");
      usernameInput.value = "";
      passwordInput.value = "";
      window.userData = data;
      updateLRL({
        loggedIn: true,
        username: data.user.username,
        UID: data.user.UID,
        score: data.user.score,
      });
    } else {
      showAlertServer("error", "Login Failed", data.error);
    }
  } catch (error) {
    console.error("Error:", error);
    showAlertServer("error", "Login Failed", "An error occurred during login.");
  }
}

async function logout() {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      showAlertServer("success", "Logout Successful", data.message);
      updateLRL(null);
      if (document.getElementById("score")) {
        document.getElementById("score").textContent = "0";
      }
      delete window.userData;
    } else {
      showAlertServer("error", "Logout Failed", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    showAlertServer(
      "error",
      "Logout Failed",
      "An error occurred during logout."
    );
  }
}

async function checkSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/session`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok && data.loggedIn) {
      window.userData = data;
      if (document.getElementById("score")) {
        document.getElementById("score").textContent = data.user.score;
      }
      updateLRL({
        loggedIn: true,
        username: data.user.username,
        UID: data.user.UID,
        score: data.user.score,
      });
    } else {
      updateLRL(null);
    }
  } catch (error) {
    console.error("Error checking session:", error);
  }
}

function updateLRL(userData) {
  const loginButton = document.getElementById("login-btn");
  const logoutButton = document.getElementById("logout-btn");
  const registerButton = document.getElementById("register-btn");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (!userData || !userData.loggedIn) {
    loginButton.style.display = "unset";
    logoutButton.style.display = "none";
    registerButton.style.display = "unset";
    usernameDisplay.textContent = "Guest";
  } else {
    loginButton.style.display = "none";
    logoutButton.style.display = "unset";
    registerButton.style.display = "none";
    usernameDisplay.textContent = userData.username;
  }
}

async function sendScoreToServer(score) {
  if (!window.userData?.user?.loggedIn) {
    showAlertServer("warning", "Not logged in", "Please log in to submit your score.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
      credentials: "include",
    });

    const responseJson = await response.json();

    if (response.ok) {
      showAlertServer("success", "Score submitted", responseJson.message);
    } else {
      showAlertServer("error", "Error submitting score", responseJson.message);
    }
  } catch (error) {
    console.error("Error submitting score:", error);
    showAlertServer("error", "Error submitting score", "An error occurred while submitting your score.");
  }
}

window.onload = () => {
  loadLeaderboard();
  checkSession();
};
