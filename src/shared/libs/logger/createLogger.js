/* eslint-disable no-console */
/**
 * Создает умный переиспользуемый логгер для отладки
 *
 * @param {string} context - Контекст логирования (имя модуля/компонента)
 * @param {object} options - Опции конфигурации
 * @param {boolean} options.enabled - Включен ли логгер (по умолчанию в dev режиме)
 * @param {string} options.level - Минимальный уровень логирования ('debug' | 'info' | 'warn' | 'error')
 * @returns {object} Объект с методами логирования
 */
export function createLogger(context, options = {}) {
  const { enabled = import.meta.env.DEV, level = 'debug' } = options

  // Уровни логирования с приоритетами
  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  }

  const minLevel = levels[level] || 0

  // Форматирование сообщения
  const formatMessage = (logLevel, message, data = null) => {
    const timestamp = new Date().toISOString()
    const prefix = `[${logLevel.toUpperCase()}] [${timestamp}] [${context}]`

    if (data !== null && data !== undefined) {
      return [prefix, message, data]
    }
    return [`${prefix} ${message}`]
  }

  // Проверка уровня логирования
  const shouldLog = logLevel => {
    if (!enabled) return false
    return levels[logLevel] >= minLevel
  }

  return {
    /**
     * Логирует debug сообщение
     * @param {string} message - Текст сообщения
     * @param {any} data - Дополнительные данные для логирования
     */
    debug(message, data = null) {
      if (shouldLog('debug')) {
        console.debug(...formatMessage('debug', message, data))
      }
    },

    /**
     * Логирует info сообщение
     * @param {string} message - Текст сообщения
     * @param {any} data - Дополнительные данные для логирования
     */
    info(message, data = null) {
      if (shouldLog('info')) {
        console.info(...formatMessage('info', message, data))
      }
    },

    /**
     * Логирует warning сообщение
     * @param {string} message - Текст сообщения
     * @param {any} data - Дополнительные данные для логирования
     */
    warn(message, data = null) {
      if (shouldLog('warn')) {
        console.warn(...formatMessage('warn', message, data))
      }
    },

    /**
     * Логирует error сообщение
     * @param {string} message - Текст сообщения
     * @param {Error|any} error - Ошибка или дополнительные данные
     */
    error(message, error = null) {
      if (shouldLog('error')) {
        console.error(...formatMessage('error', message, error))
      }
    },

    /**
     * Группирует логи для лучшей читаемости
     * @param {string} label - Название группы
     * @param {function} fn - Функция, логи которой нужно сгруппировать
     */
    group(label, fn) {
      if (!enabled) {
        if (fn) fn()
        return
      }
      console.group(`[${context}] ${label}`)
      try {
        if (fn) fn()
      } finally {
        console.groupEnd()
      }
    },

    /**
     * Логирует время выполнения операции
     * @param {string} label - Название операции
     * @returns {function} Функция для остановки таймера
     */
    time(label) {
      if (!enabled) return () => {}
      const fullLabel = `[${context}] ${label}`
      console.time(fullLabel)
      return () => {
        console.timeEnd(fullLabel)
      }
    }
  }
}

/**
 * Создает логгер с предустановленными опциями
 * @param {string} context - Контекст логирования
 * @returns {object} Объект с методами логирования
 */
export function useLogger(context) {
  return createLogger(context)
}
