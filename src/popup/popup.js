const articlePlaceholder = document.getElementById("article-placeholder");
const publisherPlaceholder = document.getElementById("publisher-placeholder");
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
        console.error("Unable to load this webpage", error);
        articlePlaceholder.textContent = "Unable to load this webpage";
      });
  });
}

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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.prediction);

        console.log(data.top_words);

        // highlightWords(data.top_words);
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: highlightWords,
          args: [data.top_words], // Pass the top words
        });

        prediction.textContent = data.prediction;
        notatePrediction();
      })
      .catch((error) => {
        console.error("Unable to make prediction", error);
        prediction.textContent = "Unable to make prediction";
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  analyzeCurrentTab();
});
