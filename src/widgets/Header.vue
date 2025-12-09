<template>
  <header class="header">
    <Container>
      <div class="header__content">
        <div class="header__logo">
          <Text variant="subtitle">Курс визажа</Text>
        </div>
      </div>
    </Container>
  </header>
</template>

<script setup>
import Container from '@shared/ui/Container.vue'
import Text from '@shared/ui/Text.vue'
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(26, 4, 6, 0.8);
  backdrop-filter: blur(10px);
  padding: $spacing-2 0;
}

.header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  color: $color-neutral-white;
}
</style>
