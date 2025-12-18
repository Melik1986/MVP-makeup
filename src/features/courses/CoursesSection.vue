<template>
  <section ref="coursesRef" class="courses">
    <Container>
      <div class="courses__stage">
        <div class="courses__stack">
          <Heading variant="section" class="courses__title">Программы обучения</Heading>
          <div class="courses__cards">
            <article
              v-for="course in courses"
              :key="course.id"
              class="courses__card"
              :class="{ 'courses__card--dark': course.variant === 'dark' }"
            >
              <div class="courses__card-content">
                <Heading :level="3" class="courses__card-title">{{ course.title }}</Heading>
                <Text variant="body">{{ course.subtitle }}</Text>
              </div>
              <div class="courses__progress" aria-hidden="true">
                <div class="courses__progress-line">
                  <div class="courses__progress-fill"></div>
                </div>
                <div class="courses__progress-count">
                  <span class="courses__progress-current">01</span>
                  <span class="courses__progress-sep">/</span>
                  <span class="courses__progress-total">03</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { inject, onMounted, ref, watch } from 'vue'

import Container from '@shared/ui/Container.vue'
import Heading from '@shared/ui/Heading.vue'
import Text from '@shared/ui/Text.vue'

import { useCoursesAnimation } from './composables/useCoursesAnimation'

const courses = [
  {
    id: 'course-1',
    title: 'Визажист с 0',
    subtitle: 'Базовый курс для старта карьеры',
    variant: 'light'
  },
  {
    id: 'course-2',
    title: 'Повышение',
    subtitle: 'Для работающих мастеров',
    variant: 'dark'
  },
  {
    id: 'course-3',
    title: 'Сам себе визажист',
    subtitle: 'Научись краситься дорого',
    variant: 'light'
  }
]

const coursesRef = ref(null)
const coordinator = inject('scrollCoordinator', null)

// useCoursesAnimation вернет ref с ScrollTrigger для регистрации в координаторе
const scrollTriggerRef = useCoursesAnimation(coursesRef, coordinator)

// Регистрируем courses ScrollTrigger в координаторе после монтирования
onMounted(() => {
  // Используем watch чтобы дождаться когда ScrollTrigger будет создан
  watch(
    scrollTriggerRef,
    scrollTrigger => {
      if (scrollTrigger && coordinator) {
        coordinator.registerCoursesTrigger(scrollTrigger)
        // Синхронизируем после регистрации courses
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
