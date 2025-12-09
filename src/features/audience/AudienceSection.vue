<template>
  <Section ref="sectionRef" padding="lg" background="white">
    <div class="audience-section">
      <div class="audience-section__header">
        <Heading :level="2" variant="section"> ДЛЯ КОГО ЭТОТ КУРС? </Heading>
        <Text variant="subtitle" class="audience-section__subtitle">
          Техники + продвижение + психология
        </Text>
      </div>

      <div class="audience-section__content">
        <div ref="decorLeftRef" class="audience-section__decorative-left">
          <img
            src="/cosmetic-tube.png"
            alt="Косметика"
            class="audience-section__decoration"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </div>

        <div class="audience-section__cards">
          <AudienceCard
            v-for="(card, index) in audienceCards"
            :key="index"
            :ref="
              el => {
                if (el) cardRefs[index] = el
              }
            "
            :title="card.title"
            :description="card.description"
            :result="card.result"
            :image="card.image"
            class="audience-section__card"
          />
        </div>

        <div ref="decorRightRef" class="audience-section__decorative-right">
          <img
            src="/makeup-brush.png"
            alt="Кисть"
            class="audience-section__decoration"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </div>
      </div>

      <div class="audience-section__cta">
        <Button variant="primary" size="md" @click="emit('yes-click')"> Да, это про меня </Button>
        <Button variant="primary" size="lg" @click="emit('booking-click')">
          ЗАБРОНИРОВАТЬ МЕСТО
        </Button>
      </div>
    </div>
  </Section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ref, onMounted } from 'vue'

import AudienceCard from '@entities/audience/AudienceCard.vue'
import Button from '@shared/ui/Button.vue'
import Heading from '@shared/ui/Heading.vue'
import Section from '@shared/ui/Section.vue'
import Text from '@shared/ui/Text.vue'

const emit = defineEmits(['yes-click', 'booking-click'])

const sectionRef = ref(null)
const decorLeftRef = ref(null)
const decorRightRef = ref(null)
const cardRefs = ref([])

const audienceCards = [
  {
    title: 'Всем, кто хочет стать визажистом',
    description: 'Освой базовые техники, обрети уверенность, получи мотивацию и практический опыт.',
    result:
      'Визаж как хобби, которое приносит доход и радость. Делаешь женщин красивыми и открываешь неограниченные перспективы развития в бьюти-индустрии.',
    image: '/audience-1.jpg'
  },
  {
    title: 'Начинающих визажистов',
    description:
      'Освой базовые и продвинутые техники, обрети уверенность, продвигай свой профиль, привлекай подписчиков и клиентов.',
    result: 'Уверенно заявляешь о себе как о визажисте с доходом 50 000 рублей в месяц.',
    image: '/audience-2.jpg'
  },
  {
    title: 'Опытных визажистов',
    description:
      'Укрепи базовые навыки, улучши существующие, создай портфолио, привлеки новых клиентов, повысь цены на услуги.',
    result:
      'Достигаешь ТОП уровня в своем регионе и выстраиваешь очередь клиентов на услуги и курсы.',
    image: '/audience-3.jpg'
  },
  {
    title: 'Специалистов бьюти сферы',
    description:
      'Освой новые техники, обрети уверенность и мотивацию, продвигай свой профиль, привлекай подписчиков и клиентов.',
    result: 'Полностью меняешь деятельность или получаешь дополнительный доход к основной работе.',
    image: '/audience-4.jpg'
  }
]

onMounted(() => {
  // eslint-disable-next-line no-restricted-globals
  if (typeof window === 'undefined') return

  // Загружаем ScrollTrigger асинхронно
  import('gsap/ScrollTrigger').then(module => {
    const { ScrollTrigger: ScrollTriggerPlugin } = module
    gsap.registerPlugin(ScrollTriggerPlugin)

    const sectionElement = sectionRef.value?.$el || sectionRef.value

    // Parallax для декоративных элементов
    if (decorLeftRef.value && sectionElement) {
      gsap.to(decorLeftRef.value, {
        y: -50,
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })
    }

    if (decorRightRef.value && sectionElement) {
      gsap.to(decorRightRef.value, {
        y: -50,
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })
    }

    // Анимация появления карточек
    cardRefs.value.forEach((cardRef, index) => {
      const element = cardRef?.$el || cardRef
      if (element) {
        gsap.fromTo(
          element,
          {
            y: 50,
            autoAlpha: 0
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        )
      }
    })
  })
})
</script>

<style scoped lang="scss">
.audience-section {
  position: relative;
}

.audience-section__header {
  text-align: center;
  margin-bottom: $spacing-8;
}

.audience-section__subtitle {
  margin-top: $spacing-2;
  color: $color-neutral-gray-800;
  text-align: center;
}

.audience-section__content {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: $spacing-6;
  align-items: start;
  margin-bottom: $spacing-8;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: $spacing-4;
  }
}

.audience-section__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-6;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
    gap: $spacing-4;
  }
}

.audience-section__card {
  opacity: 0;
}

.audience-section__decorative-left,
.audience-section__decorative-right {
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: $breakpoint-lg) {
    display: none;
  }
}

.audience-section__decoration {
  max-width: 150px;
  height: auto;
  filter: drop-shadow($shadow-floating-object);
}

.audience-section__cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-3;
  margin-top: $spacing-8;
}
</style>
