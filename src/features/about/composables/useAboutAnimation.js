import { gsap } from 'gsap'
import { onUnmounted } from 'vue'

import { SplitText } from '@shared/libs/gsap/SplitText'

gsap.registerPlugin(SplitText)

export function useAboutAnimation(aboutRef) {
  let ctx = null

  const initAnimation = async () => {
    if (!aboutRef.value) return null

    await document.fonts.ready

    const { CustomEase } = await import('@shared/libs/gsap/CustomEase')
    gsap.registerPlugin(CustomEase)

    let aboutTimeline = null

    ctx = gsap.context(self => {
      const title = self.selector('.about__title')[0]
      const paragraphs = self.selector('.about__paragraph')
      const listItems = self.selector('.about__list-item')
      const image = self.selector('.about__image')[0]

      // Initial state
      if (image) {
        gsap.set(image, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          autoAlpha: 1,
          y: 50
        })
      }

      const setupReveal = elements => {
        if (!elements || (Array.isArray(elements) && elements.length === 0)) return null
        const split = new SplitText(elements, { type: 'lines', linesClass: 'line-mask' })
        split.lines.forEach(line => {
          const content = line.innerHTML
          line.innerHTML = `<div class="line-inner" style="display: block; transform: translate(0, 100%); will-change: transform;">${content}</div>`
          line.style.overflow = 'hidden'
        })
        return split
      }

      if (title) setupReveal(title)
      if (paragraphs.length) setupReveal(paragraphs)
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

      const lines = self.selector('.line-inner')
      if (lines.length) gsap.set(lines, { y: '100%' })

      // Create internal scrubbable timeline
      aboutTimeline = gsap.timeline()
      if (image) {
        aboutTimeline.to(
          image,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
            y: 0,
            duration: 1.2,
            ease: 'power4.inOut'
          },
          0
        )
      }
      if (lines.length) {
        aboutTimeline.to(
          lines,
          {
            y: '0%',
            stagger: 0.05,
            duration: 1.0,
            ease: 'expo.out'
          },
          0.2
        )
      }

      // Exit animation (fading out for Courses)
      aboutTimeline.to(
        aboutRef.value,
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        },
        '+=0.5'
      )
    }, aboutRef.value)

    return aboutTimeline
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
