<template>
  <v-container fluid>
    <!-- Header with Tabs & Search -->
    <v-row class="align-center mb-4 mt-2 flex-items">
      <v-col cols="12" md="6" class="flex-items"> </v-col>

      <v-col cols="12" md="4" offset-md="2" class="d-flex">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mr-2"
          color="primary"
        />
        <!-- <v-btn
          class="me-2"
          prepend-icon="mdi-plus"
          rounded="lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          text="Add"
          border
          @click="add()"
        ></v-btn> -->
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card class="elevation-1">
      <v-data-table
        :items="data"
        :class="isMobile"
        :headers="headers"
        :search="search"
        :items-per-page="10"
        :loading="loading"
        loading-text="Loading users..."
        class="rounded"
        dense
      >
        <template v-slot:[`item.report_type`]="{ item }">
          {{
            item.report_type == 1 ? 'Academic Concern' : 'Disciplinary Concern'
          }}
        </template>

        <template v-slot:[`item.tagged`]="{ item }">
          <span v-for="tag in item.tagged" :key="tag.id">
            {{ tag.name }}
          </span>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="
              item.status == 0
                ? 'yellow'
                : item.status == 1
                ? 'orange'
                : item.status == 2
                ? 'red'
                : 'green'
            "
            >{{
              item.status == 0
                ? 'Adviser Review'
                : item.status == 1
                ? 'Prefect Review'
                : item.status == 2
                ? 'Parent Review'
                : 'Resolved'
            }}</v-chip
          >
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            color="primary"
            variant="outlined"
            @click="viewItem(item)"
            block
            class="my-1"
          >
            <v-icon start size="18"> mdi-eye </v-icon>
            View
          </v-btn>
        </template>

        <template #no-data>
          <v-alert type="info" border="start" color="white">
            No data found.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="reportDialog" max-width="600" eager scrollable>
      <v-card>
        <v-card-title class="d-flex dialog-header align-center">
          <span v-if="studentReportData">
            Reported Student {{ studentReportData.name }}</span
          >
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            @click="reportDialog = false"
          >
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="">
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="studentReportData.report_type"
                :rules="[formRules.required]"
                variant="outlined"
                density="comfortable"
                class="rounded-lg"
                readonly
                item-title="description"
                item-value="id"
                label="Report Type"
                color="pink"
                :items="[
                  { id: 1, description: 'Academic Concern' },
                  { id: 2, description: 'Disciplinary Concern' },
                ]"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="studentReportData.report_description"
                label="Report Description"
                row-height="30"
                rows="3"
                color="pink"
                variant="outlined"
                readonly
                auto-grow
              ></v-textarea>
            </v-col>
            <v-col>
              <div>Tagged students:</div>
              <div
                style="
                  border: 1px pink solid;
                  padding: 10px;
                  border-radius: 10px;
                "
              >
                <span v-for="tag in studentReportData.tagged" :key="tag.id">
                  {{ tag.name }}
                  <span v-if="studentReportData.tagged.length >= 1">,</span>
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" variant="outlined" @click="reportDialog = false">
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
      { title: 'Name', value: 'name', align: 'start' },
      { title: 'Reported BY:', value: 'teacher_name', align: 'center' },
      { title: 'Subject', value: 'subject_title', align: 'center' },
      { title: 'Grade Level', value: 'grade_level', align: 'center' },
      { title: 'Type', value: 'report_type', align: 'center' },
      { title: 'Tagged Student', value: 'tagged', align: 'center' },
      { title: 'Status', value: 'status', align: 'center' },
      {
        title: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false,
        width: 100,
      },
    ],
    studentReportData: [],
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
      console.log(this.userId, this.filter);
      this.axiosCall(
        '/parent-records/getMyReport/' + this.filter + '/' + this.userId,
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
      this.studentReportData = item;
      this.reportDialog = true;
    },
  },
};
</script>
