<template>
  <section ref="reviewsRef" class="reviews">
    <Container>
      <Heading variant="section" class="reviews__title">Отзывы учениц</Heading>
      <div class="reviews__grid">
        <!-- Column 1: Moves Down -->
        <div class="reviews__column reviews__column--down">
          <div v-for="(review, index) in column1" :key="`col1-${index}`" class="reviews__card">
            <div class="reviews__card-header">
              <div class="reviews__avatar">
                <!-- Placeholder for avatar -->
                <span>{{ review.name[0] }}</span>
              </div>
              <div class="reviews__info">
                <Text variant="body" class="reviews__name">{{ review.name }}</Text>
                <Text variant="small" class="reviews__date">{{ review.date }}</Text>
              </div>
            </div>
            <Text variant="body" class="reviews__text">{{ review.text }}</Text>
          </div>
        </div>

        <!-- Column 2: Moves Up (Center) -->
        <div v-if="!isMobile" class="reviews__column reviews__column--up">
          <div v-for="(review, index) in column2" :key="`col2-${index}`" class="reviews__card">
            <div class="reviews__card-header">
              <div class="reviews__avatar">
                <span>{{ review.name[0] }}</span>
              </div>
              <div class="reviews__info">
                <Text variant="body" class="reviews__name">{{ review.name }}</Text>
                <Text variant="small" class="reviews__date">{{ review.date }}</Text>
              </div>
            </div>
            <Text variant="body" class="reviews__text">{{ review.text }}</Text>
          </div>
        </div>

        <!-- Column 3: Moves Down -->
        <div v-if="!isMobile" class="reviews__column reviews__column--down">
          <div v-for="(review, index) in column3" :key="`col3-${index}`" class="reviews__card">
            <div class="reviews__card-header">
              <div class="reviews__avatar">
                <span>{{ review.name[0] }}</span>
              </div>
              <div class="reviews__info">
                <Text variant="body" class="reviews__name">{{ review.name }}</Text>
                <Text variant="small" class="reviews__date">{{ review.date }}</Text>
              </div>
            </div>
            <Text variant="body" class="reviews__text">{{ review.text }}</Text>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import Container from '@shared/ui/Container.vue'
import Heading from '@shared/ui/Heading.vue'
import Text from '@shared/ui/Text.vue'

import { useReviewsAnimation } from './composables/useReviewsAnimation'

const reviewsRef = ref(null)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Mock data split into 3 columns
const column1 = [
  {
    name: 'Анна К.',
    date: 'Март 2024',
    text: 'Курс перевернул мое представление о макияже. Теперь я работаю в салоне!'
  },
  {
    name: 'Мария С.',
    date: 'Февраль 2024',
    text: 'Ольга - лучший наставник. Все четко, без воды.'
  },
  { name: 'Елена В.', date: 'Январь 2024', text: 'Окупила курс за первый месяц работы.' },
  { name: 'Дарья М.', date: 'Декабрь 2023', text: 'Очень много практики, это самое главное.' }
]

const column2 = [
  { name: 'Кристина А.', date: 'Апрель 2024', text: 'Спасибо за поддержку 24/7. Это бесценно.' },
  { name: 'Виктория П.', date: 'Март 2024', text: 'Научилась делать идеальные стрелки и кожу.' },
  { name: 'Светлана И.', date: 'Февраль 2024', text: 'Клиенты в восторге от моих работ.' },
  { name: 'Алина Б.', date: 'Январь 2024', text: 'Лучшее вложение в себя за последний год.' }
]

const column3 = [
  {
    name: 'Оксана Г.',
    date: 'Март 2024',
    text: 'Прошла курс "Сам себе визажист", теперь крашусь как профи.'
  },
  { name: 'Татьяна Л.', date: 'Февраль 2024', text: 'Атмосфера на курсе просто огонь!' },
  {
    name: 'Наталья К.',
    date: 'Январь 2024',
    text: 'Получила сертификат и сразу нашла первых клиентов.'
  },
  {
    name: 'Екатерина Р.',
    date: 'Декабрь 2023',
    text: 'Рекомендую всем, кто хочет изменить свою жизнь.'
  }
]

useReviewsAnimation(reviewsRef)
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/features/_reviews.scss
</style>
