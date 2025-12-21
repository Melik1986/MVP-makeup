import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onUnmounted } from 'vue'

import { CustomEase } from '@shared/libs/gsap/CustomEase'
import { SplitText } from '@shared/libs/gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

export function useHeroAnimation(containerRef) {
  let ctx

  /**
   * Инициализация входной анимации (Intro).
   * Эти анимации проигрываются один раз при загрузке страницы.
   */
  const initAnimation = async () => {
    if (typeof window === 'undefined' || !containerRef.value) {
      return { introTl: null }
    }

    const q = gsap.utils.selector(containerRef.value)
    const container = containerRef.value

    // 1. МГНОВЕННЫЙ SETUP (Синхронно)
    // Показываем контейнер сразу, чтобы не было "темного экрана"
    gsap.set(container, { autoAlpha: 1, visibility: 'visible' })

    // Ожидание шрифтов для корректных замеров SplitText
    if (document.fonts) {
      await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 500))])
    }

    ctx = gsap.context(() => {
      // Стабилизация GPU слоев
      gsap.set([container, q('.hero__title-row'), q('.hero__model-container')], {
        force3D: true,
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        z: 0.1
      })

      // Начальное состояние моделей
      const modelBackEl = q('.hero__model-back')
      const otherModels = q('.hero__model-side, .hero__model-front')
      gsap.set(modelBackEl, { autoAlpha: 1, visibility: 'visible' })
      gsap.set(otherModels, { autoAlpha: 0, visibility: 'hidden' })
    }, containerRef.value)

    const cgEase = CustomEase.create(
      'cg-ease',
      'M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.627,1.009 0.813,1.006 1,1'
    )

    let introTl = null

    ctx.add(() => {
      const startDateContent = q('.hero__tag--start .hero__tag-content')
      const formatContent = q('.hero__tag--format .hero__tag-content')
      const headlineWrapper = q('.hero__headline-top-wrapper')
      const titleLeftWrapper = q('.hero__title-left .hero__duration-wrapper')
      const titleRightWrapper = q('.hero__title-right .hero__level-wrapper')
      const mentorshipWords = q('.hero__mentorship-wrapper .text-reveal__word')
      const earningsWords = q('.hero__earnings-wrapper .text-reveal__word')
      const modelBack = q('.hero__model-back')
      const modelSide = q('.hero__model-side')
      const modelFront = q('.hero__model-front')
      const cta = q('.hero__cta')
      const chars = [
        q('.hero__char--v span'),
        q('.hero__char--i span'),
        q('.hero__char--z span'),
        q('.hero__char--a1 span'),
        q('.hero__char--zh span'),
        q('.hero__char--i2 span'),
        q('.hero__char--s span'),
        q('.hero__char--t span')
      ]

      const isValidElement = el => el && (el.length > 0 || el.nodeType === 1)

      // --- Intro Timeline (Entrance) ---
      introTl = gsap.timeline({ paused: true })
      introTl.addLabel('start', 0)

      if (isValidElement(modelBack)) {
        introTl.fromTo(
          modelBack,
          { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', autoAlpha: 1 },
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
            duration: 1.2,
            ease: 'power4.inOut'
          },
          'start'
        )
      }

      introTl.fromTo(
        [startDateContent, formatContent],
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.0, stagger: 0.1, ease: cgEase },
        'start+=0.2'
      )

      introTl.addLabel('left_side', 0.6)
      introTl.fromTo(
        [titleLeftWrapper, ...mentorshipWords],
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.02,
          ease: cgEase
        },
        'left_side'
      )

      const signaturePaths = q('.hero__signature path')
      if (signaturePaths.length) {
        signaturePaths.forEach(path => {
          const len = path.getTotalLength?.() || 1000
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, autoAlpha: 1 })
        })
        introTl.to(
          signaturePaths,
          { strokeDashoffset: 0, duration: 2.5, ease: 'power1.inOut' },
          'left_side+=0.2'
        )
      }

      introTl.addLabel('swap', 1.8)
      introTl.to(modelBack, { x: 50, autoAlpha: 0, duration: 0.8 }, 'swap')
      introTl.fromTo(
        modelSide,
        { x: -50, autoAlpha: 0, visibility: 'visible' },
        { x: 0, autoAlpha: 1, duration: 0.8 },
        'swap'
      )

      introTl.addLabel('final_model', 'swap+=1.0')
      introTl.to(modelSide, { autoAlpha: 0, duration: 0.5 }, 'final_model')
      introTl.fromTo(
        modelFront,
        { autoAlpha: 0, visibility: 'visible', scale: 1.1 },
        { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
        'final_model'
      )

      introTl.addLabel('headline', 'swap+=0.2')
      introTl.fromTo(
        headlineWrapper,
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1 },
        'headline'
      )

      chars.forEach((char, i) => {
        if (isValidElement(char)) {
          introTl.fromTo(
            char,
            { x: i % 2 === 0 ? '1rem' : '-1rem', autoAlpha: 0 },
            { x: '0rem', autoAlpha: 1, duration: 1.5, ease: cgEase },
            `headline+=${i * 0.03}`
          )
        }
      })

      introTl.addLabel('right_side', 'headline+=0.4')
      introTl.fromTo(
        [titleRightWrapper, ...earningsWords],
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.02,
          ease: cgEase
        },
        'right_side'
      )

      introTl.addLabel('cta', 'right_side+=0.4')
      introTl.fromTo(
        cta,
        { scale: 0.8, autoAlpha: 0, y: 20 },
        { scale: 1, autoAlpha: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' },
        'cta'
      )
    })

    return {
      introTl
    }
  }

  /**
   * Инжекция анимации портала Hero в мастер-таймлайн.
   * Это делает анимацию частью глобального потока скролла.
   */
  const injectHeroPortal = (masterTl, label) => {
    if (!containerRef.value) return
    const q = gsap.utils.selector(containerRef.value)
    const container = containerRef.value
    const titleRowEl = q('.hero__title-row')
    const cta = q('.hero__cta')

    const elementsToFade = [
      q('.hero__background'),
      q('.hero__model-container'),
      q('.hero__tags'),
      q('.hero__title-left'),
      q('.hero__title-right'),
      q('.hero__headline-top-wrapper'),
      cta
    ].filter(el => el && (el.length > 0 || el.nodeType === 1))

    // 1. Зум заголовка
    masterTl.fromTo(
      titleRowEl,
      { scale: 1, autoAlpha: 1, z: 0.1 },
      {
        scale: 30, // Безопасный зум для GPU
        transformOrigin: '50% 55%',
        ease: 'power2.in',
        duration: 1,
        immediateRender: false
      },
      label
    )

    // 2. Исчезновение остальных элементов
    masterTl.fromTo(
      elementsToFade,
      { autoAlpha: 1 },
      {
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.05,
        immediateRender: false,
        ease: 'none'
      },
      label
    )

    // 3. Полное скрытие Hero в конце портала
    masterTl.fromTo(
      container,
      { autoAlpha: 1, visibility: 'visible' },
      {
        autoAlpha: 0,
        duration: 0.4,
        ease: 'none',
        immediateRender: false,
        onComplete: () => gsap.set(container, { visibility: 'hidden', pointerEvents: 'none' }),
        onReverseComplete: () =>
          gsap.set(container, { visibility: 'visible', pointerEvents: 'auto' })
      },
      `${label}+=0.6`
    )
  }

  onUnmounted(() => {
    ctx?.revert()
  })

  return {
    initAnimation,
    injectHeroPortal
  }
}
