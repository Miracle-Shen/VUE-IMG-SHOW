<template>
  <nav class="sidebar">
    <ul>
      <li :class="{ active: currentTab === 'Data List' }" @click="selectTab('ImageUploader')">MIP Data Checker</li>
      <li :class="{ active: currentTab === 'Original Files' }" @click="selectTab('OriginalFiles')">Single Neuron Checker</li>
      <li :class="{ active: currentTab === 'Analysis' }" @click="selectTab('Analysis')">Neuron Analysis</li>
<!--      <li :class="{ active: currentTab === 'File' }" @click="selectTab('File')">Files</li>-->
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'HeadSideBar',
  props: {
    currentTab: String, // 从父组件接收当前的激活 Tab
  },
  methods: {
    selectTab(tab) {
      this.$emit('tab-selected', tab); // 向父组件发出选中的 Tab 名称
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: flex;
  justify-content: center; /* 居中对齐 */
  padding: 10px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ccc;
}

.sidebar ul {
  display: flex; /* 水平排列列表项 */
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 10px 20px;
  cursor: pointer;
  color: #333;
  font-weight: bold;
  border-bottom: 2px solid transparent;
  margin: 0 10px; /* 增加选项之间的间距 */
}

.sidebar li:hover {
  background-color: #f1f1f1;
}

.sidebar li.active {
  border-bottom: 2px solid #4a90e2;
  color: #4a90e2;
}
</style>
