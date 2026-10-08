"use strict";

const SPARSE_CORRIDOR = [38, 39, 40, 41, 53, 65, 66, 78];

const COLORS = {
  green: "#00ffa3",
  greenSoft: "#86ffd2",
  cyan: "#00d4ff",
  amber: "#ffbd59",
  red: "#ff4d7d",
  text: "#f3f7fa"
};

function seededNoise(value) {
  const x = Math.sin(value * 9283.731 + 17.17) * 43758.5453;
  return x - Math.floor(x);
}

function buildGraph() {
  const rows = 8;
  const columns = 12;
  const nodes = [];
  const edges = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const xJitter = (seededNoise(index + 1) - 0.5) * 0.026;
      const yJitter = (seededNoise(index + 137) - 0.5) * 0.036;
      nodes.push({
        index,
        x: 0.085 + (column / (columns - 1)) * 0.83 + xJitter,
        y: 0.12 + (row / (rows - 1)) * 0.75 + yJitter
      });

      if (column < columns - 1) edges.push([index, index + 1]);
      if (row < rows - 1) edges.push([index, index + columns]);
      if (row < rows - 1 && column < columns - 1 && (row + column) % 3 === 0) {
        edges.push([index, index + columns + 1]);
      }
      if (row < rows - 1 && column > 0 && (row * 2 + column) % 5 === 0) {
        edges.push([index, index + columns - 1]);
      }
    }
  }

  return { nodes, edges };
}

const GRAPH = buildGraph();
const NODE_BY_INDEX = new Map(GRAPH.nodes.map((node) => [node.index, node]));
const BROAD_ORDER = [...GRAPH.nodes]
  .sort((a, b) => {
    const aDistance = Math.hypot(a.x - 0.36, a.y - 0.49);
    const bDistance = Math.hypot(b.x - 0.36, b.y - 0.49);
    return aDistance - bDistance;
  })
  .map((node) => node.index);
const WORK_SPARKS = Array.from({ length: 1000 }, (_, index) => ({
  x: 0.07 + seededNoise(index + 2001) * 0.86,
  y: 0.1 + seededNoise(index + 5003) * 0.78,
  energy: seededNoise(index + 9001)
})).sort((a, b) => {
  const aDistance = Math.hypot(a.x - 0.36, a.y - 0.49);
  const bDistance = Math.hypot(b.x - 0.36, b.y - 0.49);
  return aDistance - bDistance;
});

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function rgba(hex, alpha) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function pointForNode(node, width, height) {
  return { x: node.x * width, y: node.y * height };
}

function drawDiamond(context, x, y, radius, color, alpha = 1) {
  context.save();
  context.globalAlpha = alpha;
  context.translate(x, y);
  context.rotate(Math.PI / 4);
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 13;
  context.fillRect(-radius, -radius, radius * 2, radius * 2);
  context.restore();
}

function drawCorridor(context, indices, width, height, progress, color, lineWidth) {
  if (indices.length < 2) return;
  const visibleSegments = Math.max(1, Math.ceil((indices.length - 1) * clamp(progress)));

  context.save();
  context.beginPath();
  indices.slice(0, visibleSegments + 1).forEach((index, pointIndex) => {
    const point = pointForNode(NODE_BY_INDEX.get(index), width, height);
    if (pointIndex === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = color;
  context.shadowBlur = lineWidth > 2 ? 12 : 0;
  context.stroke();
  context.restore();
}

function drawWorkSparks(context, mode, width, height, progress) {
  if (mode === "broad") {
    const visible = Math.floor(WORK_SPARKS.length * clamp(progress));
    context.save();
    for (let index = 0; index < visible; index += 1) {
      const spark = WORK_SPARKS[index];
      const radius = 0.55 + spark.energy * 0.7;
      context.beginPath();
      context.arc(spark.x * width, spark.y * height, radius, 0, Math.PI * 2);
      context.fillStyle = rgba(COLORS.cyan, 0.2 + spark.energy * 0.34);
      context.fill();
    }
    context.restore();
    return;
  }

  if (mode === "corridor") {
    const visible = Math.floor(SPARSE_CORRIDOR.length * clamp(progress));
    context.save();
    for (let index = 0; index < visible; index += 1) {
      const point = pointForNode(NODE_BY_INDEX.get(SPARSE_CORRIDOR[index]), width, height);
      context.beginPath();
      context.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
      context.fillStyle = COLORS.cyan;
      context.shadowColor = COLORS.cyan;
      context.shadowBlur = 11;
      context.fill();
    }
    context.restore();
  }
}

function measureCanvas(canvas, dimensions) {
  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, bounds.width);
  const height = Math.max(1, bounds.height);
  const pixelWidth = Math.max(1, Math.round(width * ratio));
  const pixelHeight = Math.max(1, Math.round(height * ratio));

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  dimensions.set(canvas, { width, height, ratio });
}

function drawNetwork(canvas, dimensions, lane, scene) {
  const size = dimensions.get(canvas);
  if (!size) return;

  const { width, height, ratio } = size;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  const {
    act,
    actName,
    phase,
    phaseIndex,
    phaseProgress,
    workProgress,
    admissionProgress,
    phaseIndices
  } = scene;
  const changeVisible = phaseIndex >= phaseIndices.change;
  const obligationVisible = phaseIndex >= phaseIndices.obligation;
  const finalVisible = phaseIndex >= phaseIndices.carry;
  const isTampered = actName === "tampered";
  const mode = lane === "full" ? act.fullMode : act.helixMode;
  const workOrder = mode === "corridor" ? SPARSE_CORRIDOR : mode === "broad" ? BROAD_ORDER : [];
  const processedCount = Math.floor(workOrder.length * workProgress);
  const processed = new Set(mode === "corridor" ? workOrder.slice(0, processedCount) : []);
  const changed = new Set(act.changeIndices);
  const obligation = new Set(act.obligationIndices);

  context.save();
  context.lineWidth = 1;
  for (const [startIndex, endIndex] of GRAPH.edges) {
    const start = pointForNode(NODE_BY_INDEX.get(startIndex), width, height);
    const end = pointForNode(NODE_BY_INDEX.get(endIndex), width, height);
    const isObligationEdge = obligationVisible && obligation.has(startIndex) && obligation.has(endIndex);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.strokeStyle = isObligationEdge
      ? rgba(COLORS.amber, 0.24)
      : rgba(COLORS.green, finalVisible ? 0.2 : 0.13);
    context.stroke();
  }
  context.restore();

  if (obligationVisible && !isTampered) {
    const obligationProgress = phase === "obligation" ? phaseProgress : 1;
    if (actName === "sparse") {
      drawCorridor(context, SPARSE_CORRIDOR, width, height, obligationProgress, rgba(COLORS.amber, 0.78), 1.3);
    } else {
      for (const index of act.obligationIndices) {
        const point = pointForNode(NODE_BY_INDEX.get(index), width, height);
        context.beginPath();
        context.arc(point.x, point.y, 5.6, 0, Math.PI * 2);
        context.strokeStyle = rgba(COLORS.amber, 0.24 + obligationProgress * 0.22);
        context.lineWidth = 1;
        context.stroke();
      }
    }
  }

  if (phaseIndex >= phaseIndices.work && actName === "sparse" && lane === "helix") {
    drawCorridor(context, SPARSE_CORRIDOR, width, height, workProgress, COLORS.cyan, 2.3);
  }

  if (phase === "work" && mode === "broad" && workProgress > 0 && workProgress < 1) {
    const source = pointForNode(NODE_BY_INDEX.get(actName === "dense" ? 43 : 39), width, height);
    const maxRadius = Math.hypot(width, height) * 0.72;
    context.beginPath();
    context.arc(source.x, source.y, maxRadius * workProgress, 0, Math.PI * 2);
    context.strokeStyle = rgba(COLORS.cyan, 0.42);
    context.lineWidth = 2;
    context.shadowColor = COLORS.cyan;
    context.shadowBlur = 18;
    context.stroke();
    context.shadowBlur = 0;
  }

  drawWorkSparks(context, mode, width, height, workProgress);

  for (const node of GRAPH.nodes) {
    const point = pointForNode(node, width, height);
    const isProcessed = processed.has(node.index);
    const isChanged = changed.has(node.index);
    const isObligation = obligation.has(node.index);
    const radius = Math.max(2.1, Math.min(width, height) * 0.0092);

    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fillStyle = rgba(COLORS.green, finalVisible ? 0.3 : 0.2);
    context.strokeStyle = rgba(COLORS.greenSoft, finalVisible ? 0.48 : 0.3);
    context.lineWidth = 0.9;
    context.fill();
    context.stroke();

    if (obligationVisible && isObligation && !isTampered) {
      context.beginPath();
      context.arc(point.x, point.y, radius + 3.3, 0, Math.PI * 2);
      context.strokeStyle = rgba(COLORS.amber, 0.74);
      context.lineWidth = 1.2;
      context.stroke();
    }

    if (isProcessed) {
      context.beginPath();
      context.arc(point.x, point.y, radius + 1.4, 0, Math.PI * 2);
      context.fillStyle = rgba(COLORS.cyan, 0.9);
      context.shadowColor = COLORS.cyan;
      context.shadowBlur = 13;
      context.fill();
      context.shadowBlur = 0;
      context.beginPath();
      context.arc(point.x, point.y, Math.max(1.1, radius * 0.34), 0, Math.PI * 2);
      context.fillStyle = COLORS.text;
      context.fill();
    }

    if (changeVisible && isChanged) {
      const changeAlpha = phase === "change"
        ? 0.72 + Math.sin(phaseProgress * Math.PI) * 0.28
        : 0.92;
      drawDiamond(context, point.x, point.y, radius + 1.1, COLORS.amber, changeAlpha);
    }
  }

  if (isTampered && lane === "helix" && phaseIndex >= phaseIndices.change) {
    const approaching = phaseIndex <= phaseIndices.work;
    const x = approaching
      ? width * (0.035 + admissionProgress * 0.075)
      : width * (0.11 - phaseProgress * 0.055);
    const y = height * 0.5;
    const packetColor = phaseIndex >= phaseIndices.carry ? COLORS.red : COLORS.amber;
    context.save();
    context.setLineDash([4, 5]);
    context.beginPath();
    context.moveTo(width * 0.015, y);
    context.lineTo(Math.max(width * 0.02, x - 8), y);
    context.strokeStyle = rgba(packetColor, 0.72);
    context.lineWidth = 1.5;
    context.stroke();
    context.restore();
    drawDiamond(context, x, y, 5.5, packetColor, phaseIndex >= phaseIndices.carry ? 0.72 : 1);
  }
}

export function createStateFieldRenderer({ fullCanvas, helixCanvas }) {
  if (!(fullCanvas instanceof HTMLCanvasElement) || !(helixCanvas instanceof HTMLCanvasElement)) {
    throw new TypeError("State Field V2 requires both canvas elements.");
  }

  const canvases = [fullCanvas, helixCanvas];
  const dimensions = new Map();
  let lastScene = null;
  let resizeObserver = null;
  let resizeFrame = null;

  function measure() {
    for (const canvas of canvases) measureCanvas(canvas, dimensions);
  }

  function redraw() {
    if (!lastScene) return;
    drawNetwork(fullCanvas, dimensions, "full", lastScene);
    drawNetwork(helixCanvas, dimensions, "helix", lastScene);
  }

  function scheduleMeasure() {
    if (resizeFrame !== null) return;
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;
      measure();
      redraw();
    });
  }

  measure();

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(scheduleMeasure);
    for (const canvas of canvases) resizeObserver.observe(canvas.parentElement || canvas);
  } else {
    window.addEventListener("resize", scheduleMeasure, { passive: true });
  }

  return {
    render(scene) {
      lastScene = scene;
      redraw();
    },
    destroy() {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
      lastScene = null;
    }
  };
}
