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
        <v-card class="pa-4 stat-card" elevation="2">
          <div class="text-h6 font-weight-bold">
            {{ studentCount ? studentCount : 0 }}
          </div>
          <div class="text-caption">Total Students</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 stat-card red-light" elevation="2">
          <div class="text-h6 font-weight-bold">
            {{ atRiskCount ? atRiskCount : 0 }} At-Risk
          </div>
          <div class="text-caption">Student/s</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 stat-card orange-light" elevation="2">
          <div class="text-h6 font-weight-bold">
            {{ lardoCount ? lardoCount : 0 }} LARDO
          </div>
          <div class="text-caption">Student/s</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row dense>
      <!-- LEFT COLUMN -->
      <v-col cols="12" md="8">
        <!-- AT RISK TABLE -->
        <v-card class="mb-6 pa-4" elevation="2">
          <v-card-title class="font-weight-bold">
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
          >
            <template v-slot:[`item.transmuted_grade`]="{ item }">
              <v-chip
                :color="riskColor(item.transmuted_grade)"
                size="small"
                variant="flat"
              >
                <span class="text-white">
                  {{
                    item.transmuted_grade <= 70
                      ? 'High'
                      : item.transmuted_grade <= 75
                      ? 'Moderate'
                      : 'Passable'
                  }}
                </span>
              </v-chip>
            </template>
            <template v-slot:[`item.grade`]="{ item }">
              {{ item.transmuted_grade }}
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <v-btn
                size="small"
                :color="
                  item.transmuted_grade <= 75
                    ? 'orange'
                    : item.transmuted_grade <= 80
                    ? 'yellow'
                    : 'green'
                "
                variant="flat"
              >
                <span class="text-white" style="font-size: 10px">
                  {{
                    item.transmuted_grade <= 70
                      ? 'Remedial Class + Parent Meeting'
                      : item.transmuted_grade <= 75
                      ? 'Teacher Consultation'
                      : 'Counceling'
                  }}
                </span>
              </v-btn>
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
        <v-card class="pa-4 mb-6" elevation="2">
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
        </v-card>
      </v-col>

      <!-- RIGHT COLUMN -->
      <v-col cols="12" md="4">
        <!-- MISBEHAVIOR -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="font-weight-bold">
            Student Misbehavior Reports
          </v-card-title>

          <v-list density="compact">
            <v-list-item
              v-for="(m, i) in misbehaveList"
              :key="i"
              class="border-bottom"
            >
              <v-list-item-title>
                {{ m.name }}
              </v-list-item-title>

              <v-chip
                size="x-small"
                :color="m.status == 0 ? 'red' : 'green'"
                variant="flat"
              >
                {{ m.status == 0 ? 'Pending' : 'Resolve' }}
              </v-chip>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- ALERTS -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="font-weight-bold">
            At-Risk & LARDO Alerts
          </v-card-title>

          <v-list density="compact">
            <v-list-item v-for="(a, i) in alertStudents" :key="i">
              <v-icon color="orange" class="me-2">mdi-alert</v-icon>
              {{
                a.transmuted_grade
                  ? 'At-Risk:' + a.name + ', ' + a.remarks
                  : 'Lardo:' + a.name + ', ' + a.remarks
              }}
            </v-list-item>
          </v-list>
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
export default {
  data() {
    return {
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

      reminders: [
        // 'Submit class report by 5 PM',
        'Submit class report on time',
        // 'Plan counseling for Alex Reyes',
      ],

      alerts: [
        'LARDO Alert: Louis skipped 5 days',
        'At-Risk: Mia low scores in English',
      ],

      notifications: [
        'Alex reported to Prefect',
        'Louis flagged as LARDO',
        'Counseling session tomorrow',
      ],
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
      if (risk <= 75) return 'orange';
      if (risk <= 80) return 'yellow';
      return 'green';
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
  border-radius: 14px;
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
</style>
