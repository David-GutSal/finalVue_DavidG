<script setup>
import { ref, computed, onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'

const marcas = ref([])
const modelos = ref([])
const vehiculos = ref([])
const marcaSeleccionada = ref(null)

onMounted(async () => {
  const [rMarcas, rModelos, rVehiculos] = await Promise.all([
    axiosInstance.get('http://localhost:3000/marcas'),
    axiosInstance.get('http://localhost:3000/modelos'),
    axiosInstance.get('http://localhost:3000/vehiculos'),
  ])
  marcas.value = rMarcas.data
  modelos.value = rModelos.data
  vehiculos.value = rVehiculos.data
})

function getPrecioMedioMarca(idMarca) {
  const idsModelos = modelos.value.filter((modelo) => modelo.idMarca === idMarca).map((modelo) => modelo.id)

  const vehiculosDeMarca = vehiculos.value.filter((v) => idsModelos.includes(v.idModelo))

  if (!vehiculosDeMarca.length) return 0

  const suma = vehiculosDeMarca.reduce((acc, v) => acc + v.precioDia, 0)
  return suma / vehiculosDeMarca.length
}

const marcasOrdenadas = computed(() => {
  return [...marcas.value].sort((marcaA, marcaB) => getPrecioMedioMarca(marcaB.id) - getPrecioMedioMarca(marcaA.id))
})

function seleccionar(marca) {
  marcaSeleccionada.value = marca
}

const modelosEnStock = computed(() => {
  if (!marcaSeleccionada.value) return []

  return modelos.value.filter((m) => {
    if (m.idMarca !== marcaSeleccionada.value.id) return false
    return vehiculos.value.some((v) => v.idModelo === m.id)
  })
})

function getPrecioDia(idModelo) {
  const vehiculosDelModelo = vehiculos.value.filter((v) => v.idModelo === idModelo)
  if (!vehiculosDelModelo.length) return 0
  const suma = vehiculosDelModelo.reduce((acc, v) => acc + v.precioDia, 0)
  return suma / vehiculosDelModelo.length
}
</script>

<template>
  <div>
    <h3 class="mb-4">Marcas</h3>
    <div class="row">
      <div class="col-md-4">
        <ul class="list-group">
          <li
            v-for="marca in marcasOrdenadas"
            :key="marca.id"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{ active: marcaSeleccionada?.id === marca.id }"
            @click="seleccionar(marca)">
            <span class="fw-semibold">{{ marca.nombre }}</span>
            <span class="badge bg-secondary rounded-pill">
              {{ getPrecioMedioMarca(marca.id).toFixed(2) }}€/día
            </span>
          </li>
          <li v-if="!marcasOrdenadas.length" class="list-group-item text-muted">
            No hay marcas disponibles
          </li>
        </ul>
      </div>

      <div class="col-md-8">
        <div v-if="marcaSeleccionada">
          <h5 class="mb-3">
            <i class="bi bi-bookmark-fill me-2"></i>
            Modelos de <span>{{ marcaSeleccionada.nombre }}</span> en stock
          </h5>
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>Modelo</th>
                <th>Precio/día</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="modelo in modelosEnStock" :key="modelo.id">
                <td>{{ modelo.modelo }}</td>
                <td>{{ getPrecioDia(modelo.id).toFixed(2) }}€</td>
              </tr>
              <tr v-if="!modelosEnStock.length">
                <td colspan="2" class="text-center text-muted">
                  Esta marca no tiene modelos en stock
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
