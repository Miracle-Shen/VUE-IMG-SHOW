<template>
  <div class="image-uploader">
    <div class="select-function-row">
<!--      <label for="lowerPercent" class="percent-label">Lower Percent:</label>-->
<!--      <input type="number" id="lowerPercent" v-model="lowerPercent" class="percent-input" step="0.05" min="0" max="1" />-->

<!--      <label for="upperPercent" class="percent-label">Upper Percent:</label>-->
<!--      <input type="number" id="upperPercent" v-model="upperPercent" class="percent-input" step="0.05" min="0" max="1" />-->
      <label for="lowerPercent" class="percent-label">Lower Percent:</label>
      <input
          type="number"
          id="lowerPercent"
          v-model="lowerPercent"
          class="percent-input"
          step="0.05"
          min="0"
          max="1"
          @input="handlePercentChange"
      />
      <label for="upperPercent" class="percent-label">Upper Percent:</label>
      <input
          type="number"
          id="upperPercent"
          v-model="upperPercent"
          class="percent-input"
          step="0.05"
          min="0"
          max="1"
          @input="handlePercentChange"
      />


      <!-- 新的神经元选择容器 -->
      <div class="neuron-select-group">
        <label for="functionSelect" class="select-label">神经元类型:</label>
        <select id="functionSelect" v-model="selectedFunction" class="styled-select" @change="handleFunctionChange">
          <option v-for="option in functionOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <label v-if="subOptions.length" for="subOptionSelect" class="select-label">次选项:</label>
        <select v-if="subOptions.length" id="subOptionSelect" v-model="selectedSubOption" class="styled-select" @change="fetchDefaultImages">
          <option v-for="sub in subOptions" :key="sub" :value="sub">
            {{ sub }}
          </option>
        </select>
      </div>
    </div>

    <!-- 图片展示区 -->
    <div v-if="images.length" class="image-preview">
      <h3 class="info-header">
        <span class="badge directory">当前目录：{{ selectedDirectory.replace(/%2B/g, '+') }} ({{ images.length }} 张图片)</span>
        <span class="badge category">{{ selectedFunction }}：{{ selectedSubOption }}</span>
        <span class="badge range">{{ lowerPercent*100 }} % - {{ upperPercent*100 }} %</span>
      </h3>

      <div class="image-display">
        <img :src="images[currentImageIndex]" alt="Processed Image" class="displayed-image" />
      </div>

      <div class="image-controls">
        <button @click="prevImage" :disabled="currentImageIndex === 0">上一张</button>
        <button @click="nextImage" :disabled="currentImageIndex === images.length - 1">下一张</button>
      </div>

      <p>{{ currentImageIndex + 1 }} / {{ images.length }}</p>
    </div>

    <div v-else-if="noImagesFound" class="no-image-placeholder">
      <p>暂无权限查看!请联系管理人员!</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFunction: "exc_inh",
      selectedSubOption: "excitatory_neuron",
      lowerPercent: 0.0,
      upperPercent: 0.05,
      currentImageIndex: 0,
      images: [],
      functionOptions: [
        { value: "exc_inh", label: "Exc/Inh" },
        { value: "cell_type_1", label: "Cell Type 1" },
        { value: "cell_type_2", label: "Cell Type 2" },
      ],
      subOptionMap: {
        exc_inh: ["excitatory_neuron", "inhibitory_neuron", "nonneuron"],
        cell_type_1: ["L2b", "STC", "L2c", "L3b", "L4b", "L2a", "ITC", "PTC", "DTC", "L5a", "L3a", "L4a", "L4c", "L5b", "L6short-a", "L5ET", "L5NP", "L6tall-a", "L6short-b", "L6tall-c", "L6tall-b"],
        cell_type_2: ["23P", "NGC", "BPC", "BC", "MC", "astrocyte", "4P", "5P-ET", "5P-IT", "5P-NP", "6P-IT", "6P-CT", "OPC", "oligo", "pericyte"],
      },
      subOptions: [],
    };
  },
  computed: {
    selectedDirectory() {
      return `${encodeURIComponent(this.selectedFunction)}%2B${this.selectedSubOption}%2B${Math.round(this.lowerPercent * 100)}-${Math.round(this.upperPercent * 100)}`;
    },
  },
  mounted() {
    this.updateSubOptions();
    this.fetchDefaultImages();
  },
  methods: {
    updateSubOptions() {
      this.subOptions = this.subOptionMap[this.selectedFunction] || [];
      this.selectedSubOption = this.subOptions.length ? this.subOptions[0] : "";
    },
    async fetchDefaultImages() {
      try {
        // const directoryPath = `${encodeURIComponent(this.selectedFunction)}%2B${this.selectedSubOption}%2B${Math.round(this.lowerPercent * 100)}-${Math.round(this.upperPercent * 100)}`;
        const directoryPath = this.selectedDirectory;
        // const response = await fetch(`http://localhost:5000/images?directory=${directoryPath}`);
        const response = await fetch(`http://10.194.13.103:5000/images?directory=${directoryPath}`);
        if (response.status === 404) {
          this.images = [];  // 清空图片列表
          this.noImagesFound = true;  // 设置“无图片”状态
          return;
        }

        this.noImagesFound = this.images.length === 0;
        const data = await response.json();
        // this.images = data.images.map((image) => `http://localhost:5000/images/${data.directory}/${image}`);
        // this.images = data.images.map((image) => `http://10.194.13.103:5000/images/${data.directory}/${image}`);
        const baseUrl = `http://${data.ip}:5000/images/${data.directory}`;
        this.images = data.images.map((image) => `${baseUrl}/${image}`);
        console.log("data:",data)
        this.currentImageIndex = 0;
      } catch (error) {
        this.images = [];
        this.noImagesFound = true;
        console.error("Error fetching default images:", error);
      }
    },
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex -= 1;
      }
    },
    nextImage() {
      if (this.currentImageIndex < this.images.length - 1) {
        this.currentImageIndex += 1;
      }
    },
    handleFunctionChange() {
      this.updateSubOptions();
      this.fetchDefaultImages(); // 调用 fetchDefaultImages 更新图片
    },

    handlePercentChange() {
      this.updateSubOptions();
      this.fetchDefaultImages(); // 调用 fetchDefaultImages 更新图片
    },
  },
};
</script>

<style scoped>

.info-header-title {
  font-size: 20px; /* 字体略小一点，和具体信息区分 */
  font-weight: 600; /* 中等粗细 */
  text-transform: lowercase; /* 小写字母，增加科技感 */
  letter-spacing: 1px; /* 增加字母间距，增强专业感 */
  color: #f18d8d; /* 使用较浅的灰色，显得柔和 */
  margin-right: 8px; /* 与后面的内容区分开一点 */
}

.info-header {
  font-size: 18px; /* 适中的字体大小 */
  line-height: 1.6; /* 增加行高，增强可读性 */
  color: #333; /* 深灰色，营造专业的视觉效果 */
  font-weight: bold;
  display: flex;
  flex-wrap: wrap; /* 使内容在小屏幕上自动换行 */
  gap: 15px; /* 各信息块之间的间距 */
}

.highlight {
  padding: 4px 10px;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
}

.highlight.directory {
  background-color: #3498db; /* 蓝色背景 */
}

.highlight.category {
  background-color: #e67e22; /* 橙色背景 */
}

.highlight.range {
  background-color: #2ecc71; /* 绿色背景 */
}


.image-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.select-label {
  font-size: 18px;
  font-weight: bold;
  color: #4a90e2;
  margin-bottom: 10px;
}


.percent-input,
.styled-select {
  box-sizing: border-box;
  width: 100%;
  max-width: 300px;
  padding: 10px;
  font-size: 15px;
  color: #333;
  background-color: #ffffff; /* 白色背景 */
  border: 1px solid #e0e0e0;
  border-radius: 8px; /* 圆角 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  transition: all 0.3s ease;
  appearance: none; /* 去除默认的下拉箭头样式 */
  cursor: pointer;
}

/* 输入框和选择框的悬停效果 */
.percent-input:hover,
.styled-select:hover {
  border-color: #0073e6; /* 悬停时边框颜色 */
  box-shadow: 0px 6px 12px rgba(0, 115, 230, 0.2); /* 悬停时增强阴影 */
}

/* 点击时的聚焦效果 */
.percent-input:focus,
.styled-select:focus {
  outline: none; /* 去除默认的 outline */
  border-color: #1a73e8; /* 聚焦时边框颜色 */
  box-shadow: 0px 6px 12px rgba(0, 115, 230, 0.3); /* 聚焦时阴影 */
}

.styled-select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='gray'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  padding-right: 30px; /* 为下拉箭头留出空间 */
}

/* 标签文字样式 */
.select-label {
  font-size: 16px;
  font-weight: bold;
  color: #cabfbf;
  margin-bottom: 8px;
  display: block;
}

.neuron-select-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 整体布局行样式 */
.select-function-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

/* 输入框（Lower/Upper Percent）宽度 */
.percent-input {
  width: 120px;
}

/* 保持居中对齐 */
.image-uploader {
  max-width: 800px;
  margin: 0 auto;
}

.neuron-select-group {
  display: flex;
  align-items: center;
  gap: 10px; /* 控制“神经元类型”和“次选项”之间的间距 */
}


.percent-label {
  font-size: 16px;
  color: #4a90e2;
  font-weight: bold;
}

.percent-input {
  width: 80px;
  padding: 5px;
  font-size: 14px;
  border: 1px solid #4a90e2;
  border-radius: 5px;
}
.image-preview {
  width: 100%;
  max-width: 800px;
  height: auto;
  background-color: #2d2d2d;
  border: 2px dashed #4a90e2;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  padding: 1px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.displayed-image {
  max-width: 100%;
  max-height:760px;
  object-fit: contain;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  margin-bottom: 10px; /* 给图片与按钮之间添加间距 */
}

.image-controls {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.image-controls button {
  padding: 8px 12px;
  font-size: 14px;
  color: #ffffff;
  background-color: #4a90e2;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.image-controls button:disabled {
  background-color: #888;
  cursor: not-allowed;
}

.image-controls button:hover:not(:disabled) {
  background-color: #6fa7d9;
}


.images img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #4a90e2;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.link-formats {
  display: flex;
  gap: 10px;
}

.link-formats button {
  padding: 8px 15px;
  border: none;
  background: #3b3b3b;
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.link-formats .active {
  background-color: #4a90e2;
}

.link-formats button:hover {
  background-color: #6fa7d9;
}

.quick-upload {
  padding: 8px 20px;
  background-color: #4a90e2;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.quick-upload:hover {
  background-color: #6fa7d9;
}


.info-header {
  display: flex;
  gap: 8px; /* 控制标签之间的间距 */
  flex-wrap: wrap; /* 使标签在小屏幕上自动换行 */
}

/* 通用标签样式 */
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  color: #fff;
}

/* 针对不同类型标签的颜色样式 */
.badge.directory {
  background-color: #4e4b4b; /* 灰色背景 */
}

.badge.category {
  background-color: #e67e22; /* 橙色背景 */
}

.badge.range {
  background-color: #2ecc71; /* 绿色背景 */
}

.no-image-placeholder {
  width: 100%;
  max-width: 800px;
  background-color: #f0f0f0;
  border: 2px dashed #4a90e2;
  border-radius: 10px;
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 18px;
}

</style>
