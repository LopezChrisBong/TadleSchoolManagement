<template>
  <div>
    <v-dialog v-model="dialog" max-width="620" persistent scrollable>
      <v-form ref="EventForm" @submit.prevent>
        <v-card rounded="xl" elevation="2">
          <!-- Header -->
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h6 font-weight-bold">
                {{ action }} {{ event }} Event
              </div>
              <div class="text-caption text-grey">
                Create upcoming events of school.
              </div>
            </div>

            <v-btn
              icon="mdi-close"
              variant="text"
              color="grey"
              @click="closeD"
            />
          </v-card-title>

          <v-divider />

          <!-- Content -->
          <v-card-text class="pa-6" style="max-height: 65vh">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  density="comfortable"
                  v-model="eventName"
                  label="Name of event"
                  :rules="[formRules.required]"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-radio-group v-model="isActive" inline>
                  <v-radio
                    label="Active"
                    color="green"
                    :value="STATUS.ACTIVE"
                  />
                  <v-radio
                    label="Inactive"
                    color="red"
                    :value="STATUS.INACTIVE"
                  />
                </v-radio-group>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="formatedDate"
                      label="Start date of event"
                      variant="outlined"
                      density="comfortable"
                      color="pink"
                      readonly
                      v-bind="props"
                    />
                  </template>

                  <v-date-picker
                    v-model="eventDate"
                    :min="minDate"
                    color="pink"
                    @update:model-value="
                      menu = false;
                      formatEventDate();
                    "
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <div
                  v-if="showFileActions"
                  class="d-flex justify-space-between pa-2"
                >
                  <v-btn
                    color="green"
                    variant="flat"
                    class="pa-2 mx-2"
                    @click="viewFile()"
                  >
                    <v-icon start> mdi-eye-outline </v-icon>
                    View File
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="flat"
                    class="pa-2"
                    @click="handleUpdateClick"
                  >
                    <v-icon start> mdi-pencil-outline </v-icon>
                    Update File
                  </v-btn>
                </div>
                <div v-else>
                  <v-file-input
                    variant="outlined"
                    v-model="uploadedFile"
                    @update:modelValue="onFileChange"
                    density="comfortable"
                    class="rounded-lg"
                    label="Event Image(landscape)"
                    color="pink"
                    accept=".png, .jpg, .jpeg"
                    :clearable="false"
                  />
                </div>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  variant="outlined"
                  density="comfortable"
                  v-model="eventDescription"
                  label="Description"
                  :rules="[formRules.required]"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider />

          <!-- Actions -->
          <v-card-actions class="px-6 py-4">
            <v-spacer />

            <v-btn variant="outlined" color="grey" @click="closeD">
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              variant="flat"
              @click="action == 'Add' ? accept() : update()"
              v-if="
                action == 'Add' ? true : userId == data?.addedBy ? true : false
              "
              :disabled="disableButton"
            >
              <v-icon start>
                {{ action === 'Add' ? 'mdi-check-circle' : 'mdi-content-save' }}
              </v-icon>
              {{ action === 'Add' ? 'Add' : 'Update' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
import eventBus from '@/eventBus';
export default {
  props: {
    data: Object,
    action: String,
    event: String,
  },
  data() {
    return {
      dialog: false,
      menu: false,
      eventDate: null,
      isUpdateFile: false,
      formatedDate: null,
      STATUS: {
        ACTIVE: 1,
        INACTIVE: 0,
      },
      isActive: 1,
      eventFile: null,
      uploadedFile: null,
      eventName: null,
      minDate: new Date().toISOString().slice(0, 10),
      eventDescription: null,
      fadeAwayMessage: {
        show: false,
        type: 'success',
        header: 'Successfully Added!',
        message: '',
        top: 10,
      },
    };
  },
  computed: {
    showFileActions() {
      return this.action === 'Update' && !this.isUpdateFile;
    },
    filteredAccessModules() {
      if (!this.verifyModel.assignedModuleID) {
        return this.assigneAccessModulesList;
      }

      return this.assigneAccessModulesList.filter(
        (item) => item.id !== this.verifyModel.assignedModuleID,
      );
    },
    disableButton() {
      if (
        this.eventName == '' ||
        this.eventName == null ||
        this.eventDescription == '' ||
        this.eventDescription == null ||
        this.eventDate == '' ||
        this.eventDate == null
      ) {
        return true;
      } else {
        return false;
      }
    },
  },

  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.initialize();
        if (data.id) {
          console.log('Love', data);
          this.eventName = data.eventName;
          this.formatedDate = this.formatDate(data.eventDate);
          this.eventDate = data.eventDate;
          this.eventDescription = data.eventDescription;
          this.eventFile = data.eventFile;
          this.isActive = data.isActive;
        } else {
          this.eventName = null;
          this.eventDate = null;
          this.eventDescription = null;
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.userId = this.$store.state.user.id;
    },
    formatEventDate() {
      this.formatedDate = this.formatDate(this.eventDate);
    },
    closeD() {
      eventBus.emit('closeAddEvenDialog', true);
      this.dialog = false;
      this.eventFile = null;
      this.uploadedFile = null;
      this.isUpdateFile = false;
      this.eventDescription = null;
      this.eventDate = null;
      this.eventName = null;
    },

    accept() {
      let filter = this.$store.getters.getFilterSelected;
      const fd = new FormData();
      fd.append('file', this.uploadedFile);
      let data = {
        eventDate: this.eventDate,
        eventName: this.eventName,
        eventDescription: this.eventDescription,
        eventType: this.event,
        schoolYearID: filter,
      };
      fd.append('body', JSON.stringify(data));
      if (!this.uploadedFile) {
        this.axiosCall('/school-events', 'POST', data).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'success';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'error';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      } else {
        this.axiosCall('/school-events/addEvent', 'POST', fd).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'success';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = 'error';
            this.fadeAwayMessage.header = 'System Message';
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    update() {
      const fd = new FormData();
      fd.append('file', this.uploadedFile);
      let data = {
        id: this.data.id,
        oldFile: this.eventFile,
        eventDate: this.eventDate,
        eventName: this.eventName,
        eventDescription: this.eventDescription,
        isActive: this.isActive,
      };
      fd.append('body', JSON.stringify(data));
      console.log(data, this.data.id);
      if (!this.uploadedFile) {
        this.axiosCall('/school-events/' + this.data.id, 'PATCH', data).then(
          (res) => {
            if (res.data.status == 201 || res.data.status == 200) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'success';
              this.fadeAwayMessage.header = 'System Message';
              this.fadeAwayMessage.message = 'Successfully updated!!';
              this.closeD();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'error';
              this.fadeAwayMessage.header = 'System Message';
              this.fadeAwayMessage.message = res.data.msg;
            }
          },
        );
      } else {
        this.axiosCall('/school-events/update-event-file', 'POST', fd).then(
          (res) => {
            if (res.data.status == 201 || res.data.status == 200) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'success';
              this.fadeAwayMessage.header = 'System Message';
              this.fadeAwayMessage.message = 'Successfully updated!!';
              this.closeD();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = 'error';
              this.fadeAwayMessage.header = 'System Message';
              this.fadeAwayMessage.message = res.data.msg;
            }
          },
        );
      }
    },
    onFileChange(file) {
      this.isUpdateFile = false;
      this.uploadedFile = file;
    },
    handleUpdateClick() {
      this.isUpdateFile = true;
      this.uploadedFile = null;
    },
    viewFile() {
      const file = Array.isArray(this.uploadedFile)
        ? this.uploadedFile[0]
        : this.uploadedFile;

      if (file) {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');

        setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
        return;
      }

      if (this.eventFile) {
        window.open(
          `${process.env.VUE_APP_SERVER}/school-events/view/eventFile/${this.eventFile}`,
          '_blank',
        );
      }
    },
  },
};
</script>
