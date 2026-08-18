<template>
  <v-container fluid class="pa-6 accounts-page">
    <!-- Top Section -->
    <v-card rounded="xl" elevation="0" class="mb-6 toolbar-card">
      <v-card-text class="pa-5">
        <v-row align="center" dense>
          <!-- Tabs -->
          <v-col cols="12" md="6" class="d-flex flex-wrap ga-2">
            <div class="tab-group">
              <v-btn
                v-for="tab in tabList"
                :key="tab.id"
                size="small"
                rounded="lg"
                :class="['tab-btn', { 'tab-btn--active': tab.active }]"
                variant="text"
                @click="changeTab(tab)"
              >
                {{ tab.name }}
              </v-btn>
            </div>
          </v-col>

          <!-- Search & Action -->
          <v-col cols="12" md="6" class="d-flex justify-end ga-3">
            <v-text-field
              v-model="search"
              placeholder="Search users..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
              max-width="260"
              class="search-field"
            />
            <v-btn
              prepend-icon="mdi-plus"
              rounded="lg"
              color="#E35E93"
              variant="flat"
              @click="add"
            >
              Add Account
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card rounded="xl" elevation="0" class="table-card">
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        :items-per-page="10"
        :loading="loading"
        loading-text="Loading data..."
        class="text-body-2 dt-container accounts-table"
      >
        <template v-slot:[`item.fname`]="{ item }">
          <div class="font-weight-medium">
            {{ item.fname }} {{ item.lname }}
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <v-btn
              size="small"
              variant="tonal"
              rounded="lg"
              :color="tab === 1 ? '#E35E93' : '#2563EB'"
              class="me-2"
              @click="tab === 1 ? editItem(item) : viewItem(item)"
            >
              <v-icon start size="16">{{
                tab === 1 ? 'mdi-check' : 'mdi-eye'
              }}</v-icon>
              {{ tab === 1 ? 'Verify' : 'View' }}
            </v-btn>

            <v-btn
              v-if="tab === 1"
              size="small"
              variant="tonal"
              rounded="lg"
              color="error"
              @click="deleteItem(item)"
            >
              <v-icon start size="16">mdi-delete</v-icon>
              Delete
            </v-btn>
          </div>
        </template>

        <template #no-data>
          <v-empty-state
            icon="mdi-account-off-outline"
            title="No users found"
            text="Try adjusting your search or filters"
            class="py-10"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialogs -->
    <AccountVerificationDialog :data="updateData" :action="action" />
    <AddAccountDialog :data="addData" :action="action" />

    <!-- Delete Confirmation -->
    <v-dialog v-model="dialogConfirmDelete" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="text-center pt-8 pb-2">
          <v-avatar size="56" color="red-lighten-5" class="mb-4">
            <v-icon size="28" color="red">mdi-delete-outline</v-icon>
          </v-avatar>
          <div class="text-h6 font-weight-bold mb-1">Confirm Deletion</div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            This action cannot be undone. Are you sure you want to delete this
            account?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 py-6">
          <v-btn
            block
            variant="outlined"
            color="grey-darken-1"
            rounded="lg"
            @click="dialogConfirmDelete = false"
          >
            Cancel
          </v-btn>
          <v-btn
            block
            color="error"
            variant="flat"
            rounded="lg"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Options Dialog -->
    <v-dialog v-model="dialog" max-width="560" persistent>
      <v-card rounded="xl" elevation="2">
        <!-- Header -->
        <v-card-title
          class="d-flex align-center justify-space-between px-6 py-4 dialog-header"
        >
          <div>
            <div class="text-h6 font-weight-bold">View Details</div>
            <div class="text-caption dialog-header-subtitle">
              Choose what you want to manage
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
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
                elevation="0"
                @click="editItem(dataEdit)"
              >
                <v-card-text class="text-center">
                  <v-avatar
                    size="56"
                    class="mb-3 action-icon action-icon--module"
                  >
                    <v-icon size="28" color="white"
                      >mdi-file-cog-outline</v-icon
                    >
                  </v-avatar>
                  <div class="font-weight-medium">Module</div>
                  <div class="text-caption text-medium-emphasis">
                    System access &amp; roles
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Personal Info -->
            <v-col cols="12" md="4">
              <v-card
                class="action-card"
                rounded="lg"
                elevation="0"
                @click="personalInfo(dataEdit)"
              >
                <v-card-text class="text-center">
                  <v-avatar
                    size="56"
                    class="mb-3 action-icon action-icon--personal"
                  >
                    <v-icon size="28" color="white"
                      >mdi-account-box-outline</v-icon
                    >
                  </v-avatar>
                  <div class="font-weight-medium">Personal Info</div>
                  <div class="text-caption text-medium-emphasis">
                    Profile &amp; details
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Credentials -->
            <v-col cols="12" md="4">
              <v-card
                class="action-card"
                rounded="lg"
                elevation="0"
                @click="credentials(dataEdit)"
              >
                <v-card-text class="text-center">
                  <v-avatar
                    size="56"
                    class="mb-3 action-icon action-icon--credentials"
                  >
                    <v-icon size="28" color="white">mdi-file-sign</v-icon>
                  </v-avatar>
                  <div class="font-weight-medium">Credentials</div>
                  <div class="text-caption text-medium-emphasis">
                    Certificates &amp; licenses
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Footer -->
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn
            variant="outlined"
            color="grey"
            rounded="lg"
            @click="dialog = false"
          >
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
import AccountVerificationDialog from "../../components/Dialogs/Forms/AccountVerificationDialog.vue";
import AddAccountDialog from "../../components/Dialogs/Forms/AddAccountDialog.vue";
export default {
  components: {
    AccountVerificationDialog,
    AddAccountDialog,
  },
  data: () => ({
    search: "",
    dialog: false,
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
    dataEdit: [],
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
    activeTab: { id: 1, name: "For Verification", active: true },
    tab: 1,
    tabList: [
      { id: 1, name: "For Verification", active: true },
      { id: 2, name: "Verified", active: false },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    addData: null,
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
    this.dialog = false;
    eventBus.on("closeAccountsVerificationDialog", () => {
      if (this.tab == 1) {
        this.initialize();
      } else if (this.tab == 2) {
        this.getVerifiedUsers();
      }
    });
    eventBus.on("closeAddAccountDialog", () => {
      if (this.tab == 1) {
        this.initialize();
      } else if (this.tab == 2) {
        this.getVerifiedUsers();
      }
    });
  },
  beforeUnmount() {
    eventBus.off("closeAccountsVerificationDialog");
    eventBus.off("closeAddAccountDialog");
  },
  watch: {
    options: {
      handler() {
        if (this.tab == 1) {
          this.initialize();
        } else if (this.tab == 2) {
          this.getVerifiedUsers();
        }
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

    initialize() {
      this.loading = true;
      this.tab = 1;

      this.axiosCall("/user-details/getAllUsersToVerify", "GET").then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.activeTab = { id: 1, name: "For Verification" };
          this.data = data;
          this.dialog = false;
          this.loading = false;
        }
      });
    },

    getVerifiedUsers() {
      this.loading = true;
      this.axiosCall("/user-details/getAllVerifiedUser", "GET").then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.dialog = false;
          this.loading = false;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab.id; // Now setting only the ID

      if (tab.id === 1) {
        this.initialize();
      } else if (tab.id === 2) {
        this.getVerifiedUsers();
      }

      this.tab = tab.id;

      // Optional: if you want visual styling control using `tab.active`
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
    personalInfo(dataEdit) {
      this.addData = dataEdit;
      this.action = "Update";
    },
    credentials(dataEdit) {
      this.addData = dataEdit;
      this.action = "Edit";
    },

    editItem(item) {
      this.updateData = item;
      this.action = this.tab == 1 ? "Verify" : "Update";
    },
    viewItem(item) {
      this.dialog = true;
      this.dataEdit = item;
    },

    confirmDelete() {
      this.axiosCall("/user-details/" + this.deleteData.id, "DELETE").then(
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
.accounts-page {
  --brand: #e35e93;
  --brand-soft: #fdeef5;
  --ink: #17241d;
  --ink-soft: #6b7280;
}

/* Toolbar */
.toolbar-card,
.table-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.tab-group {
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 4px;
  display: inline-flex;
  gap: 4px;
}

.tab-btn {
  color: var(--ink-soft) !important;
  font-weight: 500;
}

.tab-btn--active {
  background-color: #ffffff !important;
  color: var(--brand) !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.search-field :deep(.v-field) {
  border-radius: 10px;
}

.dialog-header-subtitle {
  color: rgba(255, 255, 255, 0.85);
}

/* Table — header background/rounding comes from the global .dt-container class */
.accounts-table :deep(thead th) {
  font-weight: 700 !important;
  font-size: 11px !important;
  letter-spacing: 0.05em;
}

.accounts-table :deep(tbody tr:hover) {
  background-color: var(--brand-soft);
}

/* Action cards in the View Details dialog */
.action-card {
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}
.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  border-color: var(--brand);
}

.action-icon {
  margin-inline: auto;
}
.action-icon--module {
  background: linear-gradient(135deg, #e35e93, #c2457b);
}
.action-icon--personal {
  background: linear-gradient(135deg, #0d9488, #0a6f66);
}
.action-icon--credentials {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

@media (prefers-reduced-motion: reduce) {
  .action-card {
    transition: none !important;
  }
}
</style>
