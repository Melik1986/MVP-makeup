import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useLogger } from '@shared/libs/logger'

gsap.registerPlugin(ScrollTrigger)

const logger = useLogger('ScrollCoordinator')

/**
 * Создает единый координатор-дирижер для управления Master Timeline.
 * Координатор теперь управляет единым ScrollTrigger для всей страницы.
 */
export function createScrollCoordinator() {
  let masterTimeline = null
  let masterScrollTrigger = null

  /**
   * Инициализирует единый Master Timeline
   * @param {HTMLElement} triggerElement - Элемент, запускающий скролл (обычно обертка страницы)
   * @param {Object} options - Настройки ScrollTrigger
   */
  const initMasterTimeline = (triggerElement, options = {}) => {
    if (masterTimeline) {
      masterTimeline.kill()
    }
    if (masterScrollTrigger) {
      masterScrollTrigger.kill()
    }

    const {
      start = 'top top',
      end = '+=8000', // Общая длина "полотна" в пикселях
      pin = true,
      scrub = 1.5, // Сделаем скролл более "тягучим" для премиальности
      ...rest
    } = options

    masterTimeline = gsap.timeline()

    masterScrollTrigger = ScrollTrigger.create({
      animation: masterTimeline,
      trigger: triggerElement,
      start,
      end,
      pin,
      scrub,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      ...rest
    })

    logger.info('Master Timeline initialized', { end })
    return masterTimeline
  }

  /**
   * Добавляет таймлайн секции в общий поток
   * @param {string} label - Метка для позиции
   * @param {gsap.core.Timeline} timeline - Таймлайн секции
   * @param {string|number} position - Позиция в мастер-таймлайне (label или время)
   */
  const injectTimeline = (label, timeline, position) => {
    if (!masterTimeline) {
      logger.error('Master Timeline not initialized. Call initMasterTimeline first.')
      return
    }
    if (label) masterTimeline.addLabel(label, position)
    if (timeline) masterTimeline.add(timeline, label || position)
  }

  const synchronize = () => {
    if (masterScrollTrigger) masterScrollTrigger.refresh()
    ScrollTrigger.refresh()
  }

  const cleanup = () => {
    if (masterTimeline) masterTimeline.kill()
    if (masterScrollTrigger) masterScrollTrigger.kill()
    masterTimeline = null
    masterScrollTrigger = null
  }

  return {
    initMasterTimeline,
    injectTimeline,
    synchronize,
    cleanup,
    getMasterTimeline: () => masterTimeline
  }
}
