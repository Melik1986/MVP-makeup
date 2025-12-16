import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, onUnmounted } from 'vue'

gsap.registerPlugin(ScrollTrigger)

export function useAudienceAnimation(sectionRef, decorLeftRef, decorRightRef, cardRefs) {
  let ctx

  onMounted(() => {
    // eslint-disable-next-line no-restricted-globals
    if (typeof window === 'undefined') return
    if (!sectionRef.value) return

    // Получаем DOM элемент из Vue компонента (нужно для scope в gsap.context)
    const sectionElement = sectionRef.value?.$el || sectionRef.value

    ctx = gsap.context(() => {
      // Parallax for decorative elements
      if (decorLeftRef.value && sectionElement) {
        gsap.to(decorLeftRef.value, {
          y: -50,
          scrollTrigger: {
            trigger: sectionElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      if (decorRightRef.value && sectionElement) {
        gsap.to(decorRightRef.value, {
          y: -50,
          scrollTrigger: {
            trigger: sectionElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      // Card Stagger Animation
      if (cardRefs.value && cardRefs.value.length > 0) {
        cardRefs.value.forEach((cardRef, index) => {
          const element = cardRef?.$el || cardRef
          if (element) {
            gsap.fromTo(
              element,
              {
                y: 50,
                autoAlpha: 0
              },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.6,
                delay: index * 0.1,
                scrollTrigger: {
                  trigger: element,
                  start: 'top 80%',
                  toggleActions: 'play none none none'
                }
              }
            )
          }
        })
      }
    }, sectionElement)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
