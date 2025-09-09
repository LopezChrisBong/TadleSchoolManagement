<template>
  <v-app>
    <!-- Sticky Top App Bar -->
    <v-app-bar app dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        {{
          $vuetify.display.smAndUp ? "School Management System" : "SMS"
        }}</v-toolbar-title
      >
      <v-spacer />
      <!-- notification -->
      <v-menu location="bottom end" offset-y transition="scale-transition">
        <template #activator="{ props }">
          <v-badge
            :content="unreadCount > 99 ? '99+' : unreadCount"
            :model-value="hasUnread"
            color="blue"
            overlap
          >
            <v-btn icon v-bind="props">
              <v-icon :color="hasUnread ? 'white' : 'white'">
                {{ hasUnread ? "mdi-bell-ring" : "mdi-bell-outline" }}
              </v-icon>
            </v-btn>
          </v-badge>
        </template>

        <v-card width="360" max-height="600" class="overflow-y-auto rounded-lg">
          <v-card-title class="d-flex justify-space-between align-center px-4">
            <div class="text-h6">Notifications</div>
            <!-- <v-btn icon variant="plain" @click="closeMenu"
              ><v-icon>mdi-dots-horizontal</v-icon></v-btn
            > -->
          </v-card-title>

          <!-- <v-tabs v-model="notifTab" grow>
            <v-tab>All</v-tab>
            <v-tab>Unread</v-tab>
          </v-tabs> -->
          <v-card-text>
            <!-- LARDO Notification -->
            <div v-if="lardoNotification.length" class="px-4 pt-2">
              <div
                class="text-subtitle-1 font-weight-medium d-flex justify-space-between"
              >
                LARDO Notification .....
                <!-- <v-btn
                  variant="text"
                  class="text-pink text-caption"
                  @click="goTolardoNotification"
                  >See all</v-btn
                > -->
              </div>

              <div
                v-for="(req, i) in limitLardoAdviser"
                :key="'req-' + i"
                class="d-flex mb-4"
              >
                <v-avatar size="48" class="me-3">
                  <v-icon>mdi-account-circle-outline</v-icon>
                  <!-- <v-img :src="req.avatar" /> -->
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ req.student_name }}
                  </div>
                  <div class="text-caption mb-1">
                    {{ req.remarks }}
                  </div>
                  <v-btn
                    size="small"
                    class="me-2"
                    color="primary"
                    @click="openLardoNotification(req)"
                    >View</v-btn
                  >
                  <!--
                <v-btn
                  size="small"
                  variant="outlined"
                  @click="deleteRequest(req)"
                  >Delete</v-btn
                > -->
                </div>
                <v-icon color="#dc0b70" v-if="!req.read" size="24" class="mt-2"
                  >mdi-numeric-1-circle</v-icon
                >
              </div>
            </div>

            <!-- LARDO Notification for faculty -->
            <div v-if="lardoNotificationForFaculty.length" class="px-4 pt-2">
              <div
                class="text-subtitle-1 font-weight-medium d-flex justify-space-between"
              >
                LARDO Notification .....
                <!-- <v-btn
                  variant="text"
                  class="text-pink text-caption"
                  @click="goTolardoNotification"
                  >See all</v-btn
                > -->
              </div>

              <div
                v-for="(req, i) in limitLardoFaculty"
                :key="'req-' + i"
                class="d-flex mb-4"
              >
                <v-avatar size="48" class="me-3">
                  <v-icon>mdi-account-circle-outline</v-icon>
                  <!-- <v-img :src="req.avatar" /> -->
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ req.student_name }}
                  </div>
                  <div class="text-caption mb-1">
                    {{ req.remarks }}
                  </div>
                  <v-btn
                    size="small"
                    class="me-2"
                    color="primary"
                    @click="openLardoFacultyNotification(req)"
                    >View</v-btn
                  >
                  <!--
                <v-btn
                  size="small"
                  variant="outlined"
                  @click="deleteRequest(req)"
                  >Delete</v-btn
                > -->
                </div>
                <v-icon color="#dc0b70" v-if="!req.read" size="24" class="mt-2"
                  >mdi-numeric-1-circle</v-icon
                >
              </div>
            </div>

            <!-- At-Risk Notification -->
            <div v-if="atRiskNotification.length" class="px-4">
              <div
                class="text-subtitle-1 font-weight-medium d-flex justify-space-between mb-2"
              >
                At-Risk Notification .....
                <!-- <v-btn
                  variant="text"
                  class="text-pink text-caption"
                  @click="goToNotifications"
                  >See all</v-btn
                > -->
              </div>

              <v-list density="compact" class="pa-0">
                <v-list-item
                  v-for="(notif, index) in limitAtRiskAdviser"
                  :key="'notif-' + index"
                  @click="openAdviserNotification(notif)"
                  class="hover:bg-grey-lighten-3 rounded-lg"
                >
                  <template #prepend>
                    <v-avatar size="36">
                      <v-icon>mdi-account-circle-outline</v-icon>
                      <!-- <v-img :src="notif.avatar" /> -->
                    </v-avatar>
                    <v-icon
                      v-if="!notif.read"
                      color="#dc0b70"
                      size="24"
                      style="margin-top: -2.1rem; margin-left: -0.7rem"
                      >mdi-numeric-1-circle</v-icon
                    >
                  </template>
                  <v-list-item-content>
                    <v-list-item-title class="text-body-2">
                      {{ notif.student_name }}
                    </v-list-item-title>
                    <div class="text-caption grey--text">
                      {{ notif.remarks }}
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>

            <!-- At-Risk Notification for faculty-->
            <div v-if="atRiskNotificationForFaculty.length" class="px-4">
              <div
                class="text-subtitle-1 font-weight-medium d-flex justify-space-between mb-2"
              >
                At-Risk Notification .....
                <!-- <v-btn
                  variant="text"
                  class="text-pink text-caption"
                  @click="goToNotifications"
                  >See all</v-btn
                > -->
              </div>

              <v-list density="compact" class="pa-0">
                <v-list-item
                  v-for="(notif, index) in limitAtRiskFaculty"
                  :key="'notif-' + index"
                  @click="openFacultyNotification(notif)"
                  class="hover:bg-grey-lighten-3 rounded-lg"
                >
                  <template #prepend>
                    <v-avatar size="36">
                      <v-icon>mdi-account-circle-outline</v-icon>
                      <!-- <v-img :src="notif.avatar" /> -->
                    </v-avatar>
                    <v-icon
                      v-if="!notif.read"
                      color="#dc0b70"
                      size="24"
                      style="margin-top: -2.1rem; margin-left: -0.7rem"
                      >mdi-numeric-1-circle</v-icon
                    >
                  </template>
                  <v-list-item-content>
                    <v-list-item-title class="text-body-2">
                      {{ notif.student_name }}
                    </v-list-item-title>
                    <div class="text-caption grey--text">
                      {{ notif.remarks }}
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>

            <!-- Parent Notification -->
            <div v-if="parentNotification.length" class="px-4">
              <div
                class="text-subtitle-1 font-weight-medium d-flex justify-space-between mb-2"
              >
                Parent Notification .....
                <!-- <v-btn
                  variant="text"
                  class="text-pink text-caption"
                  @click="goToNotifications"
                  >See all</v-btn
                > -->
              </div>

              <v-list density="compact" class="pa-0">
                <v-list-item
                  v-for="(notif, index) in limitParentNotification"
                  :key="'notif-' + index"
                  @click="openParentNotification(notif)"
                  class="hover:bg-grey-lighten-3 rounded-lg"
                >
                  <template #prepend>
                    <v-avatar size="36">
                      <v-icon>mdi-account-circle-outline</v-icon>
                      <!-- <v-img :src="notif.avatar" /> -->
                    </v-avatar>
                    <v-icon
                      v-if="!notif.read"
                      color="#dc0b70"
                      size="24"
                      style="margin-top: -2.1rem; margin-left: -0.7rem"
                      >mdi-numeric-1-circle</v-icon
                    >
                  </template>
                  <v-list-item-content>
                    <v-list-item-title class="text-body-2">
                      {{ notif.student_name }}
                    </v-list-item-title>
                    <div class="text-caption grey--text">
                      Finale Grade of:{{ notif.transmuted_grade }}
                    </div>
                    <div class="text-caption grey--text">
                      Ramarks: {{ notif.remarks }}
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
          <v-card-actions class="pa-5 d-flex justify-center">
            <!-- <v-spacer></v-spacer> -->
            <v-btn
              color="#e35e93"
              class="white--text"
              block
              @click="showAllNotifDialog = true"
            >
              <!-- <v-icon>mdi-check-circle</v-icon> -->
              View All Notification
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <!-- Account-->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-chip
            v-bind="props"
            class="rounded-pill py-2 px-3 d-flex align-center"
            color="white"
            style="color: white"
          >
            <v-avatar size="32" class="me-2">
              <v-img
                :src="
                  !profImg ? require('@/assets/img/img_avatar.png') : profImg
                "
              />
            </v-avatar>
            <v-icon size="20" class="me-1" v-if="$vuetify.display.smAndDown">
              mdi-account-arrow-right
            </v-icon>
            <v-icon size="20">mdi-chevron-down</v-icon>
          </v-chip>
        </template>

        <v-card width="260" elevation="10" class="rounded-lg">
          <!-- HEADER -->
          <v-list class="pa-0">
            <v-list-item>
              <v-row align="center" class="ma-0">
                <v-col cols="3" class="d-flex justify-center">
                  <v-avatar size="50">
                    <v-img
                      :src="
                        !profImg
                          ? require('@/assets/img/img_avatar.png')
                          : profImg
                      "
                    />
                  </v-avatar>
                </v-col>

                <v-col cols="7" class="pl-0">
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ $store.state.user.fname }}
                    {{ $store.state.user.lname.charAt(0).toUpperCase() }}.
                  </div>
                  <div class="text-caption">
                    {{ $store.state.user.usertype.description }} /
                    {{ getMyRole($store.state.user.user.user_roleID) }}
                  </div>
                </v-col>

                <v-col cols="2" class="text-end">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    @click="menu = false"
                    class="close"
                    color="white"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>

          <!-- MENU OPTIONS -->
          <v-divider />

          <v-list class="py-1">
            <v-list-item
              @click="logout()"
              class="hover:bg-grey-lighten-4 transition rounded-lg"
              prepend-icon="mdi-logout"
            >
              <v-list-item-title class="text-body-2"
                >Sign Out</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Sticky Sidebar Drawer -->
    <v-navigation-drawer
      app
      v-model="drawer"
      :temporary="$vuetify.display.smAndDown"
    >
      <v-list nav dense class="sidebar mt-2">
        <!-- <v-list-item>
          <v-avatar>
            <v-img :src="profImg" width="60" />
          </v-avatar>
          <v-list-item-title class="text-uppercase">
            {{ $store.state.user.fname }} {{ $store.state.user.lname }}
          </v-list-item-title>
        </v-list-item> 
        <v-divider />-->
        <template v-for="(link, i) in links" :key="i">
          <v-list-item
            v-if="!link.subLink"
            :to="`/${userType}${link.route}`"
            router
            :exact="true"
            density="compact"
          >
            <div class="d-flex justify-left align-center">
              <v-icon start>{{ link.icon }}</v-icon>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </div>
          </v-list-item>

          <v-list-group v-else v-model="openGroups[i]">
            <template #activator="{ props }">
              <v-list-item v-bind="props" density="compact">
                <div class="d-flex justify-left align-center">
                  <v-icon start>{{ link.icon }}</v-icon>
                  <v-list-item-title>{{ link.title }}</v-list-item-title>
                </div>
              </v-list-item>
            </template>

            <v-list-item
              v-for="sublink in link.subLink"
              :key="sublink.title"
              :to="`/${userType}${sublink.route}`"
              router
              class="rounded my-1"
            >
              <v-list-item-title>{{ sublink.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Scrollable Main Content -->
    <v-main class="scrollable-main bg-grey-lighten-4">
      <v-container fluid>
        <v-row>
          <v-col :cols="$vuetify.display.smAndUp ? 12 : 12">
            <div class="fill-height pb-6" style="background-color: white">
              <div class="d-flex justify-space-between align-center pa-4">
                <h2 class="text-h6 font-weight-bold">
                  {{ $route.meta.title }}
                </h2>
                <div style="width: 200px; height: auto">
                  <v-autocomplete
                    label="Year"
                    @update:modelValue="changeFilter"
                    v-model="selectedFilter"
                    item-title="school_year"
                    item-value="id"
                    :items="filterYears"
                  ></v-autocomplete>
                </div>
              </div>
              <router-view @reloadProfile="loadImg" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- Notification Dialog -->
    <v-dialog v-model="showAllNotifDialog" scrollable max-width="600">
      <v-card>
        <v-card-title>All Notifications</v-card-title>
        <v-divider />
        <v-card-text>
          <!-- <v-list>
            <v-list-item v-for="(notif, index) in notifications" :key="index">
              <v-list-item-title>{{ notif.title }}</v-list-item-title>
              <v-list-item-subtitle
                >{{ notif.date }} {{ notif.read }}</v-list-item-subtitle
              >
            </v-list-item>
          </v-list> -->
          <!-- LARDO Notification -->
          <div v-if="lardoNotification.length" class="px-4 pt-2">
            <div
              class="text-subtitle-1 font-weight-medium d-flex justify-space-between"
            >
              LARDO Notification
              <!-- <v-btn
                variant="text"
                class="text-pink text-caption"
                @click="goTolardoNotification"
                >See all</v-btn
              > -->
            </div>

            <div
              v-for="(req, i) in lardoNotification"
              :key="'req-' + i"
              class="d-flex mb-4"
            >
              <v-avatar size="48" class="me-3">
                <v-icon>mdi-account-circle-outline</v-icon>
                <!-- <v-img :src="req.avatar" /> -->
              </v-avatar>

              <div class="flex-grow-1">
                <div class="text-body-2 font-weight-medium">
                  {{ req.student_name }}
                </div>
                <div class="text-caption mb-1">
                  {{ req.remarks }}
                </div>

                <v-btn
                  size="small"
                  class="me-2"
                  color="primary"
                  @click="openLardoNotification(req)"
                  >View</v-btn
                >
                <!--
                <v-btn
                  size="small"
                  variant="outlined"
                  @click="deleteRequest(req)"
                  >Delete</v-btn
                > -->
              </div>
              <v-icon color="#dc0b70" v-if="!req.read" size="24" class="mt-2"
                >mdi-numeric-1-circle</v-icon
              >
            </div>
          </div>

          <!-- LARDO Notification for faculty -->
          <div v-if="lardoNotificationForFaculty.length" class="px-4 pt-2">
            <div
              class="text-subtitle-1 font-weight-medium d-flex justify-space-between"
            >
              LARDO Notification
              <!-- <v-btn
                variant="text"
                class="text-pink text-caption"
                @click="goTolardoNotification"
                >See all</v-btn
              > -->
            </div>

            <div
              v-for="(req, i) in lardoNotificationForFaculty"
              :key="'req-' + i"
              class="d-flex mb-4"
            >
              <v-avatar size="48" class="me-3">
                <v-icon>mdi-account-circle-outline</v-icon>
                <!-- <v-img :src="req.avatar" /> -->
              </v-avatar>
              <v-icon color="#dc0b70" v-if="!req.read" size="24" class="mt-2"
                >mdi-numeric-1-circle</v-icon
              >
              <div class="flex-grow-1">
                <div class="text-body-2 font-weight-medium">
                  {{ req.student_name }}
                </div>
                <div class="text-caption mb-1">
                  {{ req.remarks }}
                </div>
                <v-btn
                  size="small"
                  class="me-2"
                  color="primary"
                  @click="openLardoFacultyNotification(req)"
                  >View</v-btn
                >
                <!--
                <v-btn
                  size="small"
                  variant="outlined"
                  @click="deleteRequest(req)"
                  >Delete</v-btn
                > -->
              </div>
              <v-icon color="#dc0b70" v-if="!req.read" size="24" class="mt-2"
                >mdi-numeric-1-circle</v-icon
              >
            </div>
          </div>

          <!-- At-Risk Notification -->
          <div v-if="atRiskNotification.length" class="px-4">
            <div
              class="text-subtitle-1 font-weight-medium d-flex justify-space-between mb-2"
            >
              At-Risk Notification
              <!-- <v-btn
                variant="text"
                class="text-pink text-caption"
                @click="goToNotifications"
                >See all</v-btn
              > -->
            </div>

            <v-list density="compact" class="pa-0">
              <v-list-item
                v-for="(notif, index) in atRiskNotification"
                :key="'notif-' + index"
                @click="openAdviserNotification(notif)"
                class="hover:bg-grey-lighten-3 rounded-lg"
              >
                <template #prepend>
                  <v-avatar size="36">
                    <v-icon>mdi-account-circle-outline</v-icon>
                    <!-- <v-img :src="notif.avatar" /> -->
                  </v-avatar>
                  <v-icon
                    v-if="!notif.read"
                    color="#dc0b70"
                    size="24"
                    style="margin-top: -1.5rem; margin-left: -0.7rem"
                    >mdi-numeric-1-circle</v-icon
                  >
                </template>
                <v-list-item-content>
                  <v-list-item-title class="text-body-2">
                    {{ notif.student_name }}
                  </v-list-item-title>
                  <div class="text-caption grey--text">
                    {{ notif.remarks }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>

          <!-- At-Risk Notification for faculty-->
          <div v-if="atRiskNotificationForFaculty.length" class="px-4">
            <div
              class="text-subtitle-1 font-weight-medium d-flex justify-space-between mb-2"
            >
              At-Risk Notification
              <!-- <v-btn
                variant="text"
                class="text-pink text-caption"
                @click="goToNotifications"
                >See all</v-btn
              > -->
            </div>

            <v-list density="compact" class="pa-0">
              <v-list-item
                v-for="(notif, index) in atRiskNotificationForFaculty"
                :key="'notif-' + index"
                @click="openFacultyNotification(notif)"
                class="hover:bg-grey-lighten-3 rounded-lg"
              >
                <template #prepend>
                  <v-avatar size="36">
                    <v-icon>mdi-account-circle-outline</v-icon>
                    <!-- <v-img :src="notif.avatar" /> -->
                  </v-avatar>
                  <v-icon
                    v-if="!notif.read"
                    color="#dc0b70"
                    size="24"
                    style="margin-top: -1.5rem; margin-left: -0.7rem"
                    >mdi-numeric-1-circle</v-icon
                  >
                </template>
                <v-list-item-content>
                  <v-list-item-title class="text-body-2">
                    {{ notif.student_name }}
                  </v-list-item-title>
                  <div class="text-caption grey--text">
                    {{ notif.remarks }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>

          <!-- Parent Notification -->
          <div v-if="parentNotification.length" class="px-4">
            <div
              class="text-subtitle-1 font-weight-medium d-flex justify-space-between mb-2"
            >
              Parent Notification
              <!-- <v-btn
                variant="text"
                class="text-pink text-caption"
                @click="goToNotifications"
                >See all</v-btn
              > -->
            </div>

            <v-list density="compact" class="pa-0">
              <v-list-item
                v-for="(notif, index) in parentNotification"
                :key="'notif-' + index"
                @click="openParentNotification(notif)"
                class="hover:bg-grey-lighten-3 rounded-lg"
              >
                <template #prepend>
                  <v-avatar size="36">
                    <v-icon>mdi-account-circle-outline</v-icon>
                    <!-- <v-img :src="notif.avatar" /> -->
                  </v-avatar>
                  <v-icon
                    v-if="!notif.read"
                    color="#dc0b70"
                    size="24"
                    style="margin-top: -1.5rem; margin-left: -0.7rem"
                    >mdi-numeric-1-circle</v-icon
                  >
                </template>
                <v-list-item-content>
                  <v-list-item-title class="text-body-2">
                    {{ notif.student_name }}
                  </v-list-item-title>
                  <div class="text-caption grey--text">
                    Finale Grade of:{{ notif.transmuted_grade }}
                  </div>
                  <div class="text-caption grey--text">
                    Ramarks: {{ notif.remarks }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="showAllNotifDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "NavbarPage",
  data() {
    return {
      drawer: true,
      selectedDate: new Date().toISOString().substr(0, 10),
      menu: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
          active: true,
          items: ["Dashboard 1", "Dashboard 2"],
        },
        {
          title: "Apps",
          icon: "mdi-apps",
          active: false,
          items: ["Chat", "Calendar"],
        },
        {
          title: "UI Elements",
          icon: "mdi-palette",
          active: false,
          items: ["Buttons", "Avatars"],
        },
      ],
      mini: false,
      profImg: null,
      mobile: false,
      userRoleList: [],
      links: [],
      userID: null,
      userType: null,
      openGroups: [],
      notif_cnt: 0,
      showAllNotifDialog: false,
      interval: null,
      loading: false,
      options: [],
      activeGroup: null,
      schooYearList: [],
      selectedFilter: null,
      filterYears: [],
      userModule: null,
      notifTab: 0,
      // unreadCount: 5,
      // hasUnread: true,
      lardoNotificationForFaculty: [],
      lardoNotification: [
        // {
        //   name: "Jovelyn Billote Autintico",
        //   // avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
        //   average: 65,
        //   read: false,
        // },
        // {
        //   name: "Florence Perucho",
        //   // avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
        //   average: 69,
        //   read: false,
        // },
      ],
      atRiskNotificationForFaculty: [],
      atRiskNotification: [
        // {
        //   name: "Jovelyn Billote Autintico",
        //   // avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
        //   read: false,
        // },
        // {
        //   name: "Florence Perucho",
        //   // avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
        //   read: false,
        // },
      ],
      parentNotification: [],
    };
  },

  computed: {
    unreadCount() {
      const allNotifications = [
        ...this.lardoNotification,
        ...this.lardoNotificationForFaculty,
        ...this.atRiskNotification,
        ...this.atRiskNotificationForFaculty,
        ...this.parentNotification,
      ];
      return allNotifications.filter((n) => !n.read).length;
    },
    hasUnread() {
      return this.unreadCount > 0;
    },
    limitLardoAdviser() {
      return this.lardoNotification.slice(0, 5); // Returns the first 5 items
    },
    limitLardoFaculty() {
      return this.lardoNotificationForFaculty.slice(0, 5); // Returns the first 5 items
    },
    limitAtRiskFaculty() {
      return this.atRiskNotificationForFaculty.slice(0, 5); // Returns the first 5 items
    },
    limitAtRiskAdviser() {
      return this.atRiskNotification.slice(0, 5); // Returns the first 5 items
    },
    limitParentNotification() {
      return this.parentNotification.slice(0, 5); // Returns the first 5 items
    },
  },
  watch: {
    reloadImg() {
      this.loadImg();
    },
  },
  mounted() {
    this.userId = this.$store.state.user.id;
    this.userModule = this.$store.state.user.user.assignedModuleID;
    // console.log(this.userModule);
    this.loadYearForFilter();
    this.getLardoNotification();
    this.getLardoNotificationForFaculty();
    this.getAtRiskNotification();
    this.getAtRiskNotificationForFaculty();
    this.getParentNotification();
    if (this.$vuetify.display.xs) {
      this.drawer = false;
      this.mini = false;
    }
  },
  methods: {
    loadYearForFilter() {
      this.axiosCall("/enroll-student/getSchoolYear", "GET").then((res) => {
        if (res) {
          this.selectedFilter = res.data[0].id;
          const activeYear = res.data.find((item) => item.status === 1);
          if (activeYear) {
            this.selectedFilter = activeYear.id;
          }
          this.$store.commit("setFilterSelected", this.selectedFilter);
          let data = res.data;
          this.filterYears = data;
        }
      });
    },
    changeFilter(newValue) {
      // this.$store.commit("setFilterSelected", this.selectedFilter);
      this.$store.commit("setFilterSelected", newValue);
      // let filter = this.$store.getters.getFilterSelected;
      // console.log(filter);
      // alert(filter);
    },

    openParentNotification(notif) {
      notif.read = true;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall("/notification/" + notif.id, "PATCH", { read: 1 }).then(
          (res) => {
            console.log(res);
            if (notif.route) {
              // this.$router.push(notif.route);
              this.$router.push("/" + this.userType + notif.route);
            }
          }
        );

        // this.$router.push(req.route);
      }
    },
    openAdviserNotification(notif) {
      notif.read = true;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall(
          "/notification/updateAtRiskAdviser/" + notif.id,
          "PATCH",
          { read: 1 }
        ).then((res) => {
          console.log(res);
          if (notif.route) {
            // this.$router.push(notif.route);
            this.$router.push("/" + this.userType + notif.route);
          }
        });

        // this.$router.push(req.route);
      }
    },

    openFacultyNotification(notif) {
      notif.read = true;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall(
          "/notification/updateAtRiskFaculty/" + notif.id,
          "PATCH",
          { read: 1 }
        ).then((res) => {
          console.log(res);
          if (notif.route) {
            // this.$router.push(notif.route);
            this.$router.push("/" + this.userType + notif.route);
          }
        });

        // this.$router.push(req.route);
      }
    },

    openLardoNotification(notif) {
      notif.read = true;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall(
          "/notification/updateLardoAdviser/" + notif.id,
          "PATCH",
          { read: 1 }
        ).then((res) => {
          console.log(res);
          if (notif.route) {
            // this.$router.push(notif.route);
            this.$router.push("/" + this.userType + notif.route);
          }
        });

        // this.$router.push(req.route);
      }
    },
    openLardoFacultyNotification(notif) {
      notif.read = true;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall(
          "/notification/updateLardoFaculty/" + notif.id,
          "PATCH",
          { read: 1 }
        ).then((res) => {
          console.log(res);
          if (notif.route) {
            // this.$router.push(notif.route);
            this.$router.push("/" + this.userType + notif.route);
          }
        });

        // this.$router.push(req.route);
      }
    },

    getMyRole(id) {
      const match = this.userRoleList.find(
        (r) => parseInt(r.id) === parseInt(id)
      );
      return match ? match.description : "";
    },
    openMobileNav() {
      this.drawer = true;
    },
    loadImg() {
      this.axiosCall("/user-details/getUserProfileImg", "GET").then((res) => {
        this.profImg =
          process.env.VUE_APP_SERVER +
          "/user-details/getProfileImg/" +
          res.data.profile_img;
      });
    },
    toProfile() {
      const userType =
        this.$store.state.user.usertype.description.toLowerCase();
      const roleID = this.$store.state.user.user.user_roleID;
      const path =
        roleID === 5 ? "/superadmin/profile" : `/${userType}/profile`;
      this.$router.push(path);
    },
    getCurrentDate() {
      const cur_date = new Date();
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const day = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return `${day[cur_date.getDay()]}, ${
        month[cur_date.getMonth()]
      } ${cur_date.getDate()}; ${this.formatAMPM(cur_date)}`;
    },
    formatAMPM(date) {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    },
    closeNav() {
      this.drawer = false;
      this.$emit("closeNav");
    },
    loadMenu(userType, userRole) {
      this.openGroups = this.links.map((link) => !!link.subLink && false);
      this.axiosCall("/assigned-modules/getMyAssignedModules/my", "GET").then(
        (resp) => {
          this.links = JSON.parse(resp.data.assign_mods);
          switch (userType) {
            case 1:
              this.userType = "admin";
              break;
            case 2:
              this.userType = userRole === 4 ? "superadmin" : "employee";
              break;
            case 3:
              this.userType = "parent";
              break;
            case 4:
              this.userType = "teacher";
              break;
          }
        }
      );
    },

    getLardoNotification() {
      this.axiosCall(
        "/notification/getLardoStudent/" + this.userId,
        "GET"
      ).then((res) => {
        console.log("Lardo", res.data);
        if (this.userModule == 21) {
          this.lardoNotification = res.data;
        }
      });
    },

    getLardoNotificationForFaculty() {
      this.axiosCall(
        "/notification/getLardoStudentForFaculty/" + this.userId,
        "GET"
      ).then((res) => {
        console.log("Lardo", res.data);
        if (this.userModule != 21) {
          this.lardoNotificationForFaculty = res.data;
        }
      });
    },

    getAtRiskNotification() {
      this.axiosCall(
        "/notification/getAtRiskStudent/" + this.userId,
        "GET"
      ).then((res) => {
        console.log("At-Risk", res.data);
        if (this.userModule == 21) {
          this.atRiskNotification = res.data;
        }
      });
    },

    getAtRiskNotificationForFaculty() {
      this.axiosCall(
        "/notification/getAtRiskStudentForFaculty/" + this.userId,
        "GET"
      ).then((res) => {
        console.log("At-Risk", res.data);
        if (this.userModule != 21) {
          this.atRiskNotificationForFaculty = res.data;
        }
      });
    },
    getParentNotification() {
      this.axiosCall(
        "/notification/getParentNotification/" + this.userId,
        "GET"
      ).then((res) => {
        console.log("Parent", res.data);
        this.parentNotification = res.data;
      });
    },
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  created() {
    const userType = this.$store.state.user.user.usertypeID;
    const userRole = this.$store.state.user.user.user_roleID;
    this.loadMenu(userType, userRole);
    this.interval = setInterval(() => {
      this.getLardoNotification();
      this.getLardoNotificationForFaculty();
      this.getAtRiskNotification();
      this.getAtRiskNotificationForFaculty();
      this.getParentNotification();
    }, 180000);
  },
};
</script>

<style scoped>
/* Scrollable area */
.scrollable-main {
  height: calc(100vh - 64px);
  overflow-y: auto;
  background-color: #f3f4f6; /* Soft gray */
}

/* Sidebar active link */
.sidebar .v-list-item--active {
  background-color: #dc0b70 !important;
  color: #ffffff !important;
}

/* Sidebar sublink active */
.sidebar .v-list-group .v-list-item--active {
  background-color: #dc0b70 !important; /* Lighter teal */
  color: #ffffff !important;
  border-radius: 5px;
}

/* Hover states */
.sidebar .v-list-item:hover {
  background-color: rgba(13, 148, 136, 0.1) !important;
}
.sidebar .v-list-item--active:hover {
  color: #dc0b70 !important;
}

/* App bar */
.v-app-bar {
  background-color: #dc0b70 !important;
  color: white !important;
}

/* Notification badge color */
.v-badge .v-badge__badge {
  background-color: #f97316 !important; /* Orange */
}

/* Primary button color override */
.v-btn {
  background-color: #dc0b70 !important;
  color: white !important;
}

.close {
  background-color: #ffffff !important;
  color: rgb(0, 0, 0) !important;
}
</style>
