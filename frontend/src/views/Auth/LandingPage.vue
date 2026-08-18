<template>
  <v-app>
    <v-app-bar
      elevation="1"
      class="top-bot"
      color="white"
      style="border-bottom: 1px solid #f0f0f0"
    >
      <v-container fluid>
        <div
          class="d-flex align-center justify-space-between flex-wrap"
          style="color: #e93175"
        >
          <div class="d-flex align-center">
            <v-avatar color="#fff0f6" size="38" class="mr-3">
              <v-icon size="22" color="pink">mdi-school</v-icon>
            </v-avatar>

            <span
              class="font-weight-bold"
              :class="!isSmAndUp ? 'text-subtitle-1' : 'text-h6'"
            >
              Southern Davao National High School
            </span>
          </div>

          <div v-if="isSmAndUp" class="d-flex align-center ga-1">
            <v-btn icon size="small" variant="text" color="pink">
              <v-icon size="18">mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text" color="pink">
              <v-icon size="18">mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text" color="pink">
              <v-icon size="18">mdi-email-outline</v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text" color="pink">
              <v-icon size="18">mdi-phone-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <!-- HERO SECTION -->
    <v-container fluid class="hero-section py-16 mt-15">
      <v-row align="center" justify="center">
        <v-col cols="12" md="7" class="text-center">
          <v-img
            src="/img/landingpage.jpg"
            max-width="780"
            class="mx-auto hero-image"
            cover
            rounded="xl"
          />
        </v-col>
        <v-col cols="12" md="5" class="d-flex justify-center align-center">
          <div class="text-center text-md-left">
            <v-chip
              color="pink"
              variant="tonal"
              size="small"
              class="mb-4 font-weight-medium"
            >
              Department of Education
            </v-chip>

            <p
              class="text-pink school-code-light mb-0"
              :style="
                isSmAndUp
                  ? { fontSize: '40px', fontWeight: '800', lineHeight: '1.25' }
                  : {
                      fontSize: '22px',
                      fontWeight: '800',
                      textAlign: 'center',
                    }
              "
            >
              SOUTHERN DAVAO NATIONAL HIGH SCHOOL
            </p>

            <p class="hero-subtitle mt-4">
              "Education is the most powerful weapon which you can use to change
              the world." <br />— Nelson Mandela
            </p>

            <div class="mt-6">
              <v-btn
                color="pink"
                size="large"
                rounded="xl"
                elevation="2"
                class="px-8"
                :block="!isSmAndUp"
                @click="goToDiv()"
              >
                Open Portal
                <v-icon end size="18">mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <!--EVENTS-->
    <div style="background-color: #f9f9fb; width: 100%" id="events">
      <v-container class="py-14">
        <div class="text-center mb-10">
          <h2 class="text-h5 font-weight-bold" style="color: #2b2b2b">
            School Events & Announcements
          </h2>
          <p class="text-body-2 text-medium-emphasis mt-1">
            Stay up to date with what's happening around campus
          </p>
        </div>

        <v-row>
          <v-col
            cols="12"
            v-for="(events, eventType) in eventList.event"
            :key="eventType"
            class="mb-10"
          >
            <div class="d-flex align-center mb-6">
              <v-avatar color="#fff0f6" size="44" class="mr-3">
                <v-icon size="24" color="pink">
                  {{ getIcon(eventType) }}
                </v-icon>
              </v-avatar>

              <h2
                class="font-weight-bold"
                style="color: #e93175; text-transform: uppercase"
              >
                {{ eventType }}
              </h2>

              <v-spacer />

              <v-chip color="pink" variant="tonal" size="small">
                {{ events.length }} events
              </v-chip>
            </div>

            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="(event, i) in events"
                :key="i"
              >
                <v-card rounded="xl" elevation="2" class="event-card h-100">
                  <v-card-text>
                    <div class="event-image-wrapper">
                      <v-img
                        :src="
                          event.eventFile
                            ? event.eventFile
                            : '/img/returnImg.jpg'
                        "
                        height="200"
                        cover
                      />
                    </div>
                    <v-chip
                      color="pink"
                      variant="outlined"
                      size="small"
                      class="my-3"
                      prepend-icon="mdi-calendar-blank-outline"
                    >
                      {{ formatDate(event.eventDate) }}
                    </v-chip>

                    <h3 class="mb-2 font-weight-medium">
                      {{ event.eventName }}
                    </h3>
                  </v-card-text>

                  <v-divider />

                  <v-card-actions>
                    <v-btn
                      variant="text"
                      color="pink"
                      size="small"
                      @click="Event(event)"
                    >
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
    <v-divider></v-divider>
    <v-footer class="pa-8 pa-md-14" style="background-color: #ffffff">
      <v-row>
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="0" class="mission-card pa-6 h-100">
            <v-icon size="30" color="pink" class="mb-3"
              >mdi-flag-outline</v-icon
            >
            <div class="text-subtitle-1 font-weight-bold mb-2">MISSION</div>
            <p class="text-grey-darken-1 text-body-2" style="line-height: 1.7">
              To protect and promote the right of every Filipino to quality,
              equitable, culture-based, and complete basic education where:
              Students learn in a child-friendly, gender-sensitive, safe, and
              motivating environment. Teachers facilitate learning and
              constantly nurture every learner. Administrators and staff, as
              stewards of the institution, ensure an enabling and supportive
              environment for effective learning to happen. Family, community,
              and other stakeholders are actively engaged and share
              responsibility for developing life-long learners.
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card
            rounded="xl"
            elevation="0"
            class="mission-card pa-6 h-100 text-center"
          >
            <v-icon size="30" color="pink" class="mb-3"
              >mdi-star-outline</v-icon
            >
            <div class="text-subtitle-1 font-weight-bold mb-2">CORE VALUES</div>
            <p class="text-grey-darken-1 text-body-2" style="line-height: 1.9">
              Maka-Diyos <br />
              Maka-tao <br />
              Makakalikasan <br />
              Makabansa
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="0" class="mission-card pa-6 h-100">
            <v-icon size="30" color="pink" class="mb-3">mdi-eye-outline</v-icon>
            <div class="text-subtitle-1 font-weight-bold mb-2">VISION</div>
            <p class="text-grey-darken-1 text-body-2" style="line-height: 1.7">
              We dream of Filipinos who passionately love their country and
              whose values and competencies enable them to realize their full
              potential and contribute meaningfully to building the nation. As a
              learner-centered public institution, the Department of Education
              continuously improves itself to better serve its stakeholders.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-footer>

    <v-dialog
      v-if="portalDialog"
      v-model="portalDialog"
      max-width="760"
      :fullscreen="!isSmAndUp"
    >
      <v-card :rounded="isSmAndUp ? 'xl' : ''" class="portal-dialog">
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
                height="290"
                width="310"
                :elevation="item.active ? 12 : 4"
                :class="[
                  'module-card d-flex flex-column align-center justify-center pa-6 mb-2',
                  item.active ? 'active-card' : 'inactive-card',
                ]"
              >
                <v-img
                  :src="item.image"
                  height="160"
                  width="100%"
                  cover
                  class="mb-1 pa-2"
                  rounded="lg"
                />

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
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="viewDetailDialog"
      max-width="760"
      :fullscreen="!isSmAndUp"
    >
      <v-card :rounded="isSmAndUp ? 'xl' : '0'" class="portal-dialog">
        <!-- HEADER -->
        <v-card-title class="d-flex align-center px-6 py-4">
          <v-icon color="pink" size="28" class="mr-3">
            mdi-calendar-star
          </v-icon>

          <div>
            <div class="dialog-title">Event Details</div>
            <div class="dialog-subtitle">
              Complete information about this event
            </div>
          </div>
        </v-card-title>

        <v-divider />

        <!-- CONTENT -->
        <v-card-text class="px-6 py-8">
          <v-row dense>
            <!-- TITLE -->
            <v-col cols="12">
              <div class="section-label">Title</div>
              <div class="section-value">{{ detailData.eventName }}</div>
            </v-col>

            <!-- DESCRIPTION -->
            <v-col cols="12" class="mt-4">
              <div class="section-label">Description</div>
              <div class="section-value">
                {{ detailData.eventDescription }}
              </div>
            </v-col>

            <!-- TIME -->
            <v-col cols="12" class="mt-4">
              <div class="section-label">Schedule</div>
              <div class="section-value d-flex align-center">
                <v-icon size="18" class="mr-2" color="pink">
                  mdi-clock-outline
                </v-icon>
                {{ formatDate(detailData.eventDate) }} <br />
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <!-- ACTIONS -->
        <v-card-actions class="px-6 py-4">
          <v-spacer />
          <v-btn
            variant="outlined"
            color="pink"
            rounded="lg"
            @click="viewDetailDialog = false"
          >
            Close
          </v-btn>
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
      viewDetailDialog: false,
      eventList: [],
      display: useDisplay(),
      modules: [
        {
          icon: 'mdi-account-child',
          label: 'Parents/Guardian',
          active: false,
          image: new URL('@/assets/img/parenting.jpg', import.meta.url).href,
        },
        {
          icon: 'mdi-human-male-board',
          label: 'Admin/Faculty',
          image: new URL('@/assets/img/admin_teacher.jpg', import.meta.url)
            .href,
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
      detailData: null,
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
      // this.axiosCall('/school-events/getEventsExcepMandatory', 'GET').then(
      this.axiosCall('/school-events/getEventsWithMandatory', 'GET').then(
        (res) => {
          if (res.data) {
            let data = res.data;
            this.eventList = data;
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
    Event(event) {
      console.log(event);
      this.detailData = event;
      this.viewDetailDialog = true;
    },
  },
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #fff0f6, #ffffff);
  min-height: 90vh;
  display: flex;
  align-items: center;
}

.hero-image {
  box-shadow: 0 20px 45px rgba(233, 49, 117, 0.15);
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
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(233, 49, 117, 0.15);
}

.event-image-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.event-image-wrapper img {
  transition: transform 0.4s ease;
}

.event-card:hover img {
  transform: scale(1.08);
}

.mission-card {
  background: #fdfdfd;
  border: 1px solid #f0e3ea;
  transition: all 0.25s ease;
}

.mission-card:hover {
  border-color: #f5c1d6;
  box-shadow: 0 10px 25px rgba(233, 49, 117, 0.08);
}

.portal-dialog {
  backdrop-filter: blur(6px);
  background: #ffffff;
}

.module-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f2f2f2;
}

.module-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(233, 49, 117, 0.15);
}

.inactive-card {
  background: #ffffff;
}

.active-card {
  background: linear-gradient(135deg, #e93175, #ff6fa5);
  transform: translateY(-8px) scale(1.02);
}

.school-code-light {
  font-weight: 800;
  letter-spacing: 3px;
  color: #e93175;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.dialog-subtitle {
  font-size: 0.85rem;
  color: #777;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 4px;
}

.section-value {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}
</style>
