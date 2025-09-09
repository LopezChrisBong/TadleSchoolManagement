<template>
  <v-container fluid class="pa-6 bg-white-lighten-4">
    <!-- Header Stats -->
    <v-row>
      <v-col
        cols="12"
        md="4"
        class="dt-container"
        elevation="0"
        v-for="card in headerCards"
        :key="card.title"
      >
        <v-card class="pa-3" outlined>
          <v-row align="center">
            <v-col cols="3">
              <v-icon size="36">{{ card.icon }}</v-icon>
            </v-col>
            <v-col cols="9">
              <div class="text-subtitle-2">{{ card.title }}</div>
              <div class="text-h6 font-weight-bold">{{ card.value }}</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Attendance Section -->

      <v-col
        cols="12"
        md="4"
        v-for="attendance in attendanceData"
        :key="attendance.title"
      >
        <v-card class="pa-3" outlined>
          <div class="text-subtitle-1 font-weight-medium mb-2">
            {{ attendance.title }}
          </div>
          <div class="d-flex justify-space-between">
            <div>
              Present No. <strong>{{ attendance.present }}</strong>
            </div>
            <div>
              Absent No. <strong>{{ attendance.absent }}</strong>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Student Directory -->
    <v-card class="pa-4 my-4">
      <div class="text-h6 mb-4">Student Directory of At-Risk and Warning</div>
      <v-data-table
        :headers="studentHeaders"
        :items="studentList"
        class="elevation-1"
      >
        <template v-slot:[`item.feeStatus`]="{ item }">
          <v-chip
            :color="
              item.feeStatus == 1
                ? 'orange'
                : item.feeStatus == 2
                ? 'green'
                : 'red'
            "
            dark
            small
          >
            <span>
              {{
                item.feeStatus == 1
                  ? "Warning"
                  : item.feeStatus == 2
                  ? "Passed"
                  : "At-risk"
              }}</span
            >
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Bottom Panels -->
    <!-- <v-row>
      <v-col cols="6">
        <v-card class="pa-4">
          <div class="text-h6 mb-4">Fees Collection</div>
          <canvas id="fees-chart"></canvas>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card class="pa-4 mb-4">
          <div class="text-h6 mb-2">Class Wise Performance</div>
          <div class="text-subtitle-1">
            Attendance Average: <strong>95%</strong>
          </div>
          <div class="text-subtitle-1">
            Edu. Grade Average: <strong>B+</strong>
          </div>
        </v-card>

        <v-card class="pa-4">
          <div class="text-h6 mb-2">Upcoming Activities</div>
          <v-list dense>
            <v-list-item v-for="event in upcomingEvents" :key="event.title">
              <v-list-item-content>
                <v-list-item-title>{{ event.title }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{ event.date }} • {{ event.time }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
// import Chart from "chart.js/auto";

export default {
  name: "DashboardPage",
  data() {
    return {
      headerCards: [
        {
          title: "Total Enrolled Students",
          value: "5,252",
          icon: "mdi-school",
        },
        { title: "Total Teachers", value: "132", icon: "mdi-account-tie" },
        // { title: "Working Staff", value: "38", icon: "mdi-account-group" },
        // { title: "This Month Events", value: "15", icon: "mdi-calendar" },
      ],
      attendanceData: [
        { title: "Student Attendance", present: 4752, absent: 437 },
        // { title: "Teachers Attendance", present: 132, absent: 4 },
        // { title: "Staff Attendance", present: 32, absent: 6 },
      ],
      studentHeaders: [
        { title: "Student Name", value: "name" },
        { title: "Parents Names", value: "parents" },
        { title: "Phone", value: "phone" },
        { title: "Class", value: "class" },
        { title: "Grade", value: "grade" },
        { title: "Status", value: "feeStatus" },
      ],
      studentList: [
        {
          name: "Selva Raj",
          parents: "Muthu Kumar",
          phone: "9600778090",
          class: "7th",
          grade: "F+",
          feeStatus: "0",
        },
        {
          name: "Malar",
          parents: "Muthu Kumar",
          phone: "7550364512",
          class: "10th",
          grade: "D+",
          feeStatus: "1",
        },
        {
          name: "Vinoth",
          parents: "Deva Raj",
          phone: "9600779080",
          class: "7th",
          grade: "D+",
          feeStatus: "1",
        },
      ],
      // upcomingEvents: [
      //   {
      //     title: "Student Counselling",
      //     date: "8-10 July 2021",
      //     time: "11 AM - 12 PM",
      //   },
      //   {
      //     title: "Teachers Meeting",
      //     date: "8-10 July 2021",
      //     time: "4 PM - 5 PM",
      //   },
      // ],
    };
  },
  mounted() {},
  methods: {
    initialize() {
      console.log("initialize");
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>
