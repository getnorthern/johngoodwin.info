import { onMounted, onUnmounted, ref } from 'vue'

// Mirrors the scroll-hide behaviour used on the Koda landing nav: always
// shown while inside the hero section, then hides on scroll-down / reappears
// on scroll-up once the user has scrolled past it.
export function useNavVisibility(heroSelector = '.hero') {
  const hidden = ref(false)

  let lastY = 0
  let heroBottom = 0

  function measureHero() {
    const hero = document.querySelector<HTMLElement>(heroSelector)
    heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 200
  }

  function onScroll() {
    const y = window.scrollY
    const pastHero = y > heroBottom - 100
    hidden.value = pastHero ? y > lastY : false
    lastY = y
  }

  function onResize() {
    measureHero()
  }

  onMounted(() => {
    lastY = window.scrollY
    measureHero()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
  })

  return { hidden }
}
