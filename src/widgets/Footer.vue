<template>
  <footer class="footer">
    <Container>
      <div class="footer__content">
        <Text variant="small" class="footer__copyright">
          © 2024 Курс визажа Ольги Павилиной. Все права защищены.
        </Text>
      </div>
    </Container>
  </footer>
</template>

<script setup>
import Container from '@shared/ui/Container.vue'
import Text from '@shared/ui/Text.vue'
</script>

<style scoped lang="scss">
.footer {
  background-color: $color-neutral-gray-800;
  padding: $spacing-4 0;
  margin-top: $spacing-section;
}

.footer__content {
  text-align: center;
}

.footer__copyright {
  color: $color-neutral-white;
  opacity: 0.8;
}
</style>
