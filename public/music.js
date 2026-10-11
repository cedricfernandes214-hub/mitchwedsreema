// Soft instrumental: a gentle piano-style rendition of Pachelbel's Canon in D,
// synthesised live with the Web Audio API (public-domain tune, no audio file).
// Browsers block autoplay, so it starts when a guest presses the music button.

const STEP = 0.32 // seconds per eighth note
const bass = [50, 45, 47, 42, 43, 38, 43, 45] // D A Bm F#m G D G A
const chords = [
  [62, 66, 69, 74], [57, 61, 64, 69], [59, 62, 66, 71], [54, 57, 61, 66],
  [55, 59, 62, 67], [54, 57, 62, 66], [55, 59, 62, 67], [57, 61, 64, 69],
]
const arp = [0, 1, 2, 3, 2, 1, 2, 1]
const melodyA = [78, 76, 74, 73, 71, 69, 71, 73] // F# E D C# B A B C#
const melodyB = [74, 73, 71, 69, 67, 66, 67, 64] // D C# B A G F# G E
// Which melody lines play on each pass of the eight chords
const passes = [[], [melodyA], [melodyB], [melodyA, melodyB]]

let ctx, master, reverb, timer
let step = 0
let next = 0
let playing = false

const freq = (midi) => 440 * 2 ** ((midi - 69) / 12)

function note(midi, time, length, volume) {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(volume, time + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, time + length)
  gain.connect(master)
  gain.connect(reverb)
  for (const [type, mult, level] of [['triangle', 1, 1], ['sine', 2, 0.25]]) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq(midi) * mult
    g.gain.value = level
    osc.connect(g).connect(gain)
    osc.start(time)
    osc.stop(time + length + 0.05)
  }
}

function makeReverb() {
  const seconds = 3
  const buffer = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3
    }
  }
  const conv = ctx.createConvolver()
  conv.buffer = buffer
  const wet = ctx.createGain()
  wet.gain.value = 0.45
  conv.connect(wet).connect(master)
  return conv
}

function schedule() {
  while (next < ctx.currentTime + 0.5) {
    const chord = Math.floor(step / 8) % 8
    const beat = step % 8
    const pass = Math.floor(step / 64) % passes.length
    if (beat === 0) {
      note(bass[chord], next, STEP * 8, 0.16)
      for (const line of passes[pass]) note(line[chord], next, STEP * 7, 0.11)
    }
    note(chords[chord][arp[beat]], next, STEP * 3, 0.06)
    next += STEP
    step++
  }
}

function fade(to, seconds) {
  const now = ctx.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(master.gain.value, now)
  master.gain.linearRampToValueAtTime(to, now + seconds)
}

async function start() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    reverb = makeReverb()
  }
  await ctx.resume()
  if (!playing) return
  next = ctx.currentTime + 0.1
  timer = setInterval(schedule, 100)
  schedule()
  fade(0.8, 2)
}

function stop() {
  clearInterval(timer)
  fade(0, 0.8)
}

const button = document.getElementById('music-toggle')
button.addEventListener('click', () => {
  playing = !playing
  playing ? start() : stop()
  button.setAttribute('aria-pressed', playing)
  button.querySelector('.label').textContent = playing ? 'Pause music' : 'Play music'
})
