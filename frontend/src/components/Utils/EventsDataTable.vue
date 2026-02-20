<template>
  <v-container fluid class="pa-6">
    <!-- Top Section -->
    <v-card rounded="xl" elevation="1" class="mb-6">
      <v-card-text>
        <v-row align="center" dense>
          <!-- Tabs -->
          <v-col cols="12" md="6" class="d-flex flex-wrap ga-2">
            <v-btn
              v-for="tab in tabList"
              :key="tab.id"
              size="small"
              :block="isMobile"
              rounded="lg"
              :color="tab.active ? 'pink' : 'grey'"
              :variant="tab.active ? 'flat' : 'tonal'"
              @click="changeTab(tab)"
            >
              {{ tab.name }}
            </v-btn>
          </v-col>

          <!-- Search & Action -->
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12" md="9" class="d-flex justify-end ga-2">
                <v-text-field
                  v-model="search"
                  placeholder="Search users..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  max-width="260"
              /></v-col>
              <v-col cols="12" md="3" class="d-flex justify-end ga-2"
                ><v-btn
                  prepend-icon="mdi-plus"
                  rounded="lg"
                  color="pink"
                  @click="add"
                  :block="isMobile"
                >
                  Add
                </v-btn></v-col
              >
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card rounded="xl" elevation="1">
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        :items-per-page="10"
        :loading="loading"
        loading-text="Loading data..."
        class="text-body-2"
      >
        <template v-slot:[`item.eventDate`]="{ item }">
          <div>
            {{ formatDate(item.eventDate) }}
          </div>
        </template>
        <template v-slot:[`item.isActive`]="{ item }">
          <v-chip
            size="30"
            style="font-size: 12px"
            class="pa-1"
            :color="item.isActive == 1 ? 'green' : 'red'"
          >
            {{ item.isActive == 1 ? 'Active' : 'inActive' }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-btn
              size="small"
              variant="tonal"
              color="primary"
              @click="
                viewItem(
                  item,
                  this.$store.state.user.id == item.addedBy ? 'Update' : 'View',
                )
              "
            >
              <v-icon
                center
                size="20"
                v-if="this.$store.state.user.id == item.addedBy"
                >mdi-pencil</v-icon
              >
              <v-icon center size="20" v-else>mdi-eye</v-icon>
            </v-btn>

            <v-btn
              v-if="this.$store.state.user.id == item.addedBy"
              :disabled="!allowedUpdate(item.eventDate)"
              size="small"
              variant="tonal"
              class="mx-2"
              color="error"
              @click="deleteItem(item)"
            >
              <v-icon center size="20">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <v-empty-state
            icon="mdi-database-cog-outline"
            :title="`No ${activeTab.name} found`"
            text="Try adjusting your search or filters"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialogs -->
    <EventsDialog :data="addData" :action="action" :event="activeTab.name" />

    <!-- Delete Confirmation -->
    <v-dialog v-model="dialogConfirmDelete" max-width="420">
      <v-card rounded="xl">
        <v-card-title class="font-weight-bold">Confirm Deletion</v-card-title>
        <v-card-text>
          This action cannot be undone. Are you sure you want to delete this
          data?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogConfirmDelete = false"
            >Cancel</v-btn
          >
          <v-btn color="error" variant="flat" @click="confirmDelete"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Options Dialog -->
    <v-dialog v-model="dialog" max-width="560" persistent>
      <v-card rounded="xl" elevation="2">
        <!-- Header -->
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <div class="text-h6 font-weight-bold">View Details</div>
            <div class="text-caption text-grey">
              Choose what you want to manage
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="grey"
            @click="dialog = false"
          />
        </v-card-title>

        <v-divider />

        <!-- Content -->
        <v-card-text class="pa-6">
          <v-row dense>
            <!-- Module -->
            <v-col cols="12" md="4">
              <v-card
                class="action-card"
                rounded="lg"
                elevation="1"
                @click="editItem(dataEdit)"
              >
                <v-card-text class="text-center">
                  <v-icon size="56" color="primary"
                    >mdi-file-cog-outline</v-icon
                  >
                  <div class="mt-3 font-weight-medium">Module</div>
                  <div class="text-caption text-grey">
                    System access & roles
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Personal Info -->
            <v-col cols="12" md="4">
              <v-card
                class="action-card"
                rounded="lg"
                elevation="1"
                @click="personalInfo(dataEdit)"
              >
                <v-card-text class="text-center">
                  <v-icon size="56" color="success"
                    >mdi-account-box-outline</v-icon
                  >
                  <div class="mt-3 font-weight-medium">Personal Info</div>
                  <div class="text-caption text-grey">Profile & details</div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Credentials -->
            <v-col cols="12" md="4">
              <v-card
                class="action-card"
                rounded="lg"
                elevation="1"
                @click="credentials(dataEdit)"
              >
                <v-card-text class="text-center">
                  <v-icon size="56" color="warning">mdi-file-sign</v-icon>
                  <div class="mt-3 font-weight-medium">Credentials</div>
                  <div class="text-caption text-grey">
                    Certificates & licenses
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Footer -->
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn variant="outlined" color="grey" @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Toast -->
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

<script lang="js">
import eventBus from "@/eventBus";
import EventsDialog from "../../components/Dialogs/Forms/EventsDialog.vue";
export default {
  components: {
    EventsDialog,
  },
  data: () => ({
    search: "",
    dialog: false,
    headers: [
      { title: "Even", value: "eventName", align: "start" },
      { title: "Added By", value: "name", align: "center" },
      { title: "Date", value: "eventDate", align: "center" },
      { title: "Status", value: "isActive", align: "center" },
      {
        title: "Actions",
        value: "actions",
        align: "end",
        sortable: false,
        width: 100,
      },
    ],
    data: [],
    dataEdit: [],
    activeTab: { id: 1, name: "Academic", active: true },
    tab: 1,
    tabList: [
      { id: 1, name: "Academic", active: true },
      { id: 2, name: "Celebration", active: false },
      { id: 3, name: "Mandatory", active: false },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    addData: null,
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
    eventBus.on("closeAddEvenDialog", () => {
        this.initialize();
    });
  },
  beforeUnmount() {
    eventBus.off("closeAddEvenDialog");
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
    isMobile() {
      return this.$vuetify.display.mobile;
    },
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },

  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    allowedUpdate(eventDate) {
      const today = new Date();
      const event = new Date(eventDate);
      return today <= event;
    },
    initialize() {
      let filter = this.$store.getters.getFilterSelected;
      this.loading = false;
      this.axiosCall("/school-events/getAllEventByType/"+this.activeTab.name+'/'+filter, "GET").then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.loading = false;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab; // Now setting only the ID
      this.tab = tab.id;
      this.initialize();
        this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });
    },

    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    add() {
      this.addData = [{ id: null }];
      this.action = "Add";
    },
    viewItem(item, action) {
      this.addData = item;
      this.action = action;
    },
    confirmDelete() {
      this.axiosCall("/school-events/" + this.deleteData.id, "DELETE").then(
        (res) => {
          console.log(res.data);
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Account deleted successfully!";
          this.dialogConfirmDelete =false
          this.initialize();
        },
      );
    },
  },
};
</script>
<style scoped>
.action-card {
  cursor: pointer;
  transition: all 0.2s ease;
}
.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
}
</style>

<style scoped>
.action-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
</style>
