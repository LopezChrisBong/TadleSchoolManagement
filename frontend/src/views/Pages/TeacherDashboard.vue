<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="8">
        <v-row>
          <!-- <v-col v-for="(course, i) in courses" :key="i" cols="12" md="4">
            <v-card :color="course.color" class="pa-4" dark>
              <h3 style="text-transform: uppercase">{{ course.title }}</h3>
              <v-divider class="my-2"></v-divider>
              <v-btn
                variant="outlined"
                size="small"
                class="mr-2"
                color="white"
                @click="goStudentRecords()"
                block
              >
                <v-icon size="18" class="mr-1">mdi-eye</v-icon> View Classes
              </v-btn>
            </v-card>
          </v-col> -->
          <v-col cols="12">
            <h3 style="text-transform: uppercase">My Schedule</h3>
            <v-data-table
              :headers="headers"
              :items="schedule"
              hide-default-footer
              dense
              class="rounded"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>
                    <v-chip
                      color="grey lighten-2"
                      text-color="black"
                      small
                      label
                    >
                      {{ item.time }}
                    </v-chip>
                  </td>

                  <td v-for="day in weekDays" :key="day" class="text-center">
                    <v-chip
                      style="font-size: 12px"
                      v-if="item[day]"
                      :color="getChipColor(item[day])"
                      dark
                      small
                      label
                    >
                      {{ item[day] }}
                    </v-chip>

                    <v-chip
                      v-else
                      color="grey lighten-3"
                      text-color="grey"
                      small
                      outlined
                      label
                    >
                      —
                    </v-chip>
                  </td>
                </tr>
              </template>

              <template #no-data>
                <v-alert type="info" border="start" color="white">
                  No schedule found.
                </v-alert>
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
                        ? 'Warning'
                        : item.feeStatus == 2
                        ? 'Passed'
                        : 'At-risk'
                    }}</span
                  >
                </v-chip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="primary"> mdi-calendar-clock </v-icon>
            <span class="font-weight-bold">Upcoming Events</span>
          </v-card-title>

          <v-divider />

          <v-list density="comfortable">
            <template
              v-for="(events, eventType) in eventList.event"
              :key="eventType"
            >
              <v-list-subheader
                class="text-primary font-weight-bold text-uppercase"
              >
                {{ eventType }}
              </v-list-subheader>
              <v-list-item
                v-for="(event, i) in events"
                :key="`${eventType}-${i}`"
                rounded="lg"
                class="mb-1"
              >
                <template #prepend>
                  <v-avatar size="10" :color="getEventColor(eventType)" />
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ event.eventName }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-medium-emphasis">
                  {{ formatDate(event.eventDate) }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TeacherDashboard',

  data() {
    return {
      selectedDate: new Date(),
      search: '',
      eventList: { event: {} },
      subjects: [],
      subjectColorMap: {
        English: 'indigo',
        Math: 'cyan',
        MAPEH: 'deep-orange',
        Science: 'red',
        Technology: 'blue',
      },
      schedule: [],
      studentHeaders: [
        { title: 'Student Name', value: 'name' },
        { title: 'Parents', value: 'parents' },
        { title: 'Phone', value: 'phone' },
        { title: 'Class', value: 'class' },
        { title: 'Grade', value: 'grade' },
        { title: 'Status', value: 'feeStatus' },
      ],
      studentList: [
        {
          name: 'Selva Raj',
          parents: 'Muthu Kumar',
          phone: '9600',
          class: '7th',
          grade: 'F+',
          feeStatus: 0,
        },
        {
          name: 'Malar',
          parents: 'Muthu Kumar',
          phone: '7550',
          class: '10th',
          grade: 'D+',
          feeStatus: 1,
        },
        {
          name: 'Vinoth',
          parents: 'Deva Raj',
          phone: '9600',
          class: '7th',
          grade: 'D+',
          feeStatus: 1,
        },
      ],
      weekDays: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        // 'Saturday',
      ],
      loading: true,
      headers: [
        { title: 'Time', value: 'time', align: 'start', sortable: false },
        { title: 'Monday', value: 'Monday', align: 'center', sortable: false },
        {
          title: 'Tuesday',
          value: 'Tuesday',
          align: 'center',
          sortable: false,
        },
        {
          title: 'Wednesday',
          value: 'Wednesday',
          align: 'center',
          sortable: false,
        },
        {
          title: 'Thursday',
          value: 'Thursday',
          align: 'center',
          sortable: false,
        },
        { title: 'Friday', value: 'Friday', align: 'center', sortable: false },
        // {
        //   title: 'Saturday',
        //   value: 'Saturday',
        //   align: 'center',
        //   sortable: false,
        // },
      ],
    };
  },

  computed: {
    courses() {
      return this.subjects.map((subject, index) => ({
        title: subject.subject_title,
        color:
          this.subjectColorMap[subject.subject_title] ||
          this.fallbackColor(index),
        raw: subject,
      }));
    },
  },

  mounted() {
    this.getEventsWithMandatory();
    this.getSubject();
    this.getMySchedules();
  },

  methods: {
    getChipColor(text) {
      if (!text) return 'grey';
      if (text.includes('Math')) return 'cyan';
      if (text.includes('English')) return 'indigo';
      if (text.includes('MAPEH')) return 'deep-orange';
      if (text.includes('Technology')) return 'blue';
      return 'primary';
    },
    fallbackColor(index) {
      const colors = ['purple', 'teal', 'orange', 'pink', 'green'];
      return colors[index % colors.length];
    },

    getEventColor(type) {
      return (
        { Academic: 'green', Celebration: 'orange', Mandatory: 'red' }[type] ||
        'grey'
      );
    },

    getEventsWithMandatory() {
      this.axiosCall('/school-events/getEventsWithMandatory', 'GET').then(
        (res) => {
          if (res.data) this.eventList = res.data;
        },
      );
    },

    getSubject() {
      const userID = this.$store.state.user.id;
      this.axiosCall(`/subjects/getSubjectTaagged/${userID}`, 'GET').then(
        (res) => {
          if (res.data) this.subjects = res.data;
        },
      );
    },
    goStudentRecords() {
      this.$router.push('students-records');
    },

    getMySchedules() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall('/enroll-student/MySchedule/' + filter, 'GET').then(
        (res) => {
          if (res) {
            this.schedule = res.data;
            this.loading = false;
          }
        },
      );
    },
  },
};
</script>
