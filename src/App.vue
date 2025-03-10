<template>
  <v-app>
    <v-main>
      <CreatePoll />
      <PollList />
    </v-main>
  </v-app>
</template>

<script setup>
import CreatePoll from "./components/CreatePoll.vue";
import PollList from "./components/PollList.vue";
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
