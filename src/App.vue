<template>
  <div>
<!--    <h1>Hello World</h1>-->
<!--    <el-button type="primary">Element Plus Button</el-button>-->

    <!-- 使用自定义的 HeadBar 和 SideBar 组件 -->
    <div class="main-layout">
      <Background>

      </Background>
      <HeadBar title="Mircrons Abnormal Data Check Box" />
      <HeadSideBar :currentTab="currentTab" @tab-selected="handleTabSelection" />
      <div class="content-area">
<!--        <keep-alive include="TaskPlan, Chat, Files">-->
        <component :is="currentComponent" v-if="currentComponent"></component>
<!--        </keep-alive>-->
      </div>
    </div>
  </div>
</template>

<script>
import ImageUploader from "@/component/ImageUploader.vue";
import Background from './component/Background.vue';
import HeadSideBar from "@/component/HeadSideBar.vue";
import HeadBar from './component/HeadBar.vue';
import OriginalFiles from './component/OriginalFiles.vue';
import Analysis from "@/component/Analysis.vue";
export default {
  name: 'App',
  components: {
    HeadBar,   // 注册 HeadBar 组件
    HeadSideBar,
    Background,
    ImageUploader,
    OriginalFiles,
    Analysis
  },

  data() {
    return {
      currentTab: 'ImageUploader', // 默认选中 Task Initialization
    };
  },

  // computed: {
  //   currentComponent() {
  //     if (this.currentTab === "ImageUploader") {
  //       return "ImageUploader";
  //     } else if (this.currentTab === "OriginalFiles") {
  //       return "OriginalFiles";
  //     } else if (this.currentTab === "Analysis") {
  //       return "Analysis"; // 保证只加载 Analysis 组件
  //     }
  //     return null;
  //   },
  // },
  computed: {
    currentComponent() {
      switch (this.currentTab) {
        case "ImageUploader":
          return "ImageUploader";
        case "OriginalFiles":
          return "OriginalFiles";
        case "Analysis":
          return "Analysis"; // 确保 Analysis 组件正常加载
        default:
          return null;
      }
    },
  },


  methods: {
    handleTabSelection(tab) {
      this.currentTab = tab;
    }
  },
}

</script>

<style scoped>
.app-content {
  position: relative;
  z-index: 1; /* 保证内容在背景之上 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #ffffff;
}
</style>
