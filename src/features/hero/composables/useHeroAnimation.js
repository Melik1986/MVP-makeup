import { gsap } from 'gsap'

const fourtyFrames = 1.3333333
const fiftyFrames = 1.66666
const twoFrames = 0.666666
const fourFrames = 0.133333

export async function useHeroAnimation(refs) {
  // eslint-disable-next-line no-restricted-globals
  if (typeof window === 'undefined') return

  // Динамически импортируем плагины для SSR совместимости
  const { CustomEase } = await import('gsap/CustomEase')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(CustomEase, ScrollTrigger)

  const customEaseIn = CustomEase.create('custom-ease-in', '0.52, 0.00, 0.48, 1.00')

  const {
    heroRef,
    startDateRef,
    formatRef,
    headlineTopRef,
    titleLeftRef,
    titleRightRef,
    mentorshipRef,
    earningsRef,
    modelBackRef,
    modelSideRef,
    modelFrontRef,
    ctaRef,
    chars
  } = refs

  // Установка начального состояния (скрытие элементов)
  const setInitialState = () => {
    // Start date tag
    if (startDateRef?.value) {
      const content = startDateRef.value.querySelector('.hero__tag-content')
      if (content) {
        gsap.set(content, { y: '-0.5rem', autoAlpha: 0 })
      }
    }

    // Format tag
    if (formatRef?.value) {
      const content = formatRef.value.querySelector('.hero__tag-content')
      if (content) {
        gsap.set(content, { y: '-0.5rem', autoAlpha: 0 })
      }
    }

    // Headline top
    if (headlineTopRef?.value) {
      const wrapper = headlineTopRef.value.querySelector('.hero__headline-top-wrapper')
      if (wrapper) {
        gsap.set(wrapper, { y: '0.5rem', autoAlpha: 0 })
      }
    }

    // Title characters
    if (chars.charVRef?.value) {
      const span = chars.charVRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { x: '2.7rem', autoAlpha: 0 })
      }
    }

    if (chars.charIRef?.value) {
      const span = chars.charIRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { x: '-2rem', autoAlpha: 0 })
      }
    }

    if (chars.charZRef?.value) {
      const span = chars.charZRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { x: '2.1rem', autoAlpha: 0 })
      }
    }

    if (chars.charARef1?.value) {
      const span = chars.charARef1.value.querySelector('span')
      if (span) {
        gsap.set(span, { x: '-1.2rem', autoAlpha: 0 })
      }
    }

    if (chars.charZhRef?.value) {
      const span = chars.charZhRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { x: '-3.2rem', autoAlpha: 0 })
      }
    }

    if (chars.charIRef2?.value) {
      const span = chars.charIRef2.value.querySelector('span')
      if (span) {
        gsap.set(span, { x: '-2rem', autoAlpha: 0 })
      }
    }

    if (chars.charSRef?.value) {
      const span = chars.charSRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { x: '4.3rem', autoAlpha: 0 })
      }
    }

    if (chars.charTRef?.value) {
      const span = chars.charTRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { x: '1.9rem', autoAlpha: 0 })
      }
    }

    // Левая часть
    if (titleLeftRef?.value) {
      const wrapper = titleLeftRef.value.querySelector('.hero__duration-wrapper')
      if (wrapper) {
        gsap.set(wrapper, { y: '0.5rem', autoAlpha: 0 })
      }
    }

    // Правая часть
    if (titleRightRef?.value) {
      const wrapper = titleRightRef.value.querySelector('.hero__level-wrapper')
      if (wrapper) {
        gsap.set(wrapper, { y: '0.3rem', autoAlpha: 0 })
      }
    }

    // Mentorship
    if (mentorshipRef?.value) {
      gsap.set(mentorshipRef.value, { y: '0.4rem', autoAlpha: 0 })
    }

    // Earnings
    if (earningsRef?.value) {
      gsap.set(earningsRef.value, { y: '0.4rem', autoAlpha: 0 })
    }

    // Model images - все три изображения скрыты и установлены в начальные позиции
    // Используем left в процентах для позиционирования относительно контейнера
    // Первое изображение (спина): слева от центра (left: 20%)
    if (modelBackRef?.value) {
      gsap.set(modelBackRef.value, { left: '20%', xPercent: -50, autoAlpha: 0 })
    }
    // Второе изображение (боком): ближе к центру, но слева (left: 35%)
    if (modelSideRef?.value) {
      gsap.set(modelSideRef.value, { left: '35%', xPercent: -50, autoAlpha: 0 })
    }
    // Третье изображение (спереди): в центре (left: 50%)
    if (modelFrontRef?.value) {
      gsap.set(modelFrontRef.value, { left: '50%', xPercent: -50, autoAlpha: 0 })
    }

    // CTA Button
    if (ctaRef?.value) {
      gsap.set(ctaRef.value, { scale: 0.417, y: '0.4rem', autoAlpha: 0 })
    }
  }

  // Анимация вращения модели через три изображения
  // Начинается с offset -0.5, завершается на fourFrames (0.133333)
  // Общая длительность: 0.133 - (-0.5) = 0.633 секунды
  // Увеличиваем длительность для более плавной и заметной анимации
  const animateModelRotation = (timeline, startOffset) => {
    // Увеличенные длительности для более плавного и заметного перехода
    const fadeInDuration = 0.5 // 0.5 секунды для fade-in
    const fadeOutDuration = 0.4 // 0.4 секунды для fade-out
    const overlapTime = 0.15 // Перекрытие между fade-out и fade-in для плавности

    // Первое изображение (спина, слева): fade-in + fade-out
    if (modelBackRef?.value) {
      // Появление первого изображения (left: 20%, xPercent: -50 для центрирования относительно своей позиции)
      timeline.fromTo(
        modelBackRef.value,
        { left: '20%', xPercent: -50, autoAlpha: 0 },
        { left: '20%', xPercent: -50, autoAlpha: 1, duration: fadeInDuration, ease: customEaseIn },
        startOffset
      )
      // Исчезновение первого изображения (начинается с перекрытием для плавности)
      timeline.fromTo(
        modelBackRef.value,
        { left: '20%', xPercent: -50, autoAlpha: 1 },
        { left: '20%', xPercent: -50, autoAlpha: 0, duration: fadeOutDuration, ease: customEaseIn },
        `+=${fadeInDuration - overlapTime}`
      )
    }

    // Второе изображение (боком, ближе к центру): fade-in + fade-out
    if (modelSideRef?.value) {
      // Появление второго изображения (left: 35%, xPercent: -50)
      // Начинается с перекрытием с fade-out первого
      timeline.fromTo(
        modelSideRef.value,
        { left: '35%', xPercent: -50, autoAlpha: 0 },
        { left: '35%', xPercent: -50, autoAlpha: 1, duration: fadeInDuration, ease: customEaseIn },
        `-=${fadeInDuration - overlapTime}`
      )
      // Исчезновение второго изображения
      timeline.fromTo(
        modelSideRef.value,
        { left: '35%', xPercent: -50, autoAlpha: 1 },
        { left: '35%', xPercent: -50, autoAlpha: 0, duration: fadeOutDuration, ease: customEaseIn },
        `+=${fadeInDuration - overlapTime}`
      )
    }

    // Третье изображение (спереди, в центре): fade-in + остаться видимым
    if (modelFrontRef?.value) {
      // Появление третьего изображения (left: 50%, xPercent: -50 для центра)
      // Начинается с перекрытием с fade-out второго, завершается к fourFrames
      timeline.fromTo(
        modelFrontRef.value,
        { left: '50%', xPercent: -50, autoAlpha: 0 },
        { left: '50%', xPercent: -50, autoAlpha: 1, duration: fadeInDuration, ease: customEaseIn },
        `-=${fadeInDuration - overlapTime}`
      )
    }
  }

  // Функция показа элементов (как в примере)
  const showElements = () => {
    const timeline = gsap.timeline()

    // Start date tag
    if (startDateRef?.value) {
      const content = startDateRef.value.querySelector('.hero__tag-content')
      if (content) {
        timeline.fromTo(
          content,
          { y: '-0.5rem', autoAlpha: 0 },
          { y: '0rem', autoAlpha: 1, duration: fourtyFrames, ease: customEaseIn },
          0
        )
      }
    }

    // Format tag
    if (formatRef?.value) {
      const content = formatRef.value.querySelector('.hero__tag-content')
      if (content) {
        timeline.fromTo(
          content,
          { y: '-0.5rem', autoAlpha: 0 },
          { y: '0rem', autoAlpha: 1, duration: fourtyFrames, ease: customEaseIn },
          twoFrames
        )
      }
    }

    // Headline top
    if (headlineTopRef?.value) {
      const wrapper = headlineTopRef.value.querySelector('.hero__headline-top-wrapper')
      if (wrapper) {
        timeline.fromTo(
          wrapper,
          { y: '0.5rem', autoAlpha: 0 },
          { y: '0rem', autoAlpha: 1, duration: fourtyFrames, ease: customEaseIn },
          twoFrames
        )
      }
    }

    // Title characters - первая буква В (как eve в примере)
    if (chars.charVRef?.value) {
      const span = chars.charVRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { autoAlpha: 1 })
        timeline.fromTo(
          span,
          { x: '2.7rem' },
          { x: '0rem', duration: fiftyFrames, ease: customEaseIn },
          0
        )
      }
    }

    // Левая часть - duration (как book в примере)
    if (titleLeftRef?.value) {
      const wrapper = titleLeftRef.value.querySelector('.hero__duration-wrapper')
      if (wrapper) {
        timeline.fromTo(
          wrapper,
          { y: '0.5rem', autoAlpha: 0 },
          { y: '0rem', autoAlpha: 1, duration: fourtyFrames, ease: customEaseIn },
          twoFrames
        )
      }
    }

    // З
    if (chars.charZRef?.value) {
      const span = chars.charZRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { autoAlpha: 1 })
        timeline.fromTo(
          span,
          { x: '2.1rem' },
          { x: '0rem', duration: fiftyFrames, ease: customEaseIn },
          twoFrames
        )
      }
    }

    // А
    if (chars.charARef1?.value) {
      const span = chars.charARef1.value.querySelector('span')
      if (span) {
        gsap.set(span, { autoAlpha: 1 })
        timeline.fromTo(
          span,
          { x: '-1.2rem' },
          { x: '0rem', duration: fiftyFrames, ease: customEaseIn },
          twoFrames
        )
      }
    }

    // Ж
    if (chars.charZhRef?.value) {
      const span = chars.charZhRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { autoAlpha: 1 })
        timeline.fromTo(
          span,
          { x: '-3.2rem' },
          { x: '0rem', duration: fiftyFrames, ease: customEaseIn },
          twoFrames
        )
      }
    }

    // Правая часть
    if (titleRightRef?.value) {
      const wrapper = titleRightRef.value.querySelector('.hero__level-wrapper')
      if (wrapper) {
        timeline.fromTo(
          wrapper,
          { y: '0.3rem', autoAlpha: 0 },
          { y: '0rem', autoAlpha: 1, duration: fourtyFrames, ease: customEaseIn },
          fourFrames
        )
      }
    }

    // И (вторая)
    if (chars.charIRef2?.value) {
      const span = chars.charIRef2.value.querySelector('span')
      if (span) {
        gsap.set(span, { autoAlpha: 1 })
        timeline.fromTo(
          span,
          { x: '-2rem' },
          { x: '0rem', duration: fiftyFrames, ease: customEaseIn },
          fourFrames
        )
      }
    }

    // С
    if (chars.charSRef?.value) {
      const span = chars.charSRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { autoAlpha: 1 })
        timeline.fromTo(
          span,
          { x: '4.3rem' },
          { x: '0rem', duration: fiftyFrames, ease: customEaseIn },
          fourFrames
        )
      }
    }

    // Т
    if (chars.charTRef?.value) {
      const span = chars.charTRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { autoAlpha: 1 })
        timeline.fromTo(
          span,
          { x: '1.9rem' },
          { x: '0rem', duration: fiftyFrames, ease: customEaseIn },
          fourFrames
        )
      }
    }

    // И (первая) - после З, А, Ж
    if (chars.charIRef?.value) {
      const span = chars.charIRef.value.querySelector('span')
      if (span) {
        gsap.set(span, { autoAlpha: 1 })
        timeline.fromTo(
          span,
          { x: '-2rem' },
          { x: '0rem', duration: fiftyFrames, ease: customEaseIn },
          fourFrames
        )
      }
    }

    // Mentorship
    if (mentorshipRef?.value) {
      timeline.fromTo(
        mentorshipRef.value,
        { y: '0.4rem', autoAlpha: 0 },
        { y: '0rem', autoAlpha: 1, duration: fourtyFrames, ease: customEaseIn },
        fourFrames
      )
    }

    // Earnings
    if (earningsRef?.value) {
      timeline.fromTo(
        earningsRef.value,
        { y: '0.4rem', autoAlpha: 0 },
        { y: '0rem', autoAlpha: 1, duration: fourtyFrames, ease: customEaseIn },
        fourFrames
      )
    }

    // Model rotation animation - начинается раньше заголовка, завершается одновременно
    animateModelRotation(timeline, -0.5)

    // CTA Button
    if (ctaRef?.value) {
      timeline.fromTo(
        ctaRef.value,
        { scale: 0.417, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: fourtyFrames, ease: customEaseIn },
        0
      )
      timeline.fromTo(
        ctaRef.value,
        { y: '0.4rem' },
        { y: '0rem', duration: fourtyFrames, ease: customEaseIn },
        fourFrames
      )
    }

    return timeline
  }

  // Установка начального состояния
  setInitialState()

  // Создаем timeline для показа элементов (будет реверсироваться при скролле)
  const showTimeline = showElements()

  // Сначала запускаем анимацию появления при загрузке страницы
  showTimeline.play()

  // Настройка ScrollTrigger для реверса при скролле
  // Когда пользователь скроллит и верх секции уходит за верх viewport,
  // элементы исчезают в обратном порядке их появления
  if (heroRef?.value) {
    ScrollTrigger.create({
      trigger: heroRef.value,
      start: 'top top', // Когда верх секции на верху viewport (элементы показаны)
      end: () => `+=${window.innerHeight}`, // Когда проскроллим на 100vh, верх секции уйдет за верх viewport (элементы скрыты)
      scrub: 0.5, // Плавная синхронизация со скроллом
      onUpdate: self => {
        // scrollProgress 0 = начало (элементы показаны, timeline progress = 1)
        // scrollProgress 1 = конец (элементы скрыты, timeline progress = 0)
        const scrollProgress = self.progress
        // Инвертируем: чем больше скролл, тем меньше progress (реверс show анимации)
        // Элементы исчезают в обратном порядке их появления
        const timelineProgress = 1 - scrollProgress
        showTimeline.progress(timelineProgress)
      }
    })
  }
}
