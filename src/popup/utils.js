let publisherStats = JSON.parse(localStorage.getItem("publisherStats")) || {};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("download-button").addEventListener("click", () => {
    const savedArticles =
      JSON.parse(localStorage.getItem("savedArticles")) || [];
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
  });

  document.getElementById("settings-button").addEventListener("click", () => {
    showModal();
  });

  document.getElementById("view-button").addEventListener("click", () => {
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
  });

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
});

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
  console.log("notatePrediction");
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
