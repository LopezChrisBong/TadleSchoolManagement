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
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <div class="section-title">Student Management</div>
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
        { title: 'At-Risk Grade', key: 'transmuted_grade' },
        { title: 'Adviser', key: 'adviser' },
        { title: 'Grade', key: 'grade_level' },
        { title: 'Section', key: 'room_name' },
      ],
      juniorCount: null,
      seniorCount: null,
      riskCout: null,
      atRisk: [],
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
