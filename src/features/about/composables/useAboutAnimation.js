import { gsap } from 'gsap'
import { onUnmounted } from 'vue'

import { SplitText } from '@shared/libs/gsap/SplitText'
import { useLogger } from '@shared/libs/logger'

gsap.registerPlugin(SplitText)

const logger = useLogger('useAboutAnimation')

/**
 * Composable для управления внутренними анимациями About секции
 * About сама управляет своими анимациями (SplitText, image fade, lines reveal)
 * Координатор управляет только visibility (autoAlpha) для бесшовного перехода
 */
export function useAboutAnimation(aboutRef) {
  let ctx = null
  let aboutImageTween = null
  let aboutLinesTween = null

  const initAnimation = async () => {
    if (!aboutRef.value) {
      logger.warn('aboutRef.value is null, skipping animation setup')
      return
    }

    // Wait for fonts to load before using SplitText
    await document.fonts.ready

    // Import CustomEase for premium easing
    const { CustomEase } = await import('@shared/libs/gsap/CustomEase')
    gsap.registerPlugin(CustomEase)

    ctx = gsap.context(self => {
      const title = self.selector('.about__title')[0]
      const paragraphs = self.selector('.about__paragraph')
      const listItems = self.selector('.about__list-item')
      const image = self.selector('.about__image')[0]
      const lines = self.selector('.line-inner')

      // 1. Image Clip-path Reveal + Parallax (Premium Setup)
      if (image) {
        gsap.set(image, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          autoAlpha: 1,
          y: 50
        })
      }

      // Helper for Fashion Reveal (Masked Lines)
      const setupReveal = elements => {
        if (!elements || (Array.isArray(elements) && elements.length === 0)) return null

        try {
          const split = new SplitText(elements, { type: 'lines', linesClass: 'line-mask' })
          split.lines.forEach(line => {
            const content = line.innerHTML
            line.innerHTML = `<div class="line-inner" style="display: block; transform: translate(0, 100%); will-change: transform;">${content}</div>`
            line.style.overflow = 'hidden'
          })
          return split
        } catch (error) {
          logger.error('SplitText setup failed', error)
          return null
        }
      }

      // 2. Setup Title
      if (title) setupReveal(title)

      // 3. Setup Paragraphs
      if (paragraphs.length) setupReveal(paragraphs)

      // 4. Setup List Items (Treat as lines)
      if (listItems.length) {
        listItems.forEach(item => {
          const text = item.querySelector('.about__list-item-text')
          if (text) {
            const content = text.innerHTML
            text.innerHTML = `<div class="line-inner" style="display: block; transform: translate(0, 100%); will-change: transform;">${content}</div>`
            text.style.overflow = 'hidden'
            text.style.display = 'block'
          }
        })
      }

      // 5. Setup lines initial state
      if (lines.length) {
        gsap.set(lines, { y: '100%' })
      }
    }, aboutRef.value)
  }

  /**
   * Запускает внутренние анимации About
   * Вызывается когда координатор показывает About (autoAlpha: 1)
   */
  const playAnimation = () => {
    if (!ctx) {
      logger.warn('Animation context not initialized, call initAnimation first')
      return
    }

    // Убиваем предыдущие анимации если они еще активны
    if (aboutImageTween) {
      aboutImageTween.kill()
      aboutImageTween = null
    }
    if (aboutLinesTween) {
      aboutLinesTween.kill()
      aboutLinesTween = null
    }

    // Image clip-path reveal + parallax (Premium animation like hero modelBack)
    const image = ctx.selector('.about__image')[0]
    if (image) {
      // Сбрасываем начальное состояние перед анимацией
      gsap.set(image, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        autoAlpha: 1,
        y: 50
      })
      aboutImageTween = gsap.to(image, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        y: 0,
        duration: 1.2,
        ease: 'power4.inOut'
      })
    }

    // Lines reveal (Fashion Reveal) - Premium easing
    const lines = ctx.selector('.line-inner')
    if (lines.length) {
      // Сбрасываем начальное состояние перед анимацией
      gsap.set(lines, { y: '100%' })
      aboutLinesTween = gsap.to(lines, {
        y: '0%',
        stagger: 0.05,
        duration: 1.0,
        ease: 'expo.out'
      })
    }
  }

  /**
   * Реверс анимаций About (скрытие текста и изображения)
   */
  const reverseAnimation = () => {
    if (!ctx) return

    // Реверс изображения (clip-path скрытие + parallax down)
    const image = ctx.selector('.about__image')[0]
    if (image && aboutImageTween) {
      aboutImageTween.kill()
      aboutImageTween = gsap.to(image, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.in'
      })
    }

    // Реверс текста (скрытие строк снизу вверх)
    const lines = ctx.selector('.line-inner')
    if (lines.length && aboutLinesTween) {
      aboutLinesTween.kill()
      aboutLinesTween = gsap.to(lines, {
        y: '100%',
        stagger: 0.05,
        duration: 0.8,
        ease: 'power2.in'
      })
    }
  }

  /**
   * Останавливает анимации About (kill без реверса)
   */
  const stopAnimation = () => {
    if (aboutImageTween) {
      aboutImageTween.kill()
      aboutImageTween = null
    }
    if (aboutLinesTween) {
      aboutLinesTween.kill()
      aboutLinesTween = null
    }
  }

  /**
   * Сбрасывает состояние About к начальному
   */
  const resetAnimation = () => {
    if (!ctx) return

    const image = ctx.selector('.about__image')[0]
    const lines = ctx.selector('.line-inner')

    if (image) {
      gsap.set(image, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        autoAlpha: 1,
        y: 50
      })
    }
    if (lines.length) {
      gsap.set(lines, { y: '100%' })
    }

    stopAnimation()
  }

  onUnmounted(() => {
    stopAnimation()
    if (ctx) {
      ctx.revert()
      ctx = null
    }
  })

  return {
    initAnimation,
    playAnimation,
    stopAnimation,
    reverseAnimation,
    resetAnimation
  }
}
