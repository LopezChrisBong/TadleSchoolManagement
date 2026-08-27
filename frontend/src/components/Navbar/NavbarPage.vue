<template>
  <v-app>
    <!-- Sticky Top App Bar -->
    <v-app-bar app elevation="0" class="app-bar-light">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        aria-label="Toggle navigation"
        class="d-lg-none"
        color="#1F2933"
      />
      <v-toolbar-title class="font-weight-bold d-flex align-center brand-title">
        {{ $vuetify.display.smAndUp ? 'Class Management System' : 'CMS' }}
      </v-toolbar-title>

      <!-- Decorative search field (visual only — not wired to a search action) -->
      <!--    <div class="topbar-search d-none d-lg-flex align-center">
      <v-icon size="18" color="#9AA1AC" class="me-2">mdi-magnify</v-icon>
        <span class="text-body-2 topbar-search-placeholder">Search task</span> 
      </div>-->

      <v-spacer />

      <!-- <v-btn
        icon
        variant="text"
        class="topbar-icon-btn d-none d-sm-inline-flex"
        aria-label="Mail"
      >
        <v-icon color="#4B5563">mdi-email-outline</v-icon>
      </v-btn> -->

      <!-- notification -->
      <v-menu
        v-model="notifMenu"
        location="bottom end"
        offset-y
        transition="scale-transition"
        :close-on-content-click="false"
      >
        <template #activator="{ props }">
          <v-badge
            :content="unreadCount > 99 ? '99+' : unreadCount"
            :model-value="hasUnread"
            color="#F97316"
            overlap
          >
            <v-btn
              icon
              variant="text"
              v-bind="props"
              aria-label="Notifications"
              class="topbar-icon-btn"
            >
              <v-icon :color="hasUnread ? '#E35E93' : '#4B5563'">
                {{ hasUnread ? 'mdi-bell-ring' : 'mdi-bell-outline' }}
              </v-icon>
            </v-btn>
          </v-badge>
        </template>

        <v-card
          width="380"
          max-height="650"
          class="overflow-y-auto rounded-xl notif-panel"
        >
          <!-- HEADER -->
          <v-card-title
            class="d-flex align-center px-5 py-4 notif-panel-header"
          >
            <v-avatar size="34" class="me-3 header-icon-avatar">
              <v-icon size="18" color="white">mdi-bell-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Notifications</div>
              <div class="text-caption text-medium-emphasis">
                {{
                  hasUnread ? unreadCount + ' unread' : "You're all caught up"
                }}
              </div>
            </div>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-4">
            <div
              class="d-flex pa-1 mb-1"
              v-if="$store.state.user.user.assignedModuleID != 22"
            >
              <v-btn-toggle
                v-model="status"
                mandatory
                divided
                density="comfortable"
                class="status-toggle w-100"
              >
                <v-btn value="Lardo" class="flex-grow-1" size="small">
                  <v-icon start size="16"
                    >mdi-file-document-alert-outline</v-icon
                  >
                  Lardo
                </v-btn>
                <v-btn value="At-Risk" class="flex-grow-1" size="small">
                  <v-icon start size="16">mdi-alert-circle-outline</v-icon>
                  At-Risk
                </v-btn>
              </v-btn-toggle>
            </div>

            <!-- LARDO Notification -->
            <div
              v-if="lardoNotification.length"
              class="mb-6"
              v-show="status === 'Lardo'"
            >
              <div class="section-title">LARDO Notification</div>

              <v-card
                v-for="(req, i) in limitLardoAdviser"
                :key="'req-' + i"
                class="notif-card notif-card--lardo"
                variant="flat"
              >
                <div class="d-flex align-start">
                  <v-avatar
                    size="42"
                    class="me-3 notif-avatar notif-avatar--lardo"
                  >
                    <v-icon size="20" color="white">mdi-account</v-icon>
                  </v-avatar>

                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">
                      {{ req.student_name }}
                    </div>

                    <div class="text-caption text-medium-emphasis mb-2">
                      {{ req.remarks }}
                    </div>
                    <div class="recommendation-block">
                      <div
                        class="text-caption font-weight-bold recommendation-label"
                      >
                        Decision Support Recommendation
                      </div>
                      <div class="text-caption">{{ req.recommendation }}</div>
                    </div>
                    <v-btn
                      size="small"
                      color="#E35E93"
                      variant="tonal"
                      class="mt-2"
                      @click="openLardoNotification(req)"
                    >
                      View
                    </v-btn>
                  </div>

                  <v-badge v-if="!req.read" color="error" dot />
                </div>
              </v-card>
            </div>

            <!-- LARDO Faculty -->
            <div
              v-if="lardoNotificationForFaculty.length"
              class="mb-6"
              v-show="status === 'Lardo'"
            >
              <div class="section-title">LARDO Notification</div>

              <v-card
                v-for="(req, i) in limitLardoFaculty"
                :key="'req-' + i"
                class="notif-card notif-card--lardo"
                variant="flat"
              >
                <div class="d-flex align-start">
                  <v-avatar
                    size="42"
                    class="me-3 notif-avatar notif-avatar--lardo"
                  >
                    <v-icon size="20" color="white">mdi-account</v-icon>
                  </v-avatar>

                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">
                      {{ req.student_name }}
                    </div>

                    <div class="text-caption text-medium-emphasis mb-2">
                      {{ req.remarks }}
                    </div>
                    <div class="recommendation-block">
                      <div
                        class="text-caption font-weight-bold recommendation-label"
                      >
                        Decision Support Recommendation
                      </div>
                      <div class="text-caption">{{ req.recommendation }}</div>
                    </div>
                    <v-btn
                      size="small"
                      color="#E35E93"
                      variant="tonal"
                      class="mt-2"
                      @click="openLardoFacultyNotification(req)"
                    >
                      View
                    </v-btn>
                  </div>

                  <v-badge v-if="!req.read" color="error" dot />
                </div>
              </v-card>
            </div>

            <!-- Empty state: Lardo -->
            <div
              v-if="
                !lardoNotification.length && !lardoNotificationForFaculty.length
              "
              v-show="status === 'Lardo'"
              class="empty-state"
            >
              <v-icon size="30" class="mb-2" color="grey-lighten-1"
                >mdi-file-check-outline</v-icon
              >
              <div class="text-body-2 font-weight-medium">
                No LARDO notifications
              </div>
              <div class="text-caption text-medium-emphasis">
                New alerts will show up here
              </div>
            </div>

            <!-- At Risk Adviser -->
            <div
              v-if="atRiskNotification.length"
              class="mb-6"
              v-show="status === 'At-Risk'"
            >
              <div class="section-title">At-Risk Notification</div>

              <v-card
                v-for="(notif, index) in limitAtRiskAdviser"
                :key="'notif-' + index"
                class="notif-card notif-card--risk clickable"
                variant="flat"
                @click="openAdviserNotification(notif)"
              >
                <div class="d-flex align-start">
                  <v-avatar
                    size="42"
                    class="me-3 notif-avatar notif-avatar--risk"
                  >
                    <v-icon size="20" color="white"
                      >mdi-alert-circle-outline</v-icon
                    >
                  </v-avatar>

                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">
                      {{ notif.student_name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ notif.remarks }}
                    </div>
                  </div>

                  <v-badge v-if="!notif.read" color="error" dot />
                </div>
                <div class="recommendation-block mt-2">
                  <div
                    class="text-caption font-weight-bold recommendation-label"
                  >
                    Decision Support Recommendation
                  </div>
                  <div class="text-caption">{{ notif.recommendation }}</div>
                </div>
              </v-card>
            </div>

            <!-- Empty state: At-Risk -->
            <div
              v-if="!atRiskNotification.length"
              v-show="status === 'At-Risk'"
              class="empty-state"
            >
              <v-icon size="30" class="mb-2" color="grey-lighten-1"
                >mdi-shield-check-outline</v-icon
              >
              <div class="text-body-2 font-weight-medium">
                No at-risk alerts
              </div>
              <div class="text-caption text-medium-emphasis">
                Nothing needs your attention right now
              </div>
            </div>

            <!-- Parent Notification -->
            <div v-if="parentNotification.length" class="mb-2">
              <v-card
                v-for="(notif, index) in limitParentNotification"
                :key="'notif-' + index"
                class="notif-card notif-card--parent clickable"
                variant="flat"
                @click="openParentNotification(notif)"
              >
                <div class="d-flex align-start">
                  <v-avatar
                    size="42"
                    class="me-3 notif-avatar notif-avatar--parent"
                  >
                    <v-icon size="20" color="white"
                      >mdi-account-child-outline</v-icon
                    >
                  </v-avatar>

                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">
                      {{ notif.student_name }}
                    </div>

                    <div class="text-caption text-medium-emphasis">
                      Grade: {{ notif.transmuted_grade }}
                    </div>

                    <div class="text-caption text-medium-emphasis">
                      Remarks: {{ notif.remarks }}
                    </div>
                  </div>

                  <v-badge v-if="!notif.read" color="error" dot />
                </div>
              </v-card>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-4">
            <v-btn
              block
              rounded="lg"
              color="#E35E93"
              variant="flat"
              @click="
                showAllNotifDialog = true;
                notifMenu = false;
              "
            >
              View All Notifications
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <!-- Account-->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-chip
            v-bind="props"
            class="rounded-pill py-2 px-3 d-flex align-center account-chip"
            variant="flat"
          >
            <v-avatar size="26" class="me-2">
              <v-img
                :src="
                  !profImg ? require('@/assets/img/img_avatar.png') : profImg
                "
                cover
              />
            </v-avatar>
            <!-- <span class="d-none d-md-flex flex-column me-2 account-chip-text">
              <span class="text-body-2 font-weight-medium">{{
                $store.state.user.fname
              }}</span>
              <span class="text-caption account-chip-subtext">{{
                $store.state.user.usertype.description
              }}</span>
            </span> -->
            <!-- <v-icon
              size="20"
              class="me-1"
              v-if="$vuetify.display.smAndDown"
              color="#4B5563"
            >
              mdi-account-arrow-right
            </v-icon> -->
            <v-icon size="20" color="#4B5563">mdi-chevron-down</v-icon>
          </v-chip>
        </template>

        <v-card width="280" elevation="12" rounded="xl" class="overflow-hidden">
          <!-- HEADER -->
          <v-sheet class="pa-4 account-menu-header">
            <v-row align="center" no-gutters>
              <v-col cols="auto">
                <v-avatar size="56" class="elevation-4 account-avatar-ring">
                  <v-img
                    :src="
                      !profImg
                        ? require('@/assets/img/img_avatar.png')
                        : profImg
                    "
                    cover
                  />
                </v-avatar>
              </v-col>

              <v-col class="pl-3">
                <div
                  class="text-subtitle-1 font-weight-bold text-grey-darken-4 account-name-caption"
                >
                  {{ $store.state.user.lname.toUpperCase() }}
                  {{ $store.state.user.fname.charAt(0).toUpperCase() }}.
                </div>
                <div
                  class="text-caption text-grey-darken-4 account-role-caption"
                >
                  {{ $store.state.user.usertype.description }}
                  <!-- {{ getMyRole($store.state.user.user.user_roleID) }} -->
                </div>
              </v-col>

              <v-col cols="auto">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="white"
                  @click="menu = false"
                  aria-label="Close"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>

          <!-- MENU -->
          <v-list density="comfortable" class="py-2">
            <v-list-item
              v-if="isValidated == 1"
              @click="assignedModuleDialog = true"
              rounded="lg"
              class="mx-2"
              prepend-icon="mdi-refresh-circle"
            >
              <v-list-item-title class="text-body-2">
                Change Role
              </v-list-item-title>
            </v-list-item>

            <v-divider class="my-2" v-if="isValidated == 1" />

            <v-list-item
              @click="logoutDialog = true"
              rounded="lg"
              class="mx-2 text-error"
              prepend-icon="mdi-logout"
            >
              <v-list-item-title class="text-body-2 font-weight-medium">
                Sign Out
              </v-list-item-title>
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
      class="app-drawer"
    >
      <div class="sidebar-logo d-flex align-center px-4 py-5">
        <v-avatar size="36" class="me-3 sidebar-logo-mark">
          <v-img
            :src="!profImg ? require('@/assets/img/img_avatar.png') : profImg"
            cover
          />
        </v-avatar>
        <span class="text-subtitle-1 font-weight-bold sidebar-logo-text">
          <div class="text-subtitle-1 font-weight-bold text-grey-darken-4">
            {{ $store.state.user.lname.toUpperCase() }}
            {{ $store.state.user.fname.charAt(0).toUpperCase() }}.
          </div></span
        >
      </div>

      <div class="sidebar-section-label px-4">Menu</div>

      <v-list nav dense class="sidebar mt-1">
        <template v-for="(link, i) in links" :key="i">
          <v-list-item
            v-if="!link.subLink"
            :to="`/${userType}${link.route}`"
            router
            :exact="true"
            density="compact"
            rounded="lg"
            class="mx-2 my-1 sidebar-item"
          >
            <div class="d-flex justify-left align-center">
              <v-icon start>{{ link.icon }}</v-icon>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </div>
          </v-list-item>

          <v-list-group v-else v-model="openGroups[i]">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                density="compact"
                rounded="lg"
                class="mx-2 my-1 sidebar-item"
              >
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
              class="rounded-lg my-1 mx-2 sidebar-sublink"
            >
              <v-list-item-title>{{ sublink.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Scrollable Main Content -->
    <v-main class="scrollable-main bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <v-card rounded="xl" elevation="0" class="content-card">
          <!-- Header -->
          <v-card-title
            class="d-flex align-center justify-space-between page-header"
            v-if="$route.meta.title != 'My Profile'"
          >
            <v-row align="center">
              <v-col cols="12" md="6">
                <div class="text-h6 font-weight-bold page-title">
                  {{ $route.meta.title }}
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                :class="
                  $vuetify.display.smAndDown
                    ? 'd-flex justify-center align-center'
                    : 'd-flex justify-end'
                "
              >
                <v-autocomplete
                  v-model="selectedFilter"
                  label="School Year"
                  item-title="school_year"
                  item-value="id"
                  :items="filterYears"
                  density="compact"
                  variant="outlined"
                  hide-details
                  rounded="lg"
                  style="max-width: 220px"
                  prepend-inner-icon="mdi-calendar-blank-outline"
                  @update:modelValue="changeFilter"
                />
              </v-col>
            </v-row>
          </v-card-title>

          <v-divider v-if="$route.meta.title != 'My Profile'" />

          <!-- Content -->
          <v-card-text class="pa-6">
            <router-view @reloadProfile="loadImg" />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Notification Dialog -->
    <v-dialog v-model="showAllNotifDialog" scrollable max-width="650">
      <v-card class="rounded-xl elevation-10">
        <!-- HEADER -->
        <v-card-title class="d-flex align-center px-6 py-4 notif-panel-header">
          <v-avatar size="34" class="me-3 header-icon-avatar">
            <v-icon size="18" color="white">mdi-bell-outline</v-icon>
          </v-avatar>
          <span class="text-h6 font-weight-bold"> All Notifications </span>
          <v-spacer />
          <v-btn
            icon
            variant="text"
            @click="showAllNotifDialog = false"
            aria-label="Close"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <div
            class="d-flex pa-1 mb-2"
            v-if="$store.state.user.user.assignedModuleID != 22"
          >
            <v-btn-toggle
              v-model="status"
              mandatory
              divided
              density="comfortable"
              class="status-toggle w-100"
            >
              <v-btn value="Lardo" class="flex-grow-1" size="small">
                <v-icon start size="16">mdi-file-document-alert-outline</v-icon>
                Lardo
              </v-btn>
              <v-btn value="At-Risk" class="flex-grow-1" size="small">
                <v-icon start size="16">mdi-alert-circle-outline</v-icon>
                At-Risk
              </v-btn>
            </v-btn-toggle>
          </div>

          <!-- LARDO Notification -->
          <div
            v-if="lardoNotification.length"
            class="mb-8"
            v-show="status === 'Lardo'"
          >
            <div class="section-title">LARDO Notification</div>

            <v-card
              v-for="(req, i) in lardoNotification"
              :key="'req-' + i"
              class="notif-card notif-card--lardo"
              variant="flat"
            >
              <div class="d-flex align-start">
                <v-avatar
                  size="44"
                  class="me-3 notif-avatar notif-avatar--lardo"
                >
                  <v-icon size="20" color="white">mdi-account</v-icon>
                </v-avatar>

                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ req.student_name }}
                  </div>

                  <div class="text-caption text-medium-emphasis mb-2">
                    {{ req.remarks }}
                  </div>

                  <div class="recommendation-block">
                    <div
                      class="text-caption font-weight-bold recommendation-label"
                    >
                      Decision Support Recommendation
                    </div>
                    <div class="text-caption">{{ req.recommendation }}</div>
                  </div>
                  <v-btn
                    size="small"
                    color="#E35E93"
                    variant="tonal"
                    class="mt-2"
                    @click="openLardoNotification(req)"
                  >
                    View
                  </v-btn>
                </div>

                <v-badge v-if="!req.read" color="error" dot />
              </div>
            </v-card>
          </div>

          <!-- LARDO Faculty -->
          <div
            v-if="lardoNotificationForFaculty.length"
            class="mb-8"
            v-show="status === 'Lardo'"
          >
            <div class="section-title">LARDO Notification</div>

            <v-card
              v-for="(req, i) in lardoNotificationForFaculty"
              :key="'req-' + i"
              class="notif-card notif-card--lardo"
              variant="flat"
            >
              <div class="d-flex align-start">
                <v-avatar
                  size="44"
                  class="me-3 notif-avatar notif-avatar--lardo"
                >
                  <v-icon size="20" color="white">mdi-account</v-icon>
                </v-avatar>

                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ req.student_name }}
                  </div>

                  <div class="text-caption text-medium-emphasis mb-2">
                    {{ req.remarks }}
                  </div>

                  <div class="recommendation-block">
                    <div
                      class="text-caption font-weight-bold recommendation-label"
                    >
                      Decision Support Recommendation
                    </div>
                    <div class="text-caption">{{ req.recommendation }}</div>
                  </div>
                  <v-btn
                    size="small"
                    color="#E35E93"
                    variant="tonal"
                    class="mt-2"
                    @click="openLardoFacultyNotification(req)"
                  >
                    View
                  </v-btn>
                </div>

                <v-badge v-if="!req.read" color="error" dot />
              </div>
            </v-card>
          </div>

          <!-- Empty state: Lardo -->
          <div
            v-if="
              !lardoNotification.length && !lardoNotificationForFaculty.length
            "
            v-show="status === 'Lardo'"
            class="empty-state"
          >
            <v-icon size="34" class="mb-2" color="grey-lighten-1"
              >mdi-file-check-outline</v-icon
            >
            <div class="text-body-1 font-weight-medium">
              No LARDO notifications
            </div>
            <div class="text-caption text-medium-emphasis">
              New alerts will show up here
            </div>
          </div>

          <!-- At-Risk Adviser -->
          <div
            v-if="atRiskNotification.length"
            class="mb-8"
            v-show="status === 'At-Risk'"
          >
            <div class="section-title">At-Risk Notification</div>

            <v-card
              v-for="(notif, index) in atRiskNotification"
              :key="'notif-' + index"
              class="notif-card notif-card--risk clickable"
              variant="flat"
              @click="openAdviserNotification(notif)"
            >
              <div class="d-flex align-start">
                <v-avatar
                  size="44"
                  class="me-3 notif-avatar notif-avatar--risk"
                >
                  <v-icon size="20" color="white"
                    >mdi-alert-circle-outline</v-icon
                  >
                </v-avatar>

                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ notif.student_name }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ notif.remarks }}
                  </div>
                </div>

                <v-badge v-if="!notif.read" color="error" dot />
              </div>
              <div class="recommendation-block mt-2">
                <div class="text-caption font-weight-bold recommendation-label">
                  Decision Support Recommendation
                </div>
                <div class="text-caption">{{ notif.recommendation }}</div>
              </div>
            </v-card>
          </div>

          <!-- At-Risk Faculty -->
          <div v-if="atRiskNotificationForFaculty.length" class="mb-8">
            <div class="section-title">At-Risk Notification</div>

            <v-card
              v-for="(notif, index) in atRiskNotificationForFaculty"
              :key="'notif-' + index"
              class="notif-card notif-card--risk clickable"
              variant="flat"
              @click="openFacultyNotification(notif)"
            >
              <div class="d-flex align-start">
                <v-avatar
                  size="44"
                  class="me-3 notif-avatar notif-avatar--risk"
                >
                  <v-icon size="20" color="white"
                    >mdi-alert-circle-outline</v-icon
                  >
                </v-avatar>

                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ notif.student_name }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ notif.remarks }}
                  </div>
                </div>

                <v-badge v-if="!notif.read" color="error" dot />
              </div>
              <div class="recommendation-block mt-2">
                <div class="text-caption font-weight-bold recommendation-label">
                  Decision Support Recommendation
                </div>
                <div class="text-caption">{{ notif.recommendation }}</div>
              </div>
            </v-card>
          </div>

          <!-- Empty state: At-Risk -->
          <div
            v-if="
              !atRiskNotification.length && !atRiskNotificationForFaculty.length
            "
            v-show="status === 'At-Risk'"
            class="empty-state"
          >
            <v-icon size="34" class="mb-2" color="grey-lighten-1"
              >mdi-shield-check-outline</v-icon
            >
            <div class="text-body-1 font-weight-medium">No at-risk alerts</div>
            <div class="text-caption text-medium-emphasis">
              Nothing needs your attention right now
            </div>
          </div>

          <!-- Parent Notification -->
          <div v-if="parentNotification.length" class="mb-4">
            <v-card
              v-for="(notif, index) in parentNotification"
              :key="'notif-' + index"
              class="notif-card notif-card--parent clickable"
              variant="flat"
              @click="openParentNotification(notif)"
            >
              <div class="d-flex align-start">
                <v-avatar
                  size="44"
                  class="me-3 notif-avatar notif-avatar--parent"
                >
                  <v-icon size="20" color="white"
                    >mdi-account-child-outline</v-icon
                  >
                </v-avatar>

                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ notif.student_name }}
                  </div>

                  <div class="text-caption text-medium-emphasis">
                    Final Grade: {{ notif.transmuted_grade }}
                  </div>

                  <div class="text-caption text-medium-emphasis">
                    Remarks: {{ notif.remarks }}
                  </div>
                </div>

                <v-badge v-if="!notif.read" color="error" dot />
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="#E35E93"
            variant="flat"
            rounded="lg"
            @click="showAllNotifDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Logout Dialog-->
    <v-dialog v-model="logoutDialog" max-width="420" persistent>
      <v-card class="rounded-xl">
        <!-- Header -->
        <v-card-text class="text-center pt-8 pb-2">
          <v-avatar size="56" color="red-lighten-5" class="mb-4">
            <v-icon size="28" color="red">mdi-logout</v-icon>
          </v-avatar>
          <div class="text-h6 font-weight-bold mb-1">Confirm Logout</div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Are you sure you want to log out? You'll need to sign in again to
            continue.
          </p>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="px-6 py-6">
          <div class="d-flex justify-space-between w-100">
            <v-btn
              block
              color="grey-darken-1"
              variant="outlined"
              rounded="lg"
              @click="logoutDialog = false"
            >
              Cancel
            </v-btn>
          </div>
          <div class="d-flex justify-space-between w-100">
            <v-btn
              block
              color="red"
              variant="flat"
              rounded="lg"
              @click="logout()"
            >
              Log Out
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Change Assign Module Dialog-->
    <v-dialog v-model="assignedModuleDialog" max-width="380" persistent>
      <v-card class="rounded-xl">
        <!-- Header -->
        <v-card-title class="text-h6 font-weight-bold px-6 py-4">
          Change Role
        </v-card-title>
        <v-card-subtitle class="px-6 pb-2"
          >Select the role you'd like to switch to</v-card-subtitle
        >

        <v-divider class="mt-2" />

        <!-- Content -->
        <v-card-text class="px-4 py-4">
          <v-row dense>
            <v-col
              cols="12"
              v-for="(item, index) in assigneAccessModulesList"
              :key="item.id"
            >
              <v-card
                class="role-card d-flex align-center justify-space-between px-4 py-3"
                :class="{ active: selectedModuleId === item.id }"
                elevation="0"
                border
                ripple
                @click="selectButton(index, item)"
              >
                <span class="text-body-1">
                  {{ item.description }}
                </span>
                <v-icon v-if="selectedModuleId === item.id" color="#E35E93">
                  mdi-check-circle
                </v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <!-- Actions -->
        <v-card-actions class="px-6 py-4">
          <v-btn
            variant="outlined"
            color="red"
            rounded="lg"
            @click="assignedModuleDialog = false"
          >
            Cancel
          </v-btn>

          <v-spacer />

          <v-btn
            color="#E35E93"
            :loading="isLoading"
            variant="flat"
            rounded="lg"
            :disabled="selectedModuleId === null"
            @click="confirmChangeRole"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </v-app>
</template>

<script>
export default {
  name: 'NavbarPage',
  data() {
    return {
      drawer: true,
      status: 'Lardo',
      notifMenu: false,
      logoutDialog: false,
      assignedModuleDialog: false,
      selectedModuleId: null,
      selected: [],
      selectedIndex: null,
      isLoading: false,
      selectedDate: new Date().toISOString().substr(0, 10),
      menu: [
        {
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          active: true,
          items: ['Dashboard 1', 'Dashboard 2'],
        },
        {
          title: 'Apps',
          icon: 'mdi-apps',
          active: false,
          items: ['Chat', 'Calendar'],
        },
        {
          title: 'UI Elements',
          icon: 'mdi-palette',
          active: false,
          items: ['Buttons', 'Avatars'],
        },
      ],
      fadeAwayMessage: {
        show: false,
        type: 'success',
        header: 'Successfully Added!',
        message: '',
        top: 10,
      },
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
      newRoleData: null,
      selectedFilter: null,
      filterYears: [],
      userModule: null,
      notifTab: 0,
      isValidated: null,
      lardoNotificationForFaculty: [],
      assigneAccessModulesList: [],
      lardoNotification: [],
      atRiskNotificationForFaculty: [],
      atRiskNotification: [],
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
    assignedModuleDialog(val) {
      if (val) {
        this.setInitialSelectedRole();
      }
    },
  },
  mounted() {
    this.userId = this.$store.state.user.id;
    this.userModule = this.$store.state.user.user.assignedModuleID;
    this.$store.commit('SET_ASSIGNED_MODULE', this.userModule);
    localStorage.setItem('AssignedModID', this.userModule);
    this.isValidated = this.$store.state.user.user.isValidated;
    this.loadYearForFilter();
    this.getLardoNotification();
    this.getLardoNotificationForFaculty();
    this.getAtRiskNotification();
    this.getAtRiskNotificationForFaculty();
    this.getParentNotification();
    this.getAccessControlAssignedModules();

    if (this.$vuetify.display.xs) {
      this.drawer = false;
      this.mini = false;
    }
  },
  methods: {
    setInitialSelectedRole() {
      this.assigneAccessModulesList = this.assigneAccessModulesList.map(
        (item) => ({
          ...item,
          id: Array.isArray(item.id) ? Number(item.id[0]) : Number(item.id),
        }),
      );
      console.table(this.assigneAccessModulesList);

      this.newRoleData = this.assigneAccessModulesList.find(
        (item) => item.id === this.selectedModuleId,
      );
    },
    selectButton(index, item) {
      this.selectedModuleId = item.id;
      this.newRoleData = item;
      this.selectedIndex = index;
    },
    loadYearForFilter() {
      this.axiosCall('/enroll-student/getSchoolYear', 'GET').then((res) => {
        if (res) {
          this.selectedFilter = res.data[0].id;
          const activeYear = res.data.find((item) => item.status === 1);
          if (activeYear) {
            this.selectedFilter = activeYear.id;
            this.$store.commit('setSyType', activeYear.syType);
          }
          this.$store.commit('setFilterSelected', this.selectedFilter);
          let data = res.data;
          this.filterYears = data;
        }
      });
    },
    changeFilter(newValue) {
      this.$store.commit('setFilterSelected', newValue);
      for (let index = 0; index < this.filterYears.length; index++) {
        if (this.filterYears[index].id === newValue) {
          this.$store.commit('setSyType', this.filterYears[index].syType);
        }
      }
    },

    openParentNotification(notif) {
      this.notifMenu = false;
      notif.read = true;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall('/notification/' + notif.id, 'PATCH', { read: 1 }).then(
          (res) => {
            console.log(res);
            if (notif.route) {
              this.$router.push('/' + this.userType + notif.route);
            }
          },
        );
      }
    },
    openAdviserNotification(notif) {
      notif.read = true;
      this.notifMenu = false;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall(
          '/notification/updateAtRiskAdviser/' + notif.id,
          'PATCH',
          { read: 1 },
        ).then((res) => {
          console.log(res);
          if (notif.route) {
            this.$router.push('/' + this.userType + notif.route);
          }
        });
      }
    },

    openFacultyNotification(notif) {
      notif.read = true;
      this.notifMenu = false;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall(
          '/notification/updateAtRiskFaculty/' + notif.id,
          'PATCH',
          { read: 1 },
        ).then((res) => {
          console.log(res);
          if (notif.route) {
            this.$router.push('/' + this.userType + notif.route);
          }
        });
      }
    },

    openLardoNotification(notif) {
      notif.read = true;
      this.notifMenu = false;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall(
          '/notification/updateLardoAdviser/' + notif.id,
          'PATCH',
          { read: 1 },
        ).then((res) => {
          console.log(res);
          if (notif.route) {
            this.$router.push('/' + this.userType + notif.route);
          }
        });
      }
    },
    openLardoFacultyNotification(notif) {
      notif.read = true;
      this.notifMenu = false;
      this.showAllNotifDialog = false;
      if (notif.route) {
        this.axiosCall(
          '/notification/updateLardoFaculty/' + notif.id,
          'PATCH',
          { read: 1 },
        ).then((res) => {
          console.log(res);
          if (notif.route) {
            this.$router.push('/' + this.userType + notif.route);
          }
        });
      }
    },

    getMyRole(id) {
      const match = this.userRoleList.find(
        (r) => parseInt(r.id) === parseInt(id),
      );
      return match ? match.description : '';
    },
    openMobileNav() {
      this.drawer = true;
    },
    loadImg() {
      this.axiosCall('/user-details/getUserProfileImg', 'GET').then((res) => {
        this.profImg =
          process.env.VUE_APP_SERVER +
          '/user-details/getProfileImg/' +
          res.data.profile_img;
      });
    },
    toProfile() {
      const userType =
        this.$store.state.user.usertype.description.toLowerCase();
      const roleID = this.$store.state.user.user.user_roleID;
      const path =
        roleID === 5 ? '/superadmin/profile' : `/${userType}/profile`;
      this.$router.push(path);
    },
    getCurrentDate() {
      const cur_date = new Date();
      const month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const day = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      return `${day[cur_date.getDay()]}, ${
        month[cur_date.getMonth()]
      } ${cur_date.getDate()}; ${this.formatAMPM(cur_date)}`;
    },
    formatAMPM(date) {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    },
    closeNav() {
      this.drawer = false;
      this.$emit('closeNav');
    },
    loadMenu(userType, userRole) {
      this.openGroups = this.links.map((link) => !!link.subLink && false);
      this.axiosCall('/assigned-modules/getMyAssignedModules/my', 'GET').then(
        (resp) => {
          this.selectedModuleId = resp.data.id;
          this.links = JSON.parse(resp.data.assign_mods);
          switch (userType) {
            case 1:
              this.userType = 'admin';
              break;
            case 2:
              this.userType = userRole === 4 ? 'superadmin' : 'employee';
              break;
            case 3:
              this.userType = 'parent';
              break;
            case 4:
              this.userType = 'teacher';
              break;
          }
        },
      );
    },

    getLardoNotification() {
      this.axiosCall(
        '/notification/getLardoStudent/' + this.userId,
        'GET',
      ).then((res) => {
        console.log('Lardo', res.data);
        if (this.userModule == 21) {
          this.lardoNotification = res.data;
        }
      });
    },

    getLardoNotificationForFaculty() {
      this.axiosCall(
        '/notification/getLardoStudentForFaculty/' + this.userId,
        'GET',
      ).then((res) => {
        console.log('Lardo', res.data);
        if (this.userModule != 21) {
          this.lardoNotificationForFaculty = res.data;
        }
      });
    },

    getAtRiskNotification() {
      this.axiosCall(
        '/notification/getAtRiskStudent/' + this.userId,
        'GET',
      ).then((res) => {
        console.log('At-Risk', res.data);
        if (this.userModule == 21) {
          this.atRiskNotification = res.data;
        }
      });
    },

    getAtRiskNotificationForFaculty() {
      this.axiosCall(
        '/notification/getAtRiskStudentForFaculty/' + this.userId,
        'GET',
      ).then((res) => {
        console.log('At-Risk', res.data);
        if (this.userModule != 21) {
          this.atRiskNotificationForFaculty = res.data;
        }
      });
    },
    getParentNotification() {
      this.axiosCall(
        '/notification/getParentNotification/' + this.userId,
        'GET',
      ).then((res) => {
        console.log('Parent', res.data);
        this.parentNotification = res.data;
      });
    },
    getAccessControlAssignedModules() {
      this.axiosCall('/assigned-modules/getSpecificModules', 'GET').then(
        (res) => {
          let subModules = this.$store.state.user.user.subModules;

          if (typeof subModules === 'string') {
            try {
              subModules = JSON.parse(subModules);
            } catch (error) {
              subModules = [];
            }
          }

          subModules = Array.isArray(subModules) ? subModules : [];

          this.assigneAccessModulesList = res.data.filter((item) =>
            subModules.includes(Number(item.id)),
          );
        },
      );
    },
    confirmChangeRole() {
      this.isLoading = true;
      let userID = this.$store.state.user.user.id;
      let data = {
        assignedModuleID: this.newRoleData.id,
      };
      this.axiosCall(
        '/auth/changeAssignedModule/Role/' + userID,
        'POST',
        data,
      ).then((res) => {
        if (res.data.status == 200) {
          this.$store.commit('SET_ASSIGNED_MODULE', this.newRoleData.id);
          localStorage.setItem('AssignedModID', this.newRoleData.id);
          this.isLoading = false;
          location.reload();
        } else if (res.data.status == 400) {
          this.isLoading = false;
          this.fadeAwayMessage.message = res.data.msg;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = 'error';
          this.fadeAwayMessage.header = 'System Message';
        }
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
/* ============ Design tokens (this component) ============ */
.v-app-bar,
.scrollable-main,
.sidebar,
.notif-panel,
.role-card {
  --brand: #e35e93;
  --brand-dark: #c2457b;
  --brand-soft: #fdeef5;
  --ink: #17241d;
  --ink-soft: #6b7280;
  --surface: #f6f7f9;
  --risk: #f97316;
  --risk-soft: #fff4e8;
  --lardo: #6366f1;
  --lardo-soft: #eef0fe;
  --parent: #0d9488;
  --parent-soft: #e6f6f4;
}

/* Scrollable area */
.scrollable-main {
  height: calc(100vh - 64px);
  overflow-y: auto;
  background-color: var(--surface);
}

/* App bar */
.app-bar-light {
  background-color: #ffffff !important;
  color: var(--ink) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.brand-title {
  letter-spacing: 0.2px;
  color: var(--ink);
}

.topbar-search {
  background-color: var(--surface);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 999px;
  padding: 8px 16px;
  min-width: 260px;
}
.topbar-search-placeholder {
  color: #9aa1ac;
}

.topbar-icon-btn {
  transition: transform 0.15s ease;
}
.topbar-icon-btn:hover {
  transform: translateY(-1px);
}

.account-chip {
  background-color: var(--surface) !important;
  transition: background-color 0.15s ease;
}
.account-chip:hover {
  background-color: var(--brand-soft) !important;
}
.account-chip-text {
  line-height: 1.2;
}
.account-chip-subtext {
  color: var(--ink-soft);
}

/* Sidebar */
.app-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  background-color: #ffffff !important;
}

.sidebar-logo-mark {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
}
.sidebar-logo-text {
  color: var(--ink);
}

.sidebar-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #a3aab5;
  margin-bottom: 6px;
}

.sidebar-item {
  transition: background-color 0.18s ease, transform 0.15s ease;
  color: var(--ink-soft);
}
.sidebar-item:hover {
  background-color: var(--brand-soft);
  transform: translateX(2px);
}

.sidebar :deep(.v-list-item--active) {
  background-color: var(--brand-soft) !important;
  color: var(--brand) !important;
  font-weight: 600;
  border-left: 3px solid var(--brand);
}
.sidebar :deep(.v-list-item--active .v-icon) {
  color: var(--brand) !important;
}

.sidebar-sublink {
  transition: background-color 0.18s ease;
}
.sidebar-sublink:hover {
  background-color: var(--brand-soft);
}
.sidebar :deep(.v-list-group .v-list-item--active) {
  background-color: var(--brand) !important;
  color: #ffffff !important;
  border-radius: 8px;
}

/* Content card */
.content-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.page-header {
  padding: 20px 24px !important;
}

.page-title {
  color: var(--ink);
}

/* Account menu */
.account-menu-header {
  background: linear-gradient(
    120deg,
    var(--brand) 0%,
    var(--brand-dark) 100%
  ) !important;
}
.account-role-caption {
  opacity: 0.85;
}
.account-avatar-ring {
  border: 2px solid rgba(255, 255, 255, 0.5);
}

/* Notification panel */
.notif-panel-header {
  background-color: #fafafa;
}
.header-icon-avatar {
  background: linear-gradient(120deg, var(--brand), var(--brand-dark));
}

.status-toggle {
  border-radius: 10px !important;
  overflow: hidden;
  width: 100%;
}

.section-title {
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
  color: var(--ink-soft);
}

.notif-card {
  padding: 14px;
  margin-bottom: 12px;
  border-radius: 14px;
  background-color: #fafafa;
  border-left: 3px solid transparent;
  transition: transform 0.15s ease, box-shadow 0.15s ease,
    background-color 0.15s ease;
  cursor: default;
}

.notif-card.clickable {
  cursor: pointer;
}

.notif-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.notif-card--lardo {
  border-left-color: var(--lardo);
}
.notif-card--risk {
  border-left-color: var(--risk);
}
.notif-card--parent {
  border-left-color: var(--parent);
}

.notif-avatar--lardo {
  background-color: var(--lardo);
}
.notif-avatar--risk {
  background-color: var(--risk);
}
.notif-avatar--parent {
  background-color: var(--parent);
}

.recommendation-block {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  padding: 8px 10px;
}
.recommendation-label {
  color: var(--ink-soft);
  margin-bottom: 2px;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: var(--ink-soft);
}

/* Role selection card */
.role-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.role-card:hover {
  background-color: var(--brand-soft);
  border-color: var(--brand) !important;
}

.role-card.active {
  border: 2px solid var(--brand) !important;
  background-color: var(--brand-soft);
}

/* Focus visibility for accessibility */
.notif-card.clickable:focus-visible,
.sidebar-item:focus-visible,
.role-card:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .notif-card,
  .sidebar-item,
  .topbar-icon-btn,
  .account-chip {
    transition: none !important;
  }
}
</style>
