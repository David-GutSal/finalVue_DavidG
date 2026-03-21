<script setup>
import { ref, computed, onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'
import NuevoVehiculoForm from '../components/NuevoVehiculoForm.vue'

const marcas = ref([])
const modelos = ref([])
const vehiculos = ref([])
const clientes = ref([])

const idMarcaFiltro = ref('')
const idModeloFiltro = ref('')
const mostrarForm = ref(false)

onMounted(async () => {
  const [rMarcas, rModelos, rVehiculos, rClientes] = await Promise.all([
    axiosInstance.get('http://localhost:3000/marcas'),
    axiosInstance.get('http://localhost:3000/modelos'),
    axiosInstance.get('http://localhost:3000/vehiculos'),
    axiosInstance.get('http://localhost:3000/clientes')
  ])

  marcas.value = rMarcas.data
  modelos.value = rModelos.data
  vehiculos.value = rVehiculos.data
  clientes.value = rClientes.data
})

function onMarcaChange() {
  idModeloFiltro.value = ''
  mostrarForm.value = false
}

const modelosDeMarca = computed(() => {
  if (!idMarcaFiltro.value) {
    return []
  }

  return modelos.value.filter(
    (m) => m.idMarca === idMarcaFiltro.value
  )
})

const vehiculosFiltrados = computed(() => {
  if (!idMarcaFiltro.value) {
    return vehiculos.value
  }

  if (!idModeloFiltro.value) {
    const idsModelos = modelosDeMarca.value.map((m) => m.id)

    return vehiculos.value.filter((v) =>
      idsModelos.includes(v.idModelo)
    )
  }

  return vehiculos.value.filter(
    (v) => v.idModelo === idModeloFiltro.value
  )
})

function getNombreModelo(idModelo) {
  const modelo = modelos.value.find((m) => m.id === idModelo)

  if (modelo && modelo.modelo) {
    return modelo.modelo
  }

  return 'Desconocido'
}

function getClientesDeVehiculo(idVehiculo) {
  return clientes.value.filter((c) => {
    if (c.alquileres && Array.isArray(c.alquileres)) {
      return c.alquileres.some(
        (a) => a.idVehiculo === idVehiculo
      )
    }
    return false
  })
}

function onVehiculoGuardado(nuevoVehiculo) {
  vehiculos.value.push(nuevoVehiculo)
  mostrarForm.value = false
}
</script>

<template>
  <div>
    <h3 class="mb-4">Vehículos</h3>

    <div class="row mb-4">
      <div class="col-md-4">
        <label class="form-label">Marca</label>
        <select
          v-model="idMarcaFiltro"
          class="form-select"
          @change="onMarcaChange"
        >
          <option value="">-- Todas las marcas --</option>
          <option
            v-for="m in marcas"
            :key="m.id"
            :value="m.id"
          >
            {{ m.nombre }}
          </option>
        </select>
      </div>

      <div class="col-md-4">
        <label class="form-label">Modelo</label>
        <select
          v-model="idModeloFiltro"
          class="form-select"
          :disabled="!idMarcaFiltro"
        >
          <option value="">-- Todos los modelos --</option>
          <option
            v-for="m in modelosDeMarca"
            :key="m.id"
            :value="m.id"
          >
            {{ m.modelo }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="vehiculosFiltrados.length">
      <div
        v-for="vehiculo in vehiculosFiltrados"
        :key="vehiculo.id"
        class="card mb-3"
      >
        <div class="card-body">
          <h5 class="card-title">
            {{ getNombreModelo(vehiculo.idModelo) }}

            <span class="badge bg-primary ms-2">
              {{ vehiculo.precioDia }}€/día
            </span>
          </h5>

          <div>
            <span class="fw-semibold">
              Clientes que lo han alquilado:
            </span>

            <ul class="mb-0 mt-1">
              <li
                v-for="cliente in getClientesDeVehiculo(vehiculo.id)"
                :key="cliente.id"
              >
                {{ cliente.nombre }}
              </li>

              <li
                v-if="!getClientesDeVehiculo(vehiculo.id).length"
                class="text-muted"
              >
                Ninguno todavía
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-muted mb-4">
      No hay vehículos que mostrar.
    </div>

    <button
      class="btn btn-primary mb-4"
      @click="mostrarForm = !mostrarForm"
    >
      <i class="bi bi-plus-circle me-1"></i>
      {{ mostrarForm ? 'Cancelar' : 'Nuevo Vehículo' }}
    </button>

    <div v-if="mostrarForm">
      <NuevoVehiculoForm
        :marcas="marcas"
        :modelos="modelos"
        :idMarcaInicial="idMarcaFiltro"
        :idModeloInicial="idModeloFiltro"
        @vehiculoGuardado="onVehiculoGuardado"
      />
    </div>
  </div>
</template>

<style scoped>
</style>