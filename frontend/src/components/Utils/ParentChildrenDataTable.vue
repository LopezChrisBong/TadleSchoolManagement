<template>
  <v-container fluid>
    <v-row class="align-center mb-4 mt-2 flex-items">
      <v-col cols="12" md="12" class="d-flex">
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
        <v-btn
          class="me-2"
          prepend-icon="mdi-plus"
          rounded="lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          text="Add"
          border
          @click="add()"
        ></v-btn>
      </v-col>
    </v-row>
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
        <template v-slot:[`item.fname`]="{ item }">
          {{ item.fname }} {{ item.lname }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            size="small"
            color="primary"
            variant="outlined"
            @click="studentAttendance(item)"
            block
            class="my-1"
          >
            <v-icon start size="18"> mdi-eye </v-icon>
            Attendance
          </v-btn>
          <v-btn
            size="small"
            color="pink"
            class="my-1"
            variant="outlined"
            block
            @click="classRecord(item)"
          >
            <v-icon start size="18">mdi-eye</v-icon>
            Class Record
          </v-btn>
        </template>

        <template #no-data>
          <v-empty-state
            icon="mdi-account-off"
            title="No users found"
            text="Try adjusting your search or filters"
          />
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="600px" scrollable>
      <v-card>
        <v-card-title class="dialog-header d-flex align-center">
          <span class="text-h5">Search</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <!-- <v-col cols="12">
                <v-autocomplete
                  v-model="studentID"
                  :items="enrolledStudentData"
                  item-value="id"
                  item-title="name"
                  label="Student Name"
                  variant="outlined"
                  density="compact"
                ></v-autocomplete>
              </v-col> -->
              <v-col cols="12" class="d-flex">
                <v-text-field
                  v-model="searchLRN"
                  label="Search Student"
                  variant="outlined"
                  density="compact"
                  class="mx-2"
                  color="pink"
                >
                </v-text-field>
                <v-btn
                  class="me-2"
                  variant="flat"
                  color="pink"
                  @click="searchStudentLrn()"
                  prepend-icon="mdi-magnify"
                  :loading="isLoading"
                  >Search</v-btn
                >
              </v-col>
              <v-col cols="12" v-if="enrolledStudentData.length">
                <v-card-text class="px-4 py-4">
                  <v-row dense>
                    <v-col cols="12">Search result:</v-col>
                    <v-col
                      cols="12"
                      v-for="(item, index) in enrolledStudentData"
                      :key="item.id"
                    >
                      <v-card
                        class="role-card d-flex align-center justify-space-between px-4 py-3"
                        :class="{ active: selectedStudentID === item.id }"
                        elevation="0"
                        border
                        clickable
                        ripple
                        @click="selectButton(index, item)"
                      >
                        <span class="text-body-1">
                          {{ item.name }}
                        </span>
                        <v-icon
                          v-if="selectedStudentID === item.id"
                          color="#ff82e0"
                        >
                          mdi-check-circle
                        </v-icon>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
              <v-col cols="12" v-else>
                <v-empty-state
                  icon="mdi-account-off"
                  title="No students found!"
                  text="Try adjusting your search or filters"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            variant="outlined"
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="pink darken-1"
            variant="flat"
            @click="save()"
            :loading="isLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ViewMyChildrenAttendanceDialog
      :data="studentAttendanceData"
      :action="action"
      :filter="filter"
    />
    <ViewMyChildrenClassrecodDialog
      :data="studentGradeData"
      :action="action"
      :filter="filter"
    />

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
import eventBus from "@/eventBus";
import ViewMyChildrenAttendanceDialog from "../../components/Dialogs/Views/ViewMyChildrenAttendanceDialog.vue";
import ViewMyChildrenClassrecodDialog from "../../components/Dialogs/Views/ViewMyChildrenClassrecodDialog.vue";
export default {
  components: {
    ViewMyChildrenAttendanceDialog,
    ViewMyChildrenClassrecodDialog,
  },
  data: () => ({
    search: "",
    searchLRN: "",
    selectedStudentID: null,
    addData: null,
    studentAttendanceData: null,
    isLoading: false,
    studentGradeData: null,
    action: null,
    dialog: false,
    headers: [
      { title: "Name", value: "name", align: "start" },
      {
        title: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 100,
      },
    ],
    data: [],
    filter: null,
    studentID: null,
    enrolledStudentData: [],
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.initialize();
    eventBus.on("closeMyChildrenAttendanceDialog", () => {
      this.initialize();
    });
    eventBus.on("closeMyChildrenGradeDialog", () => {
      this.initialize();
    });

    this.filter = this.$store.getters.getFilterSelected;
  },
  beforeUnmount() {
    eventBus.off("closeMyChildrenAttendanceDialog");
    eventBus.off("closeMyChildrenGradeDialog");
  },
  watch: {
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          this.initialize();
        }
      },
      deep: true,
    },
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.mobile;
    },
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },

  methods: {
    selectButton(index, item) {
      this.selectedStudentID = item.id;
      this.studentID = item.id;
      console.log(index);
    },
    initialize() {
      this.loading = false;
      this.axiosCall("/parent-records/getMyChildrenList", "GET").then((res) => {
        if (res) {
          // console.log(res.data);
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.loading = false;
        }
      });
    },
    getEnrolledStudent() {
      this.axiosCall("/parent-records", "GET").then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.enrolledStudentData = data;
        }
      });
    },
    add() {
      this.dialog = true;
      this.action = "Add";
      this.enrolledStudentData = [];
      // this.getEnrolledStudent();
    },
    save() {
      if (this.studentID == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please select student before saving!";
      } else {
        let userDetailID = this.$store.state.user.id;
        let data = {
          school_yearID: this.filter,
          studentID: this.studentID,
          parentID: userDetailID,
        };
        console.log(data);
        this.axiosCall("/parent-records/", "POST", data).then((res) => {
          console.log(res.data);
          if (res.data.status == 201) {
            this.closeD();
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "Successfully updated!!";
            this.initialize();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },
    closeD() {
      this.dialog = false;
      this.enrolledStudentData = [];
      this.studentID = null;
      this.selectedStudentID = null;
    },
    studentAttendance(item) {
      console.log("attendance", item);
      this.studentAttendanceData = item;
      this.action = "View";
    },
    classRecord(item) {
      console.log("classrecord", item);
      this.studentGradeData = item;
      this.action = "View";
    },

    // confirmDelete() {
    //   this.axiosCall("/user-details/" + this.SF10Data.id, "DELETE").then(
    //     (res) => {
    //       console.log(res.data);
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "success";
    //       this.fadeAwayMessage.header = "System Message";
    //       this.fadeAwayMessage.message = "Account deleted successfully!";
    //       this.initialize();
    //     },
    //   );
    // },
    searchStudentLrn() {
      if (this.searchLRN === "") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Empty statement!";
      } else {
        this.isLoading = true;
        this.axiosCall(
          "/parent-records/searchStudentData/" + this.searchLRN,
          "GET",
        ).then((res) => {
          if (res) {
            console.log(res.data);
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.enrolledStudentData = data;
            this.isLoading = false;
          }
        });
      }
    },
  },
};
</script>
<style scoped>
.role-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-card:hover {
  /* background-color: rgba(0, 0, 0, 0.03); */
  background-color: #ff82e0;
}

.role-card.active {
  border: 2px solid #ff82e0;
  background-color: rgba(25, 118, 210, 0.08);
}
</style>
