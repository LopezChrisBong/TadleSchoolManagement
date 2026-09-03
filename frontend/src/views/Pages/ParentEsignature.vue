<template>
  <div>
    <v-card class="ma-5 dt-container" elevation="0" variant="outlined">
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        v-model:options="options"
        :loading="loading"
        hide-default-footer
      >
        <template #[`item.hasEsign`]="{ item }">
          <v-icon v-if="item.hasEsign" color="#519043" size="large">
            mdi-check-bold
          </v-icon>
          <v-icon v-else color="red" size="large">mdi-alpha-x</v-icon>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            v-if="item.hasEsign"
            size="small"
            color="grey"
            icon="mdi-eye"
            variant="text"
            @click="viewItem(item)"
          />
          <v-btn
            size="x-small"
            color="grey"
            variant="outlined"
            prepend-icon="mdi-pencil-outline"
            @click="editItem(item)"
          >
            Update
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <MyESigDialog :data="updateData" :action="action" />

    <v-dialog v-model="dialogConfirmDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Confirmation</v-card-title>

        <v-card-text style="font-size: 17px">
          Are you sure you want to delete this item?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="teal-darken-3"
            variant="outlined"
            @click="dialogConfirmDelete = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="teal-darken-3"
            class="text-white"
            @click="
              confirmDelete();
              dialogConfirmDelete = false;
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <fade-away-message-component
      display-type="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    />
  </div>
</template>

<script>
import eventBus from '@/eventBus';
import MyESigDialog from '../../components/Dialogs/Forms/MyESigDialog.vue';
export default {
  components: {
    MyESigDialog,
  },
  data() {
    return {
      search: '',
      headers: [
        {
          title: 'Has Uploaded E-signature',
          value: 'hasEsign',
          align: 'start',
        },
        {
          title: 'Actions',
          value: 'actions',
          align: 'center',
          sortable: false,
          width: 200,
        },
      ],
      data: [],
      perPageChoices: [
        { title: '5', value: 5 },
        { title: '10', value: 10 },
        { title: '20', value: 20 },
        { title: '50', value: 50 },
        { title: '100', value: 100 },
        { title: '250', value: 250 },
        { title: '500', value: 500 },
      ],
      totalCount: 0,
      deleteData: null,
      updateData: null,
      loading: false,
      options: {},
      action: null,
      paginationData: {},
      dialogConfirmDelete: false,
      fadeAwayMessage: {
        show: false,
        type: 'success',
        header: 'Successfully Deleted!',
        message: '',
        top: 10,
      },
    };
  },
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
    eventBus.on('closeMyESigDialog', () => {
      this.initialize();
    });
  },
  beforeUnmount() {
    eventBus.off('closeMyESigDialog');
  },
  methods: {
    pagination(dataArg) {
      this.paginationData = dataArg;
    },
    initialize() {
      this.loading = true;
      this.axiosCall('/e-sigs/getMyEsign', 'GET').then((res) => {
        if (res.data) {
          this.data = res.data;
          this.loading = false;
        }
      });
    },
    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    editItem(item) {
      this.updateData = item;
      this.action = 'Update';
    },
    viewItem(item) {
      this.updateData = item;
      this.action = 'View';
    },
    confirmDelete() {
      this.axiosCall('/request-type/' + this.deleteData.id, 'DELETE').then(
        () => {
          this.fadeAwayMessage.show = true;
          this.initialize();
        },
      );
    },
  },
};
</script>
