document.addEventListener("DOMContentLoaded", () => {
  const articlePlaceholder = document.getElementById("article-placeholder");
  const publisherPlaceholder = document.getElementById("publisher-placeholder");
  const analyzeButton = document.getElementById("analyze-button");
  const predictButton = document.getElementById("predict-button");
  const prediction = document.getElementById("prediction");

  analyzeButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = currentTab.url;

      fetch("http://localhost:5000/current-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      })
        .then(response => response.json())
        .then(data => {
          articlePlaceholder.textContent = data.article_name;
          publisherPlaceholder.textContent = data.publisher;
          publisherPlaceholder.classList.remove('hidden');
        })
        .catch(error => {
          console.error("Error fetching article:", error);
          articlePlaceholder.textContent = "Error loading article";
        });
    });
  });


  predictButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = currentTab.url;

      fetch("http://localhost:5000/article-parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      })
        .then(response => response.json())
        .then(data => {
          prediction.textContent = data.prediction;
        })
        .catch(error => {
          console.error("Error fetching  url:", error);
          prediction.textContent = "Error loading article url";
        });
    });
  });

});