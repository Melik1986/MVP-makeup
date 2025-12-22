import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

import { CustomEase } from '@shared/libs/gsap/CustomEase'
import { SplitText } from '@shared/libs/gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

/**
 * Composable for Reviews section animations (Normal Flow)
 * Includes column parallax and premium title reveal.
 */
export function useReviewsAnimation(sectionRef) {
  let ctx

  onMounted(async () => {
    if (!sectionRef.value) return

    // Wait for fonts to ensure correct SplitText calculations
    if (document.fonts) {
      await document.fonts.ready
    }

    ctx = gsap.context(self => {
      const premiumEase = CustomEase.create('premium-ease', 'M0,0 C0.19,1 0.22,1 1,1')
      const title = self.selector('.reviews__title')

      // 1. Premium Title Reveal
      if (title) {
        const splitTitle = new SplitText(title, { type: 'lines' })
        gsap.set(splitTitle.lines, { overflow: 'hidden' })

        gsap.fromTo(
          splitTitle.lines,
          { yPercent: 100, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: premiumEase,
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // 2. Mobile check (simple width check or matchMedia)
      const isMobile = window.innerWidth <= 768
      if (isMobile) return // Disable complex scroll animation on mobile

      const columnsDown = self.selector('.reviews__column--down')
      const columnUp = self.selector('.reviews__column--up')

      // Helper for element validation
      const isValidElement = el => {
        if (!el) return false
        if (Array.isArray(el) || el instanceof NodeList) return el.length > 0
        return el.nodeType === 1 // Element node
      }

      // Animation: Parallax / Marquee on Scroll
      if (isValidElement(columnsDown)) {
        gsap.to(columnsDown, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      if (isValidElement(columnUp)) {
        gsap.to(columnUp, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }
    }, sectionRef.value)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
