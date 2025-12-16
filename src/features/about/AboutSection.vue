<template>
  <section ref="aboutRef" class="about">
    <Container class="about__container">
      <div class="about__content">
        <div class="about__image-wrapper">
          <Image
            src="/model-from.png"
            alt="Об авторе"
            class="about__image"
            :width="500"
            :height="700"
          />
        </div>
        <div class="about__text-wrapper">
          <Heading :level="2" variant="section" class="about__title">ОБО МНЕ</Heading>
          <div class="about__description">
            <Text variant="body" class="about__paragraph">
              Я — ваш проводник в мир профессионального визажа. Моя миссия — раскрыть ваш потенциал
              и научить создавать красоту, которая вдохновляет.
            </Text>
            <ul class="about__list">
              <li class="about__list-item">
                <Text variant="body" class="about__list-item-text"
                  >10 лет опыта в индустрии красоты</Text
                >
              </li>
              <li class="about__list-item">
                <Text variant="body" class="about__list-item-text"
                  >Основатель студии премиум-класса</Text
                >
              </li>
              <li class="about__list-item">
                <Text variant="body" class="about__list-item-text"
                  >Более 5000 довольных клиентов</Text
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'

import Container from '@shared/ui/Container.vue'
import Heading from '@shared/ui/Heading.vue'
import Image from '@shared/ui/Image.vue'
import Text from '@shared/ui/Text.vue'

import { useAboutAnimation } from './composables/useAboutAnimation'

const aboutRef = ref<HTMLElement | null>(null)
const { initAnimation, playAnimation, reverseAnimation } = useAboutAnimation(aboutRef)
const coordinator = inject('scrollCoordinator', null)

onMounted(async () => {
  // About сама управляет своими внутренними анимациями
  await initAnimation()

  // Регистрируем callbacks в координаторе - About сам запустит/остановит анимации
  // Координатор только управляет visibility (autoAlpha), выступая в роли дирижёра
  if (coordinator && typeof coordinator.registerAboutCallbacks === 'function') {
    coordinator.registerAboutCallbacks({
      onShow: () => {
        // About стал видимым - запускаем внутренние анимации
        playAnimation()
      },
      onHide: () => {
        // About скрывается - реверс анимаций (скрытие текста и изображения)
        reverseAnimation()
      }
    })
  }
})
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/features/_about.scss
</style>
