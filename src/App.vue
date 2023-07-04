<script setup lang="ts">
import { ref, onMounted } from "vue";
import Login from "./components/Login.vue";
import Chat from "./components/chat/Index.vue";
import Setting from "./components/Setting.vue";
import Cookies from "js-cookie";
const chat = ref();
const showLogin = ref(false);
const showChat = ref(false);
const showSetting = ref(false);
onMounted(() => {
  init();
});
function login() {
  showLogin.value = false;
  showChat.value = true;
}
function sign_out() {
  showChat.value = false;
  showLogin.value = true;
}
function init() {
  const showPage = Cookies.get("showPage");
  if (showPage === "showChat") {
    showChat.value = true;
  } else {
    showLogin.value = true;
  }
}
function updateUserInfo(formData: any) {
  if (chat.value) {
    for (const key in formData) {
      chat.value.updateUserInfo(key, formData[key]);
    }
  }
}
</script>

<template>
  <Transition :duration="1500">
    <Login v-if="showLogin" :showLogin="showLogin" @login="login" />
  </Transition>
  <transition :duration="1600">
    <Chat
      ref="chat"
      v-if="showChat"
      v-show="!showSetting"
      :showChat="showChat"
      @signOut="sign_out"
      @show-setting="showSetting = true"
    />
  </transition>
  <transition :duration="1500">
    <Setting
      v-if="showSetting"
      @back="showSetting = false"
      @update="updateUserInfo"
    ></Setting>
  </transition>
</template>

<style lang="less" scoped></style>
<style lang="less">
#app {
  min-height: 90vh;
  border: 1px solid transparent;
}

body {
  padding-top: 10vh;
}
</style>
