<template>
  <div class="scatter-plot-page">
    <!-- Tab按钮 -->
    <div class="tab-buttons">
      <button
          :class="{ active: activeTab === 'tab1' }"
          @click="activeTab = 'tab1'"
      >
        Soma Distribution
      </button>
      <button
          :class="{ active: activeTab === 'tab2' }"
          @click="activeTab = 'tab2'"
      >
        UMAP Features
      </button>
    </div>

    <!-- Tab1内容 -->
    <div v-if="activeTab === 'tab1'">
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
        <div v-if="selectedImage">
          <div class="image-container">
            <button
                class="prev-button"
                :disabled="activeTab === 'tab1' ? !hasPreviousImage : !tab2_hasPreviousImage"
                @click="showPreviousImage"
            >
              ◀
            </button>
            <img
                ref="modalImage"
                :src="activeTab === 'tab1' ? selectedImage : tab2_selectedImage"
                alt="Selected Preview"
                class="preview-image"
                @click="openModal"
            />
            <button
                class="next-button"
                :disabled="(activeTab === 'tab1' ? !hasNextImage : !tab2_hasNextImage)"
                @click="showNextImage"
            >
              ▶
            </button>
          </div>
        </div>
        <div v-else>
          <p>请选择图例或标签显示图片。</p>
        </div>
      </div>

      <div
          v-if="isModalVisible"
          class="modal"
          @click.self="closeModal"
      >
        <img
            :src="activeTab === 'tab1' ? selectedImage : tab2_selectedImage"
        alt="Large Preview"
        class="modal-image"
        :style="{ transform: `scale(${activeTab === 'tab1' ? scale : tab2_scale}) translate(${activeTab === 'tab1' ? translateX : tab2_translateX}px, ${activeTab === 'tab1' ? translateY : tab2_translateY}px)` }"
        @wheel="zoomImage"
        @mousedown="startDragging"
        />
      </div>

    </div>

    <!-- Tab2内容 -->
    <div v-if="activeTab === 'tab2'">
      <h3 class="page-title">Cell 3D L_measure Features Distribution without "None" Type Plot Viewer</h3>

      <!-- 顶部按钮组 -->
      <div class="button-group">
        <button
            v-for="(type, index) in dataTypes"
            :key="index"
            :class="['data-button', { active: tab2_selectedType === type }]"
            @click="tab2_selectDataType(type)"
        >
          {{ type.label }}
        </button>
      </div>

      <div class="main-content">
        <!-- 中间图表显示区域 -->
        <div class="iframe-container">
          <iframe
              :src="computedSrc_UMAP"
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
        <div v-if="tab2_selectedImage">
          <div class="image-container">
            <!-- 上一张按钮 -->
            <button
                class="prev-button"
                :disabled="(activeTab === 'tab1' ? !hasPreviousImage : !tab2_hasPreviousImage)"
                @click="showPreviousImage"
            >
              ◀
            </button>

            <!-- 显示的图片 -->
            <img
                ref="modalImage"
                :src="activeTab === 'tab1' ? selectedImage : tab2_selectedImage"
                alt="Selected Preview"
                class="preview-image"
                @click="openModal"
            />

            <!-- 下一张按钮 -->
            <button
                class="next-button"
                :disabled="(activeTab === 'tab1' ? !hasNextImage : !tab2_hasNextImage)"
                @click="showNextImage"
            >
              ▶
            </button>
          </div>
        </div>
        <div v-else>
          <p>请选择图例或标签显示图片。</p>
        </div>
      </div>
      <!-- 模态框 -->
<!--      <div-->
<!--          v-if="isModalVisible"-->
<!--          class="modal"-->
<!--          @click.self="closeModal"-->
<!--      >-->
<!--        <img-->
<!--            :src="tab2_selectedImage"-->
<!--            alt="Large Preview"-->
<!--            class="modal-image"-->
<!--            :style="{ transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)` }"-->
<!--            @wheel="zoomImage"-->
<!--            @mousedown="startDragging"-->
<!--        />-->
<!--      </div>-->
      <!-- 模态框，动态绑定不同 tab 的图片和缩放状态 -->
      <div
          v-if="isModalVisible"
          class="modal"
          @click.self="closeModal"
      >
        <img
            :src="activeTab === 'tab1' ? selectedImage : tab2_selectedImage"
        alt="Large Preview"
        class="modal-image"
        :style="{ transform: `scale(${activeTab === 'tab1' ? scale : tab2_scale}) translate(${activeTab === 'tab1' ? translateX : tab2_translateX}px, ${activeTab === 'tab1' ? translateY : tab2_translateY}px)` }"
        @wheel="zoomImage"
        @mousedown="startDragging"
        />
      </div>


    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'tab1',
      selectedType: null, // 当前选中的数据类型
      selectedImage: null,
      images: [],
      tab2_images: [],
      tab2_selectedType: null, // 当前选中的数据类型
      tab2_selectedImage: null,
      isModalVisible: false,
      scale: 1, // 图片缩放比例
      translateX: 0, // 图片水平位移
      translateY: 0, // 图片垂直位移
      isDragging: false, // 是否正在拖动
      // Tab2 的缩放和位移状态
      tab2_scale: 1,
      tab2_translateX: 0,
      tab2_translateY: 0,
      startX: 0, // 拖动开始的鼠标 X 坐标
      startY: 0, // 拖动开始的鼠标 Y 坐标
      sidebarExpanded: false,
      dataTypes: [
        {
          label: "Exc/Inh Plot",
          fileName: "3d_scatter_plot_exc_inh.html",
          image: ["Single_label_in_exc_inh.png"],
          umap_fileName:"umap_3d_exc_inh.html",
          umap_image:["umap_exc_inh.png","pairwise_exc_inh.png","exc_inh_intra_distance.png"],
        },
        {
          label: "Cell Type 1 Plot",
          fileName: "3d_scatter_plot_cell_type_1.html",
          image: ["Single_label_in_cell_type_1.png"],
          umap_fileName:"umap_3d_cell_type_1.html",
          umap_image:["umap_cell_type_1.png","pairwise_cell_type_1.png","cell_type_1_intra_distance.png"],
        },
        {
          label: "Cell Type 2 Plot",
          fileName: "3d_scatter_plot_cell_type_2.html",
          image: ["Single_label_in_cell_type_2.png"],
          umap_fileName:"umap_3d_cell_type_2.html",
          umap_image:["umap_cell_type_2.png","pairwise_cell_type_2.png","cell_type_2_intra_distance.png"],
        },
      ],
    };
  },
  methods: {
    showNextImage() {
      if (this.activeTab === 'tab1' && this.hasNextImage) {
        this.currentImageIndex++;
        if (this.currentImageIndex >= this.images.length) {
          this.currentImageIndex = 0; // 如果是最后一张，回到第一张
        }
        this.selectedImage = this.images[this.currentImageIndex];
      } else if (this.activeTab === 'tab2' && this.tab2_hasNextImage) {
        this.tab2_currentImageIndex++;
        if (this.tab2_currentImageIndex >= this.tab2_images.length) {
          this.tab2_currentImageIndex = 0; // 如果是最后一张，回到第一张
        }
        this.tab2_selectedImage = this.tab2_images[this.tab2_currentImageIndex];
      }
    },
    showPreviousImage() {
      if (this.activeTab === 'tab1' && this.hasPreviousImage) {
        this.currentImageIndex--;
        if (this.currentImageIndex < 0) {
          this.currentImageIndex = this.images.length - 1; // 如果是第一张，回到最后一张
        }
        this.selectedImage = this.images[this.currentImageIndex];
      } else if (this.activeTab === 'tab2' && this.tab2_hasPreviousImage) {
        this.tab2_currentImageIndex--;
        if (this.tab2_currentImageIndex < 0) {
          this.tab2_currentImageIndex = this.tab2_images.length - 1; // 如果是第一张，回到最后一张
        }
        this.tab2_selectedImage = this.tab2_images[this.tab2_currentImageIndex];
      }
    },
    selectDataType(type) {
      this.selectedType = type;
      if (Array.isArray(type.image)) {
        this.images = type.image;
        this.currentImageIndex = 0;
        this.selectedImage = this.images[0];  // 更新为第一个图像
      }
    },
    tab2_selectDataType(type) {
      this.tab2_selectedType = type;
      if (Array.isArray(type.umap_image)) {
        this.tab2_images = type.umap_image;
        this.tab2_currentImageIndex = 0;
        this.tab2_selectedImage = this.tab2_images[0];
      }
    },
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
      const imgElement = this.$refs.modalImage;
      const rect = imgElement.getBoundingClientRect();
      // this.scale = Math.min(Math.max(this.scale + scaleChange, 1), 3);
      if (this.activeTab === 'tab1') {
        this.scale = Math.min(Math.max(this.scale + scaleChange, 1), 3); // Tab1 的缩放操作
      } else {
        this.tab2_scale = Math.min(Math.max(this.tab2_scale + scaleChange, 1), 3); // Tab2 的缩放操作
      }

      if (rect) {
        // 调整图片位置，确保缩放时保持中心位置
        if (this.activeTab === 'tab1') {
          this.translateX -= (event.clientX - rect.left) * scaleChange;
          this.translateY -= (event.clientY - rect.top) * scaleChange;
        } else {
          this.tab2_translateX -= (event.clientX - rect.left) * scaleChange;
          this.tab2_translateY -= (event.clientY - rect.top) * scaleChange;
        }
      }
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
      if (this.activeTab === 'tab1') {
        this.translateX += event.clientX - this.startX;
        this.translateY += event.clientY - this.startY;
      } else {
        this.tab2_translateX += event.clientX - this.startX;
        this.tab2_translateY += event.clientY - this.startY;
      }

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
    hasNextImage() {
      return this.activeTab === 'tab1' ? this.currentImageIndex < this.images.length - 1 : this.tab2_currentImageIndex < this.tab2_images.length - 1;
    },
    hasPreviousImage() {
      return this.activeTab === 'tab1' ? this.currentImageIndex > 0 : this.tab2_currentImageIndex > 0;
    },
    tab2_hasNextImage() {
      return this.tab2_currentImageIndex < this.tab2_images.length - 1;
    },
    tab2_hasPreviousImage() {
      return this.tab2_currentImageIndex > 0;
    },
    computedSrc() {
      return this.selectedType ? `/${this.selectedType.fileName}` : "/3d_scatter_plot_exc_inh.html";
    },
    computedSrc_UMAP() {
      return this.tab2_selectedType ? `/${this.tab2_selectedType.umap_fileName}` : "/umap_3d_exc_inh.html";
    },
  },
  mounted() {
    if (this.dataTypes.length > 0) {
      this.selectDataType(this.dataTypes[0]);
      this.tab2_selectDataType(this.dataTypes[0]);
    }
  },

  // mounted() {
  //   if (this.dataTypes.length > 0) {
  //     this.selectDataType(this.dataTypes[0]);
  //     this.tab2_selectDataType(this.dataTypes[0]);
  //   } else {
  //     console.warn('dataTypes array is empty');
  //   }

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

.tab-buttons {
  display: flex;
  justify-content: center; /* 居中对齐 */
  align-items: center; /* 垂直居中 */
  gap: 20px; /* 按钮之间的间距 */
  background-color:transparent; /* 背景色为黑色 */
  border-bottom: 1px solid #555; /* 下边框颜色 */
  padding: 10px 0; /* 内边距让按钮区域有些高度 */
}

.tab-buttons button {
  background-color: transparent; /* 按钮背景透明 */
  color: #fff; /* 按钮文字为白色 */
  border: none; /* 无边框 */
  border-bottom: 2px solid transparent; /* 默认状态下没有下划线 */
  font-size: 22px; /* 字体大小 */
  padding: 5px 15px; /* 按钮内边距 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.tab-buttons button.active {
  border-bottom: 2px solid #fff; /* 激活状态的下划线为白色 */
  font-weight: bold; /* 激活状态加粗 */
}

.tab-buttons button:hover {
  color: #ddd; /* 悬停时文字颜色变浅 */
}

.tab-buttons button:focus {
  outline: none; /* 移除按钮的焦点边框 */
}


/* 使用说明 */
.instruction_sidebar {
  position: fixed;
  top: 50%; /* 初始位置在页面中间 */
  right: 0;
  transform: translateY(-50%); /* 垂直居中 */
  width: 50px; /* 初始宽度较小 */
  height: 200px; /* 初始高度较大 */
  background-color: #000; /* 背景颜色为黑色 */
  color: white; /* 文字颜色为白色 */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 5px 5px 0; /* 右侧圆角 */
  font-size: 22px; /* 字符大小 */
  font-weight: bold; /* 字体加粗 */
  cursor: pointer; /* 鼠标悬停时显示手型 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); /* 添加阴影效果 */
  transition: all 0.3s ease-in-out; /* 添加过渡效果 */
}

.instruction_sidebar::before {
  content: '<'; /* 添加类似图中的箭头符号 */
  display: block;
  font-size: 24px; /* 调整箭头符号的大小 */
  color: white; /* 符号颜色 */
  justify-content: center;
  lign-items: center;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.instruction_sidebar:hover {
  width: 300px; /* 鼠标悬停时宽度扩展 */
  height: 300px; /* 鼠标悬停时高度扩展 */
  transition: all 0.3s ease-in-out; /* 平滑的过渡效果 */
}

.instruction_sidebar .sidebar-content {
  opacity: 0; /* 初始时隐藏内容 */
  transition: opacity 0.3s ease-in-out; /* 内容淡入效果 */
}

.instruction_sidebar:hover .sidebar-content {
  opacity: 1; /* 鼠标悬停时内容显示 */
}

.sidebar-content h4 {
  margin-bottom: 10px;
  font-size: 19px; /* 标题字体大小 */
}

.sidebar-content ul {
  list-style: none; /* 移除列表点 */
  padding: 0;
}

.sidebar-content ul li {
  margin-bottom: 8px;
  font-size: 18px; /* 列表字体大小 */
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
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.prev-button, .next-button {
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}

.prev-button:disabled, .next-button:disabled {
  background-color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}
.preview-image {
  //width: 500px;
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
  max-width: 1500px;
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
  width: 1500px;
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
