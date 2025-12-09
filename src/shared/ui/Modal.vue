<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal" @click.self="handleClose">
        <div class="modal__overlay"></div>
        <div class="modal__content">
          <button class="modal__close" aria-label="Закрыть" @click="handleClose">×</button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const handleEscape = event => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

watch(
  () => props.isOpen,
  newValue => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-4;
}

.modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.modal__content {
  position: relative;
  z-index: 1;
  background: $color-neutral-white;
  border-radius: $border-radius-lg;
  padding: $spacing-6;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: $shadow-floating-object;
}

.modal__close {
  position: absolute;
  top: $spacing-2;
  right: $spacing-2;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  line-height: 1;
  color: $color-neutral-gray-800;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: $transition-default;

  &:hover {
    color: $color-primary-500;
    transform: scale(1.1);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal__content,
.modal-leave-active .modal__content {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__content,
.modal-leave-to .modal__content {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}
</style>
