<template>
  <v-container fluid class="pa-6 discipline-bg">
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="pa-4 border" elevation="0">
          <div class="d-flex align-center ga-3">
            <div class="header-icon-wrap">
              <v-icon icon="mdi-shield-account-outline" size="26" />
            </div>
            <div>
              <h2 class="text-h5 font-weight-bold">
                Prefect of Discipline Dashboard
              </h2>
              <span class="text-caption text-medium-emphasis"
                >Overview of student behavior and incidents</span
              >
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row dense>
      <v-col cols="12" sm="6" md="3" v-for="card in stats" :key="card.title">
        <v-card class="pa-4 stat-card border" elevation="0">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-caption text-medium-emphasis">
                {{ card.title }}
              </div>
              <div class="text-h6 font-weight-bold">{{ card.value }}</div>
            </div>
            <div class="stat-icon-wrap" :class="card.iconClass">
              <v-icon :icon="card.icon" size="22" />
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row class="mt-2" dense>
      <v-col cols="12" md="7">
        <v-card class="pa-4 border" elevation="0">
          <v-card-title class="font-weight-bold px-0"
            >Incidents by Status</v-card-title
          >
          <div class="chart-wrap">
            <Bar
              v-if="hasIncidentData"
              :data="incidentChartData"
              :options="barOptions"
            />
            <div v-else class="empty-chart">No incidents yet.</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-4 border" elevation="0">
          <v-card-title class="font-weight-bold px-0"
            >Behavior Severity Split</v-card-title
          >
          <div class="chart-wrap">
            <Doughnut
              v-if="hasBehaviorData"
              :data="behaviorChartData"
              :options="doughnutOptions"
            />
            <div v-else class="empty-chart">No behavior data yet.</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts + Tables -->
    <v-row class="mt-2">
      <!-- Incident Table -->
      <v-col cols="12" md="8">
        <v-card class="pa-4 border" elevation="0">
          <v-card-title class="font-weight-bold px-0"
            >Recent Incidents</v-card-title
          >
          <v-data-table
            :headers="headers"
            :items="incidents"
            density="comfortable"
            class="incident-table"
          >
            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="flat"
              >
                <span class="text-white">{{ item.status }}</span>
              </v-chip>
            </template>

            <template v-slot:no-data>
              <div class="py-8 text-center text-medium-emphasis">
                <v-icon
                  icon="mdi-check-circle-outline"
                  size="32"
                  class="mb-2"
                />
                <div>No recent incidents.</div>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Top Offenders -->
      <v-col cols="12" md="4">
        <v-card class="pa-4 border" elevation="0">
          <v-card-title class="font-weight-bold px-0"
            >Top Offenders</v-card-title
          >
          <v-list density="compact" lines="two">
            <v-list-item
              v-for="(student, i) in topOffenders"
              :key="student.name"
              class="offender-item"
            >
              <template v-slot:prepend>
                <v-avatar size="34" class="offender-rank" :class="rankClass(i)">
                  {{ i + 1 }}
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">
                {{ student.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ student.cases }} case{{ student.cases === 1 ? '' : 's' }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="!topOffenders.length">
              <div class="text-caption text-medium-emphasis py-2">
                No offenders recorded.
              </div>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Behavior Summary -->
    <v-row class="mt-2">
      <v-col cols="12">
        <v-card class="pa-4 border" elevation="0">
          <v-card-title class="font-weight-bold px-0"
            >Behavior Summary</v-card-title
          >
          <div v-for="item in behaviorSummary" :key="item.label" class="mb-4">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2 font-weight-medium">{{
                item.label
              }}</span>
              <span class="text-body-2 text-medium-emphasis"
                >{{ item.value }}%</span
              >
            </div>
            <v-progress-linear
              :model-value="item.value"
              height="10"
              rounded
              :color="item.color"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
);

const stats = ref([
  {
    title: 'Total Incidents',
    value: 124,
    icon: 'mdi-alert',
    iconClass: 'blue-icon',
  },
  {
    title: 'Pending Cases',
    value: 32,
    icon: 'mdi-clock-outline',
    iconClass: 'orange-icon',
  },
  {
    title: 'Resolved Cases',
    value: 78,
    icon: 'mdi-check-circle-outline',
    iconClass: 'green-icon',
  },
  {
    title: 'Suspensions',
    value: 14,
    icon: 'mdi-account-off-outline',
    iconClass: 'red-icon',
  },
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
  { label: 'Minor Offenses', value: 60, color: 'green' },
  { label: 'Major Offenses', value: 30, color: 'orange' },
  { label: 'Severe Cases', value: 10, color: 'red' },
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

const rankClass = (index) => {
  if (index === 0) return 'rank-gold';
  if (index === 1) return 'rank-silver';
  if (index === 2) return 'rank-bronze';
  return 'rank-default';
};

// --- Chart config ---
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
};
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
  },
};

const statusColorHex = {
  Pending: '#fb8c00',
  Resolved: '#43a047',
  Serious: '#e53935',
};

// Counts incidents by status directly from the `incidents` table data,
// so the chart always matches what's shown below it.
const incidentStatusCounts = computed(() => {
  const counts = {};
  incidents.value.forEach((i) => {
    counts[i.status] = (counts[i.status] || 0) + 1;
  });
  return counts;
});
const hasIncidentData = computed(() => incidents.value.length > 0);
const incidentChartData = computed(() => {
  const entries = Object.entries(incidentStatusCounts.value);
  return {
    labels: entries.map(([label]) => label),
    datasets: [
      {
        label: 'Incidents',
        data: entries.map(([, v]) => v),
        backgroundColor: entries.map(
          ([label]) => statusColorHex[label] || '#90a4ae',
        ),
        borderRadius: 6,
        maxBarThickness: 60,
      },
    ],
  };
});

const behaviorColorHex = {
  green: '#43a047',
  orange: '#fb8c00',
  red: '#e53935',
};
const hasBehaviorData = computed(() =>
  behaviorSummary.value.some((b) => b.value > 0),
);
const behaviorChartData = computed(() => ({
  labels: behaviorSummary.value.map((b) => b.label),
  datasets: [
    {
      data: behaviorSummary.value.map((b) => b.value),
      backgroundColor: behaviorSummary.value.map(
        (b) => behaviorColorHex[b.color] || '#90a4ae',
      ),
    },
  ],
}));
</script>

<style scoped>
.discipline-bg {
  min-height: 100vh;
}

.v-card {
  border-radius: 14px;
}

.v-card.border {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.header-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #ede7f6;
  color: #5e35b1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.blue-icon {
  background: #bbdefb;
  color: #1565c0;
}
.orange-icon {
  background: #ffe0b2;
  color: #ef6c00;
}
.green-icon {
  background: #c8e6c9;
  color: #2e7d32;
}
.red-icon {
  background: #ffcdd2;
  color: #c62828;
}

.incident-table :deep(thead th) {
  font-weight: 600 !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  opacity: 0.6;
}

.offender-item {
  border-bottom: 1px solid #f0f0f0;
}

.offender-rank {
  font-weight: 700;
  font-size: 13px;
  color: #fff;
}

.rank-gold {
  background: #f9a825;
}
.rank-silver {
  background: #9e9e9e;
}
.rank-bronze {
  background: #ba7245;
}
.rank-default {
  background: #90a4ae;
}

.chart-wrap {
  height: 240px;
  position: relative;
}

.empty-chart {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.4);
  font-size: 13px;
}
</style>
