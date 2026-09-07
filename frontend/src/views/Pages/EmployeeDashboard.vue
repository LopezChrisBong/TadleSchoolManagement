<template>
  <div>
    <!-- Employee Dashboard -->
    <div v-if="assignedModuleID == 22">
      <ParentDashboard />
    </div>
    <!-- Parent Dashboard -->
    <div v-else-if="assignedModuleID == 23 || assignedModuleID == 27">
      <PrefectDashboard />
    </div>
    <div v-else-if="assignedModuleID == 1">
      <Admin />
    </div>
    <!-- Parent Dashboard -->
    <div v-else-if="assignedModuleID == 2 || assignedModuleID == 21">
      <TeacherDashboard />
    </div>
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
      assignedModuleID: null,
    };
  },
  mounted() {
    this.user_roleID = this.$store.state.user.user.user_roleID;
    if (localStorage.getItem('AssignedModID') == null) {
      localStorage.setItem(
        'AssignedModID',
        this.$store.state.user.user.assignedModuleID,
      );
      this.assignedModuleID = localStorage.getItem('AssignedModID');
    } else {
      this.assignedModuleID = localStorage.getItem('AssignedModID');
    }

    // console.log('USer', this.$store.state.user.user.assignedModuleID);
    // console.log('USer', localStorage.getItem('token'));
  },

  methods: {},
};
</script>
