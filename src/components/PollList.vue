<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h4 font-weight-bold text-primary">
        Poll List
      </v-card-title>

      <v-card-text>
        <!-- Loading State -->
        <v-progress-linear
          v-if="isLoading"
          indeterminate
          color="primary"
          class="mb-4"
        ></v-progress-linear>

        <!-- Poll List -->
        <v-list v-if="polls.length > 0">
          <v-list-item
            v-for="poll in polls"
            :key="poll.id"
            @click="viewPoll(poll.code)"
          >
            <v-list-item-title class="text-h6">
              {{ poll.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Created by: {{ poll.creatorName }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Status: {{ poll.status }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Created at: {{ formatDateTime(poll.created_at) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="poll.dates.length > 0">
              Dates: {{ poll.dates.map((d) => d.date).join(", ") }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="poll.times.length > 0">
              Times: {{ poll.times.map((t) => formatTime(t.time)).join(", ") }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <!-- No Polls Message -->
        <v-alert
          v-else-if="!isLoading"
          type="info"
          variant="tonal"
          class="mt-4"
        >
          No polls found.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" color="error" timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "../plugins/axios";
import { format } from "date-fns"; // Import date-fns for formatting

// Reactive state
const polls = ref([]);
const isLoading = ref(false);
const showError = ref(false);
const errorMessage = ref("");

// Router
const router = useRouter();

// Fetch polls on component mount
onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axiosInstance.get("/api/polls");
    polls.value = response.data.polls;
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error || "Failed to fetch polls.";
    showError.value = true;
  } finally {
    isLoading.value = false;
  }
});

// Format date and time
const formatDateTime = (dateTime) => {
  return format(new Date(dateTime), "yyyy-MM-dd HH:mm");
};

const formatTime = (time) => {
  return time.slice(0, 5); // Extract HH:mm from HH:mm:ss
};

// Navigate to poll details
const viewPoll = (pollCode) => {
  router.push({ name: "PollDetails", params: { code: pollCode } });
};
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
</style>
