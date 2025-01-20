// load articles from localStorage on load
window.addEventListener("load", () => {
  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];
  updateArticleList(savedArticles);
});

// save article functionality
document.getElementById("save-button").addEventListener("click", () => {
  const article = document.getElementById("article-placeholder").textContent;
  const publisher = document.getElementById(
    "publisher-placeholder"
  ).textContent;

  if (article && publisher) {
    const savedArticles =
      JSON.parse(localStorage.getItem("savedArticles")) || [];
    savedArticles.push({ article, publisher });
    localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
    updateArticleList(savedArticles);
    showNotification("Article saved successfully!");
  } else {
    showNotification("Article or publisher data missing!", true);
  }
});

// update article list
function updateArticleList(savedArticles) {
  const listContainer = document.getElementById("saved-articles-list");
  listContainer.innerHTML = ""; // clear existing list

  if (savedArticles.length === 0) {
    listContainer.innerHTML = "<p>No saved articles available.</p>";
    return;
  }

  savedArticles.forEach((article, index) => {
    const card = document.createElement("div");
    card.classList.add("article-card");

    const title = document.createElement("h3");
    title.textContent = `Article: ${article.article}`;
    const publisher = document.createElement("p");
    publisher.textContent = `Publisher: ${article.publisher}`;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      savedArticles.splice(index, 1);
      localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
      updateArticleList(savedArticles);
      showNotification("Article deleted successfully!");
    });

    card.appendChild(title);
    card.appendChild(publisher);
    card.appendChild(deleteBtn);
    listContainer.appendChild(card);
  });
}

// Notification function
function showNotification(message, isError = false) {
  const notification = document.createElement("div");
  notification.classList.add("notification", isError ? "error" : null);
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// navbar navigation
document.getElementById("saved-articles-nav").addEventListener("click", () => {
  document.getElementById("saved-articles-content").classList.remove("hidden");
  document.getElementById("main-content").classList.add("hidden");
});

document.getElementById("main-nav").addEventListener("click", () => {
  document.getElementById("main-content").classList.remove("hidden");
  document.getElementById("saved-articles-content").classList.add("hidden");
});

// clear all articles
document.getElementById("clear-button").addEventListener("click", () => {
  localStorage.removeItem("savedArticles");
  updateArticleList([]);
  showNotification("All articles cleared successfully!");
});
