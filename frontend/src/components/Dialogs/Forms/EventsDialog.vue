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
              <v-col cols="12">
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
              <v-col cols="12">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="formatedDate"
                      label="Select Date"
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
      formatedDate: null,
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
    },

    accept() {
      let filter = this.$store.getters.getFilterSelected;
      let data = {
        eventDate: this.eventDate,
        eventName: this.eventName,
        eventDescription: this.eventDescription,
        eventType: this.event,
        schoolYearID: filter,
      };
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
    },

    update() {
      let data = {
        eventDate: this.eventDate,
        eventName: this.eventName,
        eventDescription: this.eventDescription,
      };
      console.log(data, this.data.id);
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
    },
  },
};
</script>
