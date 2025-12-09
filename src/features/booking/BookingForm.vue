<template>
  <div class="booking-form-wrapper">
    <Section v-if="!hideTitle" padding="lg" background="gray">
      <div class="booking-form">
        <Heading :level="2" variant="section"> Забронируйте место на курсе </Heading>
      </div>
    </Section>

    <Section :padding="hideTitle ? 'lg' : 'none'" :background="hideTitle ? 'gray' : 'transparent'">
      <div class="booking-form">
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
              placeholder="+7 (999) 999-99-99"
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

          <Button
            variant="primary"
            size="lg"
            type="submit"
            :disabled="isSubmitting"
            class="booking-form__submit"
          >
            {{ isSubmitting ? 'Отправка...' : 'Отправить заявку' }}
          </Button>

          <div v-if="isSuccess" class="booking-form__success">
            Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.
          </div>
        </form>
      </div>
    </Section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

import Button from '@shared/ui/Button.vue'
import Heading from '@shared/ui/Heading.vue'
import Section from '@shared/ui/Section.vue'

const { hideTitle } = defineProps({
  hideTitle: {
    type: Boolean,
    default: false
  }
})

const form = reactive({
  name: '',
  phone: '',
  email: '',
  comment: ''
})

const errors = reactive({
  name: '',
  phone: '',
  email: ''
})

const isSubmitting = ref(false)
const isSuccess = ref(false)

const validateForm = () => {
  let isValid = true

  errors.name = ''
  errors.phone = ''
  errors.email = ''

  if (!form.name.trim()) {
    errors.name = 'Имя обязательно для заполнения'
    isValid = false
  }

  if (!form.phone.trim()) {
    errors.phone = 'Телефон обязателен для заполнения'
    isValid = false
  } else if (!/^\+?[0-9]{10,15}$/.test(form.phone.replace(/\s|-|\(|\)/g, ''))) {
    errors.phone = 'Введите корректный номер телефона'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email обязателен для заполнения'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный email'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    isSuccess.value = true

    form.name = ''
    form.phone = ''
    form.email = ''
    form.comment = ''

    setTimeout(() => {
      isSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.booking-form-wrapper {
  width: 100%;
}

.booking-form {
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: $breakpoint-md) {
    max-width: 100%;
    padding: 0 $spacing-2;
  }
}

.booking-form__form {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  margin-top: $spacing-6;
}

.booking-form__field {
  display: flex;
  flex-direction: column;
  gap: $spacing-1;
}

.booking-form__label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-neutral-gray-800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.booking-form__input,
.booking-form__textarea {
  width: 100%;
  padding: $spacing-2 $spacing-3;
  font-size: $font-size-base;
  font-family: $font-family-primary;
  color: $color-neutral-gray-800;
  background-color: $color-neutral-white;
  border: 2px solid $color-neutral-gray-200;
  border-radius: $border-radius-md;
  transition: $transition-default;

  &:focus {
    outline: none;
    border-color: $color-primary-500;
  }

  &::placeholder {
    color: $color-neutral-gray-200;
  }
}

.booking-form__input--error {
  border-color: $color-semantic-error;
}

.booking-form__textarea {
  resize: vertical;
  min-height: 100px;
}

.booking-form__error {
  font-size: $font-size-sm;
  color: $color-semantic-error;
}

.booking-form__submit {
  margin-top: $spacing-2;
  align-self: center;
}

.booking-form__success {
  padding: $spacing-3;
  background-color: rgba($color-semantic-success, 0.1);
  border: 2px solid $color-semantic-success;
  border-radius: $border-radius-md;
  color: $color-semantic-success;
  text-align: center;
  font-size: $font-size-sm;
}
</style>
