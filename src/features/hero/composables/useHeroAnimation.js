import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onUnmounted } from 'vue'

import { SplitText } from '@shared/libs/gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const fourtyFrames = 1.3333333
const fiftyFrames = 3.0 // Increased to 3.0s for maximum smoothness and sync with model

export function useHeroAnimation(containerRef, coordinator = null) {
  let ctx

  const initAnimation = async () => {
    let heroTimeline = null
    // eslint-disable-next-line no-restricted-globals
    if (typeof window === 'undefined' || !containerRef.value) return

    // Динамически импортируем плагины для SSR совместимости
    const { CustomEase } = await import('@shared/libs/gsap/CustomEase')
    gsap.registerPlugin(CustomEase)

    // CodeGrid "Hop" Ease
    const cgEase = CustomEase.create(
      'cg-ease',
      'M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.627,1.009 0.813,1.006 1,1'
    )

    ctx = gsap.context(self => {
      // Helper для валидации элементов
      const isValidElement = el => {
        if (!el) return false
        if (Array.isArray(el) || el instanceof NodeList) return el.length > 0
        return el.nodeType === 1 // Element node
      }

      // Селекторы
      const startDateContent = self.selector('.hero__tag--start .hero__tag-content')
      const formatContent = self.selector('.hero__tag--format .hero__tag-content')
      const headlineWrapper = self.selector('.hero__headline-top-wrapper')
      const titleLeftWrapper = self.selector('.hero__title-left .hero__duration-wrapper')
      const titleRightWrapper = self.selector('.hero__title-right .hero__level-wrapper')

      // TextReveal Words
      const mentorshipWords = self.selector('.hero__mentorship-wrapper .text-reveal__word')
      const signature = self.selector('.hero__signature')
      const earningsWords = self.selector('.hero__earnings-wrapper .text-reveal__word')

      const modelBack = self.selector('.hero__model-back')
      const modelSide = self.selector('.hero__model-side')
      const modelFront = self.selector('.hero__model-front')
      const cta = self.selector('.hero__cta')

      // Characters (Headline)
      const charV = self.selector('.hero__char--v span')
      const charI = self.selector('.hero__char--i span')
      const charZ = self.selector('.hero__char--z span')
      const charA1 = self.selector('.hero__char--a1 span')
      const charZh = self.selector('.hero__char--zh span')
      const charI2 = self.selector('.hero__char--i2 span')
      const charS = self.selector('.hero__char--s span')
      const charT = self.selector('.hero__char--t span')
      const titleRow = self.selector('.hero__title-row')

      // --- Установка начального состояния (gsap.set) ---

      // 1. Tags (Top) -> Fly In from Top (-50px)
      if (isValidElement(startDateContent)) gsap.set(startDateContent, { y: -50, autoAlpha: 0 })
      if (isValidElement(formatContent)) gsap.set(formatContent, { y: -50, autoAlpha: 0 })

      // 2. Headline Wrapper -> Hidden (Standard)
      if (isValidElement(headlineWrapper)) gsap.set(headlineWrapper, { y: '0.5rem', autoAlpha: 0 })

      // 3. Headline Chars -> Chaotic positions (Keep existing)
      if (isValidElement(charV)) gsap.set(charV, { x: '2.7rem', autoAlpha: 0 })
      if (isValidElement(charI)) gsap.set(charI, { x: '-2rem', autoAlpha: 0 })
      if (isValidElement(charZ)) gsap.set(charZ, { x: '2.1rem', autoAlpha: 0 })
      if (isValidElement(charA1)) gsap.set(charA1, { x: '-1.2rem', autoAlpha: 0 })
      if (isValidElement(charZh)) gsap.set(charZh, { x: '-3.2rem', autoAlpha: 0 })
      if (isValidElement(charI2)) gsap.set(charI2, { x: '-2rem', autoAlpha: 0 })
      if (isValidElement(charS)) gsap.set(charS, { x: '4.3rem', autoAlpha: 0 })
      if (isValidElement(charT)) gsap.set(charT, { x: '1.9rem', autoAlpha: 0 })
      // Hide the subtitle text above the headline
      const subtitle = self.selector('.hero__headline-top-wrapper .text--subtitle')
      if (isValidElement(subtitle)) gsap.set(subtitle, { autoAlpha: 1 }) // Initially visible or handled by headline wrapper

      // 4. Short Text (Left/Right) -> Fly In from Side (-50px / 50px)
      if (isValidElement(titleLeftWrapper)) gsap.set(titleLeftWrapper, { x: -50, autoAlpha: 0 })
      if (isValidElement(titleRightWrapper)) gsap.set(titleRightWrapper, { x: 50, autoAlpha: 0 })

      // 5. Long Text (TextReveal) -> Hidden down
      if (isValidElement(mentorshipWords)) gsap.set(mentorshipWords, { y: '110%', autoAlpha: 0 })
      // Signature container should be visible, paths will be hidden by dashoffset
      if (isValidElement(signature)) gsap.set(signature, { autoAlpha: 1, y: 0 })
      if (isValidElement(earningsWords)) gsap.set(earningsWords, { y: '110%', autoAlpha: 0 })

      // 6. Models -> ClipPath or Hidden
      // Model 1 (Back): Ready for Clip Reveal
      if (isValidElement(modelBack))
        gsap.set(modelBack, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          autoAlpha: 1,
          left: '20%',
          xPercent: -50
        })
      // Other Models: Hidden
      if (isValidElement(modelSide))
        gsap.set(modelSide, { left: '35%', xPercent: -50, autoAlpha: 0 })
      if (isValidElement(modelFront))
        gsap.set(modelFront, { left: '50%', xPercent: -50, autoAlpha: 0 })

      if (isValidElement(cta)) gsap.set(cta, { scale: 0.417, y: '0.4rem', autoAlpha: 0 })

      // --- Animation Timeline ---
      const timeline = gsap.timeline()

      // === Step 1: Start ===
      timeline.addLabel('start', 0)

      // Reveal Model 1 (Clip Path)
      if (isValidElement(modelBack)) {
        timeline.to(
          modelBack,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
            duration: 1.2,
            ease: 'power4.inOut'
          },
          'start'
        )
      }

      // Reveal Tags (Fly In Top)
      if (isValidElement(startDateContent)) {
        timeline.to(
          startDateContent,
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.0,
            ease: cgEase
          },
          'start+=0.3'
        )
      }
      if (isValidElement(formatContent)) {
        timeline.to(
          formatContent,
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.0,
            ease: cgEase
          },
          'start+=0.4'
        )
      }

      // === Step 2: Left Side ===
      timeline.addLabel('left_side', 0.8)

      // Short Text (Fly In Left)
      if (isValidElement(titleLeftWrapper)) {
        timeline.to(
          titleLeftWrapper,
          {
            x: 0,
            autoAlpha: 1,
            duration: 1.0,
            ease: cgEase
          },
          'left_side'
        )
      }

      // Long Text (TextReveal Stagger)
      if (isValidElement(mentorshipWords) && mentorshipWords.length) {
        timeline.to(
          mentorshipWords,
          {
            y: '0%',
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: cgEase
          },
          'left_side+=0.2'
        )
      }

      // Signature (Handwritten style)
      const signaturePaths = self.selector('.hero__signature path')
      if (signaturePaths && signaturePaths.length) {
        signaturePaths.forEach(path => {
          // Check if getTotalLength exists (SVGPathElement)
          if (path.getTotalLength) {
            const len = path.getTotalLength()
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
          }
        })

        timeline.to(
          signaturePaths,
          {
            strokeDashoffset: 0,
            duration: 7.5,
            ease: 'power1.inOut'
          },
          'left_side+=0.6'
        )
      }

      // === Step 3: Swap 1 -> 2 (Parallax Flow) ===
      timeline.addLabel('swap_1_2', 2.0)

      // Model 1 Floats Right & Fades Out
      if (isValidElement(modelBack)) {
        timeline.to(
          modelBack,
          {
            x: '+=50',
            autoAlpha: 0,
            duration: 1.0,
            ease: 'power2.inOut'
          },
          'swap_1_2'
        )
      }

      // Model 2 Floats In from Left & Fades In
      if (isValidElement(modelSide)) {
        // We need to set start position manually in timeline or ensure set was correct
        // We set initial xPercent -50. We want to animate 'x' (pixels) from -50 to 0.
        timeline.fromTo(
          modelSide,
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 1.0, ease: 'power2.inOut' },
          'swap_1_2'
        )
      }

      // === Step 4: Headline (Chaotic) ===
      // Starts slightly after swap begins
      timeline.addLabel('headline', 'swap_1_2+=0.3')

      if (isValidElement(headlineWrapper)) {
        timeline.to(
          headlineWrapper,
          {
            y: '0rem',
            autoAlpha: 1,
            duration: fourtyFrames,
            ease: cgEase
          },
          'headline'
        )
      }

      const charsTimeline = gsap.timeline()
      if (isValidElement(charV))
        charsTimeline.to(charV, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase }, 0)
      if (isValidElement(charZ))
        charsTimeline.to(
          charZ,
          { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase },
          0.1
        )
      if (isValidElement(charA1))
        charsTimeline.to(
          charA1,
          { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase },
          0.15
        )
      if (isValidElement(charZh))
        charsTimeline.to(
          charZh,
          { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase },
          0.2
        )
      if (isValidElement(charI))
        charsTimeline.to(
          charI,
          { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase },
          0.25
        )
      if (isValidElement(charI2))
        charsTimeline.to(
          charI2,
          { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase },
          0.3
        )
      if (isValidElement(charS))
        charsTimeline.to(
          charS,
          { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase },
          0.35
        )
      if (isValidElement(charT))
        charsTimeline.to(
          charT,
          { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase },
          0.4
        )

      timeline.add(charsTimeline, 'headline')

      // === Step 5: Right Side ===
      timeline.addLabel('right_side', 'headline+=0.5')

      // Short Text (Fly In Right)
      if (isValidElement(titleRightWrapper)) {
        timeline.to(
          titleRightWrapper,
          {
            x: 0,
            autoAlpha: 1,
            duration: 1.0,
            ease: cgEase
          },
          'right_side'
        )
      }

      // Long Text (TextReveal Stagger)
      if (isValidElement(earningsWords) && earningsWords.length) {
        timeline.to(
          earningsWords,
          {
            y: '0%',
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: cgEase
          },
          'right_side+=0.2'
        )
      }

      // === Step 6: Swap 2 -> 3 (Parallax Flow) ===
      // Sync logic: Headline finishes at (headline + 0.4 + 3.0) = headline + 3.4
      // Model 3 takes 1.0s. Must start at headline + 2.4.
      // right_side is headline + 0.5. So swap_2_3 = right_side + 1.9.
      timeline.addLabel('swap_2_3', 'right_side+=1.9')

      if (isValidElement(modelSide)) {
        timeline.to(
          modelSide,
          {
            x: '+=50',
            autoAlpha: 0,
            duration: 1.0,
            ease: 'power2.inOut'
          },
          'swap_2_3'
        )
      }

      if (isValidElement(modelFront)) {
        timeline.fromTo(
          modelFront,
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 1.0, ease: 'power2.inOut' },
          'swap_2_3'
        )
      }

      // CTA
      timeline.addLabel('cta', 'swap_2_3+=0.5')
      if (isValidElement(cta)) {
        timeline.to(
          cta,
          {
            scale: 1,
            autoAlpha: 1,
            y: '0rem',
            duration: 1.0,
            ease: 'elastic.out(1, 0.5)'
          },
          'cta'
        )
      }

      // === Scroll Transition (Typography Gateway) ===
      // Find the wrapper (parent of hero) - вне scope hero, используем closest или document.querySelector
      const transitionWrapper =
        containerRef.value?.closest('.hero-transition-wrapper') ||
        document.querySelector('.hero-transition-wrapper')
      const aboutSection = document.querySelector('.about') // Need to find global About section

      let scrollTl = null

      if (transitionWrapper && aboutSection) {
        // Set initial positioning for transition
        // Координатор - единственный источник правды для управления visibility (autoAlpha)
        // Hero animation управляет только позиционированием для transition
        gsap.set(aboutSection, {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1
          // НЕ устанавливаем visibility/opacity/autoAlpha - координатор управляет этим
        })
        gsap.set(containerRef.value, {
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent' // Ensure hero background doesn't block
        })

        scrollTl = gsap.timeline({
          scrollTrigger: {
            id: 'hero-transition',
            trigger: transitionWrapper,
            start: 'top top',
            end: '+=2000', // Adjust for speed
            pin: true,
            scrub: 1,
            refreshPriority: 2, // Высокий приоритет - refresh первым
            onUpdate: () => {
              // Координатор управляет видимостью About на основе прогресса
              if (coordinator && typeof coordinator.updateAboutVisibility === 'function') {
                coordinator.updateAboutVisibility()
              }
            }
            // markers: true // For debugging
          }
        })

        // 1. Zoom Text (Gap between A and Zh)
        if (isValidElement(titleRow)) {
          scrollTl.to(titleRow, {
            scale: 300, // Even bigger scale to ensure we go "through"
            // V I Z A | Zh I S T. Yes, center is still roughly between A and Zh.
            // Keeping 53% 55% or reverting to 50% 55% depending on visual check.
            // Let's stick to the calibrated 50% 55% from previous turn as it seemed generic enough.
            transformOrigin: '50% 55%',
            ease: 'power2.inOut',
            duration: 1
          })
        }

        // 2. Fade out other elements to clear the view
        const elementsToFade = [
          self.selector('.hero__background'),
          self.selector('.hero__model'),
          self.selector('.hero__tags'),
          self.selector('.hero__cta'),
          self.selector('.hero__title-left'),
          self.selector('.hero__title-right'),
          self.selector('.hero__headline-top-wrapper .text--subtitle') // Added subtitle to fade out
        ].filter(el => isValidElement(el))

        if (elementsToFade.length > 0) {
          scrollTl.to(
            elementsToFade,
            {
              autoAlpha: 0,
              duration: 0.3
            },
            0
          )
        }

        // === About Section ===
        // About управляет своими внутренними анимациями через useAboutAnimation composable
        // Координатор управляет visibility (autoAlpha) About на основе прогресса hero timeline
        // НЕТ анимаций About элементов здесь - About управляет собой сама!

        // 3. Ensure Hero container itself fades out at the end so it doesn't block pointer events
        // AND IMPORTANTLY: Set display: none to completely remove it from flow/interaction
        scrollTl.to(
          containerRef.value,
          {
            autoAlpha: 0,
            duration: 0.1,
            ease: 'none',
            onComplete: () => {
              gsap.set(containerRef.value, { display: 'none' })
            },
            onReverseComplete: () => {
              gsap.set(containerRef.value, { display: 'flex' }) // Restore if scrolling back up
            }
          },
          0.9
        )

        // КРИТИЧНО: Refresh после всех анимаций
        if (scrollTl && scrollTl.scrollTrigger) {
          scrollTl.scrollTrigger.refresh()
        }
      }

      // Сохраняем timeline для возврата
      if (scrollTl) {
        heroTimeline = scrollTl
      }
    }, containerRef.value)

    return heroTimeline
  }

  onUnmounted(() => {
    ctx?.revert()
  })

  return {
    initAnimation // Возвращает timeline для регистрации в координаторе
  }
}
