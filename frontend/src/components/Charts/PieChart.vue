<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  data() {
    return {
      data: [],
      labels: [],
    };
  },
  watch: {
      data: {
        handler () {
        this.renderCharts();
        },
        deep: true,
      },
    },
  mounted() {
    this.renderChart();
    this.chartData();
  },
  methods:{
  chartData(){
      this.axiosCall("/chart/totalLoansPerStatus", "GET").then(
        (res) => {
          this.labels = [];
          this.data = [];
          res.data.data.result.forEach(item => {
            this.labels.push(item.label);
          });
          res.data.data.result.forEach(item => {
            this.data.push(item.totalcount);
          });
          this.extends.update();
        }
      );
    },
    renderChart(){
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient3 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.gradient3.addColorStop(0, "rgba(00, 128, 128, 0.9)");
    this.gradient3.addColorStop(0.5, "rgba(0, 128, 128, 0.25)");
    this.gradient3.addColorStop(1, "rgba(0, 128, 128, 0)");
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            backgroundColor: [this.gradient3, this.gradient2, this.gradient],
            data: this.data
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
    }
  }
};
</script>