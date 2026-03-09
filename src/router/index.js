import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '@/views/Inicio.vue'
import Marca from '@/views/Marca.vue'
import Vehiculo from '@/views/Vehiculo.vue'
import Cliente from '@/views/Cliente.vue'
import NuevaMarca from '@/views/NuevaMarca.vue'
import NuevoModelo from '@/views/NuevoModelo.vue'
import NuevoVehiculo from '@/views/NuevoVehiculo.vue'
import Alquiler from '@/views/Alquiler.vue'
import Modelo from '@/views/Modelo.vue'

const routes = [
  { path: '/', component: Inicio },
  { path: '/marcas', component: Marca },
  { path: '/marca/nueva', component: NuevaMarca },
  { path: '/modelos', component: Modelo },
  { path: '/modelo/nuevo', component: NuevoModelo },
  { path: '/vehiculos', component: Vehiculo },
  { path: '/vehiculo/nuevo', component: NuevoVehiculo },
  { path: '/clientes', component: Cliente },
  { path: '/alquiler', component: Alquiler }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router