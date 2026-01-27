<template>
  <v-container fluid>
    <!-- Header with Tabs & Search -->
    <v-row class="align-center mb-4 mt-2">
      <v-col cols="12" md="4" class="text-h6">
        <span v-if="room_name">{{ room_name }}</span>
      </v-col>

      <v-col cols="12" md="6" offset-md="2" class="d-flex">
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
          v-if="edit"
          class="me-2"
          prepend-icon="mdi-plus"
          rounded="lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          text="Add"
          border
          @click="add()"
        ></v-btn>
        <v-btn
          x-small
          color="blue"
          class="white--text mx-1"
          @click="viewFinalGrade(item)"
        >
          <v-icon size="14">mdi-eye-outline</v-icon> View Grade
        </v-btn>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card class="elevation-1">
      <v-data-table
        :items="data"
        :headers="headers"
        :search="search"
        :items-per-page="10"
        :loading="loading"
        loading-text="Loading users..."
        class="rounded"
        dense
      >
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-btn
              x-small
              color="white"
              class="black--text mx-1"
              @click="viewStudentAchievements(item)"
            >
              <v-icon size="14">mdi-printer-outline</v-icon>
              Achievements
            </v-btn>
            <v-btn
              x-small
              color="green"
              class="white--text mx-1"
              @click="valuesItem(item)"
            >
              <v-icon size="14">mdi-account-box-plus-outline</v-icon> Values
            </v-btn>

            <v-btn
              x-small
              color="orange"
              class="white--text mx-1"
              @click="dropItem(item)"
            >
              <v-icon size="14">mdi-account-cancel</v-icon> Drop
            </v-btn>
            <v-btn
              x-small
              color="#C62828"
              class="white--text mx-1"
              @click="deleteItem(item)"
            >
              <v-icon size="14">mdi-trash-can-outline</v-icon> Delete
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <v-alert type="info" border="start" color="white">
            No users found.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Verification Dialog -->
    <StudentGoodMoralDialog :data="updateData" :action="action" />
    <AddStudentList
      :data="studentDataListed"
      :action="action"
      :filter="filter"
    />
    <ViewStudentFinalGradeDialog
      :data="finalGradeData"
      :action="action"
      :filter="filter"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogConfirmDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this student?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogConfirmDelete = false"
            >Cancel</v-btn
          >
          <v-btn color="error" class="white--text" @click="confirmDelete()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogConfirmDrop" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirm Drop</v-card-title>
        <v-card-text> Are you sure you want to drop this student? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogConfirmDrop = false"
            >Cancel</v-btn
          >
          <v-btn color="error" class="white--text" @click="confirmDrop()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- view dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <div class="d-flex justify-space-between">
            <span class="headline">Add Students</span>
            <v-btn
              variant="text"
              icon="mdi-close"
              density="compact"
              color="red"
              @click="dialog = false"
            ></v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="d-flex"> love </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#147452" class="white--text" @click="save()">
            <v-icon>mdi-check-circle</v-icon>
            Save
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
import eventBus from "@/eventBus";
import StudentGoodMoralDialog from "../../components/Dialogs/Forms/StudentGoodMoralDialog.vue";
import AddStudentList from "../../components/Dialogs/Forms/AddStudentList.vue";
import ViewStudentFinalGradeDialog from "../../components/Dialogs/Views/ViewStudentFinalGradeDialog.vue";
export default {
  components: {
    StudentGoodMoralDialog,
    AddStudentList,
    ViewStudentFinalGradeDialog,
  },
  data: () => ({
    search: "",
    dialog: false,
    userRoleID: null,
    filter: null,
    studentData: [],
    studentDataListed: null,
    student_activeList: [],
    headers: [
      { title: "Name", value: "name", align: "start" },
      {
        title: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    data: [],
    edit: true,
    grade: null,
    dataEdit: [],
    room_name: null,
    deleteData: null,
    dropData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    classID: null,
    finalGradeData: null,
    dialogConfirmDelete: false,
    dialogConfirmDrop: false,
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
    eventBus.on("closeStudentBehaviorStatementDialog", () => {
      this.initialize();
    });

    eventBus.on("closeStudentDataList", () => {
      this.initialize();
    });

    eventBus.on("closeStudentGradeDialog", () => {
      this.initialize();
    });
  },
  beforeUnmount() {
    eventBus.off("closeStudentBehaviorStatementDialog");
    eventBus.off("closeStudentDataList");
    eventBus.off("closeStudentGradeDialog");
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
          // this.getTaggedStudent();
          // this.getAlreadyGenerate();
        }
      },
      deep: true,
    },
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
    isMobile() {
      return this.$vuetify.display.mobile;
    },
  },

  methods: {
    initialize() {
      this.userRoleID = this.$store.state.user.id;
      this.filter = this.$store.getters.getFilterSelected;
      this.getTaggedStudent();
    },
    valuesItem(item) {
      console.log(item);
      this.updateData = item;
      this.action = "Add";
    },
    getEnrolledStudent(grade) {
      this.axiosCall(
        "/enroll-student/AddClassStudent/EnrolledStudent/" +
          grade +
          "/" +
          this.filterYear,
        "GET",
      ).then((res) => {
        if (res.data) {
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            data[i].name = this.toTitleCase(data[i].name);
          }
          this.student_activeList = data;
        }
      });
    },
    getTaggedStudent() {
      this.axiosCall(
        "/rooms-section/getMyClassList/" +
          this.userRoleID +
          "/" +
          this.filterYear,
        "GET",
      ).then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          let data = res.data;
          //   console.log("Data Value", data);
          console.log("Grade Level", res.data[0].grade_level);
          this.getEnrolledStudent(res.data[0].grade_level);
          this.grade = res.data[0].grade_level;
          this.classID = res.data[0].roomID;
          if (data[0].name != null) {
            for (let i = 0; i < data.length; i++) {
              data[i].name = this.toTitleCase(data[i].name);
              // this.studentData.push(data[i].id);
            }
            this.data = data;
          }
          this.room_name = data[0].room_name;
        } else {
          this.edit = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "Please contact admin to set you room advisory!";
        }
      });
    },

    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },

    dropItem(item) {
      this.dialogConfirmDrop = true;
      this.dropData = item;
    },

    add() {
      this.studentDataListed = [
        { id: null, roomID: this.classID, grade_level: this.grade },
      ];
      this.action = "Add";
      // this.dialog = true;
    },
    save() {
      if (this.studentData.length > 0) {
        let data = {
          classID: this.classID,
          stundent_list: JSON.stringify(this.studentData),
        };
        console.log("Add Student", data);

        this.axiosCall(
          "/rooms-section/addMyStudentClassRoom",
          "POST",
          data,
        ).then((res) => {
          console.log(res);
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.dialog = false;
            this.studentData = [];
            this.initialize();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Cannot save without student tagged!";
      }
    },
    viewFinalGrade() {
      this.finalGradeData = {
        id: null,
        grade_level: this.grade,
        roomID: this.classID,
        school_yearID: this.filterYear,
      };
      this.action = "View";
    },
    viewStudentAchievements(item) {
      // console.log("print", item.grade_level);
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getStudentAchievements/" +
          item.studentId +
          "/" +
          this.classID +
          "/" +
          this.filterYear +
          "/" +
          item.grade_level +
          "",
        "_blank",
      );
    },
    async confirmDelete() {
      this.axiosCall(
        "/rooms-section/removeMyStudent/" + this.deleteData.id,
        "DELETE",
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.dialogConfirmDelete = false;
          location.reload();
          this.studentData = [];
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    async confirmDrop() {
      // console.log("drop", this.dropData);
      let data = {
        statusEnrolled: 2,
      };
      this.axiosCall(
        "/enroll-student/updateDropStudent/" + this.dropData.studentId,
        "PATCH",
        data,
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.initialize();
          this.dialogConfirmDrop = false;
          location.reload();
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
  },
};
</script>
<style scoped>
/* .v-tab {
  color: rgb(0, 133, 82) !important;
}
.v-tab--active {
  color: rgb(255, 255, 255) !important;
  background-color: blue !important;
} */
</style>
