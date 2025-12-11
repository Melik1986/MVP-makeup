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

    // CodeGrid "Hop" Ease
    const cgEase = CustomEase.create('cg-ease', 'M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.627,1.009 0.813,1.006 1,1')
    // Fallback/Standard Ease
    const smoothEase = 'power3.out'

    ctx = gsap.context(self => {
      // Селекторы
      const startDateContent = self.selector('.hero__tag--start .hero__tag-content')
      const formatContent = self.selector('.hero__tag--format .hero__tag-content')
      const headlineWrapper = self.selector('.hero__headline-top-wrapper')
      const titleLeftWrapper = self.selector('.hero__title-left .hero__duration-wrapper')
      const titleRightWrapper = self.selector('.hero__title-right .hero__level-wrapper')
      
      // TextReveal Words
      const mentorshipWords = self.selector('.hero__mentorship-wrapper .text-reveal__word')
      const signature = self.selector('.hero__signature') // Added signature
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

      // --- Установка начального состояния (gsap.set) ---
      
      // 1. Tags (Top) -> Fly In from Top (-50px)
      if (startDateContent) gsap.set(startDateContent, { y: -50, autoAlpha: 0 })
      if (formatContent) gsap.set(formatContent, { y: -50, autoAlpha: 0 })
      
      // 2. Headline Wrapper -> Hidden (Standard)
      if (headlineWrapper) gsap.set(headlineWrapper, { y: '0.5rem', autoAlpha: 0 })
      
      // 3. Headline Chars -> Chaotic positions (Keep existing)
      if (charV) gsap.set(charV, { x: '2.7rem', autoAlpha: 0 })
      if (charI) gsap.set(charI, { x: '-2rem', autoAlpha: 0 })
      if (charZ) gsap.set(charZ, { x: '2.1rem', autoAlpha: 0 })
      if (charA1) gsap.set(charA1, { x: '-1.2rem', autoAlpha: 0 })
      if (charZh) gsap.set(charZh, { x: '-3.2rem', autoAlpha: 0 })
      if (charI2) gsap.set(charI2, { x: '-2rem', autoAlpha: 0 })
      if (charS) gsap.set(charS, { x: '4.3rem', autoAlpha: 0 })
      if (charT) gsap.set(charT, { x: '1.9rem', autoAlpha: 0 })

      // 4. Short Text (Left/Right) -> Fly In from Side (-50px / 50px)
      if (titleLeftWrapper) gsap.set(titleLeftWrapper, { x: -50, autoAlpha: 0 })
      if (titleRightWrapper) gsap.set(titleRightWrapper, { x: 50, autoAlpha: 0 })
      
      // 5. Long Text (TextReveal) -> Hidden down
      if (mentorshipWords) gsap.set(mentorshipWords, { y: '110%', autoAlpha: 0 })
      if (signature) gsap.set(signature, { y: '110%', autoAlpha: 0 }) // Set signature
      if (earningsWords) gsap.set(earningsWords, { y: '110%', autoAlpha: 0 })

      // 6. Models -> ClipPath or Hidden
      // Model 1 (Back): Ready for Clip Reveal
      if (modelBack) gsap.set(modelBack, { 
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', 
        autoAlpha: 1, 
        left: '20%', xPercent: -50 
      })
      // Other Models: Hidden
      if (modelSide) gsap.set(modelSide, { left: '35%', xPercent: -50, autoAlpha: 0 })
      if (modelFront) gsap.set(modelFront, { left: '50%', xPercent: -50, autoAlpha: 0 })

      if (cta) gsap.set(cta, { scale: 0.417, y: '0.4rem', autoAlpha: 0 })


      // --- Animation Timeline ---
      const timeline = gsap.timeline()
      
      // === Step 1: Start ===
      timeline.addLabel('start', 0)
      
      // Reveal Model 1 (Clip Path)
      if (modelBack) {
        timeline.to(modelBack, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
          duration: 1.2,
          ease: 'power4.inOut'
        }, 'start')
      }

      // Reveal Tags (Fly In Top)
      if (startDateContent) {
        timeline.to(startDateContent, {
          y: 0,
          autoAlpha: 1,
          duration: 1.0,
          ease: cgEase
        }, 'start+=0.3')
      }
      if (formatContent) {
        timeline.to(formatContent, {
          y: 0,
          autoAlpha: 1,
          duration: 1.0,
          ease: cgEase
        }, 'start+=0.4')
      }

      // === Step 2: Left Side ===
      timeline.addLabel('left_side', 0.8)
      
      // Short Text (Fly In Left)
      if (titleLeftWrapper) {
        timeline.to(titleLeftWrapper, {
          x: 0,
          autoAlpha: 1,
          duration: 1.0,
          ease: cgEase
        }, 'left_side')
      }
      
      // Long Text (TextReveal Stagger)
      if (mentorshipWords.length) {
        timeline.to(mentorshipWords, {
          y: '0%',
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: cgEase
        }, 'left_side+=0.2')
      }
      
      // Signature (Handwritten style)
      if (signature) {
        timeline.to(signature, {
          y: '0%',
          autoAlpha: 1,
          duration: 1.0,
          ease: 'power3.out' // More fluid ease for signature
        }, 'left_side+=0.6') // Slightly after text
      }

      // === Step 3: Swap 1 -> 2 (Parallax Flow) ===
      timeline.addLabel('swap_1_2', 2.0)
      
      // Model 1 Floats Right & Fades Out
      if (modelBack) {
        timeline.to(modelBack, {
          x: '+=50',
          autoAlpha: 0,
          duration: 1.0,
          ease: 'power2.inOut'
        }, 'swap_1_2')
      }
      
      // Model 2 Floats In from Left & Fades In
      if (modelSide) {
        // We need to set start position manually in timeline or ensure set was correct
        // We set initial xPercent -50. We want to animate 'x' (pixels) from -50 to 0.
        timeline.fromTo(modelSide, 
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 1.0, ease: 'power2.inOut' },
          'swap_1_2'
        )
      }

      // === Step 4: Headline (Chaotic) ===
      // Starts slightly after swap begins
      timeline.addLabel('headline', 'swap_1_2+=0.3')
      
      if (headlineWrapper) {
        timeline.to(headlineWrapper, {
          y: '0rem',
          autoAlpha: 1,
          duration: fourtyFrames,
          ease: cgEase
        }, 'headline')
      }

      const charsTimeline = gsap.timeline()
      if (charV) charsTimeline.to(charV, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase }, 0)
      if (charZ) charsTimeline.to(charZ, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase }, 0.1)
      if (charA1) charsTimeline.to(charA1, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase }, 0.15)
      if (charZh) charsTimeline.to(charZh, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase }, 0.2)
      if (charI) charsTimeline.to(charI, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase }, 0.25)
      if (charI2) charsTimeline.to(charI2, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase }, 0.3)
      if (charS) charsTimeline.to(charS, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase }, 0.35)
      if (charT) charsTimeline.to(charT, { x: '0rem', autoAlpha: 1, duration: fiftyFrames, ease: cgEase }, 0.4)
      
      timeline.add(charsTimeline, 'headline')

      // === Step 5: Right Side ===
      timeline.addLabel('right_side', 'headline+=0.5')
      
      // Short Text (Fly In Right)
      if (titleRightWrapper) {
        timeline.to(titleRightWrapper, {
          x: 0,
          autoAlpha: 1,
          duration: 1.0,
          ease: cgEase
        }, 'right_side')
      }
      
      // Long Text (TextReveal Stagger)
      if (earningsWords.length) {
        timeline.to(earningsWords, {
          y: '0%',
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: cgEase
        }, 'right_side+=0.2')
      }

      // === Step 6: Swap 2 -> 3 (Parallax Flow) ===
      timeline.addLabel('swap_2_3', 'right_side+=1.2')
      
      if (modelSide) {
        timeline.to(modelSide, {
          x: '+=50',
          autoAlpha: 0,
          duration: 1.0,
          ease: 'power2.inOut'
        }, 'swap_2_3')
      }
      
      if (modelFront) {
        timeline.fromTo(modelFront,
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 1.0, ease: 'power2.inOut' },
          'swap_2_3'
        )
      }

      // CTA
      timeline.addLabel('cta', 'swap_2_3+=0.5')
      if (cta) {
        timeline.to(cta, {
          scale: 1,
          autoAlpha: 1,
          y: '0rem',
          duration: 1.0,
          ease: 'elastic.out(1, 0.5)'
        }, 'cta')
      }

      // ScrollTrigger logic
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
