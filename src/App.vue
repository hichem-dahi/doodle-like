<template>
  <v-app>
    <v-main>
      <v-card>
        <v-tabs v-model="tab">
          <v-tab value="one">Liste des soutenance</v-tab>
          <v-tab value="two">Ajouter un crono (soutenance)</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
              <CronoItem
                v-for="appointment in sortedAppointments"
                :appointment="appointment"
              />
            </v-tabs-window-item>

            <v-tabs-window-item value="two">
              <AddCrono />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from "vue";
import { isAfter } from "date-fns";

import { appointments } from "./composables/localStorage/appointments";

import CronoItem from "./components/CronoItem.vue";
import AddCrono from "./components/AddCrono.vue";

const tab = ref("two");

const sortedAppointments = computed(() => {
  return appointments.value.slice().sort((a, b) => {
    const dateA = new Date(`${a.date.split("T")[0]}T${a.start_time}`);
    const dateB = new Date(`${b.date.split("T")[0]}T${b.start_time}`);

    if (isAfter(dateA, dateB)) return 1; // dateA is after dateB
    if (isAfter(dateB, dateA)) return -1; // dateA is before dateB
    return 0; // dates are equal
  });
});
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
