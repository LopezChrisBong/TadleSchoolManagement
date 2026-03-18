<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <h2 class="text-h5 font-weight-bold">
            Prefect of Discipline Dashboard
          </h2>
          <span class="text-caption"
            >Overview of student behavior and incidents</span
          >
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row>
      <v-col cols="12" md="3" v-for="card in stats" :key="card.title">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-caption">{{ card.title }}</div>
              <div class="text-h6 font-weight-bold">{{ card.value }}</div>
            </div>
            <v-icon size="36">{{ card.icon }}</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts + Tables -->
    <v-row class="mt-4">
      <!-- Incident Table -->
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title>Recent Incidents</v-card-title>
          <v-data-table
            :headers="headers"
            :items="incidents"
            class="elevation-1"
          >
            <template v-slot:[`item.status`]="{ item }">
              <v-chip :color="getStatusColor(item.status)" dark>
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Top Offenders -->
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title>Top Offenders</v-card-title>
          <v-list>
            <v-list-item v-for="student in topOffenders" :key="student.name">
              <v-list-item-title>{{ student.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ student.cases }} cases
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Behavior Summary -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2" class="pa-4">
          <v-card-title>Behavior Summary</v-card-title>
          <v-progress-linear
            v-for="item in behaviorSummary"
            :key="item.label"
            :model-value="item.value"
            height="20"
            class="mb-3"
          >
            <strong>{{ item.label }} ({{ item.value }}%)</strong>
          </v-progress-linear>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const stats = ref([
  { title: 'Total Incidents', value: 124, icon: 'mdi-alert' },
  { title: 'Pending Cases', value: 32, icon: 'mdi-clock' },
  { title: 'Resolved Cases', value: 78, icon: 'mdi-check-circle' },
  { title: 'Suspensions', value: 14, icon: 'mdi-account-off' },
]);

const headers = [
  { title: 'Student', key: 'student' },
  { title: 'Violation', key: 'violation' },
  { title: 'Date', key: 'date' },
  { title: 'Status', key: 'status' },
];

const incidents = ref([
  {
    student: 'Juan Dela Cruz',
    violation: 'Late Arrival',
    date: '2026-03-10',
    status: 'Pending',
  },
  {
    student: 'Maria Santos',
    violation: 'Uniform Violation',
    date: '2026-03-09',
    status: 'Resolved',
  },
  {
    student: 'Pedro Reyes',
    violation: 'Fighting',
    date: '2026-03-08',
    status: 'Serious',
  },
]);

const topOffenders = ref([
  { name: 'Pedro Reyes', cases: 5 },
  { name: 'Juan Dela Cruz', cases: 4 },
  { name: 'Ana Lopez', cases: 3 },
]);

const behaviorSummary = ref([
  { label: 'Minor Offenses', value: 60 },
  { label: 'Major Offenses', value: 30 },
  { label: 'Severe Cases', value: 10 },
]);

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'orange';
    case 'Resolved':
      return 'green';
    case 'Serious':
      return 'red';
    default:
      return 'grey';
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>
