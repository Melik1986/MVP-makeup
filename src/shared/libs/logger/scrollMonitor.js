/* eslint-disable no-console */
/**
 * Мониторинг состояния ScrollTrigger'ов для диагностики конфликтов
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let monitorInterval = null
let isMonitoring = false

/**
 * Запускает мониторинг всех ScrollTrigger'ов
 * Логирует их состояние при каждом обновлении скролла
 */
export function startScrollTriggerMonitoring() {
  if (isMonitoring || typeof window === 'undefined') return

  isMonitoring = true
  console.group('[ScrollMonitor] Starting ScrollTrigger monitoring')

  // Отслеживаем все события ScrollTrigger
  ScrollTrigger.addEventListener('scrollStart', () => {
    console.log('[ScrollMonitor] 📜 Scroll started')
  })

  ScrollTrigger.addEventListener('scrollEnd', () => {
    console.log('[ScrollMonitor] 🏁 Scroll ended')
  })

  ScrollTrigger.addEventListener('refreshInit', () => {
    console.log('[ScrollMonitor] 🔄 Refresh init')
  })

  ScrollTrigger.addEventListener('refresh', () => {
    console.log('[ScrollMonitor] ✅ Refresh complete')
    logAllScrollTriggers()
  })

  // Логируем все триггеры при инициализации
  logAllScrollTriggers()

  // Периодически логируем состояние (только активные)
  monitorInterval = setInterval(() => {
    const activeTriggers = ScrollTrigger.getAll().filter(st => st.isActive)
    if (activeTriggers.length > 0) {
      console.log('[ScrollMonitor] Active triggers:', {
        count: activeTriggers.length,
        triggers: activeTriggers.map(st => ({
          id: st.id,
          trigger: st.trigger?.className || 'unknown',
          start: st.start,
          end: st.end,
          progress: Math.round(st.progress * 1000) / 1000,
          direction: st.direction
        })),
        scrollY: window.scrollY
      })
    }
  }, 1000) // Каждую секунду

  console.groupEnd()
}

/**
 * Останавливает мониторинг
 */
export function stopScrollTriggerMonitoring() {
  if (!isMonitoring) return

  isMonitoring = false
  if (monitorInterval) {
    clearInterval(monitorInterval)
    monitorInterval = null
  }
  console.log('[ScrollMonitor] Monitoring stopped')
}

/**
 * Логирует состояние всех ScrollTrigger'ов
 */
export function logAllScrollTriggers() {
  const allTriggers = ScrollTrigger.getAll()

  console.group('[ScrollMonitor] All ScrollTriggers state')
  console.log('Total triggers:', allTriggers.length)
  console.log('ScrollY:', window.scrollY)

  allTriggers.forEach(st => {
    const { trigger } = st
    console.group(`Trigger #${st.id}`)
    console.log('Element:', trigger?.className || trigger?.tagName || 'unknown')
    console.log('Start:', st.start)
    console.log('End:', st.end)
    console.log('Progress:', Math.round(st.progress * 1000) / 1000)
    console.log('Is Active:', st.isActive)
    console.log('Direction:', st.direction)
    console.log('Pin:', st.pin)
    if (st.pinSpacer) {
      console.log('Pin Spacer:', {
        height: st.pinSpacer.offsetHeight,
        className: st.pinSpacer.className
      })
    }
    console.groupEnd()
  })

  // Проверяем конфликты
  const conflicts = detectConflicts(allTriggers)
  if (conflicts.length > 0) {
    console.warn('[ScrollMonitor] ⚠️ Detected conflicts:', conflicts)
  }

  console.groupEnd()
}

/**
 * Обнаруживает конфликты между ScrollTrigger'ами
 * Конфликт = перекрывающиеся диапазоны start-end
 */
function detectConflicts(triggers) {
  const conflicts = []

  for (let i = 0; i < triggers.length; i++) {
    for (let j = i + 1; j < triggers.length; j++) {
      const a = triggers[i]
      const b = triggers[j]

      // Проверяем перекрытие диапазонов
      if ((a.start <= b.end && a.end >= b.start) || (b.start <= a.end && b.end >= a.start)) {
        conflicts.push({
          triggerA: {
            id: a.id,
            element: a.trigger?.className || 'unknown',
            start: a.start,
            end: a.end
          },
          triggerB: {
            id: b.id,
            element: b.trigger?.className || 'unknown',
            start: b.start,
            end: b.end
          },
          overlap: {
            start: Math.max(a.start, b.start),
            end: Math.min(a.end, b.end)
          }
        })
      }
    }
  }

  return conflicts
}
