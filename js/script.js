// ==========================================================================
// Shared behaviour across all pages: mobile nav toggle, subscribe form,
// and swapping header buttons when a demo session is active.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Footer subscribe form (index.html only) — simple email validation.
  const subscribeForm = document.getElementById("subscribeForm");
  if (subscribeForm) {
    subscribeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("subscribeEmail");
      const error = document.getElementById("subscribeError");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(input.value.trim())) {
        error.textContent = "Please enter a valid email address.";
        input.classList.add("invalid");
        return;
      }

      error.textContent = "";
      input.classList.remove("invalid");
      input.value = "";
      error.textContent = "Subscribed! Thanks for joining.";
      error.style.color = "#1f8a3b";
    });
  }

  swapHeaderForSession();
});

// If a demo session exists (see auth.js), swap the Login/SignUp buttons
// in the header for a user pill + logout, on every page.
function swapHeaderForSession() {
  const session = JSON.parse(localStorage.getItem("classiq_session") || "null");
  const actions = document.querySelector(".header-actions");
  if (!actions) return;

  if (session) {
    const loginBtn = actions.querySelector('a[href="login.html"]');
    const signupBtn = actions.querySelector('a[href="signup.html"]');
    if (loginBtn) loginBtn.remove();
    if (signupBtn) signupBtn.remove();

    const pill = document.createElement("div");
    pill.className = "user-pill";
    pill.innerHTML = `<span class="dot"></span>${session.name || session.email}
      <button id="logoutBtn" class="btn btn-dark btn-sm" style="margin-left:8px;">Logout</button>`;
    actions.prepend(pill);

    const logoutBtn = pill.querySelector("#logoutBtn");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("classiq_session");
      window.location.href = "index.html";
    });
  }
}
