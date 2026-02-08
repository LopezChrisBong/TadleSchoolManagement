<template>
  <div>
    <v-row class="mx-2 mt-2">
      <v-col cols="12" md="6" class="flex-items" style="overflow: auto">
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
          :class="tab == 3 ? 'd-none' : ''"
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
              color="pink"
              class="my-2"
              variant="flat"
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Update
            </v-btn>
            <v-btn
              x-small
              color="pink"
              class="my-2 mx-2"
              variant="outlined"
              @click="confirmDelete(item)"
            >
              <v-icon size="14">mdi-delete-outline</v-icon>Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <CreateSubjectDialog
      :data="designationData"
      :action="action"
      :filter="filter"
    />

    <VDialog v-model="confirmDialog" persistent max-width="400">
      <VCard rounded="lg">
        <!-- Header -->
        <VCardTitle class="d-flex align-center bg-error text-white">
          <VIcon class="me-2">mdi-alert-circle</VIcon>
          Warning
        </VCardTitle>

        <!-- Content -->
        <VCardText class="pt-4">
          <p class="text-body-1 mb-3" style="text-align: justify">
            Are you sure you want to delete subject
            {{ deleteData.subject_title }}?
          </p>

          <!-- <VAlert type="error" variant="tonal" density="compact">
            This action is <strong>irreversible</strong>.
          </VAlert> -->
        </VCardText>

        <!-- Actions -->
        <VCardActions class="px-4 pb-4">
          <VSpacer />

          <VBtn variant="text" color="grey" @click="confirmDialog = false">
            Cancel
          </VBtn>

          <VBtn color="error" variant="flat" @click="deleteItem">
            <VIcon start>mdi-delete</VIcon>
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
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
import eventBus from '@/eventBus';
import CreateSubjectDialog from '../../components/Dialogs/Forms/CreateSubjectDialog.vue';
export default {
  components: {
    CreateSubjectDialog,
  },
  data: () => ({
    search: '',
    taggingData: null,
    fullname: null,
    applicantData: null,
    headers: [
      {
        title: 'Subject Title',
        value: 'subject_title',
        align: 'start',
        valign: 'center',
      },

      {
        title: 'Writen Works',
        value: 'writen_works',
        align: 'center',
        valign: 'center',
        sortable: false,
      },

      {
        title: 'Performance Task',
        value: 'performance_task',
        align: 'center',
        valign: 'center',
        sortable: false,
      },

      {
        title: 'Quarter Assessment',
        value: 'quarter_assessment',
        align: 'center',
        valign: 'center',
        sortable: false,
      },

      {
        title: 'Action',
        value: 'action',
        align: 'end',
        valign: 'end',
        sortable: false,
      },
    ],

    data: [],
    printData: [],
    verified: [],
    perPageChoices: [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
      { text: '20', value: 20 },
      { text: '50', value: 50 },
      { text: '100', value: 100 },
      { text: '250', value: 250 },
      { text: '500', value: 500 },
    ],
    activeTab: { id: 1, name: 'Junior High' },
    tab: 1,
    tabList: [
      { id: 1, name: 'Junior High', active: true },
      { id: 2, name: 'Senior High', active: false },
      // { id: 2, name: "Junior High" },
      // { id: 2, name: "Senior High" },
      //   { id: 3, name: "Applicants" },
    ],
    filter: null,
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
    fadeAwayMessage: {
      show: false,
      type: 'success',
      header: 'Successfully Deleted!',
      message: '',
      top: 10,
    },
    yearList: [],
    monthsList: [
      { id: 0, name: 'All' },
      { id: 1, name: 'January' },
      { id: 2, name: 'February' },
      { id: 3, name: 'March' },
      { id: 4, name: 'April' },
      { id: 5, name: 'May' },
      { id: 6, name: 'June' },
      { id: 7, name: 'July' },
      { id: 8, name: 'August' },
      { id: 9, name: 'September' },
      { id: 10, name: 'October' },
      { id: 11, name: 'November' },
      { id: 12, name: 'December' },
    ],
  }),

  mounted() {
    this.initialize();
    eventBus.on('closeAddSubjectDialog', () => {
      this.initialize();
    });
  },

  beforeUnmount() {
    // eventBus.off("closeMyJobApplicationDialog");
    eventBus.off('closeAddSubjectDialog');

    // eventBus.off("closeMyDesignationDialog");
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
    tag(item) {
      this.taggingData = item;
      this.action = 'Tag';
    },
    printApplicants(item) {
      console.log('Item Print Report', item.id);
      let data = this.printData;
      let filter = this.$store.getters.getFilterSelected;
      console.log('Print Data', data);
      window.open(
        process.env.VUE_APP_SERVER +
          '/pdf-generator/generateJobApplicant/' +
          item.id +
          '/' +
          filter +
          '',
        '_blank', // <- This is what makes it open in a new window.
      );
    },

    // loadYear() {
    //   let curYear;
    //   var d = new Date();
    //   curYear = d.getFullYear();
    //   for (let i = curYear; i >= 2020; i--) {
    //     this.yearList.push(i);
    //   }
    // },

    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      // let filter = this.$store.getters.getFilterSelected;
      // alert(this.tabList[0].name);
      this.loading = true;
      // alert(filter);
      this.axiosCall(
        '/subjects/getSubject/active/' + this.activeTab.name,
        'GET',
      ).then((res) => {
        if (res) {
          console.log('LoveNot', res.data);
          this.data = res.data;
          this.loading = false;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab;

      this.tab = tab.id;
      this.initialize();
      this.tabList.forEach((t) => {
        t.active = t.id === tab.id;
      });
    },
    add() {
      let filter = this.$store.getters.getFilterSelected;
      this.designationData = [{ id: null, tab: this.tab }];
      this.action = 'Add';
      this.filter = filter;
    },
    editItem(item) {
      console.log(this.tab, item);
      let filter = this.$store.getters.getFilterSelected;
      this.designationData = item;
      this.action = 'Update';
      this.filter = filter;
    },

    deleteItem() {
      console.log(this.deleteData.id);
      this.axiosCall(
        '/subjects/deleteSubject/' + this.deleteData.id,
        'PATCH',
        {},
      ).then((res) => {
        if (res.data.status == 201) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'success';
          this.fadeAwayMessage.header = 'System Message';
          this.fadeAwayMessage.message = res.data.msg;
          this.confirmDialog = false;
          this.initialize();
        } else if (res.data.status == 400) {
          this.confirmDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
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
