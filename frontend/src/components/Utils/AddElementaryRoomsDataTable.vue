<template>
  <div>
    <v-row class="mx-2 mt-2">
      <v-col cols="12" md="8" class="flex-items">
        <v-tabs v-model="activeTab" color="#147452" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between">
        <!--   <v-btn
            v-else
            class="white--text ml-2 rounded-lg"
            color="green"
            @click="Print()"
          >
            <v-icon left> mdi-printer </v-icon>
            Print
          </v-btn> -->

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
          class="white--text ml-2 rounded-lg"
          :class="generatedCount == 0 ? '' : 'd-none'"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="confirmGenerate()"
        >
          <v-icon left> mdi-database-check-outline </v-icon>
          Generate Class Record
        </v-btn>
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
        <!-- <v-btn
                :class="tab == 3 ? '' : 'd-none'"
                class="white--text ml-2 rounded-lg"
                color="#147452"
                v-if="this.$store.state.user.user.isAdminApproved == 1"
                @click="printJobApplicants()"
              >
                <v-icon left> mdi-printer-outline </v-icon>
                Print
              </v-btn> -->
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        @update:options="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap" style="padding: 4px">
            <v-btn
              x-small
              color="#dc0b70"
              :class="generatedCount == 0 ? 'd-none' : ''"
              class="my-2 mx-2"
              outlined
              @click="addStudent(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Students
            </v-btn>
            <v-btn
              x-small
              color="#dc0b70"
              :class="generatedCount == 0 ? 'd-none' : ''"
              class="my-2 mx-2"
              outlined
              @click="printClassList(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Print
            </v-btn>
            <v-btn
              x-small
              color="#dc0b70"
              class="my-2 mx-2"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Update
            </v-btn>
            <v-btn
              x-small
              color="red"
              outlined
              class="my-2 mx-2"
              @click="confirmDelete(item)"
            >
              <v-icon size="14">mdi-delete-off</v-icon>Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#147452"
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <AddRoomSectionDialog
      :data="coreTimeData"
      :action="action"
      :grade="gradeName"
    />
    <!-- <MyJobApplication :data="designationData" :action="action" />
      <ApplicantOfJobDialog :data="applicantData" :action="action" />-->
    <ClassRoomGeneratedListDialog
      :data="taggingData"
      :action="action"
      :grade="gradeName"
      :filter="passfilter"
    />

    <v-dialog v-model="confirmDialog" persistent max-width="350">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to delete this information?<br /><br />
              Please note that
              <b>this action is irreversible.</b>
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
                  Are you sure you want to proceed?
                </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn color="#147452" class="white--text" @click="deleteItem()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
      :timeout="5000"
    ></fade-away-message-component>

    <v-dialog v-model="dialogConfirmGenerate" max-width="600">
      <v-card>
        <v-card-title style="font-size: 17px" color="green">
          Please confirm if the enrollment for this school years is done!
        </v-card-title>

        <v-card-text class="text-h5">
          Confirm generate class record.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal darken-3"
            outlined
            @click="dialogConfirmGenerate = false"
          >
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="
              generateClassRecord();
              dialogConfirmGenerate = false;
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import eventBus from "@/eventBus";
export default {
  components: {
    // CoreTimeDesignationDialog: () =>
    //   import("../../components/Dialogs/Forms/CoreTimeDesignationDialog.vue"),
    // ApplicantOfJobDialog: () =>
    //   import("../../components/Dialogs/Forms/ApplicantOfJobDialog.vue"),
    // MyJobApplication: () =>
    //   import("../../components/Dialogs/Forms/MyJobApplicationDialog.vue"),
    AddRoomSectionDialog: () =>
      import("../../components/Dialogs/Forms/AddRoomSectionDialog.vue"),
    ClassRoomGeneratedListDialog: () =>
      import("../../components/Dialogs/Forms/ClassRoomGeneratedListDialog.vue"),
  },
  data: () => ({
    search: "",
    taggingData: null,
    fullname: null,
    applicantData: null,
    dialogConfirmGenerate: false,
    headers: [
      {
        title: "Room Name",
        value: "room_section",
        align: "start",
        valign: "start",
        sortable: false,
      },

      {
        title: "Adviser",
        value: "name",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        title: "Action",
        value: "action",
        align: "end",
        valign: "end",
        sortable: false,
      },
    ],

    data: [],
    gradeName: null,
    printData: [],
    verified: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 1, name: "Grade 1" },
    tab: 1,
    tabList: [
      { id: 1, name: "Grade 1" },
      { id: 2, name: "Grade 2" },
      { id: 3, name: "Grade 3" },
      { id: 4, name: "Grade 4" },
      { id: 5, name: "Grade 5" },
      { id: 6, name: "Grade 6" },
      { id: 7, name: "Kinder 1" },
      { id: 8, name: "Kinder 2" },
    ],
    coreTimeData: null,
    designationData: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    toPrint: null,
    reportTypeList: [],
    jobitem: null,
    jobitemsList: [],
    selectedYear: null,
    selectedMonth: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    confirmDialog: false,
    JobPostPrint: false,
    generatedCount: null,
    conflict: null,
    passfilter: null,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
    yearList: [],
    monthsList: [
      { id: 0, name: "All" },
      { id: 1, name: "January" },
      { id: 2, name: "February" },
      { id: 3, name: "March" },
      { id: 4, name: "April" },
      { id: 5, name: "May" },
      { id: 6, name: "June" },
      { id: 7, name: "July" },
      { id: 8, name: "August" },
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" },
    ],
  }),

  mounted() {
    eventBus.on("closeAddSubjectDialog", () => {
      this.initialize();
    });
    eventBus.on("closeaddStudentClassRoomDialog", () => {
      this.initialize();
    });
  },

  beforeUnmount() {
    eventBus.off("closeAddSubjectDialog");
    eventBus.off("closeaddStudentClassRoomDialog");
  },

  watch: {
    options: {
      handler() {
        this.initialize();
        this.getAlreadyGeanerate();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          this.initialize();
          this.getAlreadyGeanerate();
        }
      },
      deep: true,
    },
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },

    //   // filterPrintData() {
    //   //   return this.paginate(
    //   //     this.data.filter((data) =>
    //   //       data.employee.toLowerCase().match(this.search.toLowerCase())
    //   //     )
    //   //   );
    //   // },
  },
  methods: {
    initialize() {
      this.loading = true;
      // let filter = this.$store.getters.getFilterSelected;
      // console.log("Filted", filter);

      if (this.tab == 1) {
        this.gradeName = "Grade 1";
        this.axiosCall("/rooms-section/" + this.gradeName, "GET").then(
          (res) => {
            if (res) {
              console.log("Love", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      } else if (this.tab == 2) {
        this.gradeName = "Grade 2";

        this.axiosCall("/rooms-section/" + this.gradeName, "GET").then(
          (res) => {
            if (res) {
              console.log("Love", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      } else if (this.tab == 3) {
        this.gradeName = "Grade 3";

        this.axiosCall("/rooms-section/" + this.gradeName, "GET").then(
          (res) => {
            if (res) {
              console.log("Love", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      } else if (this.tab == 4) {
        this.gradeName = "Grade 4";

        this.axiosCall("/rooms-section/" + this.gradeName, "GET").then(
          (res) => {
            if (res) {
              console.log("Love", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      } else if (this.tab == 5) {
        this.gradeName = "Grade 5";

        this.axiosCall("/rooms-section/" + this.gradeName, "GET").then(
          (res) => {
            if (res) {
              console.log("Love", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      } else if (this.tab == 6) {
        this.gradeName = "Grade 6";

        this.axiosCall("/rooms-section/" + this.gradeName, "GET").then(
          (res) => {
            if (res) {
              console.log("Love", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      } else if (this.tab == 7) {
        this.gradeName = "Kinder 1";

        this.axiosCall("/rooms-section/" + this.gradeName, "GET").then(
          (res) => {
            if (res) {
              console.log("Love", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      } else if (this.tab == 8) {
        this.gradeName = "Kinder 2";

        this.axiosCall("/rooms-section/" + this.gradeName, "GET").then(
          (res) => {
            if (res) {
              console.log("Love", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      }
    },

    generateClassRecord() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        "/enroll-student/getSchoolYear/toGenerate/" +
          this.gradeName +
          "/" +
          filter,
        "GET"
      ).then((res) => {
        if (res) {
          this.conflict = res.data[0].conflict;

          if (this.conflict == 0) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message =
              "No Student Enrolled in this School Year or Grade Level";
          } else {
            if (this.tab == 1) {
              this.gradeName = "Grade 1";
              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    this.initialize();
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 2) {
              this.gradeName = "Grade 2";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    this.initialize();
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 3) {
              this.gradeName = "Grade 3";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    this.initialize();
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 4) {
              this.gradeName = "Grade 4";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    this.initialize();
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 5) {
              this.gradeName = "Grade 5";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    this.initialize();
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 6) {
              this.gradeName = "Grade 6";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    this.initialize();
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 7) {
              this.gradeName = "Kinder 1";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    this.initialize();
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 8) {
              this.gradeName = "Kinder 2";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    this.initialize();
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            }
          }
        }
      });
    },

    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;

      // if (tab.id == 1) {

      this.tab = tab.id;
      this.initialize();
      this.getAlreadyGeanerate();
      // } else if (tab.id == 2) {
      //   this.getVerifiedUsers();
      //   this.tab = tab.id;
      // }
    },

    getAlreadyGeanerate() {
      let filter = this.$store.getters.getFilterSelected;

      if (this.tab == 1) {
        this.gradeName = "Grade 1";
        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 2) {
        this.gradeName = "Grade 2";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 3) {
        this.gradeName = "Grade 3";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 4) {
        this.gradeName = "Grade 4";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 5) {
        this.gradeName = "Grade 5";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 6) {
        this.gradeName = "Grade 6";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 7) {
        this.gradeName = "Kinder 1";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 8) {
        this.gradeName = "Kinder 2";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      }
    },

    add() {
      this.coreTimeData = [{ id: null }];
      this.action = "Add";
    },
    editItem(item) {
      this.coreTimeData = item;
      this.action = "Update";
    },
    printClassList(item) {
      console.log(item);
      this.fadeAwayMessage.show = true;
      this.fadeAwayMessage.type = "info";
      this.fadeAwayMessage.header = "System Message";
      this.fadeAwayMessage.message = "This Feature is to be followed";
    },

    addStudent(item) {
      let filter = this.$store.getters.getFilterSelected;
      this.taggingData = item;
      this.action = "View";
      this.passfilter = filter;
    },
    viewApplicant(item) {
      this.applicantData = item;
      this.action = 1;
    },
    viewHiredApplicant(item) {
      this.applicantData = item;
      this.action = 2;
    },
    viewItem(item) {
      if (this.tab == 1) {
        this.coreTimeData = item;
        this.action = "View";
      } else {
        this.designationData = item;
        this.action = "View";
      }
    },

    deleteItem() {
      this.axiosCall("/rooms-section/" + this.deleteData.id, "DELETE").then(
        (res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.confirmDialog = false;
            this.initialize();
          } else if (res.data.status == 400) {
            this.confirmDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },
    confirmGenerate() {
      this.dialogConfirmGenerate = true;
    },
    confirmDelete(item) {
      this.confirmDialog = true;
      this.deleteData = item;
    },
  },
};
</script>
