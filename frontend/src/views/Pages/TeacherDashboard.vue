<template>
  <v-container fluid class="pa-6 dashboard-bg">
    <!-- HEADER -->
    <!-- <v-row class="mb-6" align="center" justify="space-between">
      <v-col cols="12" md="6">
        <div class="text-h5 font-weight-bold">Advisor Dashboard</div>

        <div class="d-flex align-center mt-3">
          <v-avatar size="50" class="me-3">
            <v-img src="https://i.pravatar.cc/100?img=5" />
          </v-avatar>

          <div>
            <div class="font-weight-medium">Mrs. Santos</div>
            <div class="text-caption text-grey">
              Adviser of: Grade 8 - Section A
            </div>
            <div class="text-caption text-grey">
              School Year: 2023–2024 | Quarter: Q3
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="3" class="text-md-right mt-4 mt-md-0">
        <v-btn color="amber-darken-2" size="large" rounded="lg" elevation="2">
          Submit Class Report →
        </v-btn>
      </v-col>
    </v-row> -->

    <!-- STATS CARDS -->
    <v-row class="mb-6" dense>
      <v-col cols="12" md="4">
        <v-card class="pa-4 stat-card" elevation="0">
          <div class="stat-icon-wrap blue-icon">
            <v-icon icon="mdi-account-group-outline" size="24" />
          </div>
          <div>
            <div class="text-h6 font-weight-bold">
              {{ studentCount ? studentCount : 0 }}
            </div>
            <div class="text-caption text-medium-emphasis">Total Students</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 stat-card red-light" elevation="0">
          <div class="stat-icon-wrap red-icon">
            <v-icon icon="mdi-alert-outline" size="24" />
          </div>
          <div>
            <div class="text-h6 font-weight-bold">
              {{ atRiskCount ? atRiskCount : 0 }}
            </div>
            <div class="text-caption text-medium-emphasis">
              At-Risk Student/s
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 stat-card orange-light" elevation="0">
          <div class="stat-icon-wrap orange-icon">
            <v-icon icon="mdi-clipboard-alert-outline" size="24" />
          </div>
          <div>
            <div class="text-h6 font-weight-bold">
              {{ lardoCount ? lardoCount : 0 }}
            </div>
            <div class="text-caption text-medium-emphasis">LARDO Student/s</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- CHARTS -->
    <v-row class="mb-6" dense>
      <v-col cols="12" md="7">
        <v-card class="pa-4" elevation="0">
          <v-card-title class="font-weight-bold px-0"
            >Student Overview</v-card-title
          >
          <div class="chart-wrap">
            <Bar
              v-if="hasOverviewData"
              :data="overviewChartData"
              :options="barOptions"
            />
            <div v-else class="empty-chart">No data yet.</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="pa-4" elevation="0">
          <v-card-title class="font-weight-bold px-0"
            >Risk Level Breakdown</v-card-title
          >
          <div class="chart-wrap">
            <Doughnut
              v-if="hasRiskData"
              :data="riskChartData"
              :options="doughnutOptions"
            />
            <div v-else class="empty-chart">No at-risk students to chart.</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <!-- LEFT COLUMN -->
      <v-col cols="12" md="8">
        <!-- AT RISK TABLE -->
        <v-card class="mb-6 pa-4" elevation="0">
          <v-card-title
            class="font-weight-bold d-flex align-center flex-wrap ga-3 px-0"
          >
            At-Risk Students
            <v-spacer />
            <v-text-field
              v-model="search"
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              style="max-width: 220px"
            />
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="atRiskStudents"
            :search="search"
            density="comfortable"
            class="risk-table"
          >
            <template v-slot:[`item.transmuted_grade`]="{ item }">
              <v-chip
                :color="riskInfo(item.transmuted_grade).color"
                size="small"
                variant="flat"
              >
                <span class="text-white">
                  {{ riskInfo(item.transmuted_grade).label }}
                </span>
              </v-chip>
            </template>
            <template v-slot:[`item.grade`]="{ item }">
              {{ item.transmuted_grade }}
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <v-btn
                size="small"
                :color="riskInfo(item.transmuted_grade).color"
                variant="flat"
              >
                <span class="text-white" style="font-size: 10px">
                  {{ riskInfo(item.transmuted_grade).action }}
                </span>
              </v-btn>
            </template>

            <template v-slot:no-data>
              <div class="py-8 text-center text-medium-emphasis">
                <v-icon
                  icon="mdi-check-circle-outline"
                  size="32"
                  class="mb-2"
                />
                <div>No at-risk students found.</div>
              </div>
            </template>
          </v-data-table>
        </v-card>

        <!-- BOTTOM ROW -->
        <!-- <v-row dense>
          <v-col cols="12" md="6">
            <v-card class="pa-4 mb-6" elevation="2">
              <div class="font-weight-bold mb-3">
                Upcoming Remedial Sessions
              </div>
              <div v-for="(s, i) in remedials" :key="i" class="mb-2">
                <v-icon size="18" class="me-2">mdi-calendar</v-icon>
                {{ s }}
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="pa-4 mb-6" elevation="2">
              <div class="font-weight-bold mb-3">Important Reminders</div>
              <div v-for="(r, i) in reminders" :key="i" class="mb-2">
                <v-icon size="18" class="me-2">mdi-bell</v-icon>
                {{ r }}
              </div>
            </v-card>
          </v-col>
        </v-row> -->

        <!-- REPORT BUTTONS -->
        <!-- <v-card class="pa-4 mb-6" elevation="2">
          <div class="font-weight-bold mb-3">Report</div>

          <v-row dense>
            <v-col cols="12" md="3">
              <v-btn
                :to="'/' + 'employee/students-records'"
                router
                block
                color="blue"
                >SF2: Attendance</v-btn
              >
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                :to="'/' + 'employee/students-records'"
                router
                block
                color="indigo"
                >Class Record</v-btn
              >
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                :to="'/' + 'employee/students-records'"
                router
                block
                color="deep-purple"
                >SF9: Report Card</v-btn
              >
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                :to="'/' + 'employee/students-records'"
                router
                block
                color="cyan"
                >SF10: Student Record</v-btn
              >
            </v-col>
          </v-row>
        </v-card> -->
      </v-col>

      <!-- RIGHT COLUMN -->
      <v-col cols="12" md="4">
        <!-- MISBEHAVIOR -->
        <v-card class="mb-6" elevation="0">
          <v-card-title class="font-weight-bold">
            Student Misbehavior Reports
          </v-card-title>

          <v-list density="compact">
            <v-list-item
              v-for="(m, i) in paginatedMisbehave"
              :key="i"
              class="border-bottom py-2"
            >
              <div class="d-flex justify-space-between align-center">
                <v-list-item-title>{{ m.name }}</v-list-item-title>
                <v-chip
                  size="x-small"
                  :color="misbehaviorStatus(m.status).color"
                  variant="flat"
                  class="ml-2"
                >
                  {{ misbehaviorStatus(m.status).label }}
                </v-chip>
              </div>
            </v-list-item>

            <v-list-item v-if="!paginatedMisbehave.length">
              <div class="text-caption text-medium-emphasis py-2">
                No misbehavior reports.
              </div>
            </v-list-item>
          </v-list>

          <div class="d-flex justify-center pa-4" v-if="misbehaveList.length">
            <v-pagination
              v-model="misPage"
              :length="misPageCount"
              total-visible="5"
              density="compact"
            />
          </div>
        </v-card>

        <!-- ALERTS -->
        <v-card class="mb-6" elevation="0">
          <v-card-title class="font-weight-bold">
            At-Risk & LARDO Alerts
          </v-card-title>

          <v-list density="compact">
            <v-list-item
              v-for="(a, i) in paginatedAlerts"
              :key="i"
              class="py-2"
            >
              <template v-slot:prepend>
                <v-icon
                  :color="a.transmuted_grade ? 'red' : 'orange'"
                  icon="mdi-alert"
                  size="20"
                  class="me-2"
                />
              </template>
              <span class="text-body-2">
                {{
                  a.transmuted_grade
                    ? 'At-Risk: ' + a.name + ', ' + a.remarks
                    : 'LARDO: ' + a.name + ', ' + a.remarks
                }}
              </span>
            </v-list-item>

            <v-list-item v-if="!paginatedAlerts.length">
              <div class="text-caption text-medium-emphasis py-2">
                No alerts.
              </div>
            </v-list-item>
          </v-list>

          <div class="d-flex justify-center pa-4" v-if="alertStudents.length">
            <v-pagination
              v-model="page"
              :length="pageCount"
              total-visible="5"
              density="compact"
            />
          </div>
        </v-card>

        <!-- NOTIFICATIONS -->
        <!-- <v-card elevation="2">
          <v-card-title class="font-weight-bold">
            Recent Notifications
          </v-card-title>

          <v-list density="compact">
            <v-list-item v-for="(n, i) in notifications" :key="i">
              <v-icon size="18" class="me-2">mdi-information</v-icon>
              {{ n }}
            </v-list-item>
          </v-list>
        </v-card> -->
      </v-col>
    </v-row>
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
  components: { Bar, Doughnut },
  data() {
    return {
      page: 1,
      itemsPerPage: 10,
      misPage: 1,
      misItemsPerPage: 10,
      search: '',
      roomList: [],
      atRiskCount: null,
      studentCount: null,
      lardoCount: null,
      atRiskStudents: [],
      alertStudents: [],
      misbehaveList: [],
      headers: [
        { title: 'LRN', key: 'lrn' },
        { title: 'Student Name', key: 'name' },
        // { title: 'Risk Level', key: 'transmuted_grade' },
        { title: 'Remarks', key: 'remarks' },
        { title: 'Grade', key: 'grade' },
        { title: 'Action', key: 'action', align: 'end' },
      ],

      students: [
        {
          lrn: '1885338',
          name: 'John Dela Cruz',
          risk: 'Low',
          reason: 'Low Scores',
          remedial: true,
        },
        {
          lrn: '1885339',
          name: 'Mia Santiago',
          risk: 'Moderate',
          reason: 'Frequent Absences',
          remedial: false,
        },
        {
          lrn: '1885340',
          name: 'Alex Reyes',
          risk: 'High',
          reason: 'Low Scores',
          remedial: true,
        },
      ],

      remedials: ['Ferdinand Lim – 3:30 PM', 'Mia Santiago – 4:30 PM'],

      reminders: ['Submit class report on time'],

      alerts: [
        'LARDO Alert: Louis skipped 5 days',
        'At-Risk: Mia low scores in English',
      ],

      notifications: [
        'Alex reported to Prefect',
        'Louis flagged as LARDO',
        'Counseling session tomorrow',
      ],

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
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
        },
      },
    };
  },
  mounted() {
    this.initialize();
  },
  watch: {
    '$store.getters.getFilterSelected'() {
      this.initialize();
    },
  },
  computed: {
    paginatedAlerts() {
      const list = this.alertStudents || [];
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return list.slice(start, end);
    },
    pageCount() {
      if (!this.alertStudents || !this.itemsPerPage) return 1;
      return Math.ceil(this.alertStudents.length / this.itemsPerPage);
    },
    paginatedMisbehave() {
      const list = this.misbehaveList || [];
      const start = (this.misPage - 1) * this.misItemsPerPage;
      const end = start + this.misItemsPerPage;
      return list.slice(start, end);
    },
    misPageCount() {
      if (!this.misbehaveList || !this.misItemsPerPage) return 1;
      return Math.ceil(this.misbehaveList.length / this.misItemsPerPage);
    },

    hasOverviewData() {
      return !!(this.studentCount || this.atRiskCount || this.lardoCount);
    },
    overviewChartData() {
      return {
        labels: ['Total Students', 'At-Risk', 'LARDO'],
        datasets: [
          {
            label: 'Students',
            data: [
              this.studentCount || 0,
              this.atRiskCount || 0,
              this.lardoCount || 0,
            ],
            backgroundColor: ['#1565c0', '#c62828', '#ef6c00'],
            borderRadius: 6,
            maxBarThickness: 60,
          },
        ],
      };
    },

    // Buckets atRiskStudents by the same riskInfo() thresholds used in the table,
    // so the chart and the table can never disagree.
    riskCounts() {
      const counts = { High: 0, Moderate: 0, Passable: 0, Good: 0, 'N/A': 0 };
      (this.atRiskStudents || []).forEach((s) => {
        const label = this.riskInfo(s.transmuted_grade).label;
        counts[label] = (counts[label] || 0) + 1;
      });
      return counts;
    },
    hasRiskData() {
      return (this.atRiskStudents || []).length > 0;
    },
    riskChartData() {
      const c = this.riskCounts;
      const entries = Object.entries(c).filter(([, v]) => v > 0);
      return {
        labels: entries.map(([label]) => label),
        datasets: [
          {
            data: entries.map(([, v]) => v),
            backgroundColor: entries.map(([label]) => {
              const colorMap = {
                High: '#e53935',
                Moderate: '#fb8c00',
                Passable: '#ffb300',
                Good: '#43a047',
                'N/A': '#9e9e9e',
              };
              return colorMap[label];
            }),
          },
        ],
      };
    },
  },
  methods: {
    initialize() {
      this.getFacultyDashboardData();
    },
    riskInfo(grade) {
      if (grade == null) {
        return { label: 'N/A', color: 'grey', action: '—' };
      }
      if (grade <= 70) {
        return {
          label: 'High',
          color: 'red',
          action: 'Remedial Class + Parent Meeting',
        };
      }
      if (grade <= 75) {
        return {
          label: 'Moderate',
          color: 'orange',
          action: 'Teacher Consultation',
        };
      }
      if (grade <= 80) {
        return {
          label: 'Passable',
          color: 'amber-darken-2',
          action: 'Counseling',
        };
      }
      return { label: 'Good', color: 'green', action: 'Monitor' };
    },
    misbehaviorStatus(status) {
      const map = {
        0: { label: 'Adviser Review', color: 'yellow-darken-2' },
        1: { label: 'Prefect Review', color: 'orange' },
        2: { label: 'Parent Review', color: 'red' },
      };
      return map[status] || { label: 'Resolved', color: 'green' };
    },

    getFacultyDashboardData() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/enroll-student/getFacultyDashboardData/' + filter,
        'GET',
      ).then((res) => {
        if (res) {
          this.roomList = res.data.data;
          this.studentCount = res.data.studentCount;
          this.atRiskCount = res.data.atRiskCount;
          this.lardoCount = res.data.lardoCount;
          this.atRiskStudents = res.data.atRiskStudents;
          this.misbehaveList = res.data.misbehaveList;
          this.alertStudents = res.data.alertStudents;

          console.log('getFacultyDashboardData', res.data);
        }
      });
    },
  },
};
</script>
<style scoped>
.dashboard-bg {
  background: #f5f6fa;
  min-height: 100vh;
}

.stat-card {
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
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
.red-icon {
  background: #ffcdd2;
  color: #c62828;
}
.orange-icon {
  background: #ffe0b2;
  color: #ef6c00;
}

.red-light {
  background: #ffebee;
}

.orange-light {
  background: #fff3e0;
}

.border-bottom {
  border-bottom: 1px solid #eee;
}

.risk-table :deep(thead th) {
  font-weight: 600 !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  opacity: 0.6;
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
