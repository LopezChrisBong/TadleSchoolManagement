<template>
  <div>
    <!-- Employee Dashboard -->
    <div
      v-if="
        $store.state.user.user.assignedModuleID == 2 ||
        $store.state.user.user.assignedModuleID == 21
      "
    >
      <TeacherDashboard />
    </div>
    <!-- Parent Dashboard -->
    <div v-else-if="$store.state.user.user.assignedModuleID == 22">
      <ParentDashboard />
    </div>
    <!-- Parent Dashboard -->
    <div v-else><PrefectDashboard /></div>
  </div>
</template>

<script>
import ParentDashboard from './ParentDashboard.vue';
import PrefectDashboard from './PrefectDashboard.vue';
import TeacherDashboard from './TeacherDashboard.vue';

export default {
  components: { ParentDashboard, TeacherDashboard, PrefectDashboard },
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
