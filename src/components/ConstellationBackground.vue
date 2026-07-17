<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { VIEW_WIDTH, VIEW_HEIGHT, nodes, edges } from '../data/constellation'

const container = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

// Per-node drift: two summed sine waves per axis give smooth, non-repeating wander.
interface Drift {
  ax1: number; ax2: number; ay1: number; ay2: number
  wx1: number; wx2: number; wy1: number; wy2: number
  px1: number; px2: number; py1: number; py2: number
}

const drifts: Drift[] = nodes.map(() => {
  const amp = () => 40 + Math.random() * 40
  const freq = () => (Math.PI * 2) / (72 + Math.random() * 16)
  const phase = () => Math.random() * Math.PI * 2
  return {
    ax1: amp(), ax2: amp() * 0.5, ay1: amp(), ay2: amp() * 0.5,
    wx1: freq(), wx2: freq(), wy1: freq(), wy2: freq(),
    px1: phase(), px2: phase(), py1: phase(), py2: phase(),
  }
})

const positions = new Float64Array(nodes.length * 2)

// Random twinkle: each node periodically eases from its base opacity to fully
// opaque and back. twinkles holds [nextStartTime, duration] per node.
const twinkles = nodes.map<[number, number]>(() => [Math.random() * 15, 0])

function twinkleIntensity(i: number, t: number): number {
  const tw = twinkles[i]
  if (t < tw[0]) return 0
  if (t < tw[0] + tw[1]) return Math.sin((Math.PI * (t - tw[0])) / tw[1])
  tw[0] = t + 3 + Math.random() * 12
  tw[1] = 1.5 + Math.random() * 1.5
  return 0
}

function updatePositions(t: number) {
  for (let i = 0; i < nodes.length; i++) {
    const [x, y] = nodes[i]
    const d = drifts[i]
    positions[i * 2] = x + d.ax1 * Math.sin(d.wx1 * t + d.px1) + d.ax2 * Math.sin(d.wx2 * t + d.px2)
    positions[i * 2 + 1] = y + d.ay1 * Math.sin(d.wy1 * t + d.py1) + d.ay2 * Math.sin(d.wy2 * t + d.py2)
  }
}

let ctx: CanvasRenderingContext2D | null = null
let lineGradient: CanvasGradient | null = null
let scale = 1
let rafId = 0
let intersecting = false
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

// The resting brightness of the whole layer. Previously applied as CSS opacity
// on the container; baked into the drawing instead so twinkles can ramp past it
// to full brightness.
const BASE_OPACITY = 0.4

function resize() {
  const el = container.value
  const cv = canvas.value
  if (!el || !cv || el.clientWidth === 0) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  cv.width = el.clientWidth * dpr
  cv.height = el.clientHeight * dpr
  // Match the old CSS background: width 100%, height auto, anchored bottom centre.
  scale = cv.width / VIEW_WIDTH
  ctx = cv.getContext('2d')
  if (!ctx) return
  ctx.setTransform(scale, 0, 0, scale, 0, cv.height - VIEW_HEIGHT * scale)
  // Line gradient from the source SVG: fades to orange towards the bottom.
  // BASE_OPACITY is baked in here (the layer itself is opacity 1 so twinkles
  // can exceed the resting brightness).
  lineGradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT)
  lineGradient.addColorStop(0.2, 'rgba(247, 201, 72, 0)')
  lineGradient.addColorStop(1, `rgba(232, 103, 44, ${BASE_OPACITY})`)
  draw(performance.now() / 1000)
}

function draw(t: number) {
  const cv = canvas.value
  if (!ctx || !cv || !lineGradient) return
  updatePositions(t)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, cv.width, cv.height)
  ctx.setTransform(scale, 0, 0, scale, 0, cv.height - VIEW_HEIGHT * scale)
  ctx.lineWidth = 0.5
  ctx.strokeStyle = lineGradient
  for (const dashed of [0, 1]) {
    ctx.setLineDash(dashed ? [2, 4] : [])
    ctx.beginPath()
    for (const [a, b, dash] of edges) {
      if (dash !== dashed) continue
      ctx.moveTo(positions[a * 2], positions[a * 2 + 1])
      ctx.lineTo(positions[b * 2], positions[b * 2 + 1])
    }
    ctx.stroke()
  }
  ctx.setLineDash([])
  // Dots are filled individually so each can twinkle: the base colour/alpha
  // reproduces the SVG's vertical gradient (#181715 alpha 0 -> #F7C948 alpha 1),
  // and a twinkle raises the alpha from that base towards 1.
  for (let i = 0; i < nodes.length; i++) {
    const r = nodes[i][2]
    if (r === 0) continue
    const y = positions[i * 2 + 1]
    const g = Math.min(Math.max(y / VIEW_HEIGHT, 0), 1)
    const base = g * BASE_OPACITY
    const alpha = base + (1 - base) * twinkleIntensity(i, t)
    if (alpha <= 0) continue
    const red = Math.round(24 + (247 - 24) * g)
    const green = Math.round(23 + (201 - 23) * g)
    const blue = Math.round(21 + (72 - 21) * g)
    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`
    ctx.beginPath()
    ctx.arc(positions[i * 2], y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function shouldAnimate() {
  return intersecting && !document.hidden && !reducedMotion.matches
}

function tick(now: number) {
  rafId = 0
  if (!shouldAnimate()) return
  draw(now / 1000)
  rafId = requestAnimationFrame(tick)
}

function startOrStop() {
  if (shouldAnimate() && !rafId) {
    rafId = requestAnimationFrame(tick)
  } else if (reducedMotion.matches) {
    draw(0)
  }
}

let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

onMounted(() => {
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container.value!)
  intersectionObserver = new IntersectionObserver(([entry]) => {
    intersecting = entry.isIntersecting
    startOrStop()
  })
  intersectionObserver.observe(container.value!)
  document.addEventListener('visibilitychange', startOrStop)
  reducedMotion.addEventListener('change', startOrStop)
  resize()
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  document.removeEventListener('visibilitychange', startOrStop)
  reducedMotion.removeEventListener('change', startOrStop)
})
</script>

<template>
  <div ref="container" class="constellation" aria-hidden="true">
    <canvas ref="canvas" class="constellation-canvas"></canvas>
  </div>
</template>

<style scoped>
.constellation {
  position: absolute;
  left: 50%;
  bottom: -50%;
  transform: translateX(-50%);
  width: 100%;
  height: 200%;
  pointer-events: none;
  z-index: 0;
}

.constellation-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

@media (max-width: 640px) {
  .constellation {
    display: none;
  }
}
</style>
