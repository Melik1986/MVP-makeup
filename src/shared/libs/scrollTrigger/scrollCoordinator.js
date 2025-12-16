import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useLogger } from '@shared/libs/logger'

gsap.registerPlugin(ScrollTrigger)

const logger = useLogger('ScrollCoordinator')

/**
 * Создает единый координатор-дирижер для управления ScrollTrigger'ами
 * Координатор управляет только бесшовными переходами между секциями,
 * каждая секция отвечает за свои внутренние анимации
 */
export function createScrollCoordinator() {
  let heroScrollTrigger = null
  let coursesScrollTrigger = null
  let aboutSection = null
  let aboutTransitionConfig = null
  let isAboutVisible = false
  let aboutOnShowCallback = null // Callback вызывается когда About становится видимой
  let aboutOnHideCallback = null // Callback вызывается когда About скрывается
  let scrollUpdateHandler = null // Глобальный обработчик обновлений ScrollTrigger

  /**
   * Регистрирует Hero ScrollTrigger
   * @param {gsap.core.Timeline} timeline - Hero timeline с ScrollTrigger
   */
  const registerHeroTrigger = timeline => {
    if (!timeline || !timeline.scrollTrigger) {
      logger.error('Hero timeline must have ScrollTrigger', {
        hasTimeline: !!timeline,
        hasScrollTrigger: !!timeline?.scrollTrigger
      })
      return
    }

    heroScrollTrigger = timeline.scrollTrigger

    // Если progress = 1 при scrollY = 0, это означает что ScrollTrigger еще не обновился
    // Выполняем refresh перед чтением progress
    if (typeof window !== 'undefined' && window.scrollY === 0 && heroScrollTrigger.progress === 1) {
      heroScrollTrigger.refresh()
    }

    const currentProgress = heroScrollTrigger.progress

    // Убеждаемся что hero trigger имеет правильные настройки
    if (!heroScrollTrigger.vars.id) {
      logger.warn('Hero ScrollTrigger should have id: "hero-transition"')
    }

    if (!heroScrollTrigger.vars.refreshPriority) {
      logger.warn('Hero ScrollTrigger should have refreshPriority: 2')
    }

    // Сохраняем ссылку на hero trigger для использования
    // Координатор будет вызывать handleAboutVisibility через публичный метод updateAboutVisibility
    // который будет вызываться из onUpdate callback hero ScrollTrigger (передается при создании)

    // Синхронизируем начальное состояние при регистрации
    if (aboutTransitionConfig && aboutSection) {
      handleAboutVisibility(currentProgress)
    }

    logger.info('Hero ScrollTrigger registered', {
      id: heroScrollTrigger.vars.id,
      refreshPriority: heroScrollTrigger.vars.refreshPriority
    })
  }

  /**
   * Регистрирует Courses ScrollTrigger
   * @param {gsap.core.ScrollTrigger} scrollTrigger - Courses ScrollTrigger instance
   */
  const registerCoursesTrigger = scrollTrigger => {
    if (!scrollTrigger) {
      logger.error('Courses ScrollTrigger is required')
      return
    }

    coursesScrollTrigger = scrollTrigger

    logger.info('Courses ScrollTrigger registered', {
      id: coursesScrollTrigger.vars.id
    })
  }

  /**
   * Регистрирует callbacks About для реакции на изменения видимости
   * About сам управляет своими внутренними анимациями, координатор только управляет видимостью
   * @param {Object} callbacks - Объект с callback функциями
   * @param {Function} callbacks.onShow - Вызывается когда About становится видимой
   * @param {Function} callbacks.onHide - Вызывается когда About скрывается
   */
  const registerAboutCallbacks = callbacks => {
    if (callbacks) {
      if (typeof callbacks.onShow === 'function') {
        aboutOnShowCallback = callbacks.onShow
      }
      if (typeof callbacks.onHide === 'function') {
        aboutOnHideCallback = callbacks.onHide
      }
    }
  }

  /**
   * Настраивает управление About переходом
   * Координатор управляет visibility (autoAlpha) и запускает внутренние анимации
   * @param {Object} config - Конфигурация перехода
   * @param {number} config.showAtProgress - Прогресс hero timeline когда показывать About (0-1)
   * @param {number} config.hideAtProgress - Прогресс hero timeline когда скрывать About (0-1)
   * @param {HTMLElement} config.aboutSection - Элемент About секции
   */
  const scheduleAboutTransition = config => {
    if (!config || !config.aboutSection) {
      logger.error('About section element is required')
      return
    }

    const {
      aboutSection: aboutSectionElement,
      showAtProgress = 0.6,
      hideAtProgress = 0.98
    } = config
    aboutSection = aboutSectionElement
    aboutTransitionConfig = {
      showAtProgress,
      hideAtProgress
    }

    // КООРДИНАТОР - ЕДИНСТВЕННЫЙ ИСТОЧНИК ПРАВДЫ для управления visibility About
    // НЕ устанавливаем начальное состояние здесь - оно будет установлено handleAboutVisibility
    // на основе текущего прогресса hero timeline (если он уже зарегистрирован)

    // Если hero trigger уже зарегистрирован, синхронизируем состояние сразу
    // Используем requestAnimationFrame чтобы убедиться что все инициализировано
    if (heroScrollTrigger) {
      requestAnimationFrame(() => {
        if (aboutSection && aboutTransitionConfig && heroScrollTrigger) {
          handleAboutVisibility(heroScrollTrigger.progress)
        }
      })
    } else {
      // Если hero trigger еще не зарегистрирован, устанавливаем начальное скрытое состояние
      // Оно будет переопределено когда hero trigger зарегистрируется
      gsap.set(aboutSection, { autoAlpha: 0 })
      isAboutVisible = false
    }
  }

  /**
   * Управляет видимостью About на основе прогресса hero timeline
   * КООРДИНАТОР - ЕДИНСТВЕННЫЙ ИСТОЧНИК ПРАВДЫ для управления visibility About
   * @param {number} progress - Прогресс hero timeline (0-1)
   */
  const handleAboutVisibility = progress => {
    if (!aboutSection || !aboutTransitionConfig) {
      logger.warn('handleAboutVisibility called but config not ready', {
        hasAboutSection: !!aboutSection,
        hasConfig: !!aboutTransitionConfig
      })
      return
    }

    const { showAtProgress, hideAtProgress } = aboutTransitionConfig

    // Показываем About (координатор - единственное место управления видимостью)
    // About сам управляет своими внутренними анимациями через callbacks
    if (progress >= showAtProgress && progress < hideAtProgress) {
      if (!isAboutVisible) {
        logger.info('Showing About', { progress, showAtProgress, hideAtProgress })
        gsap.set(aboutSection, { autoAlpha: 1 })
        isAboutVisible = true
        // Уведомляем About что он стал видимым - About сам запустит свои анимации
        if (aboutOnShowCallback && typeof aboutOnShowCallback === 'function') {
          aboutOnShowCallback()
        }
        logger.info('✅ About shown by coordinator', { progress })
      } else {
        // Если уже видима, убеждаемся что она остается видимой
        // (защита от конфликтов с другими частями кода)
        gsap.set(aboutSection, { autoAlpha: 1 })
      }
    }
    // Скрываем About для бесшовного перехода (координатор управляет видимостью)
    // About сам управляет остановкой своих анимаций через callbacks
    else {
      if (isAboutVisible) {
        // Уведомляем About что он скрывается
        if (aboutOnHideCallback && typeof aboutOnHideCallback === 'function') {
          aboutOnHideCallback()
        }
        gsap.to(aboutSection, {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            isAboutVisible = false
          }
        })
      } else {
        // Если About уже скрыта, убеждаемся что она останется скрытой
        gsap.set(aboutSection, { autoAlpha: 0 })
        isAboutVisible = false
      }
    }
  }

  /**
   * Синхронизирует все ScrollTrigger'ы
   * Вызывает refresh для всех триггеров в правильном порядке
   */
  const synchronize = () => {
    // Hero должен refresh первым (refreshPriority: 2)
    if (heroScrollTrigger) {
      heroScrollTrigger.refresh()
    }

    // Courses refresh после hero (refreshPriority: 1)
    if (coursesScrollTrigger && heroScrollTrigger) {
      coursesScrollTrigger.refresh()
    }

    // Финальный refresh всех триггеров
    ScrollTrigger.refresh()
  }

  /**
   * Получает hero ScrollTrigger для использования в других composables
   * @returns {gsap.core.ScrollTrigger|null}
   */
  const getHeroTrigger = () => heroScrollTrigger || ScrollTrigger.getById('hero-transition')

  /**
   * Обновляет видимость About на основе текущего прогресса hero timeline
   * Вызывается из onUpdate callback hero ScrollTrigger
   */
  const updateAboutVisibility = () => {
    // Используем зарегистрированный триггер или ищем по ID как fallback
    // Это позволяет работать даже если registerHeroTrigger еще не вызван
    const trigger = heroScrollTrigger || ScrollTrigger.getById('hero-transition')

    if (!trigger) {
      // Триггер еще не создан - это нормально при инициализации
      return
    }

    if (!aboutTransitionConfig || !aboutSection) {
      logger.warn('updateAboutVisibility: config not ready', {
        hasConfig: !!aboutTransitionConfig,
        hasSection: !!aboutSection
      })
      return
    }

    handleAboutVisibility(trigger.progress)
  }

  /**
   * Очищает все ресурсы
   */
  const cleanup = () => {
    // Удаляем глобальный обработчик
    if (scrollUpdateHandler) {
      ScrollTrigger.removeEventListener('update', scrollUpdateHandler)
      scrollUpdateHandler = null
    }

    // Координатор больше не управляет About - просто очищаем ссылки
    // About будет управляться своим composable или останется в текущем состоянии

    heroScrollTrigger = null
    coursesScrollTrigger = null
    aboutSection = null
    aboutTransitionConfig = null
    isAboutVisible = false
    aboutOnShowCallback = null
    aboutOnHideCallback = null
    scrollUpdateHandler = null
  }

  return {
    registerHeroTrigger,
    registerCoursesTrigger,
    registerAboutCallbacks,
    scheduleAboutTransition,
    synchronize,
    getHeroTrigger,
    updateAboutVisibility,
    cleanup
  }
}
