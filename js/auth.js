// ==========================================================================
// Client-side auth simulation.
//
// There is no backend for this assessment, so "accounts" are kept in
// localStorage under classiq_users, plus one built-in demo account.
// A logged-in user is stored under classiq_session and read by script.js
// to change the header on every page.
// ==========================================================================

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEMO_ACCOUNT = { name: "Demo User", email: "demo@classiq.com", password: "demo123" };

function getUsers() {
  return JSON.parse(localStorage.getItem("classiq_users") || "[]");
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("classiq_users", JSON.stringify(users));
}

function findUser(email) {
  if (email.toLowerCase() === DEMO_ACCOUNT.email) return DEMO_ACCOUNT;
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (message) {
    input.classList.add("invalid");
    error.textContent = message;
  } else {
    input.classList.remove("invalid");
    error.textContent = "";
  }
}

function showStatus(message, isError) {
  const status = document.getElementById("formStatus");
  if (!status) return;
  status.textContent = message;
  status.className = "form-status " + (isError ? "error" : "success");
}

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  if (signupForm) signupForm.addEventListener("submit", handleSignup);
  if (loginForm) loginForm.addEventListener("submit", handleLogin);
});

function handleSignup(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const fullname = document.getElementById("fullname").value.trim();
  const password = document.getElementById("password").value;

  let valid = true;

  if (!EMAIL_PATTERN.test(email)) {
    setFieldError("email", "emailError", "Enter a valid email address.");
    valid = false;
  } else {
    setFieldError("email", "emailError", "");
  }

  if (fullname.length < 2) {
    setFieldError("fullname", "fullnameError", "Enter your full name.");
    valid = false;
  } else {
    setFieldError("fullname", "fullnameError", "");
  }

  if (password.length < 6) {
    setFieldError("password", "passwordError", "Password must be at least 6 characters.");
    valid = false;
  } else {
    setFieldError("password", "passwordError", "");
  }

  if (!valid) return;

  if (findUser(email)) {
    showStatus("An account with this email already exists. Please login.", true);
    return;
  }

  const user = { name: fullname, email, password };
  saveUser(user);
  localStorage.setItem("classiq_session", JSON.stringify({ name: fullname, email }));

  showStatus("Account created! Redirecting to your dashboard…", false);
  setTimeout(() => (window.location.href = "dashboard.html"), 900);
}

function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  let valid = true;

  if (!EMAIL_PATTERN.test(email)) {
    setFieldError("email", "emailError", "Enter a valid email address.");
    valid = false;
  } else {
    setFieldError("email", "emailError", "");
  }

  if (password.length === 0) {
    setFieldError("password", "passwordError", "Enter your password.");
    valid = false;
  } else {
    setFieldError("password", "passwordError", "");
  }

  if (!valid) return;

  const user = findUser(email);

  if (!user || user.password !== password) {
    showStatus("Incorrect email or password.", true);
    return;
  }

  localStorage.setItem("classiq_session", JSON.stringify({ name: user.name, email: user.email }));

  showStatus("Login successful! Redirecting…", false);
  setTimeout(() => (window.location.href = "dashboard.html"), 700);
}
