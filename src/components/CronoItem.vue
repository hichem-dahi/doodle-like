<template>
  <v-card>
    <template #title>
      <h4>{{ names }}</h4>
    </template>
    <template #append>
      <v-menu>
        <!-- Activator (mdi-close button) -->
        <template #activator="{ props: menuProps }">
          <v-btn
            variant="text"
            size="small"
            icon="mdi-menu"
            v-bind="menuProps"
          ></v-btn>
        </template>

        <!-- Menu content -->
        <v-list>
          <v-list-item density="compact" @click="deleteAppointment">
            <template #prepend>
              <v-btn variant="text" size="small" icon="mdi-close" />
            </template>
            <template #title>supprimer</template>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <v-card-subtitle>
      {{ formatDate(appointment.date) }}
    </v-card-subtitle>

    <v-card-subtitle>
      {{ appointment.start_time }} - {{ appointment.end_time }}
    </v-card-subtitle>

    <v-card-text>{{ appointment.title }}</v-card-text>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from "vue";
import { format } from "date-fns"; // Install date-fns: npm install date-fns
import { fr } from "date-fns/locale";

import { appointments } from "../composables/localStorage/appointments";

// Define the `appointment` prop
const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const names = computed(() => {
  const firstName = props.appointment.first_name || "";
  const lastName = props.appointment.last_name || "";
  const firstName2 = props.appointment.first_name2
    ? `, ${props.appointment.first_name2}`
    : "";
  const lastName2 = props.appointment.last_name2
    ? ` ${props.appointment.last_name2}`
    : "";

  return `${firstName} ${lastName}${firstName2}${lastName2}`.trim();
});

// Function to format the date
const formatDate = (dateString) => {
  if (!dateString) return "No date provided";
  return format(new Date(dateString), "MMMM d, yyyy", { locale: fr }); // Example: "October 15, 2023"
};

function deleteAppointment() {
  const index = appointments.value.findIndex((a) => a == props.appointment);
  appointments.value.splice(index, 1);
}
</script>
