<template>
  <v-form @submit.prevent="submitForm" ref="formRef">
    <!-- First Name -->
    <v-text-field
      density="compact"
      variant="solo-filled"
      label="Nom"
      v-model.trim="form.first_name"
      :rules="[requiredRule]"
    ></v-text-field>

    <!-- Last Name -->
    <v-text-field
      density="compact"
      variant="solo-filled"
      label="Prénom"
      v-model.trim="form.last_name"
      :rules="[requiredRule]"
    ></v-text-field>

    <!-- Binome Section -->
    <div v-if="isBinome" class="binome">
      <h3 class="pa-2">Binome:</h3>
      <!-- Binome First Name -->
      <v-text-field
        density="compact"
        variant="solo-filled"
        label="Nom"
        v-model.trim="form.first_name2"
        :rules="isBinome ? [requiredRule] : []"
      ></v-text-field>

      <!-- Binome Last Name -->
      <v-text-field
        density="compact"
        variant="solo-filled"
        label="Prénom"
        v-model.trim="form.last_name2"
        :rules="isBinome ? [requiredRule] : []"
      ></v-text-field>
    </div>

    <!-- Toggle Binome -->
    <v-btn
      class="my-3"
      size="small"
      variant="text"
      prepend-icon="mdi-plus"
      block
      @click="isBinome = !isBinome"
    >
      ajouter binome
    </v-btn>

    <!-- Theme -->
    <v-text-field
      density="compact"
      variant="solo-filled"
      label="Theme"
      v-model="form.title"
      :rules="[requiredRule]"
    ></v-text-field>

    <!-- Date -->
    <v-date-input
      density="compact"
      variant="solo-filled"
      label="Date"
      prepend-icon=""
      prepend-inner-icon="mdi-calendar"
      v-model="form.date"
      :min="yesterday"
      :rules="[requiredRule]"
    ></v-date-input>

    <!-- Time -->
    <v-select
      density="compact"
      variant="solo-filled"
      label="Heure"
      v-model="timeForm"
      :items="availableTimeSlots"
      :item-props="itemProps"
      :rules="[requiredRule]"
    ></v-select>

    <v-chip-group v-model="intervalPicked" selected-class="text-primary">
      <v-chip v-for="timeInterval in timeIntervals" :value="timeInterval">
        {{ timeInterval }} min
      </v-chip>
    </v-chip-group>

    <!-- Submit Button -->
    <v-btn block color="primary" type="submit">Soumettre</v-btn>
  </v-form>

  <!-- Success Snackbar -->
  <v-snackbar v-model="snackbar.show" :timeout="3000" color="success">
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { isSameDay } from "date-fns";

import { appointments } from "../composables/localStorage/appointments";

const timeIntervals = [30, 60];

// Form state
const isBinome = ref(false);

const form = reactive({
  first_name: "",
  last_name: "",
  first_name2: "",
  last_name2: "",
  title: "",
  date: new Date(), // Default to today's date
  start_time: null,
  end_time: null,
});

// Time selection
const timeForm = ref({
  start: null,
  end: null,
});

const intervalPicked = ref(timeIntervals[0]);

// Snackbar for success message
const snackbar = reactive({
  show: false,
  message: "",
});

// Form reference for validation
const formRef = ref(null);

// Calculate yesterday's date
const yesterday = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() - 1); // Subtract 1 day from today
  return date;
});

// Validation rule
const requiredRule = (value) => !!value || "Ce champ est obligatoire.";

// Function to generate time range options dynamically
const generateTimeRangeOptions = (startTime, endTime, intervalMinutes) => {
  const options = [];
  let currentTime = new Date(`1970-01-01T${startTime}:00`);

  while (currentTime < new Date(`1970-01-01T${endTime}:00`)) {
    const startHours = currentTime.getHours().toString().padStart(2, "0");
    const startMinutes = currentTime.getMinutes().toString().padStart(2, "0");
    const startFormatted = `${startHours}:${startMinutes}`;

    // Add interval to current time to get end time
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    const endHours = currentTime.getHours().toString().padStart(2, "0");
    const endMinutes = currentTime.getMinutes().toString().padStart(2, "0");
    const endFormatted = `${endHours}:${endMinutes}`;

    // Add the time range to the options array
    options.push({ start: startFormatted, end: endFormatted });
  }

  return options;
};

// Generate time range options from 08:00 to 18:00 in 30-minute intervals
const timeOptions = computed(() =>
  generateTimeRangeOptions("08:00", "18:00", intervalPicked.value)
);

const availableTimeSlots = computed(() => {
  // Get all booked time slots
  const takenTimeSlots = appointments.value
    .filter((a) => isSameDay(a.date, form.date))
    .map((a) => ({
      start: a.start_time,
      end: a.end_time,
    }));

  // Filter out time slots that are already booked
  return timeOptions.value.filter((timeSlot) => {
    const timeSlotStart = new Date(`1970-01-01T${timeSlot.start}:00`);
    const timeSlotEnd = new Date(`1970-01-01T${timeSlot.end}:00`);
    return !takenTimeSlots.some((takenSlot) => {
      const takenSlotStart = new Date(`1970-01-01T${takenSlot.start}:00`);
      const takenSlotEnd = new Date(`1970-01-01T${takenSlot.end}:00`);

      return (
        (timeSlotStart >= takenSlotStart && timeSlotStart < takenSlotEnd) ||
        (timeSlotEnd > takenSlotStart && timeSlotEnd <= takenSlotEnd) ||
        (timeSlotStart <= takenSlotStart && timeSlotEnd >= takenSlotEnd)
      );
    });
  });
});

// Function to define item properties for v-select
const itemProps = (item) => {
  return {
    title: item.start && item.end ? `${item.start} - ${item.end}` : null, // Display text in the dropdown
    value: item, // Value to store in v-model
  };
};

// Form submission
const submitForm = async () => {
  // Validate form
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  // Set start and end time
  form.start_time = timeForm.value.start;
  form.end_time = timeForm.value.end;
  form.date = new Date(form.date).toISOString().split("T")[0];

  // Add appointment to the list
  appointments.value.push({ ...form });

  // Show success message
  snackbar.message = "Rendez-vous ajouté avec succès!";
  snackbar.show = true;

  // Reset form
  formRef.value.reset();
  isBinome.value = false;
  timeForm.value = { start: null, end: null };
};
</script>
