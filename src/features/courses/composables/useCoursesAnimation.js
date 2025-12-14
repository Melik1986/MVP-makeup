import { gsap } from 'gsap'
import { onMounted, onUnmounted } from 'vue'

import { ScrollTrigger } from '@shared/libs/gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useCoursesAnimation(sectionRef) {
  let ctx

  onMounted(() => {
    if (!sectionRef.value) return

    ctx = gsap.context(self => {
      const wrapper = self.selector('.courses__gallery-wrapper')[0]
      const gallery = self.selector('.courses__gallery')[0]

      if (wrapper && gallery) {
        // Calculate scroll amount: gallery width - wrapper width
        // We use function-based value to recalculate on resize automatically by ScrollTrigger's invalidateOnRefresh
        const getScrollAmount = () => -(gallery.scrollWidth - wrapper.clientWidth)

        // Horizontal Scroll
        gsap.to(gallery, {
          x: getScrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top top',
            end: () => `+=${gallery.scrollWidth - wrapper.clientWidth + 200}`, // Scroll distance based on content length
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        })
      }
    }, sectionRef.value)
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
