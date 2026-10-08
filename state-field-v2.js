"use strict";

const PHASES = [
  { key: "established", duration: 1050 },
  { key: "change", duration: 1350 },
  { key: "obligation", duration: 1550 },
  { key: "work", duration: 3500 },
  { key: "carry", duration: 1250 },
  { key: "resolve", duration: 1450 }
];

const PHASE_INDEX = Object.fromEntries(PHASES.map((phase, index) => [phase.key, index]));
const SPARSE_CORRIDOR = [38, 39, 40, 41, 53, 65, 66, 78];

const DEFAULT_TOTAL_LABELS = {
  fullProcessedLabel: "Illustrative work",
  helixProcessedLabel: "Illustrative work",
  fullCarriedLabel: "Depicted as retained",
  helixCarriedLabel: "Depicted as retained",
  fullCompleteLabel: "Complete state",
  helixCompleteLabel: "Complete state"
};

const ACTS = {
  sparse: {
    kicker: "ACT 01 · SPARSE CHANGE",
    title: "Preserve the established. Advance what the successor requires.",
    description: "One change creates a bounded successor obligation. FULL revisits the field; HELIX follows the illustrated obligation corridor.",
    causeOverline: "SAME STARTING POINT",
    causeTitle: "Established state + one incoming change",
    causeDetail: "Physical change creates an illustrated 8-unit successor obligation",
    fullRouteOverline: "COMPLETE-STATE ROUTE",
    fullRouteTitle: "FULL",
    helixRouteOverline: "RETAINED PREDECESSOR + SUCCESSOR WORK",
    helixRouteTitle: "HELIX",
    fullCounterLabel: "ILLUSTRATIVE WORK",
    helixCounterLabel: "ILLUSTRATIVE WORK",
    fullCounterUnit: "illustrative units",
    helixCounterUnit: "illustrative units",
    fullFieldCaption: "1 cyan spark = 1 illustrative work unit",
    helixFieldCaption: "8 cyan sparks follow the illustrated corridor",
    economicsOverline: "ILLUSTRATIVE ROUTE BURDEN",
    economicsTitle: "Selective route stays below FULL.",
    economicsNote: "This scene uses illustrative units—not a measured cost model.",
    economicsFullValue: "1,000 i.u.",
    economicsSelectiveValue: "8 i.u.",
    climaxKicker: "CONCEPTUAL PLAYBACK",
    climaxTitle: "SAME RESULT",
    climaxDetail: "Illustrative paths; the same complete successor.",
    climaxFullLabel: "FULL",
    climaxFullMain: "1,000 illustrative units",
    climaxFullSub: "0 depicted as retained · 1,000 complete",
    climaxHelixLabel: "HELIX",
    climaxHelixMain: "8 illustrative units",
    climaxHelixSub: "992 depicted as retained · 1,000 complete",
    ...DEFAULT_TOTAL_LABELS,
    mobileFullLabel: "FULL",
    mobileHelixLabel: "HELIX",
    mobileFullUnit: "illustrative work",
    mobileHelixUnit: "illustrative work",
    fullFinalWork: 1000,
    helixFinalWork: 8,
    fullFinalCarried: 0,
    helixFinalCarried: 992,
    fullComplete: "1,000",
    helixComplete: "1,000",
    changeIndices: [39],
    obligationIndices: SPARSE_CORRIDOR,
    fullMode: "broad",
    helixMode: "corridor",
    phaseStatus: {
      established: "The same established predecessor state is present on both routes.",
      change: "One physical change arrives. It is not yet the same thing as successor work.",
      obligation: "An illustrated 8-unit successor obligation is traced separately from the incoming change.",
      work: "FULL revisits the field. HELIX work follows only the illustrated corridor.",
      carry: "The scene depicts 992 illustrative units as retained predecessor state.",
      resolve: "The conceptual routes end at the same successor. Recorded demo outcome: receiver matched examiner FULL."
    },
    fullStatuses: ["Established state", "Change received", "Obligation mapped", "Broad work wave", "0 depicted as retained", "Fixture match"],
    helixStatuses: ["Established state", "Change received", "Corridor mapped", "Selective work", "992 depicted as retained", "Fixture match"],
    phaseLabels: ["Established", "Change", "Obligation", "Work", "Retain", "Resolve"],
    announcement: "Conceptual sparse scene complete. FULL used one thousand illustrative work units. HELIX used eight, with nine hundred ninety-two depicted as retained predecessor state. In the recorded demo, the receiver matched examiner FULL."
  },
  dense: {
    kicker: "ACT 02 · DENSE CHANGE",
    title: "When the selective path costs more, choose FULL.",
    description: "In the recorded dense fixture, the candidate representation exceeded complete state. This scene visualizes that crossover with illustrative units.",
    causeOverline: "SAME STARTING POINT",
    causeTitle: "Established state + broad incoming change",
    causeDetail: "The illustrated successor burden broadens and crosses FULL",
    fullRouteOverline: "COMPLETE-STATE ROUTE",
    fullRouteTitle: "FULL",
    helixRouteOverline: "HELIX ROUTE DECISION",
    helixRouteTitle: "HELIX",
    fullCounterLabel: "ILLUSTRATIVE WORK",
    helixCounterLabel: "FULL WORK SELECTED",
    fullCounterUnit: "illustrative units",
    helixCounterUnit: "illustrative units after pivot",
    fullFieldCaption: "1 cyan spark = 1 illustrative work unit",
    helixFieldCaption: "illustrated candidate yields to FULL",
    economicsOverline: "ILLUSTRATIVE ROUTE BURDEN",
    economicsTitle: "Illustrated selective burden crosses FULL.",
    economicsNote: "Recorded dense fixture: candidate representation exceeded complete state. Bars are illustrative.",
    economicsFullValue: "1,000 i.u.",
    economicsSelectiveValue: "1,180 i.u.",
    climaxKicker: "ROUTE CROSSOVER",
    climaxTitle: "FULL SELECTED",
    climaxDetail: "The route changes. The required result does not.",
    climaxFullLabel: "FULL",
    climaxFullMain: "1,000 illustrative units",
    climaxFullSub: "complete-state route · 1,000 complete",
    climaxHelixLabel: "HELIX",
    climaxHelixMain: "FULL route chosen",
    climaxHelixSub: "1,000 illustrative units · 1,000 complete",
    ...DEFAULT_TOTAL_LABELS,
    mobileFullLabel: "FULL",
    mobileHelixLabel: "HELIX",
    mobileFullUnit: "illustrative work",
    mobileHelixUnit: "FULL after pivot",
    fullFinalWork: 1000,
    helixFinalWork: 1000,
    fullFinalCarried: 0,
    helixFinalCarried: 0,
    fullComplete: "1,000",
    helixComplete: "1,000",
    changeIndices: Array.from({ length: 96 }, (_, index) => index).filter((index) => ((index * 7) % 10) < 5),
    obligationIndices: Array.from({ length: 96 }, (_, index) => index).filter((index) => ((index * 11) % 13) < 11),
    fullMode: "broad",
    helixMode: "broad",
    phaseStatus: {
      established: "The same established predecessor state is present on both routes.",
      change: "Broad physical change arrives. Density alone does not decide the route.",
      obligation: "The illustrated successor burden broadens and crosses the FULL reference.",
      work: "HELIX selects FULL before the candidate is applied to the receiver.",
      carry: "The complete-state route finishes with no selective carry-forward advantage.",
      resolve: "The conceptual pivot ends at complete state. Recorded demo outcome: receiver matched examiner FULL."
    },
    fullStatuses: ["Established state", "Broad change", "FULL reference", "FULL processing", "Complete state", "Fixture match"],
    helixStatuses: ["Established state", "Broad change", "Crossover depicted", "FULL selected", "Complete state", "Fixture match"],
    phaseLabels: ["Established", "Change", "Crossover", "Work", "Complete", "Resolve"],
    announcement: "Conceptual dense scene complete. The illustrated selective burden exceeded FULL, so HELIX selected the complete-state route. In the recorded demo, the receiver matched examiner FULL."
  },
  tampered: {
    kicker: "ACT 03 · TAMPERED CHANGE",
    title: "Lineage fails. Mutation never begins.",
    description: "A wrong-parent candidate reaches admission. Continuity fails before row changes are applied, so the receiver remains untouched.",
    causeOverline: "AUTHORITY + CANDIDATE",
    causeTitle: "Established receiver + wrong-parent candidate",
    causeDetail: "Admission work occurs before successor work is allowed",
    fullRouteOverline: "ESTABLISHED RECEIVER",
    fullRouteTitle: "RECEIVER",
    helixRouteOverline: "HELIX ADMISSION BOUNDARY",
    helixRouteTitle: "HELIX ADMISSION",
    fullCounterLabel: "SUCCESSOR WORK",
    helixCounterLabel: "ADMISSION",
    fullCounterUnit: "successor work not reached",
    helixCounterUnit: "candidate checked before mutation",
    fullFieldCaption: "known-good receiver remains stable",
    helixFieldCaption: "candidate remains outside receiver state",
    economicsOverline: "ADMISSION BOUNDARY",
    economicsTitle: "Parent continuity fails before mutation.",
    economicsNote: "Admission is performed. Successor work and receiver mutation never begin.",
    economicsFullValue: "UNCHANGED",
    economicsSelectiveValue: "REJECTED",
    climaxKicker: "REJECTED · WRONG PARENT",
    climaxTitle: "RECEIVER UNCHANGED",
    climaxDetail: "No successor is admitted. The established predecessor remains in place.",
    climaxFullLabel: "RECEIVER",
    climaxFullMain: "Known-good receiver",
    climaxFullSub: "1,000 established · unchanged",
    climaxHelixLabel: "HELIX ADMISSION",
    climaxHelixMain: "Admission performed",
    climaxHelixSub: "0 successor work · no mutation",
    fullProcessedLabel: "Successor work",
    helixProcessedLabel: "Successor work",
    fullCarriedLabel: "Receiver state",
    helixCarriedLabel: "Admission",
    fullCompleteLabel: "Mutation",
    helixCompleteLabel: "Receiver",
    mobileFullLabel: "RECEIVER",
    mobileHelixLabel: "HELIX ADMISSION",
    mobileFullUnit: "successor work",
    mobileHelixUnit: "before mutation",
    fullFinalWork: 0,
    helixFinalWork: 0,
    fullFinalCarried: 1000,
    helixFinalCarried: 1000,
    fullComplete: "UNCHANGED",
    helixComplete: "UNCHANGED",
    changeIndices: [],
    obligationIndices: [],
    fullMode: "static",
    helixMode: "rejected",
    phaseStatus: {
      established: "The receiver begins with established, known-good state.",
      change: "A candidate package arrives with proposed change and claimed lineage.",
      obligation: "Admission inspects the candidate before any receiver mutation is allowed.",
      work: "Admission is performed and parent continuity is checked. Successor work has not begun.",
      carry: "The parent mismatch stops admission. The candidate is rejected outside the receiver.",
      resolve: "Zero successor work is performed. No mutation occurs. The receiver remains unchanged."
    },
    fullStatuses: ["Known-good state", "Receiver stable", "No mutation", "Zero successor work", "Predecessor retained", "Unchanged"],
    helixStatuses: ["Admission ready", "Candidate received", "Lineage inspection", "Admission performed", "Rejected", "Receiver unchanged"],
    phaseLabels: ["Established", "Candidate", "Admission", "Inspect", "Reject / retain", "Unchanged"],
    announcement: "Tampered scene complete. Admission was performed, parent continuity failed, zero successor work was performed, no receiver mutation occurred, and the receiver remained unchanged."
  }
};

const numberFormatter = new Intl.NumberFormat("en-US");

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function easeInOutCubic(value) {
  if (value < 0.5) return 4 * value * value * value;
  return 1 - Math.pow(-2 * value + 2, 3) / 2;
}

async function initializeStateField() {
  const root = document.getElementById("sf-state-field");
  if (!root) return;

  const { createStateFieldRenderer } = await import("./state-field-v2-visualization.js");

  const byId = (id) => root.querySelector(`#${id}`);
  const firstById = (...ids) => ids.map(byId).find(Boolean) || null;
  const actPanel = byId("sf-act-panel");
  const replayButton = byId("sf-replay-button");
  const pauseButton = byId("sf-pause-button");
  const pauseIcon = pauseButton?.querySelector(".sf-pause-icon");
  const pauseLabel = pauseButton?.querySelector(".sf-pause-label");
  const liveStatus = byId("sf-live-status");
  const fullCanvas = byId("sf-full-network");
  const helixCanvas = byId("sf-helix-network");
  const actTabs = Array.from(root.querySelectorAll("[data-act-target]"));
  const speedButtons = Array.from(root.querySelectorAll("[data-speed]"));
  const phaseNodes = Array.from(root.querySelectorAll("[data-phase-node]"));

  if (!actPanel || !replayButton || !pauseButton || !pauseIcon || !pauseLabel || !liveStatus || !fullCanvas || !helixCanvas || actTabs.length !== 3) {
    console.warn("State Field V2 was not initialized because its DOM contract is incomplete.");
    return;
  }

  const textFields = {
    kicker: byId("sf-act-kicker"),
    title: byId("sf-act-title"),
    description: byId("sf-act-description"),
    causeOverline: byId("sf-cause-overline"),
    causeTitle: byId("sf-cause-title"),
    causeDetail: byId("sf-cause-detail"),
    fullRouteOverline: byId("sf-full-route-overline"),
    fullRouteTitle: byId("sf-full-route-title"),
    helixRouteOverline: byId("sf-helix-route-overline"),
    helixRouteTitle: byId("sf-helix-route-title"),
    fullCounterLabel: byId("sf-full-counter-label"),
    helixCounterLabel: byId("sf-helix-counter-label"),
    fullCounterUnit: byId("sf-full-counter-unit"),
    helixCounterUnit: byId("sf-helix-counter-unit"),
    fullFieldCaption: byId("sf-full-field-caption"),
    helixFieldCaption: byId("sf-helix-field-caption"),
    economicsOverline: byId("sf-economics-overline"),
    economicsTitle: byId("sf-economics-title"),
    economicsNote: byId("sf-economics-note"),
    economicsFullValue: byId("sf-economics-full-value"),
    economicsSelectiveValue: byId("sf-economics-selective-value"),
    climaxKicker: byId("sf-climax-kicker"),
    climaxTitle: byId("sf-climax-title"),
    climaxDetail: byId("sf-climax-detail"),
    climaxFullLabel: byId("sf-climax-full-label"),
    climaxFullMain: byId("sf-climax-full-main"),
    climaxFullSub: byId("sf-climax-full-sub"),
    climaxHelixLabel: byId("sf-climax-helix-label"),
    climaxHelixMain: byId("sf-climax-helix-main"),
    climaxHelixSub: byId("sf-climax-helix-sub"),
    fullProcessedLabel: byId("sf-full-processed-label"),
    helixProcessedLabel: byId("sf-helix-processed-label"),
    fullCarriedLabel: byId("sf-full-carried-label"),
    helixCarriedLabel: byId("sf-helix-carried-label"),
    fullCompleteLabel: byId("sf-full-complete-label"),
    helixCompleteLabel: byId("sf-helix-complete-label")
  };

  const dynamicFields = {
    fullWork: byId("sf-full-work-count"),
    helixWork: byId("sf-helix-work-count"),
    fullProcessed: byId("sf-full-processed"),
    helixProcessed: byId("sf-helix-processed"),
    fullCarried: byId("sf-full-carried"),
    helixCarried: byId("sf-helix-carried"),
    fullComplete: byId("sf-full-complete"),
    helixComplete: byId("sf-helix-complete"),
    fullRouteStatus: byId("sf-full-route-status"),
    helixRouteStatus: byId("sf-helix-route-status"),
    phaseStatus: byId("sf-phase-status"),
    mobilePhase: byId("sf-mobile-phase"),
    mobileFullLabel: byId("sf-mobile-full-label"),
    mobileHelixLabel: byId("sf-mobile-helix-label"),
    mobileFullCount: firstById("sf-mobile-full-count", "sf-mobile-full-value"),
    mobileHelixCount: firstById("sf-mobile-helix-count", "sf-mobile-helix-value"),
    mobileFullUnit: byId("sf-mobile-full-unit"),
    mobileHelixUnit: byId("sf-mobile-helix-unit"),
    admissionSummary: byId("sf-admission-summary"),
    admissionCheck: byId("sf-admission-check"),
    successorWork: byId("sf-successor-work"),
    receiverMutation: byId("sf-receiver-mutation")
  };

  const textCache = new WeakMap();
  const renderCache = {
    phaseRail: "",
    phaseCopy: "",
    act: ""
  };
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const query = new URLSearchParams(window.location.search);
  const renderer = createStateFieldRenderer({ fullCanvas, helixCanvas });

  const playback = {
    act: "sparse",
    phaseIndex: 0,
    phaseElapsed: 0,
    speed: 1,
    state: "idle",
    frame: null,
    lastTimestamp: null,
    announced: false
  };

  function setText(element, value) {
    if (!element) return;
    const next = String(value);
    if (textCache.get(element) === next) return;
    element.textContent = next;
    textCache.set(element, next);
  }

  function setHidden(element, hidden) {
    if (element && element.hidden !== hidden) element.hidden = hidden;
  }

  function currentAct() {
    return ACTS[playback.act];
  }

  function formatNumber(value) {
    return numberFormatter.format(value);
  }

  function phaseProgress() {
    return clamp(playback.phaseElapsed / PHASES[playback.phaseIndex].duration);
  }

  function getWorkProgress() {
    if (playback.phaseIndex < PHASE_INDEX.work) return 0;
    if (playback.phaseIndex > PHASE_INDEX.work) return 1;
    return easeInOutCubic(phaseProgress());
  }

  function getAdmissionProgress() {
    if (playback.act !== "tampered") return getWorkProgress();
    if (playback.phaseIndex < PHASE_INDEX.obligation) return 0;
    if (playback.phaseIndex === PHASE_INDEX.obligation) return phaseProgress() * 0.45;
    if (playback.phaseIndex === PHASE_INDEX.work) return 0.45 + phaseProgress() * 0.55;
    return 1;
  }

  function setTextFields(act) {
    for (const [key, element] of Object.entries(textFields)) setText(element, act[key]);
    setText(dynamicFields.mobileFullLabel, act.mobileFullLabel);
    setText(dynamicFields.mobileHelixLabel, act.mobileHelixLabel);
    setText(dynamicFields.mobileFullUnit, act.mobileFullUnit);
    setText(dynamicFields.mobileHelixUnit, act.mobileHelixUnit);
    setHidden(dynamicFields.admissionSummary, playback.act !== "tampered");
  }

  function setActTabs(actName) {
    for (const tab of actTabs) {
      const selected = tab.dataset.actTarget === actName;
      tab.classList.toggle("sf-is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) actPanel.setAttribute("aria-labelledby", tab.id);
    }
  }

  function updatePlaybackButton() {
    if (playback.state === "running") {
      setText(pauseIcon, "Ⅱ");
      setText(pauseLabel, "Pause");
      pauseButton.setAttribute("aria-label", "Pause visual playback");
      return;
    }
    if (playback.state === "paused") {
      setText(pauseIcon, "▶");
      setText(pauseLabel, "Resume");
      pauseButton.setAttribute("aria-label", "Resume visual playback");
      return;
    }
    if (playback.state === "complete") {
      setText(pauseIcon, "▶");
      setText(pauseLabel, "Play again");
      pauseButton.setAttribute("aria-label", "Play this scene again");
      return;
    }
    setText(pauseIcon, "▶");
    setText(pauseLabel, "Run transition");
    pauseButton.setAttribute("aria-label", "Run visual transition");
  }

  function setPlaybackState(nextState) {
    playback.state = nextState;
    if (root.dataset.playback !== nextState) root.dataset.playback = nextState;
    updatePlaybackButton();
  }

  function updateMotionControls() {
    for (const button of speedButtons) button.disabled = motionQuery.matches;
  }

  function updatePhaseRail() {
    const cacheKey = `${playback.act}:${playback.phaseIndex}:${playback.state}`;
    if (renderCache.phaseRail === cacheKey) return;
    renderCache.phaseRail = cacheKey;
    for (const node of phaseNodes) {
      const index = PHASE_INDEX[node.dataset.phaseNode];
      node.classList.toggle("sf-is-complete", index < playback.phaseIndex || playback.state === "complete");
      node.classList.toggle("sf-is-active", index === playback.phaseIndex && playback.state !== "complete");
      if (index === playback.phaseIndex && playback.state !== "complete") node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
    }
  }

  function tamperedAdmissionStatus() {
    if (playback.phaseIndex < PHASE_INDEX.obligation) return "PENDING";
    if (playback.phaseIndex < PHASE_INDEX.carry) return "IN PROGRESS";
    return "PERFORMED · REJECTED";
  }

  function updateCounters() {
    const act = currentAct();
    const workProgress = getWorkProgress();
    const fullWork = Math.round(act.fullFinalWork * (playback.act === "tampered" ? 0 : workProgress));
    const helixWork = Math.round(act.helixFinalWork * (playback.act === "tampered" ? getAdmissionProgress() : workProgress));
    let fullWorkDisplay = formatNumber(fullWork);
    let helixWorkDisplay = formatNumber(helixWork);
    let fullProcessedDisplay = formatNumber(fullWork);
    let helixProcessedDisplay = formatNumber(helixWork);
    let fullCarriedDisplay = formatNumber(1000 - fullWork);
    let helixCarriedDisplay = formatNumber(1000 - helixWork);
    let fullCompleteDisplay = act.fullComplete;
    let helixCompleteDisplay = act.helixComplete;

    if (playback.act === "tampered") {
      const admissionStatus = tamperedAdmissionStatus();
      helixWorkDisplay = playback.phaseIndex < PHASE_INDEX.obligation
        ? "—"
        : playback.phaseIndex < PHASE_INDEX.carry ? "CHECK" : "REJECT";
      fullProcessedDisplay = "0";
      helixProcessedDisplay = "0";
      fullCarriedDisplay = "UNCHANGED";
      helixCarriedDisplay = admissionStatus;
      fullCompleteDisplay = "NONE";
      helixCompleteDisplay = "UNCHANGED";
      setText(dynamicFields.admissionCheck, admissionStatus);
      setText(dynamicFields.successorWork, "0");
      setText(dynamicFields.receiverMutation, "NONE · RECEIVER UNCHANGED");
    }

    setText(dynamicFields.fullWork, fullWorkDisplay);
    setText(dynamicFields.helixWork, helixWorkDisplay);
    setText(dynamicFields.fullProcessed, fullProcessedDisplay);
    setText(dynamicFields.helixProcessed, helixProcessedDisplay);
    setText(dynamicFields.fullCarried, fullCarriedDisplay);
    setText(dynamicFields.helixCarried, helixCarriedDisplay);
    setText(dynamicFields.fullComplete, fullCompleteDisplay);
    setText(dynamicFields.helixComplete, helixCompleteDisplay);
    setText(dynamicFields.mobileFullCount, fullWorkDisplay);
    setText(dynamicFields.mobileHelixCount, helixWorkDisplay);
  }

  function updatePhaseCopy() {
    const act = currentAct();
    const phase = PHASES[playback.phaseIndex].key;
    const cacheKey = `${playback.act}:${phase}`;
    if (renderCache.phaseCopy === cacheKey) return;
    renderCache.phaseCopy = cacheKey;
    setText(dynamicFields.phaseStatus, act.phaseStatus[phase]);
    setText(dynamicFields.fullRouteStatus, act.fullStatuses[playback.phaseIndex]);
    setText(dynamicFields.helixRouteStatus, act.helixStatuses[playback.phaseIndex]);
    setText(dynamicFields.mobilePhase, `${act.kicker.split(" · ")[0]} · ${act.phaseLabels[playback.phaseIndex]}`);
  }

  function render() {
    const act = currentAct();
    const phase = PHASES[playback.phaseIndex].key;
    if (root.dataset.phase !== phase) root.dataset.phase = phase;
    updatePhaseRail();
    updateCounters();
    updatePhaseCopy();
    renderer.render({
      act,
      actName: playback.act,
      phase,
      phaseIndex: playback.phaseIndex,
      phaseProgress: phaseProgress(),
      workProgress: getWorkProgress(),
      admissionProgress: getAdmissionProgress(),
      phaseIndices: PHASE_INDEX
    });
  }

  function stopFrame() {
    if (playback.frame !== null) {
      window.cancelAnimationFrame(playback.frame);
      playback.frame = null;
    }
  }

  function completePlayback({ announce = true } = {}) {
    stopFrame();
    playback.phaseIndex = PHASES.length - 1;
    playback.phaseElapsed = PHASES[PHASES.length - 1].duration;
    playback.lastTimestamp = null;
    setPlaybackState("complete");
    render();
    if (announce && !playback.announced) {
      setText(liveStatus, currentAct().announcement);
      playback.announced = true;
    }
  }

  function advancePhase() {
    if (playback.phaseIndex >= PHASES.length - 1) {
      completePlayback();
      return false;
    }
    playback.phaseIndex += 1;
    playback.phaseElapsed = 0;
    return true;
  }

  function tick(timestamp) {
    if (playback.state !== "running") return;
    if (playback.lastTimestamp === null) playback.lastTimestamp = timestamp;
    const delta = Math.min(80, timestamp - playback.lastTimestamp) * playback.speed;
    playback.lastTimestamp = timestamp;
    playback.phaseElapsed += delta;

    while (playback.phaseElapsed >= PHASES[playback.phaseIndex].duration) {
      playback.phaseElapsed -= PHASES[playback.phaseIndex].duration;
      if (!advancePhase()) return;
    }

    render();
    playback.frame = window.requestAnimationFrame(tick);
  }

  function startPlayback({ reset = false } = {}) {
    if (motionQuery.matches) {
      completePlayback();
      return;
    }
    if (reset) {
      playback.phaseIndex = 0;
      playback.phaseElapsed = 0;
      playback.announced = false;
      setText(liveStatus, "");
    }
    stopFrame();
    playback.lastTimestamp = null;
    setPlaybackState("running");
    render();
    playback.frame = window.requestAnimationFrame(tick);
  }

  function pausePlayback() {
    if (playback.state !== "running") return;
    stopFrame();
    playback.lastTimestamp = null;
    setPlaybackState("paused");
    render();
  }

  function togglePlayback() {
    if (playback.state === "running") pausePlayback();
    else if (playback.state === "paused") startPlayback();
    else startPlayback({ reset: true });
  }

  function replay() {
    startPlayback({ reset: true });
  }

  function renderAct(actName) {
    const act = ACTS[actName];
    playback.act = actName;
    if (root.dataset.act !== actName) root.dataset.act = actName;
    renderCache.act = actName;
    renderCache.phaseRail = "";
    renderCache.phaseCopy = "";
    setTextFields(act);
    setActTabs(actName);
    phaseNodes.forEach((node, index) => setText(node.querySelector("strong"), act.phaseLabels[index]));
    render();
  }

  function selectAct(actName, { focusTab = false, start = true } = {}) {
    if (!Object.prototype.hasOwnProperty.call(ACTS, actName)) return;
    stopFrame();
    playback.phaseIndex = 0;
    playback.phaseElapsed = 0;
    playback.announced = false;
    playback.lastTimestamp = null;
    setText(liveStatus, "");
    renderAct(actName);
    if (start) startPlayback({ reset: true });
    else setPlaybackState("idle");
    if (focusTab) actTabs.find((tab) => tab.dataset.actTarget === actName)?.focus();
  }

  function stepAct(direction, focusTab = false) {
    const actNames = Object.keys(ACTS);
    const currentIndex = actNames.indexOf(playback.act);
    const nextIndex = (currentIndex + direction + actNames.length) % actNames.length;
    selectAct(actNames[nextIndex], { focusTab, start: true });
  }

  for (const tab of actTabs) {
    tab.addEventListener("click", () => selectAct(tab.dataset.actTarget, { start: true }));
    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepAct(1, true);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepAct(-1, true);
      } else if (event.key === "Home") {
        event.preventDefault();
        selectAct("sparse", { focusTab: true, start: true });
      } else if (event.key === "End") {
        event.preventDefault();
        selectAct("tampered", { focusTab: true, start: true });
      }
    });
  }

  replayButton.addEventListener("click", replay);
  pauseButton.addEventListener("click", togglePlayback);

  for (const button of speedButtons) {
    button.addEventListener("click", () => {
      playback.speed = Number(button.dataset.speed);
      for (const candidate of speedButtons) {
        const active = candidate === button;
        candidate.classList.toggle("sf-is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      }
    });
  }

  root.addEventListener("keydown", (event) => {
    const target = event.target;
    const interactive = target instanceof Element && Boolean(target.closest("button, a, input, select, textarea, summary"));
    if (interactive) return;
    if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      replay();
    } else if (event.key === " ") {
      event.preventDefault();
      togglePlayback();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      stepAct(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepAct(-1);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playback.state === "running") pausePlayback();
  });

  const handleMotionChange = () => {
    updateMotionControls();
    if (motionQuery.matches && playback.state === "running") completePlayback();
    else render();
  };
  if (typeof motionQuery.addEventListener === "function") motionQuery.addEventListener("change", handleMotionChange);
  else motionQuery.addListener(handleMotionChange);

  const requestedAct = query.get("act");
  const initialAct = Object.prototype.hasOwnProperty.call(ACTS, requestedAct) ? requestedAct : "sparse";
  renderAct(initialAct);
  setPlaybackState("idle");
  updateMotionControls();
  if (query.get("final") === "1") completePlayback({ announce: false });
}

function scheduleStateFieldInitialization() {
  const root = document.getElementById("sf-state-field");
  if (!root) return;

  if (!("IntersectionObserver" in window)) {
    void initializeStateField();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    void initializeStateField();
  });

  observer.observe(root);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleStateFieldInitialization, { once: true });
} else {
  scheduleStateFieldInitialization();
}
