const downloadButton = document.getElementById("download-button");
const settingsButton = document.getElementById("settings-button");
const viewButton = document.getElementById("view-button");
const highlightCheckbox = document.getElementById("highlight-checkbox");

let publisherStats = JSON.parse(localStorage.getItem("publisherStats")) || {};

function handleDownloadArticles() {
  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];
  const blob = new Blob([JSON.stringify(savedArticles, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "saved_articles.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification("Downloaded articles!");
}

function handleSettingsClick() {
  showModal();
}

function handleDownloadStats() {
  const statsJson = JSON.stringify(publisherStats, null, 2);
  const blob = new Blob([statsJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "publisher_stats.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification("Publisher stats downloaded!");
}

function showModal() {
  const modal = document.getElementById("settings-modal");
  modal.classList.add("show");

  const closeButton = modal.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("show");
    }
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

function notatePrediction() {
  const publisher = document.getElementById(
    "publisher-placeholder"
  ).textContent;
  const prediction = document.getElementById("prediction").textContent;

  if (!publisherStats[publisher]) {
    publisherStats[publisher] = { left: 0, right: 0, center: 0 };
  }

  if (prediction !== "") {
    if (prediction === "Left") {
      publisherStats[publisher].left += 1;
    } else if (prediction === "Right") {
      publisherStats[publisher].right += 1;
    } else if (prediction === "Center") {
      publisherStats[publisher].center += 1;
    }
    localStorage.setItem("publisherStats", JSON.stringify(publisherStats));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  downloadButton.addEventListener("click", handleDownloadArticles);
  settingsButton.addEventListener("click", handleSettingsClick);
  viewButton.addEventListener("click", handleDownloadStats);

  highlightCheckbox.addEventListener("change", () => {
    localStorage.setItem("highlight-checkbox", highlightCheckbox.checked);
  });

  const savedState = localStorage.getItem("highlight-checkbox") === "true";
  highlightCheckbox.checked = savedState;
});
