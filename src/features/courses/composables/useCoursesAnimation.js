import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted, ref } from 'vue'

import { useLogger } from '@shared/libs/logger'

gsap.registerPlugin(ScrollTrigger)

const logger = useLogger('useCoursesAnimation')

export function useCoursesAnimation(sectionRef, _coordinator = null) {
  let ctx = null
  let scrollTriggerInstance = null
  let lastStepIndex = 1
  const scrollTriggerRef = ref(null)

  onMounted(() => {
    if (!sectionRef.value) {
      logger.warn('sectionRef.value is null, skipping animation setup')
      return
    }

    // Защита от повторного создания при HMR
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill()
      scrollTriggerInstance = null
    }

    ctx = gsap.context(self => {
      const stage = self.selector('.courses__stage')[0]
      const cards = self.selector('.courses__card')
      const progressFills = self.selector('.courses__progress-fill')
      const progressCurrents = self.selector('.courses__progress-current')
      const progressTotals = self.selector('.courses__progress-total')

      if (!stage || cards.length === 0) {
        logger.error('Required elements not found', { stage: !!stage, cards: cards.length })
        return
      }

      progressTotals.forEach(totalEl => {
        totalEl.textContent = String(cards.length).padStart(2, '0')
      })

      const baseXPercent = -50

      gsap.set(cards, {
        left: '50%',
        top: '50%',
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
      })

      cards.forEach((card, index) => {
        card.classList.toggle('is-active', index === 0)
      })

      gsap.set(progressFills, { scaleX: 0, transformOrigin: '0% 50%' })

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      for (let i = 1; i < cards.length; i += 1) {
        tl.to(
          cards[i - 1],
          {
            scale: 0.92,
            opacity: 0.55,
            duration: 1
          },
          tl.duration()
        )
        tl.to(
          cards[i],
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
          logger.warn('Hero trigger not found, using fallback start')
          return 'top top'
        },
        end: () => {
          const stageWidth = stage.clientWidth || window.innerWidth
          const steps = Math.max(1, cards.length)
          return `+=${Math.round(stageWidth * steps)}`
        },
        pin: stage,
        scrub: 1,
        animation: tl,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        refreshPriority: 1,
        onUpdate: selfUpdate => {
          const { progress } = selfUpdate
          gsap.set(progressFills, { scaleX: progress })

          const nextIndex = Math.min(cards.length, Math.round(progress * (cards.length - 1)) + 1)
          if (nextIndex !== lastStepIndex) {
            lastStepIndex = nextIndex
            const currentText = String(nextIndex).padStart(2, '0')

            progressCurrents.forEach(currentEl => {
              currentEl.textContent = currentText
            })

            cards.forEach((card, index) => {
              card.classList.toggle('is-active', index === nextIndex - 1)
            })
          }
        }
      })

      // Параллакс для заголовка - уходит вверх медленнее после распиннинга секции
      const title = self.selector('.courses__title')[0]
      if (title) {
        ScrollTrigger.create({
          trigger: sectionRef.value,
          start: () =>
            // Начинаем когда основной триггер заканчивается (секция распиннилась)
            scrollTriggerInstance?.end || 'bottom top',
          end: '+=400',
          scrub: 1,
          onUpdate: self => {
            // Заголовок движется медленнее - 60% от скорости скролла
            const { progress } = self
            const maxY = -200 // Максимальное смещение вверх
            gsap.set(title, { y: maxY * progress * 0.6 })
          }
        })
      }

      // Сохраняем ссылку на ScrollTrigger для cleanup и регистрации в координаторе
      scrollTriggerRef.value = scrollTriggerInstance
    }, sectionRef.value)
  })

  onUnmounted(() => {
    // Явно убиваем ScrollTrigger перед revert
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill()
      scrollTriggerInstance = null
    }

    // Revert GSAP context (очищает все анимации в контексте)
    if (ctx) {
      ctx.revert()
      ctx = null
    }
  })
}
