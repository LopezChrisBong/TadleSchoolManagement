<template>
  <v-container fluid>
    <!-- Header Section -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="12" md="6">
        <h2 class="text-h6 font-weight-bold">Modules Management</h2>
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
          color="primary"
        />
        <v-btn
          color="pink"
          class="white--text"
          @click="addnew()"
          prepend-icon="mdi-plus-box-outline"
          rounded
        >
          Add New
        </v-btn>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card class="elevation-1">
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        :items-per-page="10"
        :loading="loading"
        loading-text="Loading modules..."
        class="rounded"
        density="comfortable"
        @update:options="options"
        @pagination="pagination"
      >
        <template v-slot:[`item.icon`]="{ item }">
          <v-icon color="pink">{{ item.icon }}</v-icon>
        </template>

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
          <v-alert type="info" class="ma-4" icon="mdi-information">
            No modules found.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialogs -->
    <ModulesListDialog :data="updateData" :action="action" />

    <v-dialog v-model="dialogConfirmDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirm Deletion</v-card-title>
        <v-card-text class="text-body-1">
          Are you sure you want to delete this module?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            color="grey"
            @click="dialogConfirmDelete = false"
          >
            Cancel
          </v-btn>
          <v-btn color="error" class="white--text" @click="confirmDelete">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Fade Message -->
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
import ModulesListDialog from "../../components/Dialogs/Forms/ModulesListDialog.vue";
import eventBus from "@/eventBus";
export default {
  components: {
    ModulesListDialog,
  },

  data: () => ({
    search: "",
    headers: [
      { title: "Title", value: "title", align: "start" },
      { title: "Icon", value: "icon", align: "center" },
      { title: "Route", value: "route", align: "center" },
      {
        title: "Actions",
        value: "actions",
        align: "center",
      },
    ],
    data: [],
    perPageChoices: [
      { title: "5", value: 5 },
      { title: "10", value: 10 },
      { title: "20", value: 20 },
      { title: "50", value: 50 },
      { title: "100", value: 100 },
      { title: "250", value: 250 },
      { title: "500", value: 500 },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,

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
  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },
  mounted() {
    this.initialize();
    eventBus.on("closeModulesListDialog", () => {
      this.initialize();
    });
  },
  beforeUnmount() {
    eventBus.off("closeModulesListDialog");
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      this.loading = true;
      this.axiosCall("/sys-modules", "GET").then((res) => {
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
      this.dialogConfirmDelete = true;
      this.deleteData = item;
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
