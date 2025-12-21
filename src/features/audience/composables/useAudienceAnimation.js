import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

import { CustomEase } from '@shared/libs/gsap/CustomEase'
import { SplitText } from '@shared/libs/gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText)

export function useAudienceAnimation(
  sectionRef,
  headerRef,
  decorLeftRef,
  decorRightRef,
  cardRefs,
  ctaRef
) {
  let ctx

  onMounted(() => {
    if (typeof window === 'undefined') return
    if (!sectionRef.value) return

    const sectionElement = sectionRef.value?.$el || sectionRef.value
    const headerElement = headerRef.value
    const ctaElement = ctaRef.value

    ctx = gsap.context(() => {
      // 1. Premium Typography (SplitText)
      if (headerElement) {
        const premiumEase = CustomEase.create('premium', 'M0,0 C0.19,1 0.22,1 1,1')
        const titles = headerElement.querySelectorAll('h2, .text--subtitle')

        titles.forEach(title => {
          // Используем autoSplit: true для автоматического пересчета при загрузке шрифтов
          const split = new SplitText(title, {
            type: 'lines,chars',
            linesClass: 'lineChild',
            autoSplit: true
          })

          gsap.from(split.chars, {
            yPercent: 100,
            autoAlpha: 0,
            rotateX: -20,
            stagger: 0.02,
            duration: 1,
            ease: premiumEase,
            scrollTrigger: {
              trigger: title,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          })
        })
      }

      // 2. Orbital Parallax for decorative elements
      if (decorLeftRef.value && sectionElement) {
        gsap.to(decorLeftRef.value, {
          yPercent: -30,
          rotation: 15,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            refreshPriority: -1
          }
        })
      }

      if (decorRightRef.value && sectionElement) {
        gsap.to(decorRightRef.value, {
          yPercent: -20,
          rotation: -15,
          scale: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            refreshPriority: -1
          }
        })
      }

      // 3. Card Stagger Animation (Existing but refined)
      if (cardRefs.value && cardRefs.value.length > 0) {
        cardRefs.value.forEach((cardRef, index) => {
          const element = cardRef?.$el || cardRef
          if (element) {
            gsap.fromTo(
              element,
              {
                y: 60,
                autoAlpha: 0,
                scale: 0.95
              },
              {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: element,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                  refreshPriority: -1
                }
              }
            )
          }
        })
      }

      // 4. Magnetic CTA Interaction
      if (ctaElement) {
        const buttons = ctaElement.querySelectorAll('button')

        // Initial reveal
        gsap.from(buttons, {
          y: 30,
          autoAlpha: 0,
          scale: 0.8,
          filter: 'blur(10px)',
          stagger: 0.2,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ctaElement,
            start: 'top 95%',
            toggleActions: 'play none none none'
          }
        })

        // Magnetic effect
        buttons.forEach(btn => {
          const onMouseMove = e => {
            const rect = btn.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2

            gsap.to(btn, {
              x: x * 0.3,
              y: y * 0.3,
              duration: 0.4,
              ease: 'power2.out'
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
