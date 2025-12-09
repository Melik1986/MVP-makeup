<template>
  <div class="landing-page">
    <Header />
    <HeroSection @booking-click="openBookingModal" />
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

import AudienceSection from '@features/audience/AudienceSection.vue'
import BookingForm from '@features/booking/BookingForm.vue'
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
.landing-page {
  min-height: 100vh;
}

.booking-modal {
  padding: $spacing-4 0;
}
</style>
