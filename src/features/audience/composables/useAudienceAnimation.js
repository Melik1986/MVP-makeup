import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

import { CustomEase } from '@shared/libs/gsap/CustomEase'
import { SplitText } from '@shared/libs/gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

/**
 * Composable for Audience section animations (Normal Flow)
 * Includes enhanced SplitText for all text and magnetic button effects.
 */
export function useAudienceAnimation(
  sectionRef,
  headerRef,
  decorLeftRef,
  decorRightRef,
  cardRefs,
  ctaRef
) {
  let ctx

  onMounted(async () => {
    if (typeof window === 'undefined' || !sectionRef.value) return

    // Wait for fonts to ensure correct SplitText calculations
    if (document.fonts) {
      await document.fonts.ready
    }

    const sectionElement = sectionRef.value?.$el || sectionRef.value
    const headerElement = headerRef.value
    const ctaElement = ctaRef.value

    ctx = gsap.context(() => {
      const premiumEase = CustomEase.create('premium-ease', 'M0,0 C0.19,1 0.22,1 1,1')

      // 1. Header Reveal (SplitText)
      if (headerElement) {
        const title = headerElement.querySelector('h2')
        const subtitle = headerElement.querySelector('.audience-section__subtitle')

        const splitTitle = new SplitText(title, { type: 'lines' })
        const splitSubtitle = new SplitText(subtitle, { type: 'lines' })

        gsap.set([splitTitle.lines, splitSubtitle.lines], { overflow: 'hidden' })

        const headerTl = gsap.timeline({
          scrollTrigger: {
            trigger: headerElement,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        })

        headerTl.fromTo(
          [splitTitle.lines, splitSubtitle.lines],
          { yPercent: 100, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: premiumEase
          }
        )
      }

      // 2. Card Stagger with Internal Text SplitText
      const cards = cardRefs.value.map(ref => ref?.$el || ref).filter(Boolean)

      cards.forEach(card => {
        const cardTitle = card.querySelector('.audience-card__title')
        const cardDesc = card.querySelector('.audience-card__description')
        const cardResult = card.querySelector('.audience-card__result')
        const imageWrapper = card.querySelector('.audience-card__image-wrapper')

        // Initial states
        gsap.set(card, { autoAlpha: 0, y: 50 })
        if (imageWrapper) gsap.set(imageWrapper, { scale: 0.8, autoAlpha: 0 })

        const splitCardTitle = new SplitText(cardTitle, { type: 'lines' })
        const splitCardDesc = new SplitText(cardDesc, { type: 'lines' })
        const splitCardResult = new SplitText(cardResult, { type: 'lines' })

        gsap.set([splitCardTitle.lines, splitCardDesc.lines, splitCardResult.lines], {
          autoAlpha: 0,
          y: 20
        })

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        })

        cardTl.to(card, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: premiumEase
        })

        if (imageWrapper) {
          cardTl.to(
            imageWrapper,
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.8,
              ease: 'back.out(1.7)'
            },
            '-=0.4'
          )
        }

        cardTl.to(
          [splitCardTitle.lines, splitCardDesc.lines, splitCardResult.lines],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: premiumEase
          },
          '-=0.4'
        )
      })

      // 3. Decorative Parallax (Standalone Scrub)
      if (decorLeftRef.value) {
        gsap.fromTo(
          decorLeftRef.value,
          { y: 50, autoAlpha: 0, rotation: -10 },
          {
            y: -50,
            autoAlpha: 1,
            rotation: 10,
            scrollTrigger: {
              trigger: sectionElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          }
        )
      }

      if (decorRightRef.value) {
        gsap.fromTo(
          decorRightRef.value,
          { y: 100, autoAlpha: 0, rotation: 15 },
          {
            y: -100,
            autoAlpha: 1,
            rotation: -15,
            scrollTrigger: {
              trigger: sectionElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          }
        )
      }

      // 4. CTA and Magnetic Effect
      if (ctaElement) {
        const buttons = ctaElement.querySelectorAll('button')

        gsap.fromTo(
          buttons,
          { y: 30, autoAlpha: 0, scale: 0.9 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.2,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: ctaElement,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        )

        // Magnetic Effect logic
        buttons.forEach(btn => {
          const onMouseMove = e => {
            const rect = btn.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2

            gsap.to(btn, {
              x: x * 0.3,
              y: y * 0.3,
              duration: 0.4,
              ease: 'expo.out'
            })
          }

          const onMouseLeave = () => {
            gsap.to(btn, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: 'elastic.out(1, 0.3)'
            })
          }

          btn.addEventListener('mousemove', onMouseMove)
          btn.addEventListener('mouseleave', onMouseLeave)
        })
      }
    }, sectionElement)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
