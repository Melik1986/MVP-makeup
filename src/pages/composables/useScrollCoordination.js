import { onMounted, onUnmounted } from 'vue'

import { useLogger } from '@shared/libs/logger'
import { createScrollCoordinator } from '@shared/libs/scrollTrigger'

const logger = useLogger('useScrollCoordination')

/**
 * Composable для инициализации единого координатора ScrollTrigger'ов
 * Координатор управляет бесшовными переходами между секциями
 */
export function useScrollCoordination() {
  const coordinator = createScrollCoordinator()

  onMounted(() => {
    logger.info('Initializing ScrollCoordinator')

    // Координатор будет использоваться через методы:
    // - coordinator.registerHeroTrigger(timeline)
    // - coordinator.registerCoursesTrigger(scrollTrigger)
    // - coordinator.scheduleAboutTransition(config)
    // - coordinator.synchronize()
    //
    // Эти методы будут вызваны из соответствующих composables:
    // - useHeroAnimation вернет timeline который нужно зарегистрировать
    // - useCoursesAnimation зарегистрирует свой ScrollTrigger
    // - useAboutAnimation или AboutSection настроит About transition

    // Координатор готов к использованию
    // Регистрация триггеров будет происходить после их создания
  })

  onUnmounted(() => {
    logger.info('Cleaning up ScrollCoordinator')
    coordinator.cleanup()
  })

  // Экспортируем координатор для использования в других composables
  return coordinator
}
