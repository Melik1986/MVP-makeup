<template>
  <button :class="buttonClass" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = event => {
  emit('click', event)
}

const buttonClass = computed(() => ({
  [`button--${props.variant}`]: true,
  [`button--${props.size}`]: true,
  'button--disabled': props.disabled
}))
</script>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: $font-family-primary;
  font-weight: $font-weight-bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  cursor: pointer;
  transition: $transition-default;
  text-align: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.button--primary {
  background: $gradient-button-primary;
  color: $color-neutral-white;
  border-radius: $border-radius-full;
  box-shadow: $shadow-button-glow;

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #e06b71 0%, #b0222b 100%);
    transform: translateY(-2px);
    box-shadow: 0px 15px 25px rgba(166, 28, 38, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0px 5px 10px rgba(166, 28, 38, 0.3);
  }
}

.button--secondary {
  background: transparent;
  color: $color-neutral-white;
  border: 2px solid $color-neutral-white;
  border-radius: $border-radius-full;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }
}

.button--outline {
  background: transparent;
  color: $color-primary-500;
  border: 2px solid $color-primary-500;
  border-radius: $border-radius-full;

  &:hover:not(:disabled) {
    background: $color-primary-500;
    color: $color-neutral-white;
  }
}

.button--sm {
  padding: 12px 24px;
  font-size: $font-size-sm;

  @media (max-width: $breakpoint-md) {
    padding: 10px 20px;
    font-size: $font-size-xs;
  }
}

.button--md {
  padding: 18px 48px;
  font-size: $font-size-sm;

  @media (max-width: $breakpoint-md) {
    padding: 14px 32px;
    font-size: $font-size-xs;
  }
}

.button--lg {
  padding: 24px 64px;
  font-size: $font-size-lg;

  @media (max-width: $breakpoint-md) {
    padding: 18px 40px;
    font-size: $font-size-base;
  }

  @media (max-width: $breakpoint-sm) {
    padding: 16px 32px;
    font-size: $font-size-sm;
    width: 100%;
  }
}
</style>
