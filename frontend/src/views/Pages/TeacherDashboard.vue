<template>
  <v-container fluid>
    <!-- Course Cards -->
    <v-row>
      <v-col cols="12" md="8">
        <v-row>
          <v-col v-for="(course, i) in courses" :key="i" cols="12" md="4">
            <v-card :color="course.color" class="pa-4" dark>
              <h3 style="text-transform: uppercase">{{ course.title }}</h3>
              <v-divider class="my-2"></v-divider>
              <v-btn
                variant="outlined"
                size="small"
                class="mr-2"
                color="white"
                block
              >
                <v-icon size="18" class="mr-1">mdi-eye</v-icon> View Classes
              </v-btn>
            </v-card>
          </v-col>
          <v-col cols="12">
            <h3 style="text-transform: uppercase">My Schedule</h3>
            <v-data-table
              :headers="tableHeaders"
              :items="tableItems"
              class="elevation-1"
              hide-default-footer
              density="compact"
            >
              <!-- Render the full row manually to avoid dynamic slot-per-column issues -->
              <template v-slot:item="{ item }">
                <tr>
                  <!-- Time cell -->
                  <td>{{ item.time }}</td>

                  <!-- Day cells -->
                  <td v-for="day in weekDays" :key="day" class="text-center">
                    <v-chip
                      v-if="getClass(day, item.time)"
                      :color="getClass(day, item.time).color"
                      text-color="white"
                      size="small"
                    >
                      {{ getClass(day, item.time).title }}
                    </v-chip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="12">
            <h3 style="text-transform: uppercase">Student At-Risk</h3>
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
          </v-col>
        </v-row>
      </v-col>

      <!-- Calendar & Events -->
      <v-col cols="12" md="4">
        <!-- Calendar -->
        <v-card class="mb-4">
          <v-date-picker v-model="selectedDate" color="primary" />
        </v-card>

        <!-- Upcoming Events -->
        <v-card>
          <v-card-title>Upcoming Events</v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item v-for="(event, i) in events" :key="i">
              <v-list-item-icon>
                <v-icon :color="event.color">mdi-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ event.title }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{ event.date }} - {{ event.time }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TeacherDashboard",
  data() {
    return {
      search: "",
      selectedDate: new Date(),
      weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri"], // keep only one
      timeSlots: ["09:00", "11:00", "13:00", "15:00"],

      courses: [
        { title: "Technology", color: "indigo" },
        { title: "Artificial Intelligence", color: "cyan" },
        { title: "Business Management", color: "deep-orange" },
        { title: "UX Design", color: "orange" },
        { title: "Applied Science", color: "red" },
      ],

      schedule: [
        { day: "Mon", time: "09:00", title: "Applied Science", color: "red" },
        { day: "Tue", time: "11:00", title: "Technology", color: "indigo" },
        { day: "Wed", time: "13:00", title: "UX Design", color: "orange" },
        {
          day: "Wed",
          time: "15:00",
          title: "Business Mgmt",
          color: "deep-orange",
        },
        { day: "Thu", time: "13:00", title: "AI", color: "cyan" },
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
          feeStatus: 0,
        },
        {
          name: "Malar",
          parents: "Muthu Kumar",
          phone: "7550364512",
          class: "10th",
          grade: "D+",
          feeStatus: 1,
        },
        {
          name: "Vinoth",
          parents: "Deva Raj",
          phone: "9600779080",
          class: "7th",
          grade: "D+",
          feeStatus: 1,
        },
      ],

      events: [
        {
          title: "Applied Science Homework",
          date: "Feb 2",
          time: "11:30 - 12:30",
          color: "red",
        },
        {
          title: "Technology Exam",
          date: "Feb 3",
          time: "11:30 - 12:30",
          color: "orange",
        },
        {
          title: "AI Workshop",
          date: "Feb 5",
          time: "11:30 - 12:30",
          color: "cyan",
        },
        {
          title: "UX Design Conference",
          date: "Feb 8",
          time: "11:30 - 12:30",
          color: "green",
        },
      ],
    };
  },
  computed: {
    tableHeaders() {
      return [
        { title: "Time", value: "time" },
        ...this.weekDays.map((day) => ({ title: day, value: day })),
      ];
    },
    tableItems() {
      return this.timeSlots.map((slot) => ({
        time: slot,
        ...Object.fromEntries(this.weekDays.map((day) => [day, null])),
      }));
    },
  },
  methods: {
    getClass(day, time) {
      return (
        this.schedule.find((c) => c.day === day && c.time === time) || null
      );
    },
  },
};
</script>
