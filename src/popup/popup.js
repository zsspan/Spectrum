const API_BASE_URL = "http://localhost:5000";

const articlePlaceholder = document.getElementById("article-placeholder");
const publisherPlaceholder = document.getElementById("publisher-placeholder");
const predictButton = document.getElementById("predict-button");

// todo: relocate injected script logic to this button
const highlightButton = document.getElementById("highlight-button");

const prediction = document.getElementById("prediction");

function analyzeCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const url = currentTab.url;

    // make API call to receive article name and publisher
    fetch(`${API_BASE_URL}/article-metadata`, {
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
    console.log("Making prediction for URL:", url);

    // make API call to receive prediction, top words
    fetch(`${API_BASE_URL}/article-analyze`, {
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
        console.log("Prediction data received:", data);
        console.log("pred", data.prediction);
        console.log("after");
        // console.log(data.top_words);

        const savedState =
          localStorage.getItem("highlight-checkbox") === "true";
        if (savedState) {
          // highlightWords(data.top_words);

          // inject content script to highlight words
          chrome.scripting
            .executeScript({
              target: { tabId: currentTab.id },
              files: ["src/content/content.js"],
            })
            .then(() => {
              chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                func: (words) => {
                  highlightWords(words);
                },
                args: [data.top_words],
              });
            });
        }
        const capitalize = s => s.replace(/^./, char => char.toUpperCase());
        prediction.textContent = capitalize(data.prediction);
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
