import { reactive, ref } from 'vue'

export function useBookingForm() {
  const form = reactive({
    name: '',
    phone: '',
    message: ''
  })

  const errors = reactive({
    name: '',
    phone: ''
  })

  const isSubmitting = ref(false)
  const isSuccess = ref(false)

  const validate = () => {
    let isValid = true
    errors.name = ''
    errors.phone = ''

    if (!form.name.trim()) {
      errors.name = 'Пожалуйста, введите ваше имя'
      isValid = false
    }

    if (!form.phone.trim()) {
      errors.phone = 'Пожалуйста, введите номер телефона'
      isValid = false
    } else if (!/^\+?[0-9\s-()]{10,}$/.test(form.phone)) {
      errors.phone = 'Некорректный формат телефона'
      isValid = false
    }

    return isValid
  }

  const submitForm = async () => {
    if (!validate()) return

    isSubmitting.value = true

    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1500))

    isSubmitting.value = false
    isSuccess.value = true

    // Сброс формы
    form.name = ''
    form.phone = ''
    form.message = ''

    // Сброс статуса успеха через 5 секунд
    setTimeout(() => {
      isSuccess.value = false
    }, 5000)
  }

  return {
    form,
    errors,
    isSubmitting,
    isSuccess,
    submitForm
  }
}
