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
  })

  onUnmounted(() => {
    logger.info('Cleaning up ScrollCoordinator')
    coordinator.cleanup()
  })

  return coordinator
}
