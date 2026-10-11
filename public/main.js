// Mark JS as available so scroll-reveal styles only apply when this script runs
document.documentElement.classList.add('js')

// Falling petals background (skipped if the visitor prefers reduced motion)
const petals = document.getElementById('petals')
if (petals && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const colours = ['#f3c9d5', '#e9a9bf', '#fbf7ea', '#c9d0a8', '#b7bf93'] // blush, rose, frangipani cream, olive
  const count = innerWidth < 600 ? 10 : 18
  const rand = (min, max) => min + Math.random() * (max - min)
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span')
    p.className = 'petal'
    p.style.setProperty('--x', rand(0, 100) + 'vw')
    p.style.setProperty('--s', rand(8, 16) + 'px')
    p.style.setProperty('--c', colours[i % colours.length])
    p.style.setProperty('--t', rand(14, 26) + 's')
    p.style.setProperty('--delay', -rand(0, 26) + 's') // negative = already mid-fall on load
    p.style.setProperty('--drift', rand(-90, 90) + 'px')
    petals.appendChild(p)
  }
}

// Countdown to the Nuptial Mass — 4pm IST on 14 November 2026
const target = new Date('2026-11-14T16:00:00+05:30').getTime()
const units = Object.fromEntries(
  [...document.querySelectorAll('#countdown [data-unit]')].map((el) => [el.dataset.unit, el])
)
const pad = (n) => String(n).padStart(2, '0')

function setUnit(el, value) {
  if (el.textContent === value) return
  el.textContent = value
  el.classList.remove('tick')
  void el.offsetWidth // restart the animation
  el.classList.add('tick')
}

function tick() {
  const diff = Math.max(0, target - Date.now())
  setUnit(units.d, String(Math.floor(diff / 86400000)))
  setUnit(units.h, pad(Math.floor((diff / 3600000) % 24)))
  setUnit(units.m, pad(Math.floor((diff / 60000) % 60)))
  setUnit(units.s, pad(Math.floor((diff / 1000) % 60)))
}
tick()
setInterval(tick, 1000)

// Gentle scroll reveal
const reveals = document.querySelectorAll('.reveal')
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('in')
        io.unobserve(entry.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  reveals.forEach((el) => io.observe(el))
} else {
  reveals.forEach((el) => el.classList.add('in'))
}

// RSVP via Netlify Forms (AJAX)
const form = document.getElementById('rsvp-form')
const status = document.getElementById('form-status')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const button = form.querySelector('button')
  button.disabled = true
  status.className = 'form-status'
  status.textContent = 'Sending…'

  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
    if (!res.ok) throw new Error(res.statusText)
    const attending = form.attending.value.startsWith('Joyfully')
    form.reset()
    status.className = 'form-status ok'
    status.textContent = attending
      ? 'Thank you! We can’t wait to celebrate with you.'
      : 'Thank you for letting us know — you’ll be missed.'
  } catch {
    status.className = 'form-status err'
    status.textContent = 'Something went wrong. Please try again.'
  } finally {
    button.disabled = false
  }
})
