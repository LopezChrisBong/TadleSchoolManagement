<template>
  <div>
    <v-row class="mx-2 mt-2">
      <v-col cols="12" md="8" class="flex-items" style="overflow: auto">
        <v-tab
          v-for="tab in tabList"
          :key="tab.id"
          :value="tab.id"
          @click="changeTab(tab)"
          :class="[
            ' pa-3 mx-3 transition-all',
            tab.active ? 'bg-pink-lighten-1 text-white' : 'bg-grey-lighten-4',
          ]"
          rounded="lg"
          >{{ tab.name }}</v-tab
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between">
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
          class="white--text ml-2 rounded-lg"
          :class="
            generatedCount != 0
              ? 'd-none'
              : gradeName == 'Grade 11'
              ? ''
              : gradeName == 'Grade 12'
              ? ''
              : 'd-none'
          "
          :color="$vuetify.theme.themes.light.submitBtns"
          @click="dummyGenerate()"
        >
          <v-icon left> mdi-database-check-outline </v-icon>
          Generate Class Record
        </v-btn> -->
        <!-- <v-btn
          class="white--text ml-2 rounded-lg"
          :class="
            generatedCount != 0
              ? 'd-none'
              : gradeName == 'Grade 11'
              ? 'd-none'
              : gradeName == 'Grade 12'
              ? 'd-none'
              : ''
          "
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.user_roleID == 1"
          @click="generateClassRecord()"
        >
          <v-icon left> mdi-database-check-outline </v-icon>
          Generate Class Record
        </v-btn> -->
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.user_roleID == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="1">
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        @update:options="options"
        :loading="loading"
        @pagination="pagination"
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap" style="padding: 4px">
            <v-btn
              x-small
              color="green"
              class="my-2 mx-2"
              outlined
              @click="addStudent(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Students
            </v-btn>
            <v-btn
              x-small
              color=""
              class="my-2 mx-2"
              outlined
              @click="printClassList(item)"
            >
              <v-icon size="14">mdi-printer-outline</v-icon>Print
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
            <!-- <v-btn
              x-small
              color="red"
              outlined
              class="my-2 mx-2"
              @click="confirmDeletedItem(item)"
            >
              <v-icon size="14">mdi-delete-off</v-icon>Delete
            </v-btn> -->
          </div>
        </template>
      </v-data-table>
    </v-card>

    <AddRoomSectionDialog
      :data="RoomData"
      :action="action"
      :grade="gradeName"
    />

    <ClassRoomGeneratedListDialog
      :data="taggingData"
      :action="action"
      :grade="gradeName"
      :filter="passfilter"
    />

    <v-dialog v-model="generateSeniorClassRecord" persistent max-width="550">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">
            Please choose strand to generate class list!
          </div>
          <div class="text-body-1 mb-1 mt-10">
            <v-autocomplete
              v-model="strandId"
              :rules="[formRules.required]"
              dense
              outlined
              label="Strand"
              class="rounded-lg"
              item-title="strand_name"
              item-value="id"
              color="#93CB5B"
              :items="strandList"
            >
            </v-autocomplete>
          </div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="generateSeniorClassRecord = false"
          >
            Close
          </v-btn>
          <v-btn
            color="#147452"
            class="white--text"
            @click="generateByStrand()"
          >
            Generate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDelete" persistent max-width="350">
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

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDelete = false">
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
  </div>
</template>
<script>
import eventBus from "@/eventBus";
import AddRoomSectionDialog from "../../components/Dialogs/Forms/AddRoomSectionDialog.vue";
import ClassRoomGeneratedListDialog from "../../components/Dialogs/Forms/ClassRoomGeneratedListDialog.vue";

export default {
  components: {
    AddRoomSectionDialog,
    ClassRoomGeneratedListDialog,
  },
  data: () => ({
    search: "",
    taggingData: null,
    fullname: null,
    applicantData: null,
    strandId: null,
    strandList: [],
    confirmDelete: false,
    generateSeniorClassRecord: false,
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
    activeTab: { id: 1, name: "Grade 7", active: true },
    tab: 1,
    tabList: [
      { id: 1, name: "Grade 7", active: true },
      { id: 2, name: "Grade 8", active: false },
      { id: 3, name: "Grade 9", active: false },
      { id: 4, name: "Grade 10", active: false },
      { id: 5, name: "Grade 11", active: false },
      { id: 6, name: "Grade 12", active: false },
    ],
    RoomData: null,
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
    this.initialize();
    this.getAlreadyGenerate();

    eventBus.on("closeAddClassroom", () => {
      this.initialize();
      this.getAlreadyGenerate();
    });
    eventBus.on("closeaddStudentClassRoomDialog", () => {
      this.initialize();
      this.getAlreadyGenerate();
    });
  },

  beforeUnmount() {
    eventBus.off("closeaddStudentClassRoomDialog");
    eventBus.off("closeAddClassroom");
  },

  watch: {
    options: {
      handler() {
        this.initialize();
        this.getAlreadyGenerate();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          this.initialize();
          this.getAlreadyGenerate();
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
        this.gradeName = "Grade 7";
        this.axiosCall("/rooms-section/" + "Grade 7", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            res.data.forEach((element, i) => {
              res.data[i].room_section = this.toUpperCaseData(
                element.room_section || "",
              );
            });
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 2) {
        this.gradeName = "Grade 8";

        this.axiosCall("/rooms-section/" + "Grade 8", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            res.data.forEach((element, i) => {
              res.data[i].room_section = this.toUpperCaseData(
                element.room_section || "",
              );
            });
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 3) {
        this.gradeName = "Grade 9";

        this.axiosCall("/rooms-section/" + "Grade 9", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            res.data.forEach((element, i) => {
              res.data[i].room_section = this.toUpperCaseData(
                element.room_section || "",
              );
            });
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 4) {
        this.gradeName = "Grade 10";

        this.axiosCall("/rooms-section/" + "Grade 10", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            res.data.forEach((element, i) => {
              res.data[i].room_section = this.toUpperCaseData(
                element.room_section || "",
              );
            });
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 5) {
        this.gradeName = "Grade 11";

        this.axiosCall("/rooms-section/" + "Grade 11", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            res.data.forEach((element, i) => {
              res.data[i].room_section = this.toUpperCaseData(
                element.room_section || "",
              );
            });
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 6) {
        this.gradeName = "Grade 12";

        this.axiosCall("/rooms-section/" + "Grade 12", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            res.data.forEach((element, i) => {
              res.data[i].room_section = this.toUpperCaseData(
                element.room_section || "",
              );
            });
            this.data = res.data;
            this.loading = false;
          }
        });
      }
    },
    dummyGenerate() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        "/enroll-student/getSchoolYear/toGenerate/" +
          this.gradeName +
          "/" +
          filter,
        "GET",
      ).then((res) => {
        this.conflict = res.data[0].conflict;

        console.log("Strand Conflict", this.conflict);
        if (this.conflict == 0) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "No Student Enrolled in this School Year or Grade Level";
        } else {
          this.generateSeniorClassRecord = true;
          this.getAllStrand();
        }
      });
    },
    generateByStrand() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        "/rooms-section/getConflictStrand/" +
          this.gradeName +
          "/" +
          filter +
          "/" +
          this.strandId,
        "GET",
      ).then((res) => {
        console.log("conflict", res.data);

        if (res.data != 0) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "Please select another strand to generate, class list already exist!";
        } else {
          console.log("wala pa");
          this.axiosCall(
            "/rooms-section/genStrandRecord/seniorHigh/" +
              this.gradeName +
              "/" +
              filter +
              "/" +
              this.strandId,
            "POST",
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
      });
    },

    generateClassRecord() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        "/enroll-student/getSchoolYear/toGenerate/" +
          this.gradeName +
          "/" +
          filter,
        "GET",
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
              this.gradeName = "Grade 7";
              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST",
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
              this.gradeName = "Grade 8";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST",
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
              this.gradeName = "Grade 9";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST",
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
              this.gradeName = "Grade 10";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST",
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
              this.gradeName = "Grade 11";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST",
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
              this.gradeName = "Grade 12";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST",
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
      this.getAlreadyGenerate();
      // } else if (tab.id == 2) {
      //   this.getVerifiedUsers();
      //   this.tab = tab.id;
      // }
      this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });
    },

    getAlreadyGenerate() {
      let filter = this.$store.getters.getFilterSelected;

      if (this.tab == 1) {
        this.gradeName = "Grade 7";
        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET",
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 2) {
        this.gradeName = "Grade 8";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET",
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 3) {
        this.gradeName = "Grade 9";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET",
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 4) {
        this.gradeName = "Grade 10";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET",
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 5) {
        this.gradeName = "Grade 11";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET",
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 6) {
        this.gradeName = "Grade 12";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET",
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
      this.RoomData = [{ id: null }];
      this.action = "Add";
    },
    editItem(item) {
      this.RoomData = item;
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
        this.RoomData = item;
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
        },
      );
    },
    confirmDeletedItem(item) {
      this.confirmDialog = true;
      this.deleteData = item;
    },

    getAllStrand() {
      this.axiosCall("/rooms-section/AllStrand/Data/strand", "GET").then(
        (res) => {
          if (res) {
            let data = [];

            for (let index = 0; index < res.data.length; index++) {
              console.log();
              const arr = {
                id: res.data[index].id,
                strand_name: res.data[index].strand_name,
                trackId: res.data[index].trackId,
              };
              data.push(arr);
            }
            this.strandList = data;
            console.log("All Strand", res.data);
          }
        },
      );
    },
  },
};
</script>
