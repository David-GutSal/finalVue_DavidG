<script setup>
import { ref, computed, onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'

const clientes = ref([])
const marcas = ref([])
const modelos = ref([])
const vehiculos = ref([])

const clienteSeleccionado = ref(null)
const nombre = ref('')
const dni = ref('')
const error = ref('')
const mensaje = ref('')

onMounted(async () => {
  const [rClientes, rMarcas, rModelos, rVehiculos] = await Promise.all([
    axiosInstance.get('http://localhost:3000/clientes'),
    axiosInstance.get('http://localhost:3000/marcas'),
    axiosInstance.get('http://localhost:3000/modelos'),
    axiosInstance.get('http://localhost:3000/vehiculos')
  ])

  clientes.value = rClientes.data
  marcas.value = rMarcas.data
  modelos.value = rModelos.data
  vehiculos.value = rVehiculos.data
})

function getVehiculo(idVehiculo) {
  return vehiculos.value.find((v) => v.id === idVehiculo)
}

function getModelo(idModelo) {
  return modelos.value.find((m) => m.id === idModelo)
}

function getMarca(idMarca) {
  return marcas.value.find((m) => m.id === idMarca)
}

function getPrecioFinal(alquiler) {
  const vehiculo = getVehiculo(alquiler.idVehiculo)

  if (!vehiculo) {
    return 0
  }

  const modelo = getModelo(vehiculo.idModelo)

  let extra = 0
  if (modelo && modelo.extraPorModelo) {
    extra = modelo.extraPorModelo
  }

  return (vehiculo.precioDia + extra) * alquiler.numDias
}

const historialSeleccionado = computed(() => {
  if (!clienteSeleccionado.value) {
    return []
  }

  if (
    clienteSeleccionado.value.alquileres &&
    Array.isArray(clienteSeleccionado.value.alquileres)
  ) {
    return clienteSeleccionado.value.alquileres
  }

  return []
})

function seleccionar(cliente) {
  clienteSeleccionado.value = cliente
  nombre.value = cliente.nombre
  dni.value = cliente.dni
  error.value = ''
  mensaje.value = ''
}

function limpiarFormulario() {
  clienteSeleccionado.value = null
  nombre.value = ''
  dni.value = ''
  error.value = ''
}

async function alta() {
  error.value = ''

  if (!nombre.value || !dni.value) {
    error.value = 'Nombre y DNI son obligatorios.'
    return
  }

  const nuevoCliente = {
    nombre: nombre.value,
    dni: dni.value,
    alquileres: []
  }

  const response = await axiosInstance.post(
    'http://localhost:3000/clientes',
    nuevoCliente
  )

  const data = response.data
  clientes.value.push(data)
  limpiarFormulario()
}

async function modificar() {
  error.value = ''

  if (!nombre.value || !dni.value) {
    error.value = 'Nombre y DNI son obligatorios.'
    return
  }

  const actualizado = {
    ...clienteSeleccionado.value,
    nombre: nombre.value,
    dni: dni.value
  }

  const response = await axiosInstance.put(
    'http://localhost:3000/clientes/' + actualizado.id,
    actualizado
  )

  const data = response.data
  const idx = clientes.value.findIndex((c) => c.id === data.id)
  clientes.value[idx] = data
  limpiarFormulario()
}

async function eliminar() {
  error.value = ''

  await axiosInstance.delete(
    'http://localhost:3000/clientes/' + clienteSeleccionado.value.id
  )

  clientes.value = clientes.value.filter(
    (c) => c.id !== clienteSeleccionado.value.id
  )
  limpiarFormulario()
}

function getMarcaNombreDesdeAlquiler(alquiler) {
  const vehiculo = getVehiculo(alquiler.idVehiculo)
  if (!vehiculo) {
    return '—'
  }

  const modelo = getModelo(vehiculo.idModelo)
  if (!modelo) {
    return '—'
  }

  const marca = getMarca(modelo.idMarca)
  if (!marca || !marca.nombre) {
    return '—'
  }

  return marca.nombre
}

function getModeloNombreDesdeAlquiler(alquiler) {
  const vehiculo = getVehiculo(alquiler.idVehiculo)
  if (!vehiculo) {
    return '—'
  }

  const modelo = getModelo(vehiculo.idModelo)
  if (!modelo || !modelo.modelo) {
    return '—'
  }

  return modelo.modelo
}
</script>

<template>
  <div>
    <h3 class="mb-4">Clientes</h3>

    <div class="row">
      <div class="col-md-3">
        <h6 class="fw-semibold mb-2">Listado de clientes</h6>

        <ul class="list-group">
          <li
            v-for="cliente in clientes"
            :key="cliente.id"
            class="list-group-item list-group-item-action"
            :class="{ active: clienteSeleccionado && clienteSeleccionado.id === cliente.id }"
            @click="seleccionar(cliente)"
          >
            <div class="fw-semibold">
              {{ cliente.nombre }}
            </div>
            <div class="small">
              {{ cliente.dni }}
            </div>
          </li>

          <li
            v-if="!clientes.length"
            class="list-group-item text-muted"
          >
            No hay clientes registrados
          </li>
        </ul>
      </div>

      <div class="col-md-9">
        <div class="mb-4">
          <div v-if="clienteSeleccionado">
            <h6 class="fw-semibold mb-2">
              <i class="bi bi-clock-history me-1"></i>
              Historial de alquileres — {{ clienteSeleccionado.nombre }}
            </h6>

            <table class="table table-sm table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Días</th>
                  <th>Fecha inicio</th>
                  <th>Precio final</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(alquiler, i) in historialSeleccionado"
                  :key="i"
                >
                  <td>
                    {{ getMarcaNombreDesdeAlquiler(alquiler) }}
                  </td>

                  <td>
                    {{ getModeloNombreDesdeAlquiler(alquiler) }}
                  </td>

                  <td>
                    {{ alquiler.numDias }}
                  </td>

                  <td>
                    {{ alquiler.fechaInic }}
                  </td>

                  <td class="fw-semibold">
                    {{ getPrecioFinal(alquiler).toFixed(2) }}€
                  </td>
                </tr>

                <tr v-if="!historialSeleccionado.length">
                  <td
                    colspan="5"
                    class="text-center text-muted"
                  >
                    Sin alquileres registrados
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-else
            class="border rounded d-flex align-items-center justify-content-center text-muted"
          >
            <span>
              <i class="bi bi-person me-2"></i>
              Selecciona un cliente para ver su historial
            </span>
          </div>
        </div>

        <div class="card">
          <div class="card-header fw-semibold">
            {{ clienteSeleccionado ? 'Editar cliente' : 'Nuevo cliente' }}
          </div>

          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-5">
                <label class="form-label">Nombre</label>
                <input
                  v-model="nombre"
                  type="text"
                  class="form-control"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label">DNI</label>
                <input
                  v-model="dni"
                  type="text"
                  class="form-control"
                />
              </div>
            </div>

            <div
              v-if="error"
              class="alert alert-danger py-2 mb-3"
            >
              {{ error }}
            </div>

            <div
              v-if="mensaje"
              class="alert alert-success py-2 mb-3"
            >
              {{ mensaje }}
            </div>

            <div class="d-flex gap-2">
              <button
                class="btn btn-primary"
                :disabled="clienteSeleccionado !== null"
                @click="alta"
              >
                <i class="bi bi-person-plus me-1"></i>
                Alta
              </button>

              <button
                class="btn btn-warning"
                :disabled="clienteSeleccionado === null"
                @click="modificar"
              >
                <i class="bi bi-pencil me-1"></i>
                Modificar
              </button>

              <button
                class="btn btn-danger"
                :disabled="clienteSeleccionado === null"
                @click="eliminar"
              >
                <i class="bi bi-trash me-1"></i>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>