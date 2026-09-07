<template>
  <v-container fluid class="dashboard pa-6">
    <v-row dense class="mb-6">
      <v-col cols="12" md="4">
        <v-card
          class="stat-card green-card"
          elevation="0"
          @click="JuniorHighList()"
        >
          <div class="stat-icon-wrap green-icon">
            <v-icon icon="mdi-school-outline" size="26" />
          </div>
          <div class="stat-text">
            <div class="stat-number">{{ juniorCount ?? 0 }}</div>
            <div class="stat-label">JHS Students</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
          class="stat-card blue-card"
          elevation="0"
          @click="SeniorHighList()"
        >
          <div class="stat-icon-wrap blue-icon">
            <v-icon icon="mdi-school" size="26" />
          </div>
          <div class="stat-text">
            <div class="stat-number">{{ seniorCount ?? 0 }}</div>
            <div class="stat-label">SHS Students</div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="stat-card red-card" elevation="0" @click="AtRiskList()">
          <div class="stat-icon-wrap red-icon">
            <v-icon icon="mdi-alert-outline" size="26" />
          </div>
          <div class="stat-text">
            <div class="stat-number">{{ riskCount ?? 0 }}</div>
            <div class="stat-label">
              At-Risk Students
              <span v-if="totalStudents" class="stat-sublabel"
                >(of {{ totalStudents }} total)</span
              >
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12">
        <v-card class="pa-4" elevation="0">
          <v-card-title
            class="d-flex justify-space-between align-center flex-wrap ga-3 px-0"
          >
            <div class="section-title">Student Management</div>
            <v-text-field
              v-model="search"
              density="compact"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search student, LRN, adviser..."
              hide-details
              single-line
              class="search-field"
            />
          </v-card-title>

          <div class="legend px-0 pb-3 d-flex ga-4">
            <span><span class="dot green" /> Safe (&gt;80)</span>
            <span><span class="dot orange" /> Watch (76–80)</span>
            <span><span class="dot red" /> At-Risk (&le;75)</span>
          </div>

          <v-data-table
            :headers="headers"
            :items="atRisk"
            :search="search"
            :loading="loading"
            density="comfortable"
            class="risk-table"
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

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn size="x-small" variant="text" @click="viewStudent(item)"
                >View</v-btn
              >
              <v-btn
                size="x-small"
                color="blue"
                variant="tonal"
                class="ml-1"
                @click="editStudent(item)"
                >Edit</v-btn
              >
            </template>

            <template v-slot:no-data>
              <div class="py-8 text-center text-medium-emphasis">
                <v-icon
                  icon="mdi-check-circle-outline"
                  size="36"
                  class="mb-2"
                />
                <div>No at-risk students found.</div>
              </div>
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
        // { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
      ],
      juniorCount: null,
      seniorCount: null,
      riskCount: null,
      totalStudents: null,
      atRisk: [],
      search: '',
      loading: false,
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
      if (risk == null) return 'grey';
      if (risk <= 75) return 'red';
      if (risk <= 80) return 'orange';
      return 'green';
    },
    viewStudent(item) {
      this.$emit('view-student', item);
    },
    editStudent(item) {
      this.$emit('edit-student', item);
    },
    JuniorHighList() {
      let filter = this.$store.getters.getFilterSelected;
      window.open(
        process.env.VUE_APP_SERVER +
          '/pdf-generator/getAllStudenListByLevel/' +
          filter +
          '/' +
          'Junior High' +
          '',
        '_blank',
      );
    },
    SeniorHighList() {
      let filter = this.$store.getters.getFilterSelected;
      window.open(
        process.env.VUE_APP_SERVER +
          '/pdf-generator/getAllStudenListByLevel/' +
          filter +
          '/' +
          'Senior High' +
          '',
        '_blank',
      );
    },
    AtRiskList() {
           let filter = this.$store.getters.getFilterSelected;
      window.open(
        process.env.VUE_APP_SERVER +
          '/pdf-generator/getAllAtRiskStudents/' +
          filter +
          '',
        '_blank',
      );
    },

    getFacultyDashboardData() {
      const filter = this.$store.getters.getFilterSelected;
      this.loading = true;
      this.axiosCall('/enroll-student/getAdminDashboardData/' + filter, 'GET')
        .then((res) => {
          if (res) {
            this.juniorCount = res.data.juniorCount;
            this.seniorCount = res.data.seniorCount;
            this.atRisk = res.data.atRisk;
            this.riskCount = res.data.riskCout ?? res.data.riskCount;
            this.totalStudents = res.data.totalStudents ?? null;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
}

.stat-card {
  padding: 20px;
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
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.green-icon {
  background: #c8e6c9;
  color: #2e7d32;
}
.blue-icon {
  background: #bbdefb;
  color: #1565c0;
}
.red-icon {
  background: #ffcdd2;
  color: #c62828;
}

.stat-number {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
}

.stat-label {
  font-size: 13px;
  opacity: 0.75;
}

.stat-sublabel {
  opacity: 0.6;
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
  font-size: 16px;
}

.search-field {
  max-width: 280px;
}

.risk-table :deep(thead th) {
  font-weight: 600 !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  opacity: 0.6;
}

.legend {
  font-size: 12px;
  opacity: 0.75;
}

.dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
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
