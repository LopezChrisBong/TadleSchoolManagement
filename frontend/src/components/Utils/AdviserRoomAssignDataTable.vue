<template>
  <v-container fluid class="pa-6 class-list-bg">
    <!-- Header -->
    <v-card class="pa-4 mb-4 border" elevation="0" rounded="lg">
      <v-row align="center" dense>
        <v-col cols="12" md="4">
          <div class="d-flex align-center ga-2">
            <v-avatar size="36" color="#fce4ec" class="mr-1">
              <v-icon icon="mdi-google-classroom" color="#d6357e" size="20" />
            </v-avatar>
            <span class="text-h6 font-weight-bold">{{
              room_name || 'My Class'
            }}</span>
          </div>
        </v-col>

        <v-col cols="12" md="8" class="d-flex justify-md-end flex-wrap ga-2">
          <v-text-field
            v-model="search"
            label="Search students..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            color="#d6357e"
            rounded="lg"
            style="max-width: 260px"
          />
          <v-btn
            v-if="edit"
            prepend-icon="mdi-plus"
            rounded="lg"
            color="#d6357e"
            variant="flat"
            class="text-white font-weight-bold"
            @click="add()"
          >
            Add
          </v-btn>
          <v-btn
            prepend-icon="mdi-eye-outline"
            rounded="lg"
            color="#d6357e"
            variant="tonal"
            @click="viewFinalGrade()"
          >
            View Grade
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Data Table -->
    <v-card class="border" elevation="0" rounded="lg">
      <v-data-table
        :items="data"
        :headers="headers"
        :search="search"
        :items-per-page="10"
        :group-by="[{ key: 'sex', order: 'asc' }]"
        :loading="loading"
        loading-text="Loading students..."
        density="comfortable"
        class="class-table"
      >
        <template
          v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
        >
          <tr class="group-header-row">
            <td :colspan="columns.length">
              <v-btn
                :icon="
                  isGroupOpen(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'
                "
                size="x-small"
                variant="text"
                @click="toggleGroup(item)"
              />
              <v-icon
                :icon="
                  item.value === 'Male'
                    ? 'mdi-gender-male'
                    : 'mdi-gender-female'
                "
                :color="item.value === 'Male' ? 'blue' : 'pink'"
                size="18"
                class="mx-1"
              />
              <span class="font-weight-medium">{{ item.value }}</span>
              <v-chip
                size="x-small"
                variant="tonal"
                color="#d6357e"
                class="ml-2"
              >
                {{ item.items.length }}
              </v-chip>
            </td>
          </tr>
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="30" color="#fce4ec" class="mr-3">
              <span
                class="text-caption font-weight-bold"
                style="color: #d6357e"
              >
                {{ initials(item.name) }}
              </span>
            </v-avatar>
            <span class="font-weight-medium">{{ item.name }}</span>
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex justify-center ga-1">
            <v-tooltip v-if="item.graded == 1" text="Form 138" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-printer-outline"
                  size="small"
                  variant="text"
                  color="blue-grey"
                  @click="
                    syType == 0 || grade == 'Grade 11' || grade == 'Grade 12'
                      ? viewStudentAchievements(item)
                      : viewStudentAchievementsV2(item)
                  "
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Values" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-account-box-plus-outline"
                  size="small"
                  variant="text"
                  color="green"
                  @click="valuesItem(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Drop" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-account-cancel"
                  size="small"
                  variant="text"
                  color="orange"
                  @click="dropItem(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Delete" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-trash-can-outline"
                  size="small"
                  variant="text"
                  color="red"
                  @click="deleteItem(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>

        <template #no-data>
          <div class="py-8 text-center text-medium-emphasis">
            <v-icon icon="mdi-account-off-outline" size="32" class="mb-2" />
            <div>No students found.</div>
          </div>
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
    <v-dialog v-model="dialogConfirmDelete" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center ga-2 text-h6">
          <v-icon icon="mdi-alert-circle-outline" color="error" />
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this student? This action can't be
          undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            rounded="lg"
            @click="dialogConfirmDelete = false"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            variant="flat"
            rounded="lg"
            @click="confirmDelete()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Drop Confirmation Dialog -->
    <v-dialog v-model="dialogConfirmDrop" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center ga-2 text-h6">
          <v-icon icon="mdi-alert-circle-outline" color="warning" />
          Confirm Drop
        </v-card-title>
        <v-card-text> Are you sure you want to drop this student? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="dialogConfirmDrop = false"
            >Cancel</v-btn
          >
          <v-btn
            color="warning"
            variant="flat"
            rounded="lg"
            @click="confirmDrop()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- view dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card rounded="lg">
        <v-card-title
          class="d-flex justify-space-between align-center px-5 py-4"
          style="background: #d6357e; color: #fff"
        >
          <span class="text-h6 font-weight-bold">Add Students</span>
          <v-btn
            variant="text"
            icon="mdi-close"
            density="compact"
            color="white"
            @click="dialog = false"
          ></v-btn>
        </v-card-title>
        <v-card-text class="pa-5">
          <v-row>
            <v-col cols="12" class="d-flex"> love </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn color="#147452" variant="flat" rounded="lg" class="text-white">
            <v-icon start>mdi-check-circle</v-icon>
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
import eventBus from '@/eventBus';
import StudentGoodMoralDialog from '../../components/Dialogs/Forms/StudentGoodMoralDialog.vue';
import AddStudentList from '../../components/Dialogs/Forms/AddStudentList.vue';
import ViewStudentFinalGradeDialog from '../../components/Dialogs/Views/ViewStudentFinalGradeDialog.vue';
export default {
  components: {
    StudentGoodMoralDialog,
    AddStudentList,
    ViewStudentFinalGradeDialog,
  },
  data: () => ({
    search: '',
    dialog: false,
    userRoleID: null,
    filter: null,
    studentData: [],
    studentDataListed: null,
    student_activeList: [],
    headers: [
      { title: 'LRN', value: 'lrnNo', align: 'start', sortable: true },
      { title: 'Name', value: 'name', align: 'start', sortable: true },
      {
        title: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false,
        width: 200,
      },
    ],
    data: [],
    edit: true,
    grade: null,
    dataEdit: [],
    room_name: null,
    syType: null,
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
      type: 'success',
      header: 'Successfully Deleted!',
      message: '',
      top: 10,
    },
  }),

  mounted() {
    this.initialize();
    eventBus.on('closeStudentBehaviorStatementDialog', () => {
      this.initialize();
    });

    eventBus.on('closeStudentDataList', () => {
      this.initialize();
    });

    eventBus.on('closeStudentGradeDialog', () => {
      this.initialize();
    });
  },
  beforeUnmount() {
    eventBus.off('closeStudentBehaviorStatementDialog');
    eventBus.off('closeStudentDataList');
    eventBus.off('closeStudentGradeDialog');
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
          this.data = [];
          this.student_activeList = [];
          this.initialize();
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
      this.syType = this.$store.getters.getSyType;
      this.getTaggedStudent();
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
    valuesItem(item) {
      this.updateData = item;
      this.action = 'Add';
    },
    getEnrolledStudent(grade) {
      this.axiosCall(
        '/enroll-student/AddClassStudent/EnrolledStudent/' +
          grade +
          '/' +
          this.filter,
        'GET',
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
        '/rooms-section/getMyClassList/' + this.userRoleID + '/' + this.filter,
        'GET',
      ).then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          let data = res.data;
          if (data[0].name != null) {
            for (let i = 0; i < data.length; i++) {
              data[i].name = this.toTitleCase(data[i].name);
            }
            this.data = data;
          }
          this.room_name = data[0].room_name;
          this.grade = res.data[0].grade_level;
          this.classID = res.data[0].roomID;
          this.getEnrolledStudent(res.data[0].grade_level);
        } else {
          this.edit = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message =
            'Please contact the admin to have your room advisory set up.';
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
      this.action = 'Add';
    },
    save() {
      if (this.studentData.length > 0) {
        let data = {
          classID: this.classID,
          stundent_list: JSON.stringify(this.studentData),
        };

        this.axiosCall(
          '/rooms-section/addMyStudentClassRoom',
          'POST',
          data,
        ).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'success';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
            this.dialog = false;
            this.studentData = [];
            this.initialize();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'error';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = 'error';
        this.fadeAwayMessage.header = 'System Message';
        this.fadeAwayMessage.message = 'Cannot save without student tagged!';
      }
    },
    viewFinalGrade() {
      this.finalGradeData = {
        id: null,
        grade_level: this.grade,
        roomID: this.classID,
        school_yearID: this.filterYear,
      };
      this.action = 'View';
    },
    viewStudentAchievements(item) {
      window.open(
        process.env.VUE_APP_SERVER +
          '/pdf-generator/getStudentAchievements/' +
          item.studentId +
          '/' +
          this.classID +
          '/' +
          this.filterYear +
          '/' +
          item.grade_level +
          '',
        '_blank',
      );
    },
    viewStudentAchievementsV2(item) {
      window.open(
        process.env.VUE_APP_SERVER +
          '/pdf-generator/getStudentAchievementsV2/' +
          item.studentId +
          '/' +
          this.classID +
          '/' +
          this.filterYear +
          '/' +
          item.grade_level +
          '',
        '_blank',
      );
    },
    async confirmDelete() {
      this.axiosCall(
        '/rooms-section/removeMyStudent/' + this.deleteData.id,
        'DELETE',
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'success';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
          this.dialogConfirmDelete = false;
          this.getTaggedStudent();
          this.studentData = [];
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    async confirmDrop() {
      let data = {
        statusEnrolled: 2,
      };
      this.axiosCall(
        '/enroll-student/updateDropStudent/' + this.dropData.studentId,
        'PATCH',
        data,
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'success';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
          this.initialize();
          this.dialogConfirmDrop = false;
          location.reload();
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
  },
};
</script>
<style scoped>
.class-list-bg {
  min-height: 100vh;
}

.v-card.border {
  border-color: rgba(0, 0, 0, 0.08) !important;
}

.class-table :deep(thead th) {
  font-weight: 600 !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  opacity: 0.6;
}

.group-header-row {
  background: #f5f6fa;
}

.group-header-row td {
  padding: 6px 12px !important;
}
</style>
