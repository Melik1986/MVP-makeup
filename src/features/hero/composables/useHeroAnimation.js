import { gsap } from 'gsap'
import { onUnmounted } from 'vue'

const fourtyFrames = 1.3333333
const fiftyFrames = 1.66666
const twoFrames = 0.666666
const fourFrames = 0.133333

export function useHeroAnimation(containerRef) {
  let ctx

  const initAnimation = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (typeof window === 'undefined' || !containerRef.value) return

    // Динамически импортируем плагины для SSR совместимости
    const { CustomEase } = await import('gsap/CustomEase')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(CustomEase, ScrollTrigger)

    const customEaseIn = CustomEase.create('custom-ease-in', '0.52, 0.00, 0.48, 1.00')

    ctx = gsap.context(self => {
      // Селекторы
      const startDateContent = self.selector('.hero__tag--start .hero__tag-content')
      const formatContent = self.selector('.hero__tag--format .hero__tag-content')
      const headlineWrapper = self.selector('.hero__headline-top-wrapper')
      const titleLeftWrapper = self.selector('.hero__title-left .hero__duration-wrapper')
      const titleRightWrapper = self.selector('.hero__title-right .hero__level-wrapper')
      const mentorship = self.selector('.hero__mentorship-wrapper')
      const earnings = self.selector('.hero__earnings-wrapper')
      const modelBack = self.selector('.hero__model-back')
      const modelSide = self.selector('.hero__model-side')
      const modelFront = self.selector('.hero__model-front')
      const cta = self.selector('.hero__cta')

      // Characters
      const charV = self.selector('.hero__char--v span')
      const charI = self.selector('.hero__char--i span')
      const charZ = self.selector('.hero__char--z span')
      const charA1 = self.selector('.hero__char--a1 span')
      const charZh = self.selector('.hero__char--zh span')
      const charI2 = self.selector('.hero__char--i2 span')
      const charS = self.selector('.hero__char--s span')
      const charT = self.selector('.hero__char--t span')

      // --- Установка начального состояния ---
      if (startDateContent) gsap.set(startDateContent, { y: '-0.5rem', autoAlpha: 0 })
      if (formatContent) gsap.set(formatContent, { y: '-0.5rem', autoAlpha: 0 })
      if (headlineWrapper) gsap.set(headlineWrapper, { y: '0.5rem', autoAlpha: 0 })
      
      // Chars
      if (charV) gsap.set(charV, { x: '2.7rem', autoAlpha: 0 })
      if (charI) gsap.set(charI, { x: '-2rem', autoAlpha: 0 })
      if (charZ) gsap.set(charZ, { x: '2.1rem', autoAlpha: 0 })
      if (charA1) gsap.set(charA1, { x: '-1.2rem', autoAlpha: 0 })
      if (charZh) gsap.set(charZh, { x: '-3.2rem', autoAlpha: 0 })
      if (charI2) gsap.set(charI2, { x: '-2rem', autoAlpha: 0 })
      if (charS) gsap.set(charS, { x: '4.3rem', autoAlpha: 0 })
      if (charT) gsap.set(charT, { x: '1.9rem', autoAlpha: 0 })

      if (titleLeftWrapper) gsap.set(titleLeftWrapper, { y: '0.5rem', autoAlpha: 0 })
      if (titleRightWrapper) gsap.set(titleRightWrapper, { y: '0.3rem', autoAlpha: 0 })
      if (mentorship) gsap.set(mentorship, { y: '0.4rem', autoAlpha: 0 })
      if (earnings) gsap.set(earnings, { y: '0.4rem', autoAlpha: 0 })

      // Models - скрываем все модели изначально
      if (modelBack) gsap.set(modelBack, { left: '20%', xPercent: -50, autoAlpha: 0 })
      if (modelSide) gsap.set(modelSide, { left: '35%', xPercent: -50, autoAlpha: 0 })
      if (modelFront) gsap.set(modelFront, { left: '50%', xPercent: -50, autoAlpha: 0 })

      if (cta) gsap.set(cta, { scale: 0.417, y: '0.4rem', autoAlpha: 0 })


      // --- Animation Timeline ---
      const timeline = gsap.timeline()
      
      // Label: Start
      timeline.addLabel('start', 0)
      
      // 1. Model Back (появляется первой)
      if (modelBack) {
        timeline.to(modelBack, {
          autoAlpha: 1,
          duration: 0.5,
          ease: customEaseIn
        }, 'start')
      }

      // Label: Left Text (starts at 0.3s)
      timeline.addLabel('text_left', 0.3)
      
      // 2. Small text (titleLeftWrapper, mentorship)
      if (titleLeftWrapper) {
        timeline.to(titleLeftWrapper, {
          y: '0rem',
          autoAlpha: 1,
          duration: fourtyFrames,
          ease: customEaseIn
        }, 'text_left') 
      }
      
      if (mentorship) {
        timeline.to(mentorship, {
          y: '0rem',
          autoAlpha: 1,
          duration: fourtyFrames,
          ease: customEaseIn
        }, 'text_left+=0.1')
      }

      // Label: Swap 1->2 (starts at 1.5s - giving enough time for text to be readable/appearing)
      timeline.addLabel('swap_1_2', 1.5)

      // 3. Model 1 disappears -> Model 2 appears
      if (modelBack) {
        timeline.to(modelBack, {
          autoAlpha: 0,
          duration: 0.4,
          ease: customEaseIn
        }, 'swap_1_2') 
      }

      if (modelSide) {
        timeline.to(modelSide, {
          autoAlpha: 1,
          duration: 0.5,
          ease: customEaseIn
        }, 'swap_1_2') 
      }

      // Label: Headline (starts with swap, maybe slightly delayed 0.2s)
      timeline.addLabel('headline', 'swap_1_2+=0.2')

      // 4. Headline Animation starts (headlineWrapper + chars)
      if (headlineWrapper) {
        timeline.to(headlineWrapper, {
          y: '0rem',
          autoAlpha: 1,
          duration: fourtyFrames,
          ease: customEaseIn
        }, 'headline') 
      }

      // Анимация букв (хаотичный порядок как в оригинале, но привязанный к таймлайну)
      const charsTimeline = gsap.timeline()
      if (charV) charsTimeline.to(charV, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: customEaseIn }, 0)
      if (charZ) charsTimeline.to(charZ, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: customEaseIn }, 0.1)
      if (charA1) charsTimeline.to(charA1, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: customEaseIn }, 0.15)
      if (charZh) charsTimeline.to(charZh, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: customEaseIn }, 0.2)
      if (charI) charsTimeline.to(charI, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: customEaseIn }, 0.25) // First I
      if (charI2) charsTimeline.to(charI2, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: customEaseIn }, 0.3)
      if (charS) charsTimeline.to(charS, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: customEaseIn }, 0.35)
      if (charT) charsTimeline.to(charT, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: customEaseIn }, 0.4)

      // Добавляем анимацию букв в основной таймлайн
      timeline.add(charsTimeline, 'headline')

      // Label: Right Text
      timeline.addLabel('text_right', 'headline+=0.5') // Overlap

      // 5. Rest of text (Right side)
      if (titleRightWrapper) {
        timeline.to(titleRightWrapper, {
          y: '0rem',
          autoAlpha: 1,
          duration: fourtyFrames,
          ease: customEaseIn
        }, 'text_right') 
      }

      if (earnings) {
        timeline.to(earnings, {
          y: '0rem',
          autoAlpha: 1,
          duration: fourtyFrames,
          ease: customEaseIn
        }, 'text_right+=0.1')
      }
      
      // Tags (StartDate, Format)
      if (startDateContent) {
        timeline.to(startDateContent, {
          y: '0rem',
          autoAlpha: 1,
          duration: fourtyFrames,
          ease: customEaseIn
        }, 'start+=0.2') // Раньше, с контентом
      }
      if (formatContent) {
        timeline.to(formatContent, {
          y: '0rem',
          autoAlpha: 1,
          duration: fourtyFrames,
          ease: customEaseIn
        }, 'start+=0.4')
      }

      // Label: Swap 2->3
      timeline.addLabel('swap_2_3', 'text_right+=1.0') // Wait a bit

      // 6. Model 2 disappears -> Model 3 appears (End of sequence)
      if (modelSide) {
        timeline.to(modelSide, {
          autoAlpha: 0,
          duration: 0.4,
          ease: customEaseIn
        }, 'swap_2_3')
      }

      if (modelFront) {
        timeline.to(modelFront, {
          autoAlpha: 1,
          duration: 0.5,
          ease: customEaseIn
        }, 'swap_2_3')
      }

      // CTA Button
      timeline.addLabel('cta', 'swap_2_3')
      if (cta) {
        timeline.to(cta, {
          scale: 1,
          autoAlpha: 1,
          y: '0rem',
          duration: fourtyFrames,
          ease: customEaseIn
        }, 'cta')
      }


      // ScrollTrigger logic remains same
      ScrollTrigger.create({
        trigger: containerRef.value,
        start: 'top top',
        end: () => `+=${window.innerHeight}`,
        scrub: 0.5,
        onUpdate: self => {
          const scrollProgress = self.progress
          const timelineProgress = 1 - scrollProgress
          timeline.progress(timelineProgress)
        }
      })
    }, containerRef.value)
  }

  onUnmounted(() => {
    ctx?.revert()
  })

  return {
    initAnimation
  }
}
