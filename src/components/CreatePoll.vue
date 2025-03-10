<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h4 font-weight-bold text-primary">
        Create a New Poll
      </v-card-title>

      <v-card-text>
        <!-- Poll Title -->
        <v-text-field
          v-model="poll.title"
          label="Poll Title"
          variant="outlined"
          density="compact"
          required
          class="mb-4"
        ></v-text-field>

        <!-- Poll Description -->
        <v-textarea
          v-model="poll.description"
          label="Poll Description"
          variant="outlined"
          density="compact"
          rows="3"
          class="mb-4"
        ></v-textarea>

        <!-- Poll Times -->
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-h6 font-weight-bold">
            Poll Time Slots
          </v-card-title>
          <v-card-text>
            <v-row
              v-for="(timeSlot, index) in poll.timeSlots"
              :key="index"
              class="mb-2"
            >
              <v-col cols="6">
                <v-text-field
                  v-model="timeSlot.startDateTime"
                  label="Start Date and Time"
                  type="datetime-local"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="timeSlot.endDateTime"
                  label="End Date and Time"
                  type="datetime-local"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  color="error"
                  icon
                  @click="removeTimeSlot(index)"
                  :disabled="poll.timeSlots.length <= 1"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-btn color="primary" @click="addTimeSlot">
              <v-icon left>mdi-plus</v-icon>
              Add Time Slot
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Creator Name -->
        <v-text-field
          v-model="poll.creatorName"
          label="Your Name"
          variant="outlined"
          density="compact"
          required
          class="mb-4"
        ></v-text-field>

        <!-- Creator Email -->
        <v-text-field
          v-model="poll.creatorEmail"
          label="Your Email"
          type="email"
          variant="outlined"
          density="compact"
          required
          class="mb-4"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          size="large"
          @click="createPoll"
          :loading="isLoading"
        >
          <v-icon left>mdi-check</v-icon>
          Create Poll
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      Poll created successfully!
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" color="error" timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import axios from "../plugins/axios";

// Get current date-time for initial time slot
const getCurrentDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - (now.getMinutes() % 15)); // Round to nearest 15 minutes
  return now.toISOString().slice(0, 16); // Format for datetime-local
};

// Reactive state
const poll = ref({
  title: "",
  description: "",
  timeSlots: [
    {
      startDateTime: getCurrentDateTime(),
      endDateTime: (() => {
        const end = new Date(getCurrentDateTime());
        end.setHours(end.getHours() + 1);
        return end.toISOString().slice(0, 16);
      })(),
    },
  ],
  creatorName: "",
  creatorEmail: "",
});

const isLoading = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

// Methods
const addTimeSlot = () => {
  const lastSlot = poll.value.timeSlots[poll.value.timeSlots.length - 1];
  const newStart = new Date(lastSlot.endDateTime);
  newStart.setHours(newStart.getHours() + 1);

  const newEnd = new Date(newStart);
  newEnd.setHours(newEnd.getHours() + 1);

  poll.value.timeSlots.push({
    startDateTime: newStart.toISOString().slice(0, 16),
    endDateTime: newEnd.toISOString().slice(0, 16),
  });
};

const removeTimeSlot = (index) => {
  if (poll.value.timeSlots.length > 1) {
    poll.value.timeSlots.splice(index, 1);
  }
};

const createPoll = async () => {
  isLoading.value = true;

  // Validate inputs
  const validatedPoll = {
    ...poll.value,
    timeSlots: poll.value.timeSlots.filter(
      (slot) => slot.startDateTime && slot.endDateTime
    ),
  };

  if (
    !validatedPoll.title ||
    !validatedPoll.creatorName ||
    !validatedPoll.creatorEmail ||
    validatedPoll.timeSlots.length === 0
  ) {
    errorMessage.value =
      "Please fill in all required fields and ensure time slots are valid.";
    showError.value = true;
    isLoading.value = false;
    return;
  }

  try {
    const response = await axios.post("/api/polls/create", validatedPoll);
    console.log(response);

    if (response.data.success) {
      showSuccess.value = true;
      resetForm();
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "An error occurred.";
    showError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  poll.value = {
    title: "",
    description: "",
    timeSlots: [
      {
        startDateTime: getCurrentDateTime(),
        endDateTime: (() => {
          const end = new Date(getCurrentDateTime());
          end.setHours(end.getHours() + 1);
          return end.toISOString().slice(0, 16);
        })(),
      },
    ],
    creatorName: "",
    creatorEmail: "",
  };
};
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
</style>
