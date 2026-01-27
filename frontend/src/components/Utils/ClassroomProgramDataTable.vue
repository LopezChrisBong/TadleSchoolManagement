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
            ' pa-2 mx-2 transition-all',
            tab.active ? 'bg-pink-lighten-1 text-white' : 'bg-grey-lighten-4',
          ]"
          rounded="lg"
          >{{ tab.name }}</v-tab
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between">
        <v-autocomplete
          v-model="section"
          :rules="[formRules.required]"
          variant="outlined"
          density="compact"
          @update:modelValue="changeValueSection"
          label="Section"
          class="rounded-lg"
          item-title="room_section"
          item-value="id"
          color="#93CB5B"
          :items="sectionList"
        >
        </v-autocomplete>

        <!--  <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mr-2"
          color="primary"
        /> -->
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
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
        :items="filteredItems"
        :items-per-page="50"
        :search="search"
        @update:options="options"
        :loading="loading"
        @pagination="pagination"
        :group-by="groupBy"
        :sort-by="sortBy"
        :custom-sort="customSort"
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap">
            <v-btn
              x-small
              color="#dc0b70"
              class="mx-1"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>
            </v-btn>
            <!-- <v-btn
              x-small
              color="#C62828"
              class="white--text mx-1"
              @click="confirmDelete(item)"
            >
              <v-icon size="14">mdi-trash-can-outline</v-icon>
            </v-btn> -->
          </div>
        </template>

        <template
          v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
        >
          <tr>
            <td
              :colspan="columns.length"
              class="cursor-pointer"
              v-ripple
              @click="toggleGroup(item)"
            >
              <div class="d-flex align-center">
                <v-btn
                  :icon="isGroupOpen(item) ? '$expand' : '$next'"
                  color="medium-emphasis"
                  density="comfortable"
                  size="small"
                  variant="outlined"
                ></v-btn>

                <span class="ms-4">Days: {{ item.value }}</span>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <ClassroomProgramDialog
      :data="coreTimeData"
      :action="action"
      :grade="grade"
      :section="section"
      :filter="filter"
    />
    <!-- <MyDesignationDialog :data="designationData" :action="action" /> -->

    <v-dialog v-model="confirmDialog" persistent max-width="350">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <b>This action is irreversible.</b>
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
            Are you sure you want to proceed?
          </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close to Cancel
          </v-btn>
          <v-btn color="green" class="white--text" @click="deleteItem()">
            Confirm Delete
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
    ></fade-away-message-component>
  </div>
</template>
<script>
import eventBus from "@/eventBus";
import ClassroomProgramDialog from "../../components/Dialogs/Forms/ClassroomProgramDialog.vue";
export default {
  components: {
    ClassroomProgramDialog,
  },
  data: () => ({
    search: "",
    groupBy: [{ key: "day", order: "ASD" }],
    sortBy: [{ key: "day", order: "ASD" }],
    dayOrder: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],

    // headers: [
    //   {
    //     title: "Time",
    //     value: "time",
    //     align: "start",
    //     valign: "start",
    //     sortable: false,
    //   },
    //   {
    //     title: "Faculty Name",
    //     value: "name",
    //     align: "center",
    //     valign: "center",
    //     sortable: false,
    //   },

    //   {
    //     title: "Day",
    //     value: "day",
    //     align: "center",
    //     valign: "center",
    //     sortable: false,
    //   },

    //   {
    //     title: "Subject",
    //     value: "subject_title",
    //     align: "center",
    //     valign: "center",
    //     sortable: false,
    //   },

    //   {
    //     title: "Action",
    //     value: "action",
    //     align: "center",
    //     valign: "center",
    //     sortable: false,
    //   },
    // ],
    headers: [
      {
        align: "start",
        key: "day",
        width: 250,
      },
      {
        title: "Time",
        key: "time",
        width: 200,
      },
      {
        title: "Faculty Name",
        key: "name",
        width: 200,
      },
      {
        title: "Subject",
        key: "subject_title",
        width: 200,
      },
      {
        title: "Action",
        key: "action",
        width: 200,
      },
    ],
    tools: [
      {
        title: "Time",
        value: "time",
        width: 200,
      },
      {
        title: "Faculty Name",
        value: "name",
        width: 200,
      },

      {
        title: "Subject",
        value: "subject_title",
        width: 200,
      },

      {
        title: "Action",
        value: "action",
        width: 200,
      },
    ],
    data: [],
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
    grade: null,
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
    section: null,
    sectionList: [],
    coreTimeData: null,
    filter: null,
    designationData: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    confirmDialog: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),
  computed: {
    // Filtered data based on selected category
    filteredItems() {
      if (!this.section) {
        return this.data; // Show all items if no category is selected
      }
      return this.data.filter((item) => item.roomId === this.section);
    },
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },

  mounted() {
    this.initialize();
    eventBus.on("closeAddScheduleDialog", () => {
      this.getClassroom(this.section);
    });
    // eventBus.on("closeMyDesignationDialog", () => {
    //   this.initialize();
    // });
  },
  beforeUnmount() {
    eventBus.off("closeAddScheduleDialog");
    // eventBus.off("closeMyDesignationDialog");
  },

  watch: {
    section(category) {
      this.getClassroom(category);
    },
    options: {
      handler() {
        this.initialize();
        this.getClassroom(this.section);
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          console.log(oldData, newData);
          this.getClassroom(this.section);
        }
      },
      deep: true,
    },
  },

  methods: {
    customSort(items, sortBy) {
      console.log("Console", sortBy);
      return [...items].sort((a, b) => {
        for (const { key, order } of sortBy) {
          if (key === "day") {
            const aIndex = this.dayOrder.indexOf(a[key]) ?? 99;
            const bIndex = this.dayOrder.indexOf(b[key]) ?? 99;
            if (aIndex !== bIndex) {
              return (aIndex - bIndex) * (order === "desc" ? -1 : 1);
            }
          } else {
            // fallback to normal string/number comparison
            if (a[key] < b[key]) return order === "desc" ? 1 : -1;
            if (a[key] > b[key]) return order === "desc" ? -1 : 1;
          }
        }
        return 0;
      });
    },
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      this.getClassListed();
      this.getClassroom(this.section);
    },

    getClassListed() {
      this.loading = true;
      const itemsWithSameId = this.tabList.filter(
        (item) => item.id === this.tab,
      );
      // alert(itemsWithSameId[0].name);

      this.axiosCall("/rooms-section/" + itemsWithSameId[0].name, "GET").then(
        (res) => {
          console.log("Classroom List", res.data);
          this.sectionList = res.data;
          this.section = res.data[0].id;
        },
      );
    },
    getClassroom(section) {
      this.loading = true;
      let filter = this.$store.getters.getFilterSelected;
      let grade =
        this.tab == 1
          ? "Grade 7"
          : this.tab == 2
          ? "Grade 8"
          : this.tab == 3
          ? "Grade 9"
          : this.tab == 4
          ? "Grade 10"
          : this.tab == 5
          ? "Grade 11"
          : "Grade 12";
      this.axiosCall(
        "/enroll-student/getClassProgramm/" +
          grade +
          "/" +
          section +
          "/" +
          filter,
        "GET",
      ).then((res) => {
        if (res) {
          this.data = res.data;
          this.loading = false;
        }
      });
    },

    changeValueSection(data) {
      this.section = data;
    },

    switchItem(item) {
      if (this.tab == 1) {
        this.axiosCall("/my-core-time/toggleActive/" + item.id, "PATCH").then(
          (res) => {
            if (res) {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.initialize();
              } else {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          },
        );
      } else if (this.tab == 2) {
        this.axiosCall("/my-designation/toggleActive/" + item.id, "PATCH").then(
          (res) => {
            if (res) {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.initialize();
              } else {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          },
        );
      }
    },
    // getVerifiedUsers() {
    //   this.loading = true;

    //   this.axiosCall("/user-details/getAllVerifiedUser", "GET").then((res) => {
    //     if (res) {
    //       this.data = [];

    //       this.data = res.data;
    //       this.loading = false;
    //     }
    //   });
    // },

    changeTab(tab) {
      this.activeTab = tab;
      // if (tab.id == 1) {
      this.tab = tab.id;
      this.initialize();
      // } else if (tab.id == 2) {
      //   this.getVerifiedUsers();
      //   this.tab = tab.id;
      // }
      this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });
    },
    add() {
      let filter = this.$store.getters.getFilterSelected;
      if (this.tab == 1) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 7";
        this.section;
        this.filter = filter;
      } else if (this.tab == 2) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 8";
        this.section;
        this.filter = filter;
      } else if (this.tab == 3) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 9";
        this.section;
        this.filter = filter;
      } else if (this.tab == 4) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 10";
        this.section;
        this.filter = filter;
      } else if (this.tab == 5) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 11";
        this.section;
        this.filter = filter;
      } else if (this.tab == 6) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 12";
        this.section;
        this.filter = filter;
      }
    },
    editItem(item) {
      console.log("Update", item);
      let filter = this.$store.getters.getFilterSelected;
      if (this.tab == 1) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 7";
        this.section;
        this.filter = filter;
      } else if (this.tab == 2) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 8";
        this.section;
        this.filter = filter;
      } else if (this.tab == 3) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 9";
        this.section;
        this.filter = filter;
      } else if (this.tab == 4) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 10";
        this.section;
        this.filter = filter;
      } else if (this.tab == 5) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 11";
        this.section;
        this.filter = filter;
      } else if (this.tab == 6) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 12";
        this.section;
        this.filter = filter;
      }
    },

    viewItem(item) {
      this.coreTimeData = item;
      this.action = "View";
    },

    deleteItem() {
      this.axiosCall(
        "/enroll-student/deleteAvailabilitySchedule/" + this.deleteData.availId,
        "DELETE",
      ).then((res) => {
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
      });
    },
    confirmDelete(item) {
      this.confirmDialog = true;
      this.deleteData = item;
    },
  },
};
</script>
