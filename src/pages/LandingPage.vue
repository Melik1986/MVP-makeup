<template>
  <div class="landing-page">
    <Header />
    <div class="hero-transition-wrapper">
      <HeroSection @booking-click="openBookingModal" />
      <AboutSection />
    </div>
    <CoursesSection />
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
import { ref } from 'vue'

import AboutSection from '@features/about/AboutSection.vue'
import AudienceSection from '@features/audience/AudienceSection.vue'
import BookingForm from '@features/booking/BookingForm.vue'
import CoursesSection from '@features/courses/CoursesSection.vue'
import HeroSection from '@features/hero/HeroSection.vue'
import Divider from '@shared/ui/Divider.vue'
import Heading from '@shared/ui/Heading.vue'
import Modal from '@shared/ui/Modal.vue'
import Footer from '@widgets/Footer.vue'
import Header from '@widgets/Header.vue'

const isBookingModalOpen = ref(false)

const openBookingModal = () => {
  isBookingModalOpen.value = true
}

const closeBookingModal = () => {
  isBookingModalOpen.value = false
}
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/pages/_landing.scss
</style>
