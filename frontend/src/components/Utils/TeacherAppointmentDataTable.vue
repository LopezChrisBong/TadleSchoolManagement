<template>
  <v-container fluid>
    <!-- Header with Title & Search -->
    <v-row class="align-center mb-4 mt-2">
      <v-col cols="12" md="6">
        <div class="d-flex align-center">
          <v-icon size="28" color="primary" class="mr-2"
            >mdi-file-document-alert-outline</v-icon
          >
          <span class="text-h6 font-weight-bold">Appointment Reports</span>
        </div>
      </v-col>

      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-text-field
          v-model="search"
          label="Search reports"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          single-line
          style="max-width: 320px"
          color="primary"
        />
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card class="elevation-2 rounded-lg">
      <v-data-table
        :items="data"
        :class="isMobile"
        :headers="headers"
        :search="search"
        :items-per-page="10"
        :loading="loading"
        loading-text="Loading reports..."
        class="rounded-lg report-table"
      >
        <template v-slot:[`item.name`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="32" color="primary" variant="tonal" class="mr-3">
              <span class="text-caption font-weight-bold">
                {{ initials(item.name) }}
              </span>
            </v-avatar>
            <span class="font-weight-medium">{{ item.name }}</span>
          </div>
        </template>

        <template v-slot:[`item.schedule`]="{ item }">
          <span class="text-body-2">{{ formatDate(item.schedule) }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            color="primary"
            variant="tonal"
            @click="viewItem(item)"
            rounded="lg"
          >
            <v-icon start size="18">mdi-eye-outline</v-icon>
            View
          </v-btn>
        </template>

        <template #no-data>
          <v-alert type="info" variant="tonal" border="start" class="ma-4">
            No reports found.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- View Appointment Dialog -->
    <v-dialog v-model="reportDialog" max-width="480" scrim="black">
      <v-card class="rounded-lg" v-if="appointmentData">
        <v-card-item class="pb-2">
          <div class="d-flex align-center">
            <v-avatar size="40" color="primary" variant="tonal" class="mr-3">
              <span class="text-body-2 font-weight-bold">
                {{ initials(appointmentData.name) }}
              </span>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ appointmentData.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                Appointment #{{ appointmentData.id }}
              </div>
            </div>
          </div>
        </v-card-item>

        <v-divider />

        <v-card-text class="pt-4">
          <v-row dense>
            <v-col cols="12">
              <div class="text-caption text-medium-emphasis">Purpose</div>
              <div class="text-body-2 font-weight-medium">
                {{ appointmentData.purpose || '—' }}
              </div>
            </v-col>
            <v-col cols="12" md="6" class="mt-3">
              <div class="text-caption text-medium-emphasis">Student Name</div>
              <div class="text-body-2 font-weight-medium">
                {{ appointmentData.student_name }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-caption text-medium-emphasis">Schedule</div>
              <div class="text-body-2 font-weight-medium">
                {{ formatDate(appointmentData.schedule) }}
              </div>
            </v-col>

            <v-col cols="12" md="6" class="mt-3">
              <div class="text-caption text-medium-emphasis">Requested</div>
              <div class="text-body-2 font-weight-medium">
                {{ formatDate(appointmentData.created_at) }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="justify-end pa-4">
          <v-btn
            variant="tonal"
            color="primary"
            rounded="lg"
            @click="reportDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Toast Message -->
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    />
  </v-container>
</template>

<script>
export default {
  components: {},
  data: () => ({
    search: '',
    dialog: false,
    userRoleID: null,
    headers: [
      { title: 'Parent Name', value: 'name', align: 'start' },
      { title: 'Purpose', value: 'purpose', align: 'center' },
      { title: 'Schedule', value: 'schedule', align: 'center' },
      {
        title: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false,
        width: 100,
      },
    ],
    appointmentData: null,
    reportDialog: false,
    data: [],
    userId: null,
    loading: false,
    options: {},
    action: null,
    filter: null,
    fadeAwayMessage: {
      show: false,
      type: 'success',
      header: 'Successfully Deleted!',
      message: '',
      top: 10,
    },
  }),

  mounted() {
    this.initialize();
  },
  beforeUnmount() {},
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
    isMobile() {
      return this.$vuetify.display.mobile;
    },
  },

  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          this.initialize();
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.userId = this.$store.state.user.id;
      this.filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        '/parent-records/getTeacherAppointment/' +
          this.filter +
          '/' +
          this.userId,
        'GET',
      ).then((res) => {
        if (res) {
          let data = Array.isArray(res.data) ? res.data : [];
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.loading = false;
        }
      });
    },
    viewItem(item) {
      this.appointmentData = item;
      this.reportDialog = true;
    },
    initials(name) {
      if (!name) return '';
      return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('');
    },
    formatDate(value) {
      if (!value) return '—';
      const d = new Date(value);
      if (isNaN(d)) return value;
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    },
  },
};
</script>

<style scoped>
.report-table :deep(thead) {
  background-color: rgb(var(--v-theme-primary), 0.06);
}
.report-table :deep(th) {
  font-weight: 700 !important;
  font-size: 0.78rem !important;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.report-table :deep(tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
