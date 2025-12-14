<template>
  <section ref="coursesRef" class="courses">
    <Container>
      <Heading variant="section" class="courses__title">Программы обучения</Heading>
      <div class="courses__gallery-wrapper">
        <div class="courses__gallery">
          <div class="courses__card">
            <div class="courses__card-content">
              <Heading :level="3" class="courses__card-title">Визажист с 0</Heading>
              <Text variant="body">Базовый курс для старта карьеры</Text>
            </div>
          </div>
          <div class="courses__card courses__card--dark">
            <div class="courses__card-content">
              <Heading :level="3" class="courses__card-title">Повышение</Heading>
              <Text variant="body">Для работающих мастеров</Text>
            </div>
          </div>
          <div class="courses__card">
            <div class="courses__card-content">
              <Heading :level="3" class="courses__card-title">Сам себе визажист</Heading>
              <Text variant="body">Научись краситься дорого</Text>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { ref } from 'vue'

import Container from '@shared/ui/Container.vue'
import Heading from '@shared/ui/Heading.vue'
import Text from '@shared/ui/Text.vue'

import { useCoursesAnimation } from './composables/useCoursesAnimation'

const coursesRef = ref(null)

useCoursesAnimation(coursesRef)
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/features/_courses.scss
</style>
