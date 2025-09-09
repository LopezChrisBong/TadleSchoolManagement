<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  props: {
    pieData: Object,
  },
  data: () => ({
    datas: [],
    label: [],
  }),
  watch: {
    pieData: {
      handler(val) {
        if (val) {
          this.renderGraph(val.label, val.data);
        }
      },
      deep: true,
    },
  },
  methods: {
    renderGraph(label, data) {
      this.renderChart(
        {
          labels: label,
          datasets: [
            {
              backgroundColor: [
                "#0096FF",
                "#17C800",
                "#20C745",
                "#FC7300",
                "#F8B102",
              ],
              data: data,
            },
          ],
        },

        {
          tooltips: {
            enabled: false,
          },
          responsive: true,
          maintainAspectRatio: false,
          // legend: {
          //   display: true,
          //   position: "right",
          //   align: "center",
          // },
          // pieceLabel: {
          //   render: "label",
          //   arc: true,
          //   fontColor: "#000",
          //   position: "inside",
          // },
        }
      );
    },
  },
};
</script>
