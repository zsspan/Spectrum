const mainNav = document.getElementById("main-nav");
const savedArticlesNav = document.getElementById("saved-articles-nav");
const mainContent = document.getElementById("main-content");
const savedArticlesContent = document.getElementById("saved-articles-content");

function switchPage() {
  mainContent.classList.add("hidden");
  savedArticlesContent.classList.add("hidden");

  if (this === mainNav) {
    mainContent.classList.remove("hidden");
  } else if (this === savedArticlesNav) {
    savedArticlesContent.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mainNav.addEventListener("click", switchPage);
  savedArticlesNav.addEventListener("click", switchPage);
});
