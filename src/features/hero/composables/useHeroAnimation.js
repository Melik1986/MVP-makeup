import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onUnmounted } from 'vue'

import { SplitText } from '@shared/libs/gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export function useHeroAnimation(containerRef) {
  let ctx

  const initAnimation = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (typeof window === 'undefined' || !containerRef.value) return

    if (document.fonts) {
      await document.fonts.ready
    }

    const { CustomEase } = await import('@shared/libs/gsap/CustomEase')
    gsap.registerPlugin(CustomEase)

    const cgEase = CustomEase.create(
      'cg-ease',
      'M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.627,1.009 0.813,1.006 1,1'
    )

    let introTl = null
    let portalTl = null

    ctx = gsap.context(() => {
      // Helper для валидации элементов
      const isValidElement = el => {
        if (!el) return false
        if (Array.isArray(el) || el instanceof NodeList) return el.length > 0
        return el.nodeType === 1
      }

      // Селекторы через gsap.utils.selector
      const q = gsap.utils.selector(containerRef.value)
      const startDateContent = q('.hero__tag--start .hero__tag-content')
      const formatContent = q('.hero__tag--format .hero__tag-content')
      const headlineWrapper = q('.hero__headline-top-wrapper')
      const titleLeftWrapper = q('.hero__title-left .hero__duration-wrapper')
      const titleRightWrapper = q('.hero__title-right .hero__level-wrapper')
      const mentorshipWords = q('.hero__mentorship-wrapper .text-reveal__word')
      const signature = q('.hero__signature')
      const earningsWords = q('.hero__earnings-wrapper .text-reveal__word')
      const modelBack = q('.hero__model-back')
      const modelSide = q('.hero__model-side')
      const modelFront = q('.hero__model-front')
      const cta = q('.hero__cta')
      const charV = q('.hero__char--v span')
      const charI = q('.hero__char--i span')
      const charZ = q('.hero__char--z span')
      const charA1 = q('.hero__char--a1 span')
      const charZh = q('.hero__char--zh span')
      const charI2 = q('.hero__char--i2 span')
      const charS = q('.hero__char--s span')
      const charT = q('.hero__char--t span')
      const titleRow = q('.hero__title-row')

      // Установка начального состояния
      if (isValidElement(startDateContent)) gsap.set(startDateContent, { y: -50, autoAlpha: 0 })
      if (isValidElement(formatContent)) gsap.set(formatContent, { y: -50, autoAlpha: 0 })
      if (isValidElement(headlineWrapper)) gsap.set(headlineWrapper, { y: '0.5rem', autoAlpha: 0 })
      if (isValidElement(charV)) gsap.set(charV, { x: '2.7rem', autoAlpha: 0 })
      if (isValidElement(charI)) gsap.set(charI, { x: '-2rem', autoAlpha: 0 })
      if (isValidElement(charZ)) gsap.set(charZ, { x: '2.1rem', autoAlpha: 0 })
      if (isValidElement(charA1)) gsap.set(charA1, { x: '-1.2rem', autoAlpha: 0 })
      if (isValidElement(charZh)) gsap.set(charZh, { x: '-3.2rem', autoAlpha: 0 })
      if (isValidElement(charI2)) gsap.set(charI2, { x: '-2rem', autoAlpha: 0 })
      if (isValidElement(charS)) gsap.set(charS, { x: '4.3rem', autoAlpha: 0 })
      if (isValidElement(charT)) gsap.set(charT, { x: '1.9rem', autoAlpha: 0 })

      if (isValidElement(titleLeftWrapper)) gsap.set(titleLeftWrapper, { x: -50, autoAlpha: 0 })
      if (isValidElement(titleRightWrapper)) gsap.set(titleRightWrapper, { x: 50, autoAlpha: 0 })
      if (isValidElement(mentorshipWords)) gsap.set(mentorshipWords, { y: '110%', autoAlpha: 0 })
      if (isValidElement(signature)) gsap.set(signature, { autoAlpha: 1, y: 0 })
      if (isValidElement(earningsWords)) gsap.set(earningsWords, { y: '110%', autoAlpha: 0 })

      if (isValidElement(modelBack))
        gsap.set(modelBack, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          autoAlpha: 1,
          left: '20%',
          xPercent: -50
        })
      if (isValidElement(modelSide))
        gsap.set(modelSide, { left: '35%', xPercent: -50, autoAlpha: 0 })
      if (isValidElement(modelFront))
        gsap.set(modelFront, { left: '50%', xPercent: -50, autoAlpha: 0 })

      if (isValidElement(cta)) {
        gsap.set(cta, { scale: 0.8, y: 20, autoAlpha: 0 })
      }

      // 1. Intro Timeline (Auto-play)
      introTl = gsap.timeline()
      introTl.addLabel('start', 0)
      if (isValidElement(modelBack)) {
        introTl.to(
          modelBack,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
            duration: 1.2,
            ease: 'power4.inOut'
          },
          'start'
        )
      }
      if (isValidElement(startDateContent)) {
        introTl.to(
          startDateContent,
          { y: 0, autoAlpha: 1, duration: 1.0, ease: cgEase },
          'start+=0.3'
        )
      }
      if (isValidElement(formatContent)) {
        introTl.to(formatContent, { y: 0, autoAlpha: 1, duration: 1.0, ease: cgEase }, 'start+=0.4')
      }
      introTl.addLabel('left_side', 0.8)
      if (isValidElement(titleLeftWrapper)) {
        introTl.to(
          titleLeftWrapper,
          { x: 0, autoAlpha: 1, duration: 1.0, ease: cgEase },
          'left_side'
        )
      }
      if (isValidElement(mentorshipWords) && mentorshipWords.length) {
        introTl.to(
          mentorshipWords,
          { y: '0%', autoAlpha: 1, duration: 0.8, stagger: 0.03, ease: cgEase },
          'left_side+=0.2'
        )
      }
      const signaturePaths = q('.hero__signature path')
      if (signaturePaths && signaturePaths.length) {
        signaturePaths.forEach(path => {
          if (path.getTotalLength) {
            const len = path.getTotalLength()
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
          }
        })
        introTl.to(
          signaturePaths,
          { strokeDashoffset: 0, duration: 7.5, ease: 'power1.inOut' },
          'left_side+=0.6'
        )
      }
      introTl.addLabel('swap_1_2', 2.0)
      if (isValidElement(modelBack)) {
        introTl.to(
          modelBack,
          { x: '+=50', autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' },
          'swap_1_2'
        )
      }
      if (isValidElement(modelSide)) {
        introTl.fromTo(
          modelSide,
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 1.0, ease: 'power2.inOut' },
          'swap_1_2'
        )
      }
      introTl.addLabel('headline', 'swap_1_2+=0.3')
      if (isValidElement(headlineWrapper)) {
        introTl.to(
          headlineWrapper,
          { y: '0rem', autoAlpha: 1, duration: 1.33, ease: cgEase },
          'headline'
        )
      }
      const charsTimeline = gsap.timeline()
      const chars = [charV, charZ, charA1, charZh, charI, charI2, charS, charT]
      chars.forEach((char, i) => {
        if (isValidElement(char)) {
          charsTimeline.to(char, { x: '0rem', autoAlpha: 1, duration: 3.0, ease: cgEase }, i * 0.05)
        }
      })
      introTl.add(charsTimeline, 'headline')
      introTl.addLabel('right_side', 'headline+=0.5')
      if (isValidElement(titleRightWrapper)) {
        introTl.to(
          titleRightWrapper,
          { x: 0, autoAlpha: 1, duration: 1.0, ease: cgEase },
          'right_side'
        )
      }
      if (isValidElement(earningsWords) && earningsWords.length) {
        introTl.to(
          earningsWords,
          { y: '0%', autoAlpha: 1, duration: 0.8, stagger: 0.03, ease: cgEase },
          'right_side+=0.2'
        )
      }
      introTl.addLabel('swap_2_3', 'right_side+=1.9')
      if (isValidElement(modelSide)) {
        introTl.to(
          modelSide,
          { x: '+=50', autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' },
          'swap_2_3'
        )
      }
      if (isValidElement(modelFront)) {
        introTl.fromTo(
          modelFront,
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 1.0, ease: 'power2.inOut' },
          'swap_2_3'
        )
      }
      introTl.addLabel('cta', 'swap_2_3+=0.5')
      if (isValidElement(cta)) {
        introTl.to(
          cta,
          { scale: 1, autoAlpha: 1, y: '0rem', duration: 1.0, ease: 'elastic.out(1, 0.5)' },
          'cta'
        )
      }

      // 2. Portal Timeline (Scrubbed zoom)
      portalTl = gsap.timeline()
      if (isValidElement(titleRow)) {
        portalTl.to(
          titleRow,
          {
            scale: 300,
            transformOrigin: '50% 55%',
            ease: 'power2.inOut',
            duration: 1
          },
          0
        )
      }
      const elementsToFade = [
        q('.hero__background'),
        q('.hero__model'),
        q('.hero__tags'),
        q('.hero__title-left'),
        q('.hero__title-right'),
        q('.hero__headline-top-wrapper .text--subtitle'),
        cta
      ].filter(el => isValidElement(el))

      if (elementsToFade.length > 0) {
        portalTl.to(elementsToFade, { autoAlpha: 0, duration: 0.3 }, 0)
      }

      portalTl.to(
        containerRef.value,
        {
          autoAlpha: 0,
          duration: 0.1,
          onComplete: () => {
            if (containerRef.value) gsap.set(containerRef.value, { display: 'none' })
          },
          onReverseComplete: () => {
            if (containerRef.value) gsap.set(containerRef.value, { display: 'flex' })
          }
        },
        0.9
      )
    }, containerRef.value)

    return { introTl, portalTl }
  }

  onUnmounted(() => {
    ctx?.revert()
  })

  return {
    initAnimation
  }
}
