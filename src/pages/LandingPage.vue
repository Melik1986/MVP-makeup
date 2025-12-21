<template>
  <div class="landing-page">
    <!-- Preloader -->
    <Transition name="fade">
      <div v-if="isLoading" class="preloader">
        <div class="preloader__content">
          <div class="preloader__logo">ОЛЬГА ПАВИЛИНА</div>
          <div class="preloader__line">
            <div class="preloader__progress"></div>
          </div>
        </div>
      </div>
    </Transition>

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

import { useLandingPage } from './composables/useLandingPage'

const masterContainerRef = ref(null)
const heroSectionRef = ref(null)
const aboutSectionRef = ref(null)
const coursesSectionRef = ref(null)

const {
  isBookingModalOpen,
  isLoading,
  coordinator,
  openBookingModal,
  closeBookingModal,
  initLandingAnimation
} = useLandingPage()

provide('scrollCoordinator', coordinator)

onMounted(() => {
  initLandingAnimation(masterContainerRef.value, {
    heroSection: heroSectionRef.value,
    aboutSection: aboutSectionRef.value,
    coursesSection: coursesSectionRef.value
  })
})
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/pages/_landing.scss
</style>
