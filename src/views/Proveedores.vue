<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="layout">
      <BarraLateral/>
      <div class="contenido-principal">
        <h1>Pagina para los proveedores</h1>
        <!-- Aquí irá el resto de tu contenido -->
      </div>
    </div>
  </template>

<script>
import axios from 'axios';
import BarraLateral from "../components/BarraLateral.vue";
  
export default {
  components: {
    BarraLateral,
  },
  data() {
    return {
      proveedores: [],
    };
  },
  methods: {
    async listarproveedores() {
      try {
        const response = await axios.get('proveedor/list');
        this.proveedores = response.data;
        console.log(this.proveedores)
      } catch (error) {
        console.error('Hubo un error al obtener los datos:', error);
      }
    },
  },
  mounted() {
    this.listarproveedores();
  },
};
</script>