import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

import { CustomEase } from '@shared/libs/gsap/CustomEase'
import { SplitText } from '@shared/libs/gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

/**
 * Composable for Booking section animations (Normal Flow)
 */
export function useBookingAnimation(sectionRef, decorCreamRef) {
  let ctx

  onMounted(async () => {
    if (typeof window === 'undefined' || !sectionRef.value) return

    // Wait for fonts to ensure correct SplitText calculations
    if (document.fonts) {
      await document.fonts.ready
    }

    const sectionElement = sectionRef.value?.$el || sectionRef.value
    const q = gsap.utils.selector(sectionElement)

    ctx = gsap.context(() => {
      const premiumEase = CustomEase.create('premium-ease', 'M0,0 C0.19,1 0.22,1 1,1')
      const title = q('h2')
      const fields = q('.booking-form__field')
      const submitBtn = q('.booking-form__submit')

      // 1. Title Reveal
      const splitTitle = new SplitText(title, { type: 'lines' })
      gsap.set(splitTitle.lines, { overflow: 'hidden' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top 70%', // Adjusted for earlier start
          toggleActions: 'play none none reverse'
        }
      })

      tl.fromTo(
        splitTitle.lines,
        { yPercent: 100, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: premiumEase
        }
      )

      // 2. Form Fields Stagger
      tl.fromTo(
        fields,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: premiumEase
        },
        '-=0.4'
      )

      // 3. Submit Button
      tl.fromTo(
        submitBtn,
        { scale: 0.9, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        },
        '-=0.2'
      )

      // 4. Decor Parallax
      if (decorCreamRef.value) {
        gsap.fromTo(
          decorCreamRef.value,
          { y: 60, rotation: -15, autoAlpha: 0 },
          {
            y: -60,
            rotation: 5,
            autoAlpha: 1,
            scrollTrigger: {
              trigger: sectionElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        )
      }
    }, sectionElement)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
