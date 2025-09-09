<template>
  <v-container fluid>
    <!-- Charts -->
    <v-row>
      <!-- Donut -->
      <!-- <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Students by Grade and Gender</v-card-title>
          <v-card-text>
            <Doughnut :data="donutData" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col> -->

      <!-- Participation -->

      <!-- Gauges -->
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Average Subject Grade</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    md="3"
                    v-for="subject in subjects"
                    :key="subject.name"
                    class="mb-4 d-flex justify-center align-center border rounded-lg"
                  >
                    <p class="pa-3">{{ subject.name }} - {{ subject.score }}</p>
                    <v-progress-circular
                      :model-value="subject.score"
                      color="primary"
                      size="80"
                      width="8"
                    >
                      {{ subject.score }}
                    </v-progress-circular></v-col
                  >
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-title
                >Student Participation Rate by Subjects</v-card-title
              >
              <v-card-text>
                <Bar
                  :data="barHorizontalData"
                  :options="barHorizontalOptions"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!--School Events-->
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

      <!-- Exam Results -->
      <!-- <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Examination Results by Subject</v-card-title>
          <v-card-text>
            <Bar :data="examResultsData" :options="examResultsOptions" />
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import {
  // Doughnut,
  Bar,
} from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  components: {
    // Doughnut,
    Bar,
  },
  data() {
    return {
      selectedDate: new Date(),
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
      selectedYear: "2024",
      years: ["2023", "2024", "2025"],
      selectedGrade: "All",
      grades: ["All", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
      totalStudents: 300,
      subjects: [
        { name: "Arts", score: 84.37 },
        { name: "English", score: 84.05 },
        { name: "Maths", score: 81.86 },
        { name: "Phys. Ed", score: 84.76 },
        { name: "Science", score: 79.36 },
      ],
      donutData: {
        labels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
        datasets: [
          {
            data: [22.3, 19.3, 23.0, 14.8, 20.6],
            backgroundColor: [
              "#f87171",
              "#fbbf24",
              "#34d399",
              "#60a5fa",
              "#a78bfa",
            ],
          },
        ],
      },
      barHorizontalData: {
        labels: ["English", "Arts", "Maths", "Phys. Ed", "Science"],
        datasets: [
          {
            label: "Participation Rate (%)",
            data: [98.5, 97.2, 96.7, 93.8, 92.5],
            backgroundColor: "#60a5fa",
          },
        ],
      },
      barHorizontalOptions: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
      examResultsData: {
        labels: ["Phys. Ed", "Arts", "English", "Science", "Maths"],
        datasets: [
          {
            label: "Pass",
            data: [220, 180, 170, 160, 150],
            backgroundColor: "#34d399",
          },
          {
            label: "Fail",
            data: [20, 40, 50, 30, 35],
            backgroundColor: "#f87171",
          },
          {
            label: "Not attended",
            data: [10, 15, 20, 15, 10],
            backgroundColor: "#a3a3a3",
          },
        ],
      },
      examResultsOptions: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    };
  },
};
</script>
