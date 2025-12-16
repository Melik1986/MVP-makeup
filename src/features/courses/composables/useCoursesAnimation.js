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

    // Защита от повторного создания при HMR
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill()
      scrollTriggerInstance = null
    }

    ctx = gsap.context(self => {
      const wrapper = self.selector('.courses__gallery-wrapper')[0]
      const gallery = self.selector('.courses__gallery')[0]

      if (!wrapper || !gallery) {
        logger.error('Required elements not found', { wrapper: !!wrapper, gallery: !!gallery })
        return
      }

      // Calculate scroll amount: gallery width - wrapper width
      // We use function-based value to recalculate on resize automatically by ScrollTrigger's invalidateOnRefresh
      const getScrollAmount = () => -(gallery.scrollWidth - wrapper.clientWidth)

      // Horizontal Scroll
      const tween = gsap.to(gallery, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          id: 'courses-horizontal-scroll',
          trigger: sectionRef.value,
          start: () => {
            // Координатор гарантирует что hero trigger уже создан и отrefreshed
            const heroTrigger = ScrollTrigger.getById('hero-transition')
            if (heroTrigger) {
              return heroTrigger.end // Начинаем сразу после hero
            }
            logger.warn('Hero trigger not found, using fallback start')
            return 'top top' // Fallback
          },
          end: () => `+=${gallery.scrollWidth - wrapper.clientWidth + 200}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 1 // Низкий приоритет (refresh после hero)
        }
      })

      // Сохраняем ссылку на ScrollTrigger для cleanup и регистрации в координаторе
      scrollTriggerInstance = tween.scrollTrigger
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
