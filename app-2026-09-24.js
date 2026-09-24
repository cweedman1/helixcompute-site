const DATA_URLS = {
  evidence: "/data/evidence-profiles-2026-09-23.json",
  pricing: "/data/cloud-pricing-2026-09-23.json"
};

const browserWindow = typeof window === "undefined" ? null : window;
const isLocal = browserWindow && ["localhost", "127.0.0.1"].includes(browserWindow.location.hostname);
const DEMO_API = isLocal
  ? "http://127.0.0.1:8000/demo"
  : "https://helixcompute-demo.onrender.com/demo";

let evidenceData = null;
let pricingData = null;

function formatInteger(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatDecimal(value, digits = 2) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatKilobytes(bytes) {
  return `${formatDecimal(bytes / 1000, 1)} KB`;
}

function tieredCost(usage, dimension) {
  let remaining = Math.max(0, usage - dimension.free_allowance_units);
  let cost = 0;
  for (const tier of dimension.paid_tiers) {
    const amount = tier.width_units === null
      ? remaining
      : Math.min(remaining, tier.width_units);
    cost += amount * tier.rate;
    remaining -= amount;
    if (remaining <= 0) break;
  }
  return cost;
}

function marginalCost(workloadUsage, otherUsage, dimension, customRate) {
  if (customRate !== null) {
    return workloadUsage * customRate;
  }
  return tieredCost(otherUsage + workloadUsage, dimension) - tieredCost(otherUsage, dimension);
}

function helixUsageRange(expandedUsage, evidence) {
  if (evidence.model === "collapse_ratio") {
    return {
      low: expandedUsage / evidence.measured_high,
      high: expandedUsage / evidence.measured_low
    };
  }
  if (evidence.model === "helix_multiplier") {
    return {
      low: expandedUsage * evidence.measured_low,
      high: expandedUsage * evidence.measured_high
    };
  }
  throw new Error(`Unsupported evidence model: ${evidence.model}`);
}

function calculateProjection({ expandedUsage, otherUsage, evidence, provider, kind, customRate }) {
  const dimension = provider[kind];
  const helixUsage = helixUsageRange(expandedUsage, evidence);
  const baselineCost = marginalCost(expandedUsage, otherUsage, dimension, customRate);
  const helixLowCost = marginalCost(helixUsage.low, otherUsage, dimension, customRate);
  const helixHighCost = marginalCost(helixUsage.high, otherUsage, dimension, customRate);
  return {
    unit: dimension.display_unit,
    baselineCost,
    helixUsage,
    helixLowCost,
    helixHighCost,
    savingsLow: baselineCost - helixHighCost,
    savingsHigh: baselineCost - helixLowCost,
    customRate: customRate !== null
  };
}

function renderLiveDemo(data) {
  if (data.schema_version !== "helix.governed_demo.v1") {
    throw new Error("The public endpoint has not yet been upgraded to the governed demo schema.");
  }
  const campaign = data.sparse_campaign;
  const dense = data.dense_control;
  const probe = data.fail_closed_probe;
  return [
    `Full representation       ${formatKilobytes(campaign.expanded_baseline_transition_bytes)}`,
    `Helix                     ${formatKilobytes(campaign.governed_transition_bytes_including_periodic_snapshots)}`,
    `Reduction                 ${formatDecimal(campaign.transition_collapse_ratio, 2)}x`,
    `Exact reconstruction      ${campaign.all_reconstructions_exact ? "YES" : "NO"}`,
    "",
    `Verified before acceptance  ${campaign.all_admission_checks_passed ? "YES" : "NO"}`,
    `Invalid change              ${probe.status}; state ${probe.receiver_state_unchanged ? "UNCHANGED" : "MUTATED"}`,
    `Dense change                ${dense.selected_route === "FULL_FALLBACK" ? "COMPLETE STATE USED" : dense.selected_route}`
  ].join("\n");
}

async function runHelixDemo() {
  const output = document.getElementById("demo-output");
  const meaning = document.getElementById("meaning-block");
  output.textContent = "Running the governed reconstruction fixture…\n";
  meaning.style.display = "none";
  try {
    const response = await fetch(`${DEMO_API}?snapshot_interval=10`);
    if (!response.ok) throw new Error(`Demo returned HTTP ${response.status}`);
    const data = await response.json();
    output.textContent = renderLiveDemo(data);
    meaning.style.display = "block";
  } catch (error) {
    output.textContent = `Demo unavailable: ${error.message}`;
  }
}

function fillSelect(select, rows) {
  select.replaceChildren();
  for (const row of rows) {
    const option = document.createElement("option");
    option.value = row.id;
    option.textContent = row.label;
    select.append(option);
  }
}

function profilesFor(kind) {
  return evidenceData.profiles.filter((profile) => profile.kind === kind);
}

function renderCalculator() {
  if (!evidenceData || !pricingData) return;
  const kind = document.getElementById("calculator-kind").value;
  const evidence = evidenceData.profiles.find((row) => row.id === document.getElementById("evidence-profile").value);
  const provider = pricingData.profiles.find((row) => row.id === document.getElementById("provider-profile").value);
  const expandedUsage = Number(document.getElementById("expanded-usage").value);
  const otherUsage = Number(document.getElementById("other-usage").value);
  const customRaw = document.getElementById("custom-rate").value.trim();
  const customRate = customRaw === "" ? null : Number(customRaw);
  const output = document.getElementById("cost-output");
  const detailsOutput = document.getElementById("cost-details-output");

  if (!evidence || !provider || !Number.isFinite(expandedUsage) || expandedUsage < 0 || !Number.isFinite(otherUsage) || otherUsage < 0 || (customRate !== null && (!Number.isFinite(customRate) || customRate < 0))) {
    output.textContent = "Enter non-negative usage and rate values.";
    detailsOutput.textContent = "";
    return;
  }

  const result = calculateProjection({ expandedUsage, otherUsage, evidence, provider, kind, customRate });
  const dimension = provider[kind];
  const baselineLabel = evidence.model === "collapse_ratio" ? "Expanded" : "Baseline";
  const evidenceRange = evidence.measured_low === evidence.measured_high
    ? `${formatDecimal(evidence.measured_low, 4)} ${evidence.unit}`
    : `${formatDecimal(evidence.measured_low, 4)}–${formatDecimal(evidence.measured_high, 4)} ${evidence.unit}`;
  const helixCost = result.helixLowCost === result.helixHighCost
    ? formatMoney(result.helixLowCost)
    : `${formatMoney(result.helixLowCost)}–${formatMoney(result.helixHighCost)}`;
  let differenceLabel = "Projected savings";
  let differenceValue = `${formatMoney(result.savingsLow)}–${formatMoney(result.savingsHigh)}`;
  if (result.savingsLow < 0 && result.savingsHigh < 0) {
    differenceLabel = "Projected difference";
    differenceValue = `Helix costs ${formatMoney(Math.abs(result.savingsHigh))}–${formatMoney(Math.abs(result.savingsLow))} more`;
  }
  const dataAvoidedLow = expandedUsage - result.helixUsage.high;
  const dataAvoidedHigh = expandedUsage - result.helixUsage.low;
  let dataDifferenceLabel = "Data avoided";
  let dataDifferenceValue = `${formatDecimal(dataAvoidedLow)}–${formatDecimal(dataAvoidedHigh)} ${result.unit}`;
  if (dataAvoidedLow < 0 && dataAvoidedHigh < 0) {
    dataDifferenceLabel = "Data difference";
    dataDifferenceValue = `Helix uses ${formatDecimal(Math.abs(dataAvoidedHigh))}–${formatDecimal(Math.abs(dataAvoidedLow))} ${result.unit} more`;
  }
  output.textContent = [
    `${baselineLabel} data\n${formatDecimal(expandedUsage)} ${result.unit}`,
    `Projected Helix data\n${formatDecimal(result.helixUsage.low)}–${formatDecimal(result.helixUsage.high)} ${result.unit}`,
    `${dataDifferenceLabel}\n${dataDifferenceValue}`,
    "",
    `${baselineLabel} cost\n${formatMoney(result.baselineCost)}`,
    `Projected Helix cost\n${helixCost}`,
    `${differenceLabel}\n${differenceValue}`,
    "",
    "Projection from measured Helix byte reductions and published provider pricing. Not a measured cloud bill."
  ].join("\n\n");
  detailsOutput.textContent = [
    `Evidence: ${evidence.label}`,
    `Measured range: ${evidenceRange}`,
    `Baseline represented: ${evidence.baseline}`,
    `Provider/profile: ${provider.label}`,
    `Region/destination: ${provider.region_destination}`,
    `Pricing date: ${pricingData.as_of}`,
    `Units: ${result.unit}`,
    `${baselineLabel} workload: ${formatDecimal(expandedUsage)} ${result.unit}`,
    `Other account usage: ${formatDecimal(otherUsage)} ${result.unit}`,
    `Projected Helix usage: ${formatDecimal(result.helixUsage.low)}–${formatDecimal(result.helixUsage.high)} ${result.unit}`,
    `Expanded marginal list cost: ${formatMoney(result.baselineCost)}`,
    `Projected Helix marginal list cost: ${formatMoney(result.helixLowCost)}–${formatMoney(result.helixHighCost)}`,
    `Projected marginal savings: ${formatMoney(result.savingsLow)}–${formatMoney(result.savingsHigh)}`,
    `Free allowance/tier treatment: ${result.customRate ? "CUSTOM FLAT RATE; provider tiers and allowances bypassed" : dimension.free_allowance_note}`,
    `Custom-rate status: ${result.customRate ? `USED (${formatMoney(customRate)} per ${result.unit})` : "NOT USED"}`,
    `Snapshot treatment: ${evidence.snapshot_treatment}`,
    "Exclusions: taxes, negotiated discounts, commitments, operations, retrieval, replication, acceleration, compute, and physical I/O not represented by the measured profile."
  ].join("\n");
}

function refreshEvidenceProfiles() {
  const kind = document.getElementById("calculator-kind").value;
  fillSelect(document.getElementById("evidence-profile"), profilesFor(kind));
  renderCalculator();
}

async function initializeCalculator() {
  const output = document.getElementById("cost-output");
  const detailsOutput = document.getElementById("cost-details-output");
  try {
    const [evidenceResponse, pricingResponse] = await Promise.all([
      fetch(DATA_URLS.evidence),
      fetch(DATA_URLS.pricing)
    ]);
    if (!evidenceResponse.ok || !pricingResponse.ok) throw new Error("dated profile files could not be loaded");
    [evidenceData, pricingData] = await Promise.all([
      evidenceResponse.json(),
      pricingResponse.json()
    ]);
    fillSelect(document.getElementById("provider-profile"), pricingData.profiles);
    refreshEvidenceProfiles();
  } catch (error) {
    output.textContent = `Calculator unavailable: ${error.message}`;
    detailsOutput.textContent = "";
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("run-demo-btn")?.addEventListener("click", runHelixDemo);
    document.getElementById("calculator-kind")?.addEventListener("change", refreshEvidenceProfiles);
    for (const id of ["evidence-profile", "provider-profile", "expanded-usage", "other-usage", "custom-rate"]) {
      document.getElementById(id)?.addEventListener("input", renderCalculator);
      document.getElementById(id)?.addEventListener("change", renderCalculator);
    }
    initializeCalculator();
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { tieredCost, marginalCost, helixUsageRange, calculateProjection };
}
