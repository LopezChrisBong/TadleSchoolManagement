<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="fade-away-message-container elevation-2 rounded-lg"
      :class="{
        show: showClass,
        hide: !showClass,
        variation1: showVariation1Class,
        variation2: showVariation2Class,
        variation3: showVariation3Class,
        variation4: showVariation4Class,
        variation5: showVariation5Class,
      }"
      :style="{ width: widthStyle, '--accent': background }"
    >
      <div class="accent-bar" :style="{ backgroundColor: background }"></div>

      <v-row no-gutters align="center" class="pa-4">
        <!-- Icon Column -->
        <v-col
          :cols="12"
          sm="3"
          class="d-flex justify-center"
          v-if="displayType === 'variation2'"
        >
          <v-avatar
            size="56"
            class="my-auto icon-badge"
            :style="{ backgroundColor: background + '1A' }"
          >
            <v-icon :color="background" size="28">{{ mdiIcon }}</v-icon>
          </v-avatar>
        </v-col>

        <v-col cols="12" sm="3" class="d-flex justify-center" v-else>
          <v-avatar
            size="56"
            class="my-auto icon-badge"
            :style="{ backgroundColor: background + '1A' }"
          >
            <v-icon :color="background" size="28">{{ mdiIcon }}</v-icon>
          </v-avatar>
        </v-col>

        <!-- Content Column -->
        <v-col cols="12" sm="9" class="d-flex flex-column justify-center">
          <div
            v-if="header"
            class="text-h6 font-weight-bold mb-1 text-center text-sm-left message-header"
          >
            {{ header }}
          </div>
          <div
            v-if="message"
            class="text-body-2 text-center text-sm-left message-body"
          >
            {{ message }}
          </div>
        </v-col>
      </v-row>

      <!-- Close Button -->
      <v-row no-gutters justify="center" class="border-top">
        <v-btn
          variant="text"
          :color="background"
          class="close-btn"
          block
          @click="clickClose"
          aria-label="Close notification"
        >
          <v-icon class="me-2" size="18">mdi-close</v-icon> Close
        </v-btn>
      </v-row>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'FadeAwayMessage',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    header: {
      type: String,
      default: 'SERVER ERROR',
    },
    message: {
      type: String,
      default: 'Something went wrong!',
    },
    timeout: {
      type: [Number, String],
      default: 10000,
    },
    type: {
      type: String,
      default: 'success',
    },
    // top: {
    //   type: [Number, String],
    //   default: 20,
    // },
    backgroundClass: {
      type: String,
      default: 'primary',
    },
    textColorClass: {
      type: String,
      default: 'white--text',
    },
    displayType: {
      type: String,
      default: 'default',
    },
    width: {
      type: [Number, String],
      default: 600,
    },
  },

  watch: {
    modelValue(val) {
      this.display = val;
      if (val) {
        this.showBox();
      } else {
        this.clickClose();
      }
    },

    type: function (val) {
      this.setType(val);
    },

    // display(val) {
    //   if (val) {
    //     this.showBox();
    //   } else {
    //     this.clickClose();
    //   }
    // },
  },

  mounted: function () {
    this.display = this.modelValue;
  },

  data: () => ({
    display: false,
    mdiIcon: 'mdi-check',
    background: '#6DB249',
    headerClasses: 'title',
    mainContainerClasses: {},
    timeoutId: null,
    showClass: false,
    showVariation1Class: false,
    showVariation2Class: false,
    showVariation3Class: false,
    showVariation4Class: false,
    showVariation5Class: false,
  }),
  computed: {
    widthStyle() {
      return typeof this.width === 'number' ? `${this.width}px` : this.width;
    },
  },

  methods: {
    showBox() {
      this.headerClasses = 'title';
      this.setType();
      this.setMainContainerClass();

      setTimeout(() => {
        this.showClass = true;
        this.timeoutId = setTimeout(() => {
          this.clickClose();
        }, this.timeout);
      }, 10);
    },

    clickClose() {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.showClass = false;
      this.$emit('update:modelValue', false);
    },
    setMainContainerClass() {
      this.showVariation1Class = false;
      this.showVariation2Class = false;
      this.showVariation3Class = false;
      this.showVariation4Class = false;
      this.showVariation5Class = false;

      switch (this.displayType) {
        case 'variation1':
          this.showVariation1Class = true;
          break;
        case 'variation2':
          this.showVariation2Class = true;
          break;
        case 'variation3':
          this.showVariation3Class = true;
          break;
        case 'variation4':
          this.showVariation4Class = true;
          break;
        case 'variation5':
          this.showVariation5Class = true;
          break;
      }
    },

    setType(type) {
      switch (type) {
        case 'success':
        case 'primary':
          this.background = '#6DB249';
          this.mdiIcon = 'mdi-check';
          break;
        case 'warning':
          this.background = '#F59E0B';
          this.mdiIcon = 'mdi-alert-circle-outline';
          break;
        case 'danger':
        case 'error':
          this.background = '#DC2626';
          this.mdiIcon = 'mdi-alert-octagon-outline';
          break;
      }
    },
  },
};
</script>

<style scoped>
.fade-away-message-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 300px;
  background: white;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.18);
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  pointer-events: none;
  user-select: none;
  border-radius: 16px;
  overflow: hidden;
  z-index: 2147483647;
}
@media (min-width: 768px) {
  .fade-away-message-container {
    max-width: 600px;
  }
}

.fade-away-message-container.show {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, -50%) scale(1);
}

.fade-away-message-container.hide {
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.95);
}

.accent-bar {
  height: 4px;
  width: 100%;
}

.icon-badge {
  border-radius: 50%;
}

.message-header {
  color: #17241d;
}

.message-body {
  color: #6b7280;
}

.border-top {
  border-top: 1px solid #eef0f2;
}

.close-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.02em;
}
</style>
