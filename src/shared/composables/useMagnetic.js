import { gsap } from 'gsap'
import { onMounted, onUnmounted } from 'vue'

/**
 * Применяет магнитный эффект к переданному элементу или массиву элементов
 * @param {import('vue').Ref|HTMLElement|HTMLElement[]} target - Элемент(ы) для эффекта
 * @param {Object} options - Настройки силы и плавности
 */
export function useMagnetic(target, options = {}) {
  const {
    strength = 0.3,
    durationIn = 0.4,
    durationOut = 0.6,
    easeIn = 'power2.out',
    easeOut = 'elastic.out(1, 0.3)'
  } = options

  const applyEffect = el => {
    if (!el) return

    // Если элемент - компонент Vue (например, Button), берем его корневой DOM-элемент
    const targetEl = el.$el || el

    const onMouseMove = e => {
      const rect = targetEl.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(targetEl, {
        x: x * strength,
        y: y * strength,
        duration: durationIn,
        ease: easeIn
      })
    }

    const onMouseLeave = () => {
      gsap.to(targetEl, {
        x: 0,
        y: 0,
        duration: durationOut,
        ease: easeOut
      })
    }

    targetEl.addEventListener('mousemove', onMouseMove)
    targetEl.addEventListener('mouseleave', onMouseLeave)

    return () => {
      targetEl.removeEventListener('mousemove', onMouseMove)
      targetEl.removeEventListener('mouseleave', onMouseLeave)
    }
  }

  const cleanups = []

  onMounted(() => {
    const rawValue = target.value || target
    const elements = Array.isArray(rawValue) ? rawValue : [rawValue]

    elements.forEach(el => {
      // Если это контейнер, ищем кнопки внутри
      if (el instanceof HTMLElement && !el.matches('button, .button')) {
        const buttons = el.querySelectorAll('button, .button')
        if (buttons.length > 0) {
          buttons.forEach(btn => {
            const cleanup = applyEffect(btn)
            if (cleanup) cleanups.push(cleanup)
          })
          return
        }
      }

      const cleanup = applyEffect(el)
      if (cleanup) cleanups.push(cleanup)
    })
  })

  onUnmounted(() => {
    cleanups.forEach(cleanup => cleanup())
  })
}
