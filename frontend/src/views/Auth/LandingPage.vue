<template>
  <v-app>
    <v-app-bar elevation="3" class="top-bot">
      <v-container fluid>
        <div
          class="d-flex align-center justify-space-between flex-wrap"
          style="color: #e93175"
        >
          <div class="d-flex align-center">
            <v-icon size="28" class="mr-2">mdi-school</v-icon>

            <span
              class="font-weight-bold"
              :class="!isSmAndUp ? 'text-subtitle-1' : 'text-h6'"
            >
              Southern Davao National High School
            </span>
          </div>

          <div
            v-if="isSmAndUp"
            class="text-caption font-weight-medium text-right mt-1 mt-sm-0"
          >
            facebook • twitter • email • number
          </div>
        </div>
      </v-container>
    </v-app-bar>
    <!-- HERO SECTION -->
    <v-container fluid class="hero-section py-16 mt-15">
      <v-row align="center" justify="center">
        <v-col cols="12" md="6" class="text-center">
          <v-img
            src="/img/bgportal.jpg"
            max-width="480"
            class="mx-auto"
            cover
            rounded="xl"
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center align-center">
          <div>
            <h1 class="text-pink">SOUTHERN DAVAO NATIONAL HIGH SCHOOL</h1>

            <p class="hero-subtitle mt-4">
              "Education is the most powerful weapon which you can use to change
              the world." — Nelson Mandela
            </p>

            <v-btn
              color="#e93175"
              size="large"
              variant="outlined"
              append-icon="mdi-account"
              class="mt-6"
              rounded="lg"
              style="width: 300px"
              @click="goToDiv()"
            >
              Open Portal
            </v-btn>
            <v-btn
              color="#e93175"
              size="large"
              variant="flat"
              append-icon="mdi-calendar"
              class="mt-6 mx-3"
              rounded="lg"
              style="width: 300px"
              @click="goToEvents()"
            >
              EVENTS
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-divider color="black"></v-divider>
    <!--EVENTS-->
    <div style="background-color: #f3f3f3; width: 100%" id="events">
      <v-container class="py-12">
        <v-row>
          <v-col
            cols="12"
            v-for="(events, eventType) in eventList.event"
            :key="eventType"
            class="mb-10"
          >
            <div class="d-flex align-center mb-6">
              <v-icon size="32" class="mr-3" color="pink">
                {{ getIcon(eventType) }}
              </v-icon>

              <h2 class="font-weight-bold" style="color: #e93175">
                {{ eventType }}
              </h2>

              <v-spacer />

              <v-chip color="pink" variant="tonal" size="small">
                {{ events.length }} events
              </v-chip>
            </div>

            <v-row>
              <v-col cols="12" md="4" v-for="(event, i) in events" :key="i">
                <v-card rounded="xl" elevation="2" class="event-card">
                  <v-card-text>
                    <v-chip
                      color="pink"
                      variant="outlined"
                      size="small"
                      class="mb-3"
                    >
                      {{ formatDate(event.eventDate) }}
                    </v-chip>

                    <h3 class="mb-2 font-weight-medium">
                      {{ event.eventName }}
                    </h3>

                    <p class="text-medium-emphasis mb-0">
                      {{ event.eventDescription }}
                    </p>
                  </v-card-text>

                  <v-divider />

                  <v-card-actions>
                    <v-btn variant="text" color="pink" size="small">
                      View Details
                    </v-btn>

                    <v-spacer />

                    <v-icon size="18" color="grey"> mdi-calendar </v-icon>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- FOOTER -->
    <v-divider color="black"></v-divider>
    <v-footer class="py-2">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <strong>MISSION</strong>
            <p class="text-grey mt-2">MISSION WORDS</p>
          </v-col>

          <v-col cols="12" md="4">
            <strong>VISSION</strong>
            <p class="text-grey">VISSION WORDS</p>
          </v-col>

          <v-col cols="12" md="4">
            <strong>CORE VALUES</strong>
            <p class="text-grey mt-2">CORE WORDS</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <v-dialog v-model="portalDialog" max-width="560">
      <v-card rounded="2xl" class="portal-dialog">
        <v-card-title class="text-center py-6">
          <div class="text-h6 font-weight-bold">Choose your portal</div>
          <div class="text-body-2 text-medium-emphasis mt-1">
            Select the portal that applies to you to sign in
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="py-8">
          <v-row justify="center" dense>
            <v-col
              v-for="(item, i) in modules"
              :key="i"
              cols="12"
              sm="6"
              class="d-flex justify-center"
            >
              <v-card
                @click="setActive(i)"
                rounded="xl"
                height="190"
                width="210"
                :elevation="item.active ? 12 : 4"
                :class="[
                  'module-card d-flex flex-column align-center justify-center pa-6',
                  item.active ? 'active-card' : 'inactive-card',
                ]"
              >
                <v-icon
                  size="68"
                  class="mb-4"
                  :color="item.active ? 'white' : 'pink'"
                >
                  {{ item.icon }}
                </v-icon>

                <div
                  class="text-subtitle-1 font-weight-medium text-center"
                  :class="item.active ? 'text-white' : 'text-grey-darken-4'"
                >
                  {{ item.label }}
                </div>

                <v-chip
                  v-if="item.active"
                  size="x-small"
                  color="white"
                  variant="outlined"
                  class="mt-3"
                >
                  Selected
                </v-chip>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-6 py-4">
          <v-spacer />
          <v-btn variant="flat" color="red" @click="portalDialog = false">
            Cancel
          </v-btn>

          <!-- <v-btn
            color="primary"
            variant="flat"
            class="ml-3"
            :disabled="!modules.some((m) => m.active)"
          >
            Continue
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { useDisplay } from 'vuetify';
export default {
  data() {
    return {
      portalDialog: false,
      eventList: [],
      display: useDisplay(),
      modules: [
        { icon: 'mdi-account-child', label: 'Parents/Guardian', active: false },
        {
          icon: 'mdi-human-male-board',
          label: 'Admin/Faculty',
          active: false,
        },
      ],
      features: [
        {
          icon: 'mdi-cash',
          title: 'Low down payment',
          text: 'Affordable and flexible loan options.',
        },
        {
          icon: 'mdi-clock-fast',
          title: 'Fast response',
          text: 'Get approved within minutes.',
        },
        {
          icon: 'mdi-shield-check',
          title: 'No cost of applying',
          text: 'No hidden charges or upfront fees.',
        },
      ],
      steps: [
        {
          title: 'Apply online',
          text: 'Fill out a simple online form.',
        },
        {
          title: 'Connect with lender',
          text: 'We match you with trusted lenders.',
        },
        {
          title: 'Receive payment',
          text: 'Funds are sent directly to your account.',
        },
      ],
    };
  },
  mounted() {
    this.getEventsExcepMandatory();
  },
  computed: {
    isSmAndUp() {
      return this.display.smAndUp;
    },
  },
  methods: {
    setActive(index) {
      console.log(index);
      this.modules.forEach((mod, i) => {
        mod.active = i === index;
        localStorage.setItem('userType', index);
        this.$router.push('/login');
      });
    },
    goToDiv() {
      setTimeout(() => {
        this.portalDialog = true;
      }, 50);
    },
    goToEvents() {
      document.getElementById('events').scrollIntoView({
        behavior: 'smooth',
      });
    },
    getEventsExcepMandatory() {
      this.axiosCall('/school-events/getEventsExcepMandatory', 'GET').then(
        (res) => {
          if (res.data) {
            this.eventList = res.data;
          }
        },
      );
    },
    getIcon(type) {
      const icons = {
        Academic: 'mdi-school',
        Celebration: 'mdi-party-popper',
        Sports: 'mdi-basketball',
        Default: 'mdi-calendar',
      };
      return icons[type] || icons.Default;
    },
  },
};
</script>

<style scoped>
.hero-section {
  background-color: #ffffff;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #555;
}

.bg-light {
  background-color: #ffffff;
}

.event-card {
  transition: all 0.25s ease;
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
}
.portal-dialog {
  backdrop-filter: blur(6px);
}

.module-card {
  cursor: pointer;
  transition: all 0.25s ease;
}

.module-card:hover {
  transform: translateY(-6px);
}

.inactive-card {
  background: #ffffff;
}

.active-card {
  background: linear-gradient(135deg, #e93175, #ff6fa5);
  transform: translateY(-8px) scale(1.02);
}
</style>
