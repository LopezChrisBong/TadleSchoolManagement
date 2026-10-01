<template>
  <v-container fluid class="dash pa-4 pa-md-6">
    <!-- Header -->
    <header class="page-head">
      <h1 class="page-title">Discipline overview</h1>
      <p class="page-sub">
        Student behavior, incidents and repeat cases for the current school
        year.
      </p>
    </header>

    <!-- Overview strip -->
    <section class="overview" aria-label="Totals">
      <div v-for="card in stats" :key="card.title" class="overview-cell">
        <span class="stat-icon-wrap" :class="card.iconClass">
          <v-icon :icon="card.icon" size="20" />
        </span>
        <span class="cell-body">
          <span class="cell-label">{{ card.title }}</span>
          <span class="cell-value">{{ card.value }}</span>
        </span>
      </div>
    </section>

    <!-- Charts -->
    <v-row dense>
      <v-col cols="12" md="7">
        <v-card class="panel" elevation="0">
          <h2 class="panel-title">Incidents by status</h2>
          <p class="panel-sub">How many incidents sit in each stage</p>
          <div class="chart-wrap">
            <Bar
              v-if="hasIncidentData"
              :data="incidentChartData"
              :options="barOptions"
            />
            <div v-else class="empty">
              <v-icon icon="mdi-chart-bar" size="34" />
              <strong>No incidents yet</strong>
              <span>Reported incidents will be charted here.</span>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="panel" elevation="0">
          <h2 class="panel-title">Behavior severity</h2>
          <p class="panel-sub">Share of students in each severity level</p>
          <div class="chart-wrap">
            <Doughnut
              v-if="hasBehaviorData"
              :data="behaviorChartData"
              :options="doughnutOptions"
            />
            <div v-else class="empty">
              <v-icon icon="mdi-chart-donut" size="34" />
              <strong>No behavior data yet</strong>
              <span>The split appears once behavior is recorded.</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Incidents + offenders -->
    <v-row dense>
      <v-col cols="12" md="8">
        <v-card class="panel panel-fill" elevation="0">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Recent incidents</h2>
              <p class="panel-sub">
                {{ incidents.length }}
                {{ incidents.length === 1 ? 'incident' : 'incidents' }}
              </p>
            </div>
            <v-text-field
              v-model="search"
              density="compact"
              placeholder="Search student or violation"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              clearable
              single-line
              class="search-field"
            />
          </div>

          <v-data-table
            :headers="headers"
            :items="incidents"
            :search="search"
            density="comfortable"
            hover
            class="tbl"
          >
            <template v-slot:[`item.student`]="{ item }">
              <div class="person">
                <v-avatar
                  size="30"
                  color="primary"
                  variant="tonal"
                  class="avatar"
                >
                  {{ initials(item.student) }}
                </v-avatar>
                <span class="person-name">{{ item.student }}</span>
              </div>
            </template>

            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="tonal"
              >
                {{ item.status }}
              </v-chip>
            </template>

            <template v-slot:no-data>
              <div class="empty">
                <v-icon icon="mdi-check-circle-outline" size="34" />
                <strong>No recent incidents</strong>
                <span>Nothing has been reported.</span>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="panel panel-fill" elevation="0">
          <h2 class="panel-title">Latest offenders</h2>
          <p class="panel-sub">Students ranked by number of cases</p>

          <ul v-if="topOffenders.length" class="rank-list">
            <li
              v-for="(student, i) in topOffenders"
              :key="student.name + i"
              class="rank-row"
            >
              <v-avatar size="32" class="rank" :class="rankClass(i)">
                {{ i + 1 }}
              </v-avatar>
              <span class="rank-name">{{ student.name }}</span>
              <span class="rank-cases">
                {{ student.cases }}
                <small>case{{ student.cases === 1 ? '' : 's' }}</small>
              </span>
            </li>
          </ul>

          <div v-else class="empty">
            <v-icon icon="mdi-account-check-outline" size="34" />
            <strong>No offenders recorded</strong>
            <span>Repeat cases will be listed here.</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Behavior summary -->
    <v-card class="panel" elevation="0">
      <h2 class="panel-title">Behavior summary</h2>
      <p class="panel-sub">Percentage of students by behavior level</p>

      <div v-if="behaviorSummary.length" class="summary">
        <div
          v-for="item in behaviorSummary"
          :key="item.label"
          class="summary-row"
        >
          <div class="summary-top">
            <span class="summary-label">{{ item.label }}</span>
            <span class="summary-value">{{ item.value }}%</span>
          </div>
          <v-progress-linear
            :model-value="item.value"
            height="8"
            rounded
            :color="item.color"
            bg-color="surface-variant"
            bg-opacity="0.25"
          />
        </div>
      </div>

      <div v-else class="empty">
        <v-icon icon="mdi-chart-timeline-variant" size="34" />
        <strong>No summary yet</strong>
        <span>Behavior levels appear once records exist.</span>
      </div>
    </v-card>
  </v-container>
</template>

<script>
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

export default {
  name: 'DisciplineDashboard',
  components: {
    Bar,
    Doughnut,
  },

  data() {
    return {
      stats: [],
      search: '',

      headers: [
        { title: 'Student', key: 'student' },
        { title: 'Violation', key: 'violation' },
        { title: 'Date', key: 'date' },
        { title: 'Status', key: 'status' },
      ],

      incidents: [],
      topOffenders: [],
      behaviorSummary: [],

      barOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },

      doughnutOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 12 },
          },
        },
      },

      statusColorHex: {
        Pending: '#e08a00',
        Resolved: '#2e9e5b',
        Adviser: '#d63b3b',
        'Un-Resolved': '#d63b3b',
        'Parent Meeting': '#c2185b',
      },

      behaviorColorHex: {
        green: '#2e9e5b',
        orange: '#e08a00',
        red: '#d63b3b',
      },
    };
  },

  mounted() {
    this.initialize();
  },

  computed: {
    incidentStatusCounts() {
      const counts = {};
      this.incidents.forEach((i) => {
        counts[i.status] = (counts[i.status] || 0) + 1;
      });
      return counts;
    },

    hasIncidentData() {
      return this.incidents?.length > 0;
    },

    incidentChartData() {
      const entries = Object.entries(this.incidentStatusCounts);
      return {
        labels: entries.map(([label]) => label),
        datasets: [
          {
            label: 'Incidents',
            data: entries.map(([, value]) => value),
            backgroundColor: entries.map(
              ([label]) => this.statusColorHex[label] || '#90a4ae',
            ),
            borderRadius: 6,
            maxBarThickness: 60,
          },
        ],
      };
    },

    hasBehaviorData() {
      return this.behaviorSummary.some((b) => b.value > 0);
    },

    behaviorChartData() {
      return {
        labels: this.behaviorSummary.map((b) => b.label),
        datasets: [
          {
            data: this.behaviorSummary.map((b) => b.value),
            backgroundColor: this.behaviorSummary.map(
              (b) => this.behaviorColorHex[b.color] || '#90a4ae',
            ),
            borderWidth: 0,
          },
        ],
      };
    },
  },

  methods: {
    initialize() {
      this.getPrefectDashboardData();
    },

    getPrefectDashboardData() {
      const filter = this.$store.getters.getFilterSelected;
      const assignedModuleID = localStorage.getItem('AssignedModID');

      this.axiosCall(
        '/enroll-student/getPrefectDashboardData/' +
          filter +
          '/' +
          assignedModuleID,
        'GET',
      ).then((res) => {
        if (res) {
          this.stats = res.data.stats ?? [];
          this.incidents = res.data.incidents ?? [];
          this.topOffenders = res.data.topOffenders ?? [];
          this.behaviorSummary = res.data.behaviorSummary ?? [];
        }
      });
    },

    initials(name) {
      return (
        String(name || '?')
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0].toUpperCase())
          .join('') || '?'
      );
    },

    getStatusColor(status) {
      switch (status) {
        case 'Pending':
          return 'orange';
        case 'Resolved':
          return 'green';
        case 'Adviser':
        case 'Un-Resolved':
          return 'red';
        case 'Parent Meeting':
          return 'pink';
        default:
          return 'grey';
      }
    },

    rankClass(index) {
      if (index === 0) return 'rank-gold';
      if (index === 1) return 'rank-silver';
      if (index === 2) return 'rank-bronze';
      return 'rank-default';
    },
  },
};
</script>

<style scoped>
.dash {
  --line: rgba(var(--v-border-color), var(--v-border-opacity));
  --muted: rgba(var(--v-theme-on-surface), 0.62);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
}
.page-sub {
  margin: 2px 0 0;
  font-size: 14px;
  color: var(--muted);
}

/* ---------- Overview strip ---------- */
.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
}
.overview-cell {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-right: 1px solid var(--line);
}
.overview-cell:last-child {
  border-right: 0;
}
.stat-icon-wrap {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
}
.cell-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.cell-label {
  font-size: 13px;
  color: var(--muted);
}
.cell-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  font-variant-numeric: tabular-nums;
}

/* iconClass values coming from the API */
.blue-icon {
  background: color-mix(in srgb, #2b5fa8 14%, transparent);
  color: #2b5fa8;
}
.orange-icon {
  background: color-mix(in srgb, #d97706 14%, transparent);
  color: #d97706;
}
.green-icon {
  background: color-mix(in srgb, #2e9e5b 14%, transparent);
  color: #2e9e5b;
}
.red-icon {
  background: color-mix(in srgb, #d63b3b 14%, transparent);
  color: #d63b3b;
}
.pink-icon {
  background: color-mix(in srgb, #c2185b 14%, transparent);
  color: #c2185b;
}

/* ---------- Panels ---------- */
.panel {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px;
}
.panel-fill {
  height: 100%;
}
.panel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}
.panel-title {
  font-size: 17px;
  font-weight: 650;
  line-height: 1.3;
}
.panel-sub {
  margin: 2px 0 12px;
  font-size: 13px;
  color: var(--muted);
}
.panel-head .panel-sub {
  margin-bottom: 0;
}
.search-field {
  min-width: 220px;
  max-width: 280px;
}
.chart-wrap {
  position: relative;
  height: 250px;
}

/* ---------- Table ---------- */
.tbl {
  background: transparent;
}
.tbl :deep(thead th) {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: var(--muted) !important;
  background: rgba(var(--v-theme-on-surface), 0.03) !important;
  white-space: nowrap;
}
.tbl :deep(tbody td) {
  font-size: 13.5px;
}
.tbl :deep(tbody tr:last-child td) {
  border-bottom: 0;
}
.person {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  font-size: 12px;
  font-weight: 600;
}
.person-name {
  font-weight: 550;
  white-space: nowrap;
}

/* ---------- Offenders ---------- */
.rank-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.rank-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}
.rank-row:last-child {
  border-bottom: 0;
}
.rank {
  flex: none;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.rank-gold {
  background: #d99a00;
}
.rank-silver {
  background: #8d949b;
}
.rank-bronze {
  background: #b06a3b;
}
.rank-default {
  background: #aab4bd;
}
.rank-name {
  flex: 1;
  min-width: 0;
  font-weight: 550;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rank-cases {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.rank-cases small {
  font-weight: 400;
  color: var(--muted);
}

/* ---------- Behavior summary ---------- */
.summary {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.summary-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
}
.summary-label {
  font-weight: 550;
}
.summary-value {
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 32px 12px;
  text-align: center;
  font-size: 13px;
  color: var(--muted);
}
.empty strong {
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface));
}

@media (max-width: 600px) {
  .overview-cell {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .overview-cell:last-child {
    border-bottom: 0;
  }
  .search-field {
    max-width: none;
    flex: 1 1 100%;
  }
}
</style>
