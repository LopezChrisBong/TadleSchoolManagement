<template>
  <div>
    <!-- Employee Dashboard -->
    <div v-if="user_roleID != 3">
      <TeacherDashboard />
    </div>
    <!-- Parent Dashboard -->
    <div v-else><StudentDashboard /></div>
  </div>
</template>

<script>
import StudentDashboard from './ParentDashboard.vue';
import TeacherDashboard from './TeacherDashboard.vue';

export default {
  components: { StudentDashboard, TeacherDashboard },
  data() {
    return {
      user_roleID: null,
      appointments: [
        { id: 1, patient: 'John Doe', time: '9:00 AM' },
        { id: 2, patient: 'Jane Smith', time: '10:30 AM' },
      ],
      lowStocks: [
        { name: 'Gloves', quantity: 3 },
        { name: 'Syringes', quantity: 2 },
      ],
      recentPatients: [
        { name: 'Emily', date: '2025-04-18' },
        { name: 'Mark', date: '2025-04-17' },
      ],
      shortcuts: [
        {
          title: 'New Appointment',
          icon: 'mdi-calendar-plus',
          route: '/appointments/new',
        },
        {
          title: 'Patient Records',
          icon: 'mdi-folder-account',
          route: '/patients',
        },
        { title: 'Inventory', icon: 'mdi-warehouse', route: '/inventory' },
        { title: 'Reports', icon: 'mdi-chart-bar', route: '/reports' },
      ],
      notifications: [
        {
          title: 'Reminder: Appointment at 10AM',
          date: 'Today',
          read: false,
          route: '/appointments',
        },
        {
          title: 'Stock alert: Syringes',
          date: 'Yesterday',
          read: true,
          route: '/inventory',
        },
      ],
    };
  },
  mounted() {
    this.user_roleID = this.$store.state.user.user.user_roleID;
    console.log('USer', this.$store.state.user.user.user_roleID);
  },
  methods: {
    goToNotification(notif) {
      notif.read = true;
      if (notif.route) {
        this.$router.push(notif.route);
      }
    },
    goTo(section) {
      // Replace with real route mapping
      const routes = {
        attendance: '/teacher/attendance',
        scores: '/teacher/scores',
        atrisk: '/teacher/at-risk',
        lardo: '/teacher/lardo',
        confirmation: '/teacher/confirmation',
      };
      this.$router.push(routes[section]);
    },
  },
};
</script>

<style scoped>
.text-red {
  color: red !important;
}
.v-card {
  transition: 0.3s ease;
}
.v-card:hover {
  transform: scale(1.01);
}
</style>
