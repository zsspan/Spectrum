// load articles from localStorage on load
window.addEventListener("load", () => {
  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];
  updateArticleList(savedArticles);
});

// save article functionality
document.getElementById("save-button").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const article = document.getElementById("article-placeholder").textContent;
    const publisher = `By: ${
      document.getElementById("publisher-placeholder").textContent
    }`;
    const prediction = document.getElementById("prediction").textContent;

    if (article && publisher && url) {
      const savedArticles =
        JSON.parse(localStorage.getItem("savedArticles")) || [];
      savedArticles.push({ article, publisher, url, prediction });
      localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
      updateArticleList(savedArticles);
      showNotification("Article saved!");
    } else {
      showNotification("Article or publisher data missing!", true);
    }
  });
});

function createArticleCard(article, index, savedArticles) {
  const card = document.createElement("div");
  card.classList.add("article-card");

  const predictionText = article.prediction
    ? `<p>Stance: ${article.prediction}</p>`
    : "";

  card.innerHTML = `
    <h3>${article.article}</h3>
    <p>${article.publisher}</p>
    ${predictionText}
    <div class="card-controls">
      <button class="link-button">Link</button>
      <button class="delete-button">Delete</button>
    </div>
  `;

  const linkBtn = card.querySelector(".link-button");
  linkBtn.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });

  const deleteBtn = card.querySelector(".delete-button");
  deleteBtn.addEventListener("click", () => {
    savedArticles.splice(index, 1);
    localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
    updateArticleList(savedArticles);
    showNotification("Article deleted successfully!");
  });

  return card;
}

function updateArticleList(savedArticles) {
  const listContainer = document.getElementById("saved-articles-list");
  listContainer.innerHTML = ""; // clear existing list

  if (savedArticles.length === 0) {
    listContainer.innerHTML = "<p>No articles currently saved</p>";
    return;
  }

  const fragment = document.createDocumentFragment();
  savedArticles.forEach((article, index) => {
    fragment.appendChild(createArticleCard(article, index, savedArticles));
  });

  listContainer.appendChild(fragment);
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
