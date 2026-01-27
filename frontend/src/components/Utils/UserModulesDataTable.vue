<template>
  <v-container fluid>
    <!-- Header with Search and Button -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="12" md="6">
        <h2 class="text-h6 font-weight-bold">Assigned Modules</h2>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end align-center gap-3">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="mr-2"
          color="pink"
        />
        <v-btn
          color="pink"
          class="white--text"
          @click="addnew"
          prepend-icon="mdi-plus-box-outline"
          rounded
        >
          Assign New
        </v-btn>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card elevation="2" class="pa-2">
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        :loading="loading"
        hover
        density="compact"
        class="rounded-lg"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip text="Edit module" location="top">
            <template #activator="{ props }">
              <v-btn
                icon
                color="primary"
                variant="text"
                v-bind="props"
                @click="editItem(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip text="Delete module" location="top">
            <template #activator="{ props }">
              <v-btn
                icon
                color="error"
                variant="text"
                v-bind="props"
                @click="deleteItem(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>

        <template #no-data>
          <v-alert
            icon="mdi-database-off"
            type="info"
            border="start"
            class="my-4"
          >
            No modules found.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialogs -->
    <UserModulesDialog :data="updateData" :action="action" />

    <v-dialog v-model="dialogConfirmDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
        <v-card-text class="text-body-1">
          Are you sure you want to delete this item?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogConfirmDelete = false"
            >Cancel</v-btn
          >
          <v-btn color="error" class="white--text" @click="confirmDelete"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="alerted" max-width="500">
      <v-alert
        density="default"
        type="warning"
        title="Action Needed"
        class="ma-4"
        border="start"
        text="This is a placeholder alert message. Replace with meaningful content."
      />
    </v-dialog>

    <!-- Feedback Toast -->
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
import UserModulesDialog from "../../components/Dialogs/Forms/UserModulesDialog.vue";
export default {
  components: {
    UserModulesDialog,
  },

  // props: {
  //   reloadTable: {
  //     type: Boolean,
  //     required: true,
  //   },
  // },
  data: () => ({
    search: "",
    headers: [
      { title: "Description", value: "description", align: "start" },
      {
        title: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    data: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    alerted: false,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    dialogConfirmDelete: false,
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
    eventBus.on("closeUserModulesDialog", () => {
      this.initialize();
    });
  },
  beforeUnmount() {
    eventBus.off("closeUserModulesDialog");
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      this.loading = true;
      this.axiosCall("/assigned-modules", "GET").then((res) => {
        if (res) {
          this.data = res.data;
          this.loading = false;
        }
      });
    },
    addnew() {
      this.updateData = [{ id: null }];
      this.action = "Add";
    },
    deleteItem(item) {
      console.log(item);
      this.alerted = true;
      // this.dialogConfirmDelete = true;
      // this.deleteData = item;
    },
    editItem(item) {
      this.updateData = item;
      this.action = "Update";
    },
    confirmDelete() {
      this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
        () => {
          this.fadeAwayMessage.show = true;
          this.itemData = null;
          this.initialize();
        },
      );
    },
  },
};
</script>
