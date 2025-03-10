<template>
  <div>
    <h2>{{ poll.title }}</h2>
    <div v-for="(slot, index) in poll.timeSlots" :key="index">
      <label>
        <input type="checkbox" v-model="selectedSlots" :value="slot" />
        {{ slot }}
      </label>
    </div>
    <button @click="submitVotes">Submit Votes</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const poll = ref({});
    const selectedSlots = ref([]);
    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      const pollId = route.params.id;
      try {
        const response = await axios.get(`/api/polls/${pollId}`);
        poll.value = response.data;
      } catch (error) {
        console.error("Error fetching poll:", error);
      }
    });

    const submitVotes = async () => {
      try {
        const response = await axios.post(
          `/api/polls/${route.params.id}/vote`,
          {
            selectedSlots: selectedSlots.value,
          }
        );
        if (response.data.success) {
          router.push(`/poll/${route.params.id}/results`);
        }
      } catch (error) {
        console.error("Error submitting votes:", error);
      }
    };

    return {
      poll,
      selectedSlots,
      submitVotes,
    };
  },
};
</script>
