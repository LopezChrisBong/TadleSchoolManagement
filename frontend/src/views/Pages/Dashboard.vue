<template>
  <v-container fluid class="dashboard pa-6">
    <v-row dense class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="stat-card green-card">
          <div class="stat-number">{{ juniorCount ? juniorCount : 0 }}</div>
          <div class="stat-label">JHS Students</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="stat-card blue-card">
          <div class="stat-number">{{ seniorCount ? seniorCount : 0 }}</div>
          <div class="stat-label">SHS Students</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="stat-card red-card">
          <div class="stat-number">{{ riskCout ? riskCout : 0 }}</div>
          <div class="stat-label">At-Risk Students (Total: 71)</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="8">
        <!-- <v-row dense class="mb-6">
          <v-col cols="12" md="6">
            <v-card class="pa-4">
              <div class="section-title">At-Risk Overview (JHS)</div>

              <v-progress-circular
                model-value="71"
                :size="140"
                :width="18"
                color="orange"
                class="my-4"
              >
                71
              </v-progress-circular>

              <div class="legend">
                <div><span class="dot green"></span> Low 29</div>
                <div><span class="dot orange"></span> Moderate 24</div>
                <div><span class="dot red"></span> High 18</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="pa-4">
              <div class="section-title">At-Risk Overview (SHS)</div>

              <v-progress-circular
                model-value="27"
                :size="140"
                :width="18"
                color="deep-orange"
                class="my-4"
              >
                27
              </v-progress-circular>

              <div class="legend">
                <div><span class="dot green"></span> Low 12</div>
                <div><span class="dot orange"></span> Moderate 8</div>
                <div><span class="dot red"></span> High 7</div>
              </div>
            </v-card>
          </v-col>
        </v-row> -->

        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="section-title">Student Management</div>

            <!-- <v-btn size="small" color="amber-darken-2">
              Assign Adviser and Teacher →
            </v-btn> -->
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="atRisk"
            density="comfortable"
          >
            <template v-slot:[`item.transmuted_grade`]="{ item }">
              <v-chip
                size="small"
                :color="riskColor(item.transmuted_grade)"
                variant="flat"
              >
                {{ item.transmuted_grade }}
              </v-chip>
            </template>

            <template v-slot:[`item.actions`]>
              <v-btn size="x-small" variant="text">View</v-btn>
              <v-btn size="x-small" color="blue">Edit</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- <v-card class="mb-6 pa-4">
          <div class="section-title mb-4">Quick Access</div>

          <v-btn block class="mb-2" variant="outlined">Manage Classes</v-btn>
          <v-btn block class="mb-2" variant="outlined">Manage Teachers</v-btn>
          <v-btn block class="mb-2" variant="outlined">View SF2 & SF10</v-btn>
          <v-btn block color="orange">Generate Summary Reports</v-btn>
        </v-card> -->

        <v-card class="mb-6 pa-4">
          <div class="section-title mb-3">Announcements</div>

          <v-list density="compact">
            <v-list-item>
              <v-icon class="me-2" color="orange">mdi-bullhorn</v-icon>
              Parent Meeting – Friday 3PM
            </v-list-item>
            <v-list-item>
              <v-icon class="me-2" color="blue">mdi-file</v-icon>
              Submit class reports by Feb 29
            </v-list-item>
          </v-list>
        </v-card>

        <!-- <v-card class="pa-4">
          <div class="section-title mb-3">At-Risk & LARDO Students</div>

          <v-list density="compact">
            <v-list-item v-for="(s, i) in sidebarStudents" :key="i">
              <v-list-item-title>
                {{ s.name }}
              </v-list-item-title>
              <v-btn size="x-small" variant="text">View</v-btn>
            </v-list-item>
          </v-list>
        </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        { title: 'LRN', key: 'lrn' },
        { title: 'Student Name', key: 'student_name' },
        // { title: 'Status', key: 'status' },
        { title: 'At-Risk Grade', key: 'transmuted_grade' },
        { title: 'Adviser', key: 'adviser' },
        { title: 'Grade', key: 'grade_level' },
        { title: 'Section', key: 'room_name' },
      ],

      // sidebarStudents: [
      //   { name: 'John Dela Cruz' },
      //   { name: 'Mia Santiago' },
      //   { name: 'Alex Reyes' },
      // ],

      juniorCount: null,
      seniorCount: null,
      riskCout: null,
      atRisk: [],
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getFacultyDashboardData();
    },
    riskColor(risk) {
      if (risk <= 75) return 'red';
      if (risk <= 80) return 'orange';
      return 'green';
    },

    getFacultyDashboardData() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/enroll-student/getAdminDashboardData/' + filter,
        'GET',
      ).then((res) => {
        if (res) {
          this.juniorCount = res.data.juniorCount;
          this.seniorCount = res.data.seniorCount;
          this.atRisk = res.data.atRisk;
          this.riskCout = res.data.riskCout;

          console.log('getAdminDashboardData', res.data);
        }
      });
    },
  },
};
</script>
<style scoped>
.dashboard {
  /* background: #f4f6f9; */
  min-height: 100vh;
}

.stat-card {
  padding: 20px;
  border-radius: 12px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.green-card {
  background: #e8f5e9;
}
.blue-card {
  background: #e3f2fd;
}
.red-card {
  background: #ffebee;
}
.grey-card {
  background: #eceff1;
}

.section-title {
  font-weight: 600;
  font-size: 15px;
}

.legend {
  font-size: 13px;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.green {
  background: green;
}
.orange {
  background: orange;
}
.red {
  background: red;
}
</style>
