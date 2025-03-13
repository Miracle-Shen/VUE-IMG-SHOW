<template>

  <div class="chatbot-interface">
    <!-- 主聊天区 -->
    <section class="chat-area">
      <div class="chat-window" ref="chatWindow">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <div v-if="message.role === 'assistant'" class="message-row left">
            <img :src="require('@/component/assets/openAI.jpg')" class="avatar" alt="AI Avatar">
            <p class="assistant-message" v-html="parseMarkdown(message.content)"></p>
          </div>
          <div v-if="message.role === 'user'" class="message-row right">
<!--            <p class="user-message">{{ message.content }}</p>-->
            <p class="user-message" v-html="parseMarkdown(message.content)"></p>
            <img :src="require('@/component/assets/user.jpg')" class="avatar" alt="User Avatar">
          </div>
        </div>
      </div>

    </section>

    <!-- 输入区 -->
    <section class="input-area">
      <!--          v-model="userInput"：双向绑定，将输入框的内容与 userInput 变量关联，实时更新。
            @click="sendMessage"：当按钮被点击时。 调用 Vue 实例中的 sendMessage 方法。
      -->
      <textarea
          id="text_box"
          v-model="text_box"
          placeholder="Enter text and press enter, or upload a file"
          class="input-box"
          @keyup.enter.prevent="add_text"
      ></textarea>
        <button class="send-button" @click="debouncedAddText">✔ Send</button>
<!--      <button class="send-button" @click.prevent="add_text">✔ Send</button>-->
<!--      <button class="send-button" @click="upload_file">📁 Upload</button>-->
<!--      ref="fileInput"：通过 ref 获取 DOM 元素， @change="upload_file"：当用户选择文件后，调用 upload_file 方法处理上传。 -->
      <input type="file" ref="fileInput" @change="upload_file" style="display: none;">

      <button class="send-button" @click="triggerFileUpload">📁 Upload</button>
    </section>


    <!-- 模型和控制区 -->
    <aside class="model-control-area">
      <div class="checkbox-group">
        <input type="checkbox" v-model="useGpt4" id="useGpt4" />
        <label for="useGpt4">Use GPT-4</label>
      </div>
      <div class="token-info">
        Context token: {{ token_monitor }}/4096
      </div>
      <div class="control-buttons">
        <button @click="stopGenerating" class="control-button">⏹️Stop generating</button>
        <button @click="restart" class="control-button">🔄Restart</button>
        <button @click="UndoUploadFile" class="control-button">↩️Undo Upload File</button>
      </div>

      <!-- 模型选择 -->
      <div class="model-select">
        <label for="model-select">Current Model:</label>
        <select v-model="currentModel" id="model-select">
          <option>GPT-3.5</option>
          <option>GPT-4</option>
        </select>
      </div>
    </aside>
  </div>
</template>

<script>



import axios from 'axios';
import { marked } from 'marked';
import { io } from 'socket.io-client';
import { debounce } from 'lodash';
import { EventBus } from '../main';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      state: null,
      messages:[], //界面显示的信息
      chatbot: [],
      text_box: '', //输入框的
      token_monitor: 0, //计数
      // undo_file_button: false,
      // stop_generation_button: false,
      // retry_button: false,
      socket: null,
    };
  },

  created() {
    this.socket = io('http://localhost:5000', {
      transports: ['websocket'], // 强制使用 WebSocket 传输
    });

    this.socket.on('update_message', (data) => {
      const history = data.history;
      history.forEach(entry => {
        if (entry[1]) {
          this.messages.push({
            role: 'assistant',
            content: entry[1] || "No content"  // 添加默认值避免 `null` 错误
          });
        }
      });
      this.chatbot = history;
      this.text_box = '';  // 清空输入框
      this.$nextTick(() => {
      this.scrollToBottom();
      });
    });
    this.debouncedAddText = debounce(this.add_text, 300);
  },

  // beforeDestroy() {
  //   if (this.socket) {
  //     this.socket.disconnect();
  //   }
  // },


  methods: {
    async add_text() {
      if (this.text_box.trim() === '') {
        return;  // 防止发送空消息
      }
        const userMessage = this.text_box;
        this.text_box = '';
        this.messages.push({
          role: 'user',
          content: userMessage
        });
        // 向后端发送文本输入 text 是键 this.text_box 是当前组件的 text_box 变量，
        const response = await axios.post('http://localhost:5000/add_text', {
          // state: this.state,
          text: userMessage
        });
        console.log("response data:", response.data);
        const history = response.data['history'];
        // history.forEach(entry => {
        //   // if (entry[0]) {
        //   //   this.messages.push({
        //   //     role: 'user',
        //   //     content: entry[0] || "No content"  // 添加默认值避免 `null` 错误
        //   //   });
        //   // }
        //   console.log("DEBUG: assistant response data:",entry[1]);
        //   if (entry[1]) {
        //     this.messages.push({
        //       role: 'assistant',
        //       content: entry[1] || "No content"  // 添加默认值避免 `null` 错误
        //     });
        //   }
        // });
      // 获取最新的助手回复
      //   const lastEntry = history[history.length - 1];
      //   if (lastEntry && lastEntry[1]) {
      //     this.messages.push({
      //       role: 'assistant',
      //       content: lastEntry[1] || "No content"  // 添加默认值避免 `null` 错误
      //     });
      //   }
      // 遍历历史记录，从上次记录的位置开始推入助手消息
      const lastAssistantIndex = this.messages.filter(message => message.role === 'assistant').length;

      history.forEach((entry, index) => {
        if (index >= lastAssistantIndex && entry[1]) {
          this.messages.push({
            role: 'assistant',
            content: entry[1] || "No content"  // 添加默认值避免 `null` 错误
          });
        }
      });
        this.chatbot = history; //response.data.chatbot;
        console.log("Messages history:", history);
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        this.refresh_token_count();
        this.refresh_file_display();
      },

    async refresh_token_count() {
      // 向后端请求更新令牌计数
      const response = await axios.post('http://localhost:5000/refresh_token_count', { state: this.state });
      this.token_monitor = response.data.token_count;
    },

    async refresh_file_display() {
      // 向后端请求刷新文件显示
      const response = await axios.post('http://localhost:5000/refresh_file_display', { state: this.state });
      console.log("the path list:",response.data);  // 显示文件列表
      EventBus.$emit('update-file-list', response.data); // 通过事件总线发送名为 update-file-list 的事件，同时将文件列表数据作为参数传递。
    },

    triggerFileUpload() {
      this.$refs.fileInput.click(); // 模拟点击隐藏的文件输入框
    },
    async upload_file(event) {
      const files = event.target.files;
      if (!files || files.length === 0) {
        console.error('No file selected');
        return;
      }
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      // 上传文件
      try{
        const response = await axios.post('http://localhost:5000/upload_file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // const history = response.data['history'];
        this.messages.push({
          role: 'user',
          content: `📁${file.name}` // 添加默认值避免 `null` 错误
        });
        this.$nextTick(() => {
          this.scrollToBottom();  // 确保滚动到最新消息
        });
        console.log('File uploaded:', response.data.filename);
      }
      catch(error) {
        if (error.response) {          // 服务器返回了错误响应
          console.error('Upload failed:', error.response.data);
        } else if (error.request) {          // 请求已发送但未收到响应
          console.error('No response from server:', error.request);
        } else {          // 设置请求时发生错误
          console.error('Error uploading file:', error.message);
        }
      }
    },

    async stopGenerating() {      // 停止生成
      const response = await axios.post('http://localhost:5000/stop_generation');
      console.log(response.data.status);
    },

    async restart() {      // 重启聊天
      const response = await axios.post('http://localhost:5000/restart');
      this.messages = [];
      this.chatbot = [];  // 清空聊天记录
      this.token_monitor = 0;  // 重置 token 计数
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      console.log(response.data.status);
    },

    // 滚动到底部
    scrollToBottom() {
      const chatWindow = this.$refs.chatWindow;
      if (chatWindow) {
        console.log("scrollToBottom triggered");  // 用于调试，确保函数被调用
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    },
    parseMarkdown(content) {      // 使用 marked 解析 Markdown
      return marked(content);
    }
  },
  updated() {
    this.$nextTick(() => {
      this.scrollToBottom();  // 确保在 DOM 完成更新后再执行滚动操作
    });
  }
};




</script>

<style scoped>
.chatbot-interface {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #f1f1f1;
  padding: 10px;
  border-right: 1px solid #ccc;
}
.header h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.tab {
  font-size: 1.2rem;
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab.active {
  border-bottom: 2px solid #4a90e2;
  color: #4a90e2;
}

.chat-area {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  height: 400px;
  overflow-y: scroll;
  background-color: #fafafa;
}

.chat-window {
  display: flex;
  flex-direction: column;
  max-height: 800px;
  overflow-y: auto; /* 聊天窗口支持滚动 */
}

.message {
  margin-bottom: 15px;
}

.system-message {
  color: #999;
  font-style: italic;
}

.message-row {
  display: flex;
  align-items: center;
  //align-items: flex-end;
  margin-bottom: 10px;
}

.left {
  justify-content: flex-start; /* AI消息左对齐 */
}

.right {
  justify-content: flex-end; /* 用户消息右对齐 */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

.user-message {
  text-align: right;
  background-color: #e6f0ff;
  padding: 10px;
  border-radius: 20px;
  display: inline-block;
  align-self: flex-end; /* 右对齐整个消息框 */
  max-width: 60%; /* 控制消息框的宽度，避免占满全屏 */
  word-wrap: break-word; /* 避免长文本溢出 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 增加一些阴影 */
}

.assistant-message {
  text-align: left;
  background-color: #f3f3f3;
  padding: 10px;
  border-radius: 20px;
  display: inline-block;
  align-self: flex-start; /* 左对齐 */
  max-width: 60%; /* 控制消息框的最大宽度 */
  word-wrap: break-word; /* 避免长文本溢出 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 增加一些阴影 */
}

.input-area {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.input-box {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.send-button {
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 1rem;
}

.model-control-area {
  margin-top: 20px;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.token-info {
  margin: 10px 0;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.control-button {
  padding: 10px;
  background-color: #ddd;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.control-button:hover {
  background-color: #ccc;
}

.model-select {
  margin-top: 10px;
}

#model-select {
  padding: 5px;
}
</style>
