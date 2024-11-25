<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from "chart.js";
  
  export default {
    props: {
      chartData: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        chart: null,
      };
    },
    mounted() {
      // Registrar los componentes básicos de Chart.js
      Chart.register(...registerables);
  
      // Crear el gráfico cuando el componente se monte
      this.renderChart();
    },
    methods: {
      renderChart() {
        if (this.chart) {
          this.chart.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
        }
  
        const ctx = this.$refs.chartCanvas.getContext("2d");
        this.chart = new Chart(ctx, {
          type: "line",
          data: this.chartData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
          },
        });
      },
    },
    watch: {
      chartData: {
        deep: true,
        handler() {
          this.renderChart(); // Volver a renderizar el gráfico si los datos cambian
        },
      },
    },
  };
  </script>
  
  <style>
  canvas {
    max-width: 100%;
  }
  </style>
  