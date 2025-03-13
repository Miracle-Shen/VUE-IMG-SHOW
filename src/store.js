// store.js
import { createStore } from 'vuex';

const store = createStore({
    state: {
        messages: [],
        // textBox: '',
        tokenMonitor: 0,
        useGpt4: false,
        currentModel: 'GPT-3.5',
    },
    mutations: {
        setMessages(state, messages) {
            state.messages = messages;
        },
        // setTextBox(state, text) {
        //     state.textBox = text;
        // },
        setTokenMonitor(state, token) {
            state.tokenMonitor = token;
        },
        // setUseGpt4(state, value) {
        //     state.useGpt4 = value;
        // },
        // setCurrentModel(state, model) {
        //     state.currentModel = model;
        // },
    },
    actions: {
        updateMessages({ commit }, messages) {
            commit('setMessages', messages);
        },
        // updateTextBox({ commit }, text) {
        //     commit('setTextBox', text);
        // },
    },
});

export default store;
