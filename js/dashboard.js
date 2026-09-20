// ==========================================================================
// Dashboard page behaviour: personalise the banner if logged in,
// and give the course tiles a simple click action.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  const session = JSON.parse(localStorage.getItem("classiq_session") || "null");
  const heading = document.getElementById("bannerHeading");

  if (session && heading) {
    const firstName = (session.name || session.email).split(" ")[0];
    heading.textContent = `Welcome back, ${firstName} — enroll in your fav courses`;
  }

  document.querySelectorAll(".course-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      alert(`"${tile.dataset.course}" — course details coming soon.`);
    });
  });
});
