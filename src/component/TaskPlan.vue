<template>
  <div class="scatter-plot-page">
    <!-- 标题 -->
    <h3 class="page-title">Cell 3D Soma Distribution Plot Viewer</h3>

    <!-- 顶部按钮组 -->
    <div class="button-group">
      <button
          v-for="(type, index) in dataTypes"
          :key="index"
          :class="['data-button', { active: selectedType === type }]"
          @click="selectDataType(type)"
      >
        {{ type.label }}
      </button>
    </div>

    <div class="main-content">
      <!-- 中间图表显示区域 -->
      <div class="iframe-container">
        <iframe
            :src="computedSrc"
            width="100%"
            height="1500px"
            style="border: none;"
        ></iframe>
      </div>

      <!-- 右侧边栏（使用说明） -->
      <div class="instruction_sidebar" @mouseenter="expandSidebar" @mouseleave="collapseSidebar">
        <div class="sidebar-content">
          <h4>使用说明</h4>
          <ul>
            <li>点击图例中的某个标签，可以切换是否显示该标签的数据点。</li>
            <li>双击图例中的某个标签，只显示该标签的数据点并隐藏其他标签的数据点。</li>
            <li>再次双击该标签，恢复显示所有数据点。</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 右侧图片预览框 -->
    <div class="image-preview">
      <h4>单个标签的距离分布</h4>
      <div v-if="selectedImage">
        <img
            :src="selectedImage"
            alt="Selected Preview"
            class="preview-image"
            @click="openModal"
        />
      </div>
      <div v-else>
        <p>请选择图例或标签显示图片。</p>
      </div>
    </div>


    <!-- 模态框 -->
    <div
        v-if="isModalVisible"
        class="modal"
        @click.self="closeModal"
    >
      <img
          :src="selectedImage"
          alt="Large Preview"
          class="modal-image"
          :style="{ transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)` }"
          @wheel="zoomImage"
          @mousedown="startDragging"
      />
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      selectedType: null, // 当前选中的数据类型
      selectedImage: null,
      isModalVisible: false,
      scale: 1, // 图片缩放比例
      translateX: 0, // 图片水平位移
      translateY: 0, // 图片垂直位移
      isDragging: false, // 是否正在拖动
      startX: 0, // 拖动开始的鼠标 X 坐标
      startY: 0, // 拖动开始的鼠标 Y 坐标
      sidebarExpanded: false,
      dataTypes: [
        {
          label: "Exc/Inh Plot",
          fileName: "3d_scatter_plot_exc_inh.html",
          image: "Single_label_in_exc_inh.png",
        },
        {
          label: "Cell Type 1 Plot",
          fileName: "3d_scatter_plot_cell_type_1.html",
          image: "Single_label_in_cell_type_1.png",
        },
        {
          label: "Cell Type 2 Plot",
          fileName: "3d_scatter_plot_cell_type_2.html",
          image: "Single_label_in_cell_type_2.png",
        },
      ],
    };
  },
  methods: {
    openModal() {
      this.isModalVisible = true; // 打开模态框
    },
    closeModal() {
      this.isModalVisible = false; // 关闭模态框
      this.resetZoom(); // 重置缩放和位移
    },
    zoomImage(event) {
      const zoomFactor = 0.1;
      const scaleChange = event.deltaY < 0 ? zoomFactor : -zoomFactor;

      this.scale = Math.min(Math.max(this.scale + scaleChange, 1), 3);

      // Adjust image position to keep it centered
      const rect = this.$refs.modalImage.getBoundingClientRect();
      this.translateX -= (event.clientX - rect.left) * scaleChange;
      this.translateY -= (event.clientY - rect.top) * scaleChange;
    },
    startDragging(event) {
      this.isDragging = true;
      this.startX = event.clientX; // 鼠标初始 X 坐标
      this.startY = event.clientY; // 鼠标初始 Y 坐标
      window.addEventListener("mousemove", this.dragImage);
      window.addEventListener("mouseup", this.stopDragging);
    },
    dragImage(event) {
      if (!this.isDragging) return;
      // 更新图片位移
      this.translateX += event.clientX - this.startX;
      this.translateY += event.clientY - this.startY;
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    stopDragging() {
      this.isDragging = false;
      window.removeEventListener("mousemove", this.dragImage);
      window.removeEventListener("mouseup", this.stopDragging);
    },
    resetZoom() {
      // 重置缩放和位移
      this.scale = 1;
      this.translateX = 0;
      this.translateY = 0;
    },
    selectDataType(type) {
      this.selectedType = type;
      this.selectedImage = type.image;
    },
    expandSidebar() {
      console.log('Expanding sidebar...');
      this.sidebarExpanded = true;
    },
    collapseSidebar() {
      console.log('Collapsing sidebar...');
      this.sidebarExpanded = false;
    },
  },
  computed: {
    // 根据选中的类型动态计算 iframe 的 src
    computedSrc() {
      return this.selectedType
          ? `/${this.selectedType.fileName}` // 使用模板字符串动态生成路径
          : "/3d_scatter_plot_exc_inh.html"; // 默认路径
    },
  },

  mounted() {
    // 默认选中第一个类型
    this.selectDataType(this.dataTypes[0]);
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .main-content {
    grid-template-rows: 1fr; /* grid-template-columns单列布局 */
    gap: 10px;
  }

  .iframe-container {
    height: 500px; /* 限制图表高度 */
  }
}


/* 使用说明 */
.instruction_sidebar {
  position: fixed;
  top: 50%; /* 初始位置在页面中间 */
  right: 0;
  width: 40px; /* 初始状态下侧边栏宽度为0 */
  height: 90px; /* 初始高度很小，仅显示标题 */
  background-color: #333;
  color: white;
  overflow: hidden;
  transition: width 0.3s ease-in-out, height 0.3s ease-in-out; /* 设置过渡效果 */
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px 0 0 5px;
}

.sidebar-content {
  padding: 10px;
  opacity: 5%; /* 初始时内容不可见 */
  transition: opacity 0.3s ease; /* 设置内容淡入效果 */
}

.instruction_sidebar:hover {
  width: 10%; /* 鼠标悬停时侧边栏展开 */
  height: 300px; /* 展开时高度变大，显示完整内容 */
}

.instruction_sidebar:hover .sidebar-content {
  opacity: 1; /* 鼠标悬停时内容显示 */
}

.sidebar-content ul {
  margin: 10px 0;
}

.sidebar-content ul li {
  font-size: 14px;
  margin-bottom: 8px;
}

.sidebar-content h4 {
  font-size: 18px;
  margin-bottom: 10px;
}

/* 模态框样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: zoom-out; /* 鼠标指针显示为缩小状态 */
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

/* 预览图片样式 */
.preview-image {
  max-width: 100%;
  max-height: 100%;
  cursor: zoom-in; /* 鼠标指针显示为放大状态 */
}

.scatter-plot-page {
  font-family: Arial, sans-serif;
  width: 100%; /* 设置容器宽度为父容器的90% */
  max-width: none; /*1200px; 限制最大宽度 */
  height: auto; /* 自动根据内容调整高度 */
  min-height: 800px; /* 设置最小高度 */
  margin: 0 auto; /* 居中显示 */
  padding: 20px;
  //background-color: #f8f9fa;
}

.page-title {
  text-align: center;
  font-size: 34px;
  margin-bottom: 20px;
  color: #ffffff;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.data-button {
  padding: 10px 20px;
  border: 1px solid #007bff;
  background-color: #ffffff;
  color: #007bff;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.data-button:hover {
  background-color: #007bff;
  color: #ffffff;
}

.data-button.active {
  background-color: #007bff;
  color: #ffffff;
}

.main-content {
  display: grid;
  //grid-template-columns: 2fr 1fr; /* 中间区域占2/3，右侧占1/3 */
  grid-template-rows: auto 1fr; /* 垂直方向上排列 */
  gap: 10px; /* 列之间的间距 */
  width: 100%;
  height: 1000px;/*auto;*/
  padding: 0;
  margin: 0 auto;
  box-sizing: border-box;
}

.iframe-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 0 auto;/* 居中对齐 */
}

.instructions-text {
  margin-top: 20px; /* 与上方图表分隔 */
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.instructions-text h4 {
  font-size: 18px;
  margin-bottom: 10px;
  text-align: center;
}

.instructions-text ul {
  margin: 0;
  padding: 0 10px;
  list-style-type: disc;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: auto;
  width: 1800px;
  overflow: hidden;
  margin: 0 auto;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
  cursor: zoom-in;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: grab;
}

.modal-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease; /* 平滑缩放和拖动 */
}

.modal-image:active {
  cursor: grabbing;
}

</style>
