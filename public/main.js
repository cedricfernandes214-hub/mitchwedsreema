// Countdown to the Nuptial Mass — 4pm IST on 14 November 2026
const target = new Date('2026-11-14T16:00:00+05:30').getTime()
const units = Object.fromEntries(
  [...document.querySelectorAll('#countdown [data-unit]')].map((el) => [el.dataset.unit, el])
)

function tick() {
  const diff = Math.max(0, target - Date.now())
  units.d.textContent = Math.floor(diff / 86400000)
  units.h.textContent = Math.floor((diff / 3600000) % 24)
  units.m.textContent = Math.floor((diff / 60000) % 60)
}
tick()
setInterval(tick, 30000)

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
