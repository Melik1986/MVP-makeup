import { gsap } from 'gsap'
import { onUnmounted } from 'vue'

export function useCoursesAnimation(sectionRef) {
  let ctx = null

  const initAnimation = () => {
    if (!sectionRef.value) return null

    let coursesTimeline = null

    ctx = gsap.context(self => {
      const stage = self.selector('.courses__stage')[0]
      const cards = self.selector('.courses__card')
      const progressFills = self.selector('.courses__progress-fill')

      if (!stage || cards.length === 0) return

      const isMobile = window.innerWidth <= 768
      const baseXPercent = -50
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

      coursesTimeline = gsap.timeline({
        onUpdate() {
          const progress = this.progress()
          if (progressFills.length > 0) {
            gsap.set(progressFills, { scaleX: progress })
          }

          // Обновляем активный класс для индикаторов и т.д.
          const totalCards = cards.length
          const segment = 1 / (totalCards - 1 || 1)
          const index = Math.round(progress / segment)
          cards.forEach((card, idx) => {
            if (idx === index) card.classList.add('is-active')
            else card.classList.remove('is-active')
          })
        }
      })

      // Добавляем начальную анимацию первой карточки в таймлайн
      const firstCardElements = cards[0].querySelectorAll(
        '.courses__card-header, .courses__card-content, .courses__card-badge, .courses__card-index, .courses__card-title, .courses__card-subtitle, .courses__card-action, .courses__decor-circle'
      )
      coursesTimeline.to(
        firstCardElements,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.02,
          ease: 'power2.out'
        },
        0
      )

      for (let i = 1; i < cards.length; i += 1) {
        const prevCard = cards[i - 1]
        const currentCard = cards[i]
        const currentElements = currentCard.querySelectorAll(
          '.courses__card-header, .courses__card-content, .courses__card-badge, .courses__card-index, .courses__card-title, .courses__card-subtitle, .courses__card-action, .courses__decor-circle'
        )

        const startTime = coursesTimeline.duration()

        coursesTimeline.to(prevCard, { scale: 0.92, opacity: 0.55, duration: 1 }, startTime)
        coursesTimeline.to(currentCard, { xPercent: baseXPercent, duration: 1 }, startTime)

        // Анимация контента текущей карточки ПРИ НАЕЗДЕ
        coursesTimeline.to(
          currentElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: 'power2.out'
          },
          startTime + 0.3
        )
      }
    }, sectionRef.value)

    return coursesTimeline
  }

  onUnmounted(() => {
    if (ctx) {
      ctx.revert()
      ctx = null
    }
  })

  return {
    initAnimation
  }
}
