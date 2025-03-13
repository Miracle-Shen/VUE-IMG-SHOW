<template>
  <div class="widget-container">
    <!-- Model Widget -->
    <div>
      <h2>暂无权限查看!请联系管理人员!</h2>

    </div>

    <div class="widget model-widget">
      <h3>Widget.model</h3>
      <div v-if="selectedModelOption">
        <p>{{ selectedModelOption }}</p>
        <!-- 可以在这里添加具体的内容 -->
      </div>
      <div v-else class="placeholder">
        请选择模型选项
      </div>
      <div class="widget-footer">
        <p>Widget功能：选择不同模型的分析</p>
        <p>自定义配置：列表模式、网格模式</p>
      </div>
    </div>

    <!-- Distribution Widget -->
    <div class="widget distribution-widget">
      <h3>Widget.distribution</h3>
      <div v-if="selectedDistributionOption">
        <p>{{ selectedDistributionOption }}</p>
        <!-- 可以在这里放置数据分布图表 -->
      </div>
      <div v-else class="placeholder">
        请选择数据分布选项
      </div>
      <div class="widget-footer">
        <p>Widget功能：查看数据集分布情况</p>
        <p>自定义配置：饼图、柱状图</p>
      </div>
    </div>

    <!-- Prediction Widget -->
    <div class="widget prediction-widget">
      <h3>Widget.prediction</h3>
      <div v-if="selectedPredictionOption">
        <p>{{ selectedPredictionOption }}</p>
        <!-- 可以在这里添加预测数据或其他信息 -->
      </div>
      <div v-else class="placeholder">
        请选择预测选项
      </div>
      <div class="widget-footer">
        <p>Widget功能：预测数据/概率计算</p>
        <p>自定义配置：下拉菜单与文本框、单选框与选择器</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedModelOption: "", // 模型选项的选择
      selectedDistributionOption: "", // 数据分布选项的选择
      selectedPredictionOption: "", // 预测选项的选择
    };
  },
};
</script>

<style scoped>
.widget-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
  padding: 20px;
}

.widget {
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f8f8f8;
  text-align: center;
  position: relative;
}

.widget h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.placeholder {
  font-size: 16px;
  color: #aaa;
  padding: 20px;
  border: 1px dashed #aaa;
  border-radius: 8px;
  margin-top: 10px;
}

.widget-footer {
  font-size: 14px;
  color: #555;
  margin-top: 15px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>
