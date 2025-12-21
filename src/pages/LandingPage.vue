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
    end: '+=3000', // Оптимальная плотность для мгновенного отклика
    onUpdate: self => {
      // КРИТИЧНО: Если пользователь начал скроллить, завершаем авто-анимацию
      // чтобы она не конфликтовала с порталом.
      if (self.progress > 0.001 && heroTls?.introTl && !heroTls.introTl.paused()) {
        heroTls.introTl.progress(1).pause()
      }
    }
  })

  // 2. Priority Load Hero
  try {
    heroTls = await heroSectionRef.value.initAnimation()

    // СИНХРОНИЗАЦИЯ: Запускаем Hero Intro СРАЗУ
    if (heroTls?.introTl) {
      heroTls.introTl.play()
    }

    // Прелоадер уходит только когда анимация Hero уже началась
    // Это убирает "темный экран" полностью
    requestAnimationFrame(() => {
      isLoading.value = false
    })

    // 3. Parallel Load Others (Background)
    const aboutTl = aboutSectionRef.value.initAnimation()
    const coursesTl = coursesSectionRef.value.initAnimation()

    const masterTl = coordinator.getMasterTimeline()

    // -------------------------------------------------------------------------
    // MASTER SEQUENCE (Unified Flow - Flat Filmstrip Architecture)
    // -------------------------------------------------------------------------
    masterTl.addLabel('hero-start', 0)
    masterTl.addLabel('portal-open', 0.05)
    masterTl.addLabel('about-active', 0.6) // Увеличили нахлест для плавности
    masterTl.addLabel('courses-slide', 1.2)
    masterTl.addLabel('courses-active', 2.2)

    // Гарантируем скрытие About на старте
    gsap.set('.about', { autoAlpha: 0, visibility: 'hidden', pointerEvents: 'none' })

    // 1. Header (Fade in)
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

    // 2. Прямая инжекция Hero Portal в мастер-ленту
    heroSectionRef.value.injectHeroPortal(masterTl, 'portal-open')

    // 3. About Reveal (Синхронизировано с порталом)
    masterTl.fromTo(
      '.about',
      {
        autoAlpha: 0,
        scale: 0.9,
        yPercent: 10
      },
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
      'portal-open+=0.2' // Начинаем проявлять чуть позже начала зума
    )

    // Внутренняя анимация About
    coordinator.injectTimeline(null, aboutTl, 'about-active')

    // 4. Courses (Overlap with About)
    gsap.set('.courses', { yPercent: 100, autoAlpha: 1, visibility: 'visible' })

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

    coordinator.injectTimeline(null, coursesTl, 'courses-slide+=0.05')

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
  transition: opacity 0.4s ease-in;
}
.fade-leave-to {
  opacity: 0;
}
</style>
