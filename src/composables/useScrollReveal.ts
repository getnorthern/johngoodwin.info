import { onMounted, onUnmounted, useTemplateRef } from 'vue'

// Adds the `reveal` class to the element up front (styled in tokens.css to
// start hidden) then flips `is-visible` on once it scrolls into view.
// Pair with a template element using the same key: <div ref="reveal">.
export function useScrollReveal(key = 'reveal'): void {
  const target = useTemplateRef<HTMLElement>(key)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = target.value
    if (!el) return

    el.classList.add('reveal')

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer?.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
