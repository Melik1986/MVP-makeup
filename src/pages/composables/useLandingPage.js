import { gsap } from 'gsap'
import { ref } from 'vue'

import { useScrollCoordination } from './useScrollCoordination'

/**
 * Composable for Landing Page logic and animation orchestration
 * @returns {Object} Landing page states and methods
 */
export function useLandingPage() {
  const isBookingModalOpen = ref(false)
  const isLoading = ref(true)
  const coordinator = useScrollCoordination()

  const openBookingModal = () => {
    isBookingModalOpen.value = true
  }

  const closeBookingModal = () => {
    isBookingModalOpen.value = false
  }

  /**
   * Initializes the landing page animation sequence
   * @param {HTMLElement} container - Master scroll container
   * @param {Object} refs - Object containing section refs
   */
  const initLandingAnimation = async (container, { heroSection, aboutSection, coursesSection }) => {
    let heroTls = null

    // 1. Initialize Master Timeline
    coordinator.initMasterTimeline(container, {
      end: '+=3000',
      onUpdate: self => {
        if (self.progress > 0.001 && heroTls?.introTl && !heroTls.introTl.paused()) {
          heroTls.introTl.progress(1).pause()
        }
      }
    })

    try {
      // 2. Priority Load Hero
      heroTls = await heroSection.initAnimation()

      if (heroTls?.introTl) {
        heroTls.introTl.play()
      }

      // Hide preloader once hero intro starts
      requestAnimationFrame(() => {
        isLoading.value = false
      })

      // 3. Parallel Load Others
      const aboutTl = aboutSection.initAnimation()
      const coursesTl = coursesSection.initAnimation()

      const masterTl = coordinator.getMasterTimeline()

      // Set up master sequence
      masterTl.addLabel('hero-start', 0)
      masterTl.addLabel('portal-open', 0.05)
      masterTl.addLabel('about-active', 0.6)
      masterTl.addLabel('courses-slide', 1.2)
      masterTl.addLabel('courses-active', 2.2)

      // Initial state for sections
      gsap.set('.about', { autoAlpha: 0, visibility: 'hidden', pointerEvents: 'none' })
      gsap.set('.courses', { yPercent: 100, autoAlpha: 1, visibility: 'visible' })

      // Header animation
      masterTl.from(
        '.header',
        {
          yPercent: -100,
          autoAlpha: 0,
          duration: 0.4,
          ease: 'power2.out'
        },
        'hero-start'
      )

      // Inject Hero Portal
      heroSection.injectHeroPortal(masterTl, 'portal-open')

      // About Reveal
      masterTl.fromTo(
        '.about',
        { autoAlpha: 0, scale: 0.9, yPercent: 10 },
        {
          autoAlpha: 1,
          scale: 1,
          yPercent: 0,
          pointerEvents: 'auto',
          visibility: 'visible',
          duration: 0.6,
          ease: 'power2.out',
          immediateRender: false
        },
        'portal-open+=0.2'
      )

      // About Content
      coordinator.injectTimeline(null, aboutTl, 'about-active')

      // Courses Reveal
      masterTl.to(
        '.courses',
        {
          yPercent: 0,
          pointerEvents: 'auto',
          duration: 0.7,
          ease: 'power2.inOut',
          immediateRender: false
        },
        'courses-slide'
      )

      // Courses Content
      coordinator.injectTimeline(null, coursesTl, 'courses-slide+=0.05')

      coordinator.synchronize()
    } catch (error) {
      console.error('❌ Landing Init Error:', error)
      isLoading.value = false
    }
  }

  return {
    isBookingModalOpen,
    isLoading,
    coordinator,
    openBookingModal,
    closeBookingModal,
    initLandingAnimation
  }
}
