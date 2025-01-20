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
    showNotification("Article saved!");
  } else {
    showNotification("Article or publisher data missing!", true);
  }
});

function updateArticleList(savedArticles) {
  const listContainer = document.getElementById("saved-articles-list");
  listContainer.innerHTML = ""; // clear existing list

  if (savedArticles.length === 0) {
    listContainer.innerHTML = "<p>No articles currently saved</p>";
    return;
  }

  savedArticles.forEach((article, index) => {
    const card = document.createElement("div");
    card.classList.add("article-card");

    const title = document.createElement("h3");
    title.textContent = article.article;
    const publisher = document.createElement("p");
    publisher.textContent = article.publisher;

    // Create a card controls container
    const controls = document.createElement("div");
    controls.classList.add("card-controls");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      savedArticles.splice(index, 1);
      localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
      updateArticleList(savedArticles);
      showNotification("Article deleted successfully!");
    });

    // Append delete button to the card controls
    controls.appendChild(deleteBtn);

    // Append all elements to the card
    card.appendChild(title);
    card.appendChild(publisher);
    card.appendChild(controls);
    listContainer.appendChild(card);
  });
}

function showNotification(message, isError = false) {
  const notification = document.createElement("div");
  notification.classList.add("notification", isError ? "error" : null);
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// clear all articles
document.getElementById("clear-button").addEventListener("click", () => {
  localStorage.removeItem("savedArticles");
  updateArticleList([]);
  showNotification("Cleared all!");
});
