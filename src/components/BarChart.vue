<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController } from "chart.js";
  
  // Registrar todos los componentes necesarios de Chart.js
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    BarController
  );
  
  export default defineComponent({
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      chartOptions: {
        type: Object,
        default: () => ({}),
      },
    },
    mounted() {
      this.renderChart(this.chartData, this.chartOptions);
    },
    methods: {
      renderChart(data, options) {
        if (this._chart) {
          this._chart.destroy(); // Destruir el gráfico anterior para evitar conflictos
        }
        const ctx = this.$refs.canvas.getContext("2d");
        this._chart = new ChartJS(ctx, {
          type: "bar",
          data,
          options,
        });
      },
    },
    watch: {
      chartData: {
        handler(newData) {
          console.log("Datos actualizados en BarChart:", newData);
          this.renderChart(newData, this.chartOptions);
        },
        deep: true, // Para detectar cambios en estructuras anidadas
      },
    },
  });
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
  }
  </style>
  