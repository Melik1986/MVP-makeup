<template>
  <section ref="coursesRef" class="courses">
    <div class="courses__stage">
      <div class="courses__stack">
        <Heading variant="section" class="courses__title">Программы обучения</Heading>
        <div class="courses__cards">
          <article
            v-for="(course, index) in courses"
            :key="course.id"
            class="courses__card"
            :class="{ 'courses__card--dark': course.variant === 'dark' }"
          >
            <div class="courses__card-bg">
              <Image
                :src="course.texture"
                alt=""
                class="courses__card-texture"
                loading="eager"
                decoding="sync"
                aria-hidden="true"
              />
              <Image
                :src="course.image"
                :alt="course.title"
                class="courses__card-image"
                loading="eager"
                decoding="sync"
              />
            </div>
            <div class="courses__card-overlay"></div>

            <div class="courses__card-header">
              <span class="courses__card-badge">{{ course.badge }}</span>
              <span class="courses__card-index">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>

            <div class="courses__card-content">
              <Heading :level="3" class="courses__card-title">{{ course.title }}</Heading>
              <Text variant="body" class="courses__card-subtitle">{{ course.subtitle }}</Text>

              <div class="courses__card-action">
                <span class="courses__link-text">Подробнее</span>
                <div class="courses__link-arrow">→</div>
              </div>
            </div>

            <!-- Decorative elements -->
            <div class="courses__card-decor" aria-hidden="true">
              <div class="courses__decor-line"></div>
              <div class="courses__decor-circle"></div>
            </div>

            <div class="courses__progress" aria-hidden="true">
              <div class="courses__progress-line">
                <div class="courses__progress-fill"></div>
              </div>
              <div class="courses__progress-count">
                <span class="courses__progress-current">{{
                  String(index + 1).padStart(2, '0')
                }}</span>
                <span class="courses__progress-sep">/</span>
                <span class="courses__progress-total">{{
                  String(courses.length).padStart(2, '0')
                }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'

import Heading from '@shared/ui/Heading.vue'
import Image from '@shared/ui/Image.vue'
import Text from '@shared/ui/Text.vue'

import { useCoursesAnimation } from './composables/useCoursesAnimation'

const courses = [
  {
    id: 'course-1',
    title: 'Визажист с 0',
    subtitle: 'Базовый курс для старта карьеры',
    variant: 'light',
    badge: 'Basic',
    texture: '/courses/texture-powder.svg',
    image: '/courses/model-basic.png'
  },
  {
    id: 'course-2',
    title: 'Повышение',
    subtitle: 'Для работающих мастеров',
    variant: 'dark',
    badge: 'Pro Level',
    texture: '/courses/texture-silk.svg',
    image: '/courses/model-pro.png'
  },
  {
    id: 'course-3',
    title: 'Сам себе визажист',
    subtitle: 'Научись краситься дорого',
    variant: 'light',
    badge: 'For You',
    texture: '/courses/texture-glass.svg',
    image: '/courses/model-self.png'
  }
]

const coursesRef = ref(null)
const coordinator = inject('scrollCoordinator', null)

const scrollTriggerRef = useCoursesAnimation(coursesRef, coordinator)

onMounted(() => {
  watch(
    scrollTriggerRef,
    scrollTrigger => {
      if (scrollTrigger && coordinator) {
        coordinator.registerCoursesTrigger(scrollTrigger)
        coordinator.synchronize()
      }
    },
    { immediate: true }
  )
})
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/features/_courses.scss
</style>
