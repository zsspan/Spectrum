// load saved articles from local storage on page load
window.addEventListener("load", () => {
  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];
  updateArticleList(savedArticles);
});

// save current article (publisher + article placeholder) to local storage
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
    showNotification("No article or publisher data to save.", true);
  }
});

// update the article list view with saved articles from local storage
function updateArticleList(savedArticles) {
  const listContainer = document.getElementById("saved-articles-list");
  listContainer.innerHTML = ""; // clear existing list
  savedArticles.forEach((savedArticle, index) => {
    const li = document.createElement("li");
    li.textContent = `Article: ${savedArticle.article}, Publisher: ${savedArticle.publisher}`;
    listContainer.appendChild(li);
  });
}

document.getElementById("saved-articles-nav").addEventListener("click", () => {
  document.getElementById("saved-articles-content").classList.remove("hidden");
  document.getElementById("main-content").classList.add("hidden");
  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];
  updateArticleList(savedArticles);
});

// clear all saved articles from localStorage
document.getElementById("clear-button").addEventListener("click", () => {
  localStorage.removeItem("savedArticles");
  updateArticleList([]);

  showNotification("Article list fully cleared!");
});

// show a notification message to the user
function showNotification(message, isError = false) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  if (isError) {
    notification.classList.add("error");
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
