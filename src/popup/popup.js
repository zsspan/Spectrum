const articlePlaceholder = document.getElementById("article-placeholder");
const publisherPlaceholder = document.getElementById("publisher-placeholder");
const analyzeButton = document.getElementById("analyze-button");
const predictButton = document.getElementById("predict-button");
const prediction = document.getElementById("prediction");

function analyzeCurrentTab() {
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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        articlePlaceholder.textContent = data.article_name;
        publisherPlaceholder.textContent = data.publisher;
        publisherPlaceholder.classList.remove("hidden");
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  analyzeCurrentTab();
  // analyzeButton.addEventListener("click", analyzeCurrentTab);

  predictButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = currentTab.url;

      fetch("http://localhost:5000/article-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      })
        .then((response) => response.json())
        .then((data) => {
          prediction.textContent = data.prediction;
        })
        .catch((error) => {
          console.error("Error fetching url:", error);
          prediction.textContent = "Error loading article url";
        });
    });
  });
});
