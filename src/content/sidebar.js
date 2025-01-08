// Check if the sidebar already exists
if (!document.getElementById("analyzer-sidebar")) {
  // Create the sidebar container
  const sidebar = document.createElement("div");
  sidebar.id = "analyzer-sidebar";

  // Set initial content
  sidebar.innerHTML = `
      <div class="sidebar-header">
        <h2>Article Analyzer</h2>
        <button id="close-sidebar">✖</button>
      </div>
      <div class="sidebar-content">
        <p>Loading analysis...</p>
      </div>
    `;

  // Inject into the page
  document.body.appendChild(sidebar);

  // Close button functionality
  document.getElementById("close-sidebar").addEventListener("click", () => {
    sidebar.remove();
  });
}

// Example: Update content dynamically
function updateSidebarContent(summary) {
  const content = document.querySelector(".sidebar-content");
  content.innerHTML = `
      <p><b>Bias:</b> ${summary.bias}</p>
      <p><b>Confidence:</b> ${(summary.confidence * 100).toFixed(2)}%</p>
    `;
}

// Fetch or generate a mock analysis and update the sidebar
setTimeout(() => {
  const exampleSummary = {
    bias: "Right-Leaning",
    confidence: 0.88,
  };
  updateSidebarContent(exampleSummary);
}, 2000); // Simulate data fetching
