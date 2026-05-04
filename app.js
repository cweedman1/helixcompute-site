let currentScale = 1;
let lastDemoData = null;

function updateScale(value) {
  currentScale = parseInt(value);

  document.getElementById("scale-label").innerText = `${currentScale} TB/day`;

  if (lastDemoData) {
    renderCost(lastDemoData);
  }
}

function renderCost(data) {
  const costBox = document.getElementById("cost-output");

  const monthlyGB = currentScale * 1000 * 30;

  const awsSaved = Math.round(monthlyGB * 0.20 * (data.compute_reduction_pct / 100));
  const gcpSaved = Math.round(monthlyGB * 0.18 * (data.compute_reduction_pct / 100));
  const azureSaved = Math.round(monthlyGB * 0.19 * (data.compute_reduction_pct / 100));

  costBox.innerText =
    ` Estimated Monthly Savings \n\n` +
    `AWS:   $${awsSaved.toLocaleString()}\n` +
    `GCP:   $${gcpSaved.toLocaleString()}\n` +
    `Azure: $${azureSaved.toLocaleString()}\n\n` +
    `(Based on ${currentScale}TB/day pipeline baseline)`;
}

async function runHelixDemo() {
  const output = document.getElementById("demo-output");
  const costBox = document.getElementById("cost-output");
  const meaning = document.getElementById("meaning-block");
  const slider = document.getElementById("slider-block"); // 🔥 ADD THIS

  output.innerText = "Running Helix...\n";
  costBox.innerText = "";

  meaning.style.display = "none";
  slider.style.display = "none"; // 🔥 RESET SLIDER

  try {
    const res = await fetch("https://helixcompute-demo.onrender.com/demo");
    const data = await res.json();

    lastDemoData = data;

    output.innerText =
      `Full Execution: ${data.full_ops.toLocaleString()} operations\n` +
      `Helix Execution: ${data.delta_ops.toLocaleString()} operations\n\n` +
      `Compute Reduction: ${data.compute_reduction_pct}%\n` +
      `Data Reduction: ${data.data_reduction_pct}%\n\n` +
      `Validation: ${data.hash_match ? "VERIFIED" : "FAILED"}\n\n` +
      `Same result. ${data.compute_reduction_pct}% less compute.`;

    renderCost(data);

    // 🔥 Reveal AFTER results
    meaning.style.display = "block";
    slider.style.display = "block"; // 🔥 THIS WAS MISSING

  } catch (err) {
    output.innerText = "Server waking up. Try again in a moment.";
  }
}