<template>
  <div>
    <h2>{{ poll.title }} Results</h2>
    <div v-for="(slot, index) in poll.timeSlots" :key="index">
      <p>{{ slot }}: {{ votes[slot] || 0 }} votes</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const poll = ref({});
    const votes = ref({});
    const route = useRoute();

    onMounted(async () => {
      const pollId = route.params.id;
      try {
        const response = await axios.get(`/api/polls/${pollId}/results`);
        poll.value = response.data.poll;
        votes.value = response.data.votes;
      } catch (error) {
        console.error("Error fetching poll results:", error);
      }
    });

    return {
      poll,
      votes,
    };
  },
};
</script>
