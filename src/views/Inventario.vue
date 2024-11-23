<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="layout">
    <Userbar/>
    <BarraLateral/>
    <div class="contenido-principal">
      <h1>Pagina del inventario</h1>
      <!-- Aquí irá el resto de tu contenido -->
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
import BarraLateral from "../components/BarraLateral.vue";
import Userbar from '@/components/Userbar.vue';
  
export default {
  components: {
    Userbar,
    BarraLateral,
  },
  data() {
    return {
      inventario: [],
    };
  },
  methods: {
    async listarinventario() {
      try {
        const response = await axios.get('productos/');
        this.inventario = response.data;
        console.log(this.inventario)
      } catch (error) {
        console.error('Hubo un error al obtener los datos:', error);
      }
    },
  },
  mounted() {
    this.listarinventario();
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.contenido-principal {
  flex: 1;
  margin-left: 230px; /* Este valor debe ser igual al ancho de tu barra lateral */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra horizontalmente el contenido */
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

/* Si quieres que todo el contenido tenga un ancho máximo */
.contenido-principal {
  max-width: 1200px; /* O el valor que prefieras */
  margin-left: auto;
  margin-right: auto;
  padding-left: calc(230px + 20px); /* barra lateral + padding */
  padding-right: 20px;
}

/* Asegúrate de que el contenido no se solape con la barra en pantallas pequeñas */
@media (max-width: 768px) {
  .contenido-principal {
    margin-left: 0;
    padding-left: 20px;
  }
}
</style>