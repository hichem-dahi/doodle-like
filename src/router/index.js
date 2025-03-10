import { createRouter, createWebHistory } from "vue-router";
import CreatePoll from "../components/CreatePoll.vue";
import VotePoll from "../components/VotePoll.vue";
import PollResults from "../components/PollResults.vue";

const routes = [
  { path: "/", component: CreatePoll },
  { path: "/poll/:id", component: VotePoll },
  { path: "/poll/:id/results", component: PollResults },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
