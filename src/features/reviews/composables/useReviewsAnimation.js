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
      const mm = gsap.matchMedia()
      const title = self.selector('.reviews__title')

      // 1. Premium Title Reveal (Shared)
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

      // 2. Desktop Animations (min-width: 768px)
      mm.add('(min-width: 768px)', () => {
        const cards = self.selector('.reviews__card')
        const columnsDown = self.selector('.reviews__column--down')
        const columnUp = self.selector('.reviews__column--up')

        // Card Entrance (Stagger)
        if (cards && cards.length > 0) {
          gsap.from(cards, {
            y: 50,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: premiumEase,
            scrollTrigger: {
              trigger: cards[0],
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          })
        }

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
      })

      // 3. Mobile Animations (max-width: 767px)
      mm.add('(max-width: 767px)', () => {
        const cards = self.selector('.reviews__card')

        cards.forEach(card => {
          gsap.fromTo(
            card,
            { y: 80, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 1,
              ease: premiumEase,
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        })
      })
    }, sectionRef.value)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
