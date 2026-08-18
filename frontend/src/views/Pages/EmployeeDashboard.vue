<template>
  <div>
    <!-- Employee Dashboard -->
    <div v-if="$store.state.user.user.assignedModuleID == 22">
      <ParentDashboard />
    </div>
    <!-- Parent Dashboard -->
    <div v-else-if="$store.state.user.user.assignedModuleID == 23">
      <PrefectDashboard />
    </div>
    <div v-else-if="$store.state.user.user.assignedModuleID == 1">
      <Admin />
    </div>
    <!-- Parent Dashboard -->
    <div v-else><TeacherDashboard /></div>
  </div>
</template>

<script>
import ParentDashboard from './ParentDashboard.vue';
import PrefectDashboard from './PrefectDashboard.vue';
import TeacherDashboard from './TeacherDashboard.vue';
import Admin from './Dashboard.vue';

export default {
  components: { ParentDashboard, TeacherDashboard, PrefectDashboard, Admin },
  data() {
    return {
      user_roleID: null,
    };
  },
  mounted() {
    this.user_roleID = this.$store.state.user.user.user_roleID;
    // console.log('USer', this.$store.state.user.user.assignedModuleID);
    // console.log('USer', localStorage.getItem('token'));
  },

  methods: {},
};
</script>
