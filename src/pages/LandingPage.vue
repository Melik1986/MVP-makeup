<template>
  <div class="landing-page">
    <Header />

    <!-- Master Canvas for unified animations -->
    <div ref="masterContainerRef" class="master-scroll-container">
      <HeroSection ref="heroSectionRef" @booking-click="openBookingModal" />
      <AboutSection ref="aboutSectionRef" />
      <CoursesSection ref="coursesSectionRef" />
    </div>

    <!-- Rest of the page in normal flow -->
    <ReviewsSection />
    <Divider />
    <AudienceSection @yes-click="openBookingModal" @booking-click="openBookingModal" />
    <BookingForm />
    <Footer />

    <Modal :is-open="isBookingModalOpen" @close="closeBookingModal">
      <div class="booking-modal">
        <Heading :level="2" variant="section">Забронируйте место на курсе</Heading>
        <BookingForm :hide-title="true" />
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { provide, ref, onMounted } from 'vue'

import AboutSection from '@features/about/AboutSection.vue'
import AudienceSection from '@features/audience/AudienceSection.vue'
import BookingForm from '@features/booking/BookingForm.vue'
import CoursesSection from '@features/courses/CoursesSection.vue'
import HeroSection from '@features/hero/HeroSection.vue'
import ReviewsSection from '@features/reviews/ReviewsSection.vue'
import Divider from '@shared/ui/Divider.vue'
import Heading from '@shared/ui/Heading.vue'
import Modal from '@shared/ui/Modal.vue'
import Footer from '@widgets/Footer.vue'
import Header from '@widgets/Header.vue'

import { useScrollCoordination } from './composables/useScrollCoordination'

const isBookingModalOpen = ref(false)
const masterContainerRef = ref(null)

const heroSectionRef = ref(null)
const aboutSectionRef = ref(null)
const coursesSectionRef = ref(null)

const openBookingModal = () => {
  isBookingModalOpen.value = true
}

const closeBookingModal = () => {
  isBookingModalOpen.value = false
}

const coordinator = useScrollCoordination()
provide('scrollCoordinator', coordinator)

onMounted(async () => {
  // 1. Initialize Master Timeline on the container
  coordinator.initMasterTimeline(masterContainerRef.value, {
    end: '+=8000'
  })

  // 2. Request internal timelines from sections
  // Using Promise.all to ensure all internal logic is ready
  const [heroTls, aboutTl, coursesTl] = await Promise.all([
    heroSectionRef.value.initAnimation(),
    aboutSectionRef.value.initAnimation(),
    coursesSectionRef.value.initAnimation()
  ])

  // 3. Inject timelines into Master Conductor with absolute positions (labels)
  const masterTl = coordinator.getMasterTimeline()

  // Intro (starts immediately on load)
  if (heroTls?.introTl) {
    heroTls.introTl.play()
  }

  // SCRUBBED SEQUENCE:
  // Label "hero-zoom" at 0
  coordinator.injectTimeline('hero-zoom', heroTls?.portalTl, 0)

  // About reveal transition
  masterTl.to('.about', { autoAlpha: 1, duration: 0.1 }, 0.25)
  coordinator.injectTimeline('about-reveal', aboutTl, 0.25)

  // Courses reveal transition
  masterTl.to('.courses', { autoAlpha: 1, duration: 0.1 }, 0.6)
  coordinator.injectTimeline('courses-reveal', coursesTl, 0.6)

  // 4. Set final sync
  coordinator.synchronize()
})
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/pages/_landing.scss
</style>
