<template>
  <div>
    <v-row class="mx-2 mt-2">
      <v-col cols="12" md="6" class="flex-items"> </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6" class="d-flex justify-space-between">
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
        :items="data"
        :items-per-page="10"
        :search="search"
        @update:options="options"
        :loading="loading"
        @pagination="pagination"
      >
        <template v-slot:[`item.start_range`]="{ item }">
          {{ item.start_range + " - " + item.end_range }}
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap" style="padding: 4px">
            <v-btn
              x-small
              color="pink"
              class="my-2 mx-2"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Update
            </v-btn>
            <!-- <v-btn
              x-small
              color="red"
              class="my-2"
              outlined
              @click="confirmDelete(item)"
            >
              <v-icon size="14">mdi-delete-off</v-icon>Delete
            </v-btn> -->
          </div>
        </template>
      </v-data-table>
    </v-card>

    <TransmutedGradeDialog :data="transmutedData" :action="action" />
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
  </div>
</template>
<script>
import eventBus from "@/eventBus";
import TransmutedGradeDialog from "../../components/Dialogs/Forms/TransmutedGradeDialog.vue";
export default {
  components: {
    TransmutedGradeDialog,
  },
  data: () => ({
    search: "",
    headers: [
      {
        title: "Grade",
        value: "transmuted_grade",
        align: "start",
        valign: "start",
        sortable: false,
      },
      {
        title: "Range",
        value: "start_range",
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
    transmutedData: null,
    deleteData: null,
    loading: false,
    options: {},
    action: null,
    confirmDialog: false,
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

    eventBus.on("closeTransmutedGradeDialog", () => {
      this.initialize();
    });
  },

  beforeUnmount() {
    eventBus.off("closeTransmutedGradeDialog");
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
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },

    // filterPrintData() {
    //   return this.paginate(
    //     this.data.filter((data) =>
    //       data.employee.toLowerCase().match(this.search.toLowerCase())
    //     )
    //   );
    // },
  },
  methods: {
    initialize() {
      this.loading = true;
      this.axiosCall(
        "/rooms-section/getTransmutedGrade/grades/data",
        "GET",
      ).then((res) => {
        if (res) {
          this.data = res.data;
          this.loading = false;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab;

      // if (tab.id == 1) {

      this.tab = tab.id;
      this.initialize();
      // } else if (tab.id == 2) {
      //   this.getVerifiedUsers();
      //   this.tab = tab.id;
      // }
    },
    add() {
      this.transmutedData = [{ id: null }];
      this.action = "Add";
    },
    editItem(item) {
      console.log(this.tab, item);
      this.transmutedData = item;
      this.action = "Update";
    },

    // deleteItem() {
    //   this.axiosCall("/rooms-section/" + this.deleteData.id, "DELETE").then(
    //     (res) => {
    //       if (res.data.status == 200) {
    //         this.dialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "success";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //         this.confirmDialog = false;
    //         this.initialize();
    //       } else if (res.data.status == 400) {
    //         this.confirmDialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "error";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //       }
    //     }
    //   );
    // },
    // confirmDelete(item) {
    //   this.confirmDialog = true;
    //   this.deleteData = item;
    // },
  },
};
</script>
