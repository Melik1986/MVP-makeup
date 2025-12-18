import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref } from 'vue'

import { useLogger } from '@shared/libs/logger'

gsap.registerPlugin(ScrollTrigger)

const logger = useLogger('useCoursesAnimation')

export function useCoursesAnimation(sectionRef, _coordinator = null) {
  let ctx = null
  let scrollTriggerInstance = null
  const scrollTriggerRef = ref(null)

  onMounted(() => {
    if (!sectionRef.value) {
      logger.warn('sectionRef.value is null, skipping animation setup')
      return
    }

    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill()
      scrollTriggerInstance = null
    }

    ctx = gsap.context(self => {
      const stage = self.selector('.courses__stage')[0]
      const cards = self.selector('.courses__card')
      const progressFills = self.selector('.courses__progress-fill')

      if (!stage || cards.length === 0) {
        logger.error('Required elements not found', { stage: !!stage, cards: cards.length })
        return
      }

      const isMobile = window.innerWidth <= 768
      const baseXPercent = -50

      // Vertical position: lift cards up on mobile to reduce gap
      const topPos = isMobile ? '42%' : '50%'

      // Initial Setup
      gsap.set(cards, {
        left: '50%',
        top: topPos,
        yPercent: -50,
        willChange: 'transform, opacity'
      })

      cards.forEach((card, index) => {
        gsap.set(card, {
          xPercent: index === 0 ? baseXPercent : baseXPercent + 110,
          zIndex: index + 1,
          opacity: 1,
          scale: 1
        })

        // Hide internal elements initially
        const internalElements = card.querySelectorAll(
          '.courses__card-header, .courses__card-content, .courses__card-badge, .courses__card-index, .courses__card-title, .courses__card-subtitle, .courses__card-action, .courses__decor-circle'
        )
        gsap.set(internalElements, {
          opacity: 0,
          y: 30
        })
      })

      if (progressFills.length > 0) {
        gsap.set(progressFills, { scaleX: 0, transformOrigin: '0% 50%' })
      }

      // Helper to animate card content in
      const animateCardContentIn = card => {
        const elements = card.querySelectorAll(
          '.courses__card-header, .courses__card-content, .courses__card-badge, .courses__card-index, .courses__card-title, .courses__card-subtitle, .courses__card-action, .courses__decor-circle'
        )
        // Ensure we don't re-animate if already visible
        if (card.dataset.contentVisible === 'true') return

        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          overwrite: 'auto'
        })
        card.dataset.contentVisible = 'true'
      }

      // Timeline for sliding cards (SCRUBBED)
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      // Initially show first card content
      animateCardContentIn(cards[0])

      for (let i = 1; i < cards.length; i += 1) {
        const prevCard = cards[i - 1]
        const currentCard = cards[i]

        tl.to(
          prevCard,
          {
            scale: 0.92,
            opacity: 0.55,
            duration: 1
          },
          tl.duration()
        )

        tl.to(
          currentCard,
          {
            xPercent: baseXPercent,
            duration: 1
          },
          '<'
        )
      }

      scrollTriggerInstance = ScrollTrigger.create({
        id: 'courses-layered-horizontal',
        trigger: sectionRef.value,
        start: () => {
          const heroTrigger = ScrollTrigger.getById('hero-transition')
          if (heroTrigger) {
            return heroTrigger.end
          }
          return 'top top'
        },
        end: () => {
          const stageWidth = stage.clientWidth || window.innerWidth
          const steps = Math.max(1, cards.length)
          return `+=${Math.round(stageWidth * steps)}`
        },
        pin: stage,
        scrub: 1, // Keep scrub for SLIDER movement
        animation: tl,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        refreshPriority: 1,
        onUpdate: selfUpdate => {
          const { progress } = selfUpdate

          if (progressFills.length > 0) {
            gsap.set(progressFills, { scaleX: progress })
          }

          const totalCards = cards.length
          const segment = 1 / (totalCards - 1)
          const index = Math.round(progress / segment)
          const safeIndex = Math.min(Math.max(0, index), totalCards - 1)

          cards.forEach((card, idx) => {
            if (idx === safeIndex) {
              card.classList.add('is-active')
              animateCardContentIn(card) // Trigger detached animation
            } else {
              card.classList.remove('is-active')
            }
          })
        }
      })

      scrollTriggerRef.value = scrollTriggerInstance
    }, sectionRef.value)
  })

  onUnmounted(() => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill()
      scrollTriggerInstance = null
    }

    if (ctx) {
      ctx.revert()
      ctx = null
    }
  })

  return scrollTriggerRef
}
