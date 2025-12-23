<template>
  <div id="booking-form" ref="sectionRef" class="booking-form-wrapper">
    <Section v-if="!hideTitle" padding="lg" background="gray">
      <div class="booking-form">
        <Heading :level="2" variant="section"> Забронируйте место на курсе </Heading>
      </div>
    </Section>

    <Section :padding="hideTitle ? 'lg' : 'none'" :background="hideTitle ? 'gray' : 'transparent'">
      <div class="booking-form">
        <div ref="decorCreamRef" class="booking-form__decorative-cream">
          <img
            src="/decor/cream.png"
            alt="Крем"
            class="booking-form__decoration"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </div>
        <form class="booking-form__form" @submit.prevent="handleSubmit">
          <div class="booking-form__field">
            <label for="name" class="booking-form__label">Имя</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="booking-form__input"
              :class="{ 'booking-form__input--error': errors.name }"
              placeholder="Введите ваше имя"
              required
            />
            <span v-if="errors.name" class="booking-form__error">{{ errors.name }}</span>
          </div>

          <div class="booking-form__field">
            <label for="phone" class="booking-form__label">Телефон</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="booking-form__input"
              :class="{ 'booking-form__input--error': errors.phone }"
              placeholder="+380 (99) 999-99-99"
              required
            />
            <span v-if="errors.phone" class="booking-form__error">{{ errors.phone }}</span>
          </div>

          <div class="booking-form__field">
            <label for="email" class="booking-form__label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="booking-form__input"
              :class="{ 'booking-form__input--error': errors.email }"
              placeholder="example@email.com"
              required
            />
            <span v-if="errors.email" class="booking-form__error">{{ errors.email }}</span>
          </div>

          <div class="booking-form__field">
            <label for="comment" class="booking-form__label">Комментарий (необязательно)</label>
            <textarea
              id="comment"
              v-model="form.comment"
              class="booking-form__textarea"
              rows="4"
              placeholder="Ваш комментарий..."
            ></textarea>
          </div>

          <div ref="submitRef">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              :disabled="isSubmitting"
              class="booking-form__submit"
            >
              {{ isSubmitting ? 'Отправка...' : 'Отправить заявку' }}
            </Button>
          </div>

          <div v-if="isSuccess" class="booking-form__success">
            Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.
          </div>
        </form>
      </div>
    </Section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { useMagnetic } from '@shared/composables/useMagnetic'
import Button from '@shared/ui/Button.vue'
import Heading from '@shared/ui/Heading.vue'
import Section from '@shared/ui/Section.vue'

import { useBookingAnimation } from './composables/useBookingAnimation'
import { useBookingForm } from './composables/useBookingForm'

const { hideTitle } = defineProps({
  hideTitle: {
    type: Boolean,
    default: false
  }
})

const { form, errors, isSubmitting, isSuccess, submitForm: handleSubmit } = useBookingForm()

const sectionRef = ref(null)
const decorCreamRef = ref(null)
const submitRef = ref(null)

useBookingAnimation(sectionRef, decorCreamRef)
useMagnetic(submitRef)
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/features/_booking.scss
</style>
