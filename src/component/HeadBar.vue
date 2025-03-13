<template>
  <div class="headbar">
    <div class="decoration left"></div>
    <h1 class="title">Mircrons Abnormal Data Check Box</h1>
    <div class="decoration right"></div>
  </div>
</template>

<script>
export default {
  name: 'HeadBar',
  props: {  /* 允许父组件传递标题内容（默认为“Mircrons Abnormal Data Check Box”）。 */
    title: {
      type: String,
      default: 'Mircrons Abnormal Data Check Box'
    }
  }
}
</script>

<style scoped>
.headbar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0e0e0e; /* 背景颜色 */
  color: #ffffff; /* 标题文字颜色 */
  padding: 10px 20px;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
}

.decoration {
  width: 60px;
  height: 2px;
  background-color: #4a90e2; /* 装饰条的颜色 */
}

.left {
  margin-right: 15px;
}

.right {
  margin-left: 15px;
}
</style>
