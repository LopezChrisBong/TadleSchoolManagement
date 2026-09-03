<template>
  <div>
    <v-dialog persistent v-model="dialog" scrollable max-width="600px">
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-5">
          <v-avatar color="green-lighten-4" class="mr-3">
            <v-icon color="green-darken-2">mdi-draw-pen</v-icon>
          </v-avatar>

          <div>
            <div class="text-h6 font-weight-bold">
              {{ action === 'Update' ? 'Update' : 'View' }} E-Signature
            </div>
            <div class="text-caption text-medium-emphasis">
              {{
                action === 'Update'
                  ? 'Upload a new signature image'
                  : 'Signature on file'
              }}
            </div>
          </div>

          <v-spacer />

          <v-btn icon="mdi-close" variant="text" @click="close()" />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-5">
          <v-form ref="myEsigFormRef" @submit.prevent>
            <div class="text-caption text-medium-emphasis mb-2">Preview</div>

            <v-sheet
              rounded="lg"
              border
              class="d-flex align-center justify-center mb-5"
              :class="imgpreview ? 'pa-4' : 'pa-8'"
              color="grey-lighten-5"
              height="180"
            >
              <img
                v-if="imgpreview"
                :src="imgpreview"
                alt="E-signature preview"
                style="max-height: 150px; max-width: 100%; object-fit: contain"
              />
              <div v-else class="text-center text-medium-emphasis">
                <v-icon size="32" class="mb-1">mdi-image-off-outline</v-icon>
                <div class="text-caption">No signature uploaded</div>
              </div>
            </v-sheet>

            <v-file-input
              v-if="action === 'Update'"
              v-model="esigSelected"
              :rules="[formRules.required]"
              prepend-icon=""
              prepend-inner-icon="mdi-camera"
              accept="image/png"
              variant="outlined"
              color="green-darken-2"
              density="comfortable"
              label="Upload PNG signature"
              hint="PNG only, transparent background recommended"
              persistent-hint
              @change="changeImage()"
            />
          </v-form>
        </v-card-text>

        <v-divider v-if="action === 'Update'" />

        <v-card-actions v-if="action === 'Update'" class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="close()">Cancel</v-btn>
          <v-btn
            color="green-darken-2"
            class="text-white"
            variant="flat"
            prepend-icon="mdi-check-circle"
            :loading="updating"
            @click="update()"
          >
            Update Details
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
export default {
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
      dialog: false,
      esigSelected: null,
      imgpreview: null,
      updating: false,
      fadeAwayMessage: {
        show: false,
        type: 'success',
        header: 'Successfully Added!',
        message: '',
        top: 10,
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        if (data) {
          this.dialog = true;

          if (data.esign && data.esign.id != null) {
            this.imgpreview =
              process.env.VUE_APP_SERVER +
              '/e-sigs/getEsign/' +
              data.esign.esign_filename;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;
      eventBus.emit('closeMyESigDialog', false);
    },
    changeImage() {
      this.imgpreview = this.esigSelected
        ? URL.createObjectURL(this.esigSelected)
        : null;
    },
    async update() {
      const { valid } = await this.$refs.myEsigFormRef.validate();
      if (!valid) return;

      this.updating = true;

      const fd = new FormData();
      fd.append('file', this.esigSelected);

      try {
        const res = await this.axiosCall('/e-sigs/uploadEsign', 'POST', fd);

        if (res.data.status === 200) {
          this.fadeAwayMessage = {
            ...this.fadeAwayMessage,
            show: true,
            type: 'success',
            header: 'System Message',
            message: res.data.msg,
          };
        } else if (res.data.status === 400) {
          this.fadeAwayMessage = {
            ...this.fadeAwayMessage,
            show: true,
            type: 'error',
            header: 'System Message',
            message: res.data.msg,
          };
          this.$refs.myEsigFormRef.reset();
        } else if (res.data.status === 413) {
          this.fadeAwayMessage = {
            ...this.fadeAwayMessage,
            show: true,
            type: 'error',
            header: 'System Message',
            message: 'File size exceeds the maximum limit of 4MB.',
          };
          this.$refs.myEsigFormRef.reset();
        }
        this.close();
      } finally {
        this.updating = false;
      }
    },
  },
};
</script>
