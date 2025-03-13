<!-- src/components/Background.vue -->
<template>
  <div class="background">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Background',
};
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #2d4e67, #314b54); /* 上下渐变 */
  color: #ffffff;
  overflow: hidden;
  z-index: -1; /* 放在最底层 */
}
</style>
