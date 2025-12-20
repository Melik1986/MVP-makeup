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
import { gsap } from 'gsap'
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

const isLoading = ref(true)

const openBookingModal = () => {
  isBookingModalOpen.value = true
}

const closeBookingModal = () => {
  isBookingModalOpen.value = false
}

const coordinator = useScrollCoordination()
provide('scrollCoordinator', coordinator)

onMounted(async () => {
  let heroTls = null

  // 1. Initialize Master Timeline
  coordinator.initMasterTimeline(masterContainerRef.value, {
    end: '+=10000', // Больше пространства для маневра
    onUpdate: self => {
      // Блокируем авто-анимацию при скролле
      if (self.progress > 0.001 && heroTls?.introTl?.isActive()) {
        heroTls.introTl.pause()
      }
    }
  })

  // 2. Priority Load Hero
  try {
    heroTls = await heroSectionRef.value.initAnimation()

    // СРАЗУ снимаем лоадер и запускаем Intro для Hero
    isLoading.value = false
    if (heroTls?.introTl) {
      heroTls.introTl.play()
    }

    // 3. Parallel Load Others (Background)
    const [aboutTl, coursesTl] = await Promise.all([
      aboutSectionRef.value.initAnimation(),
      coursesSectionRef.value.initAnimation()
    ])

    const masterTl = coordinator.getMasterTimeline()

    // -------------------------------------------------------------------------
    // MASTER SEQUENCE (Unified Flow)
    // -------------------------------------------------------------------------
    masterTl.addLabel('hero-start', 0)
    masterTl.addLabel('portal-open', 0.1)
    masterTl.addLabel('about-active', 1.0)
    masterTl.addLabel('courses-slide', 2.8)
    masterTl.addLabel('courses-active', 4.0)

    // 1. Header (Fade in)
    masterTl.from(
      '.header',
      {
        yPercent: -100,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'expo.out'
      },
      'hero-start'
    )

    // 2. Portal (Overlap Hero Zoom with About Reveal)
    if (heroTls?.portalTl) {
      coordinator.injectTimeline(null, heroTls.portalTl, 'portal-open')
    }

    // ВАЖНО: About начинает проявляться СРАЗУ с началом портала
    masterTl.to(
      '.about',
      {
        autoAlpha: 1,
        pointerEvents: 'auto',
        duration: 0.6, // Ускоряем проявление контейнера
        ease: 'power1.inOut',
        immediateRender: false
      },
      'portal-open'
    )

    // Внутренняя анимация About начинается ПОЧТИ СРАЗУ (нахлест 95%)
    coordinator.injectTimeline(null, aboutTl, 'portal-open+=0.05')

    // 3. Courses (Overlap with About)
    gsap.set('.courses', { yPercent: 100, autoAlpha: 1 })

    masterTl.to(
      '.courses',
      {
        yPercent: 0,
        pointerEvents: 'auto',
        duration: 1.8,
        ease: 'expo.inOut',
        immediateRender: false
      },
      'courses-slide'
    )

    coordinator.injectTimeline(null, coursesTl, 'courses-slide+=0.8')

    coordinator.synchronize()
  } catch (error) {
    console.error('❌ Master Init Error:', error)
    isLoading.value = false
  }
})
</script>

<style scoped lang="scss">
.preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: $color-neutral-black;
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    text-align: center;
  }

  &__logo {
    color: $color-neutral-white;
    font-size: $font-size-xl;
    letter-spacing: 0.2em;
    margin-bottom: $spacing-4;
    font-weight: $font-weight-bold;
    font-family: Helvetica, sans-serif;
  }

  &__line {
    width: 200px;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    margin: 0 auto;
  }

  &__progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: $color-primary-500;
    transform: translateX(-100%);
    animation: progress 2s infinite ease-in-out;
  }
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>
