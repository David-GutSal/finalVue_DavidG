<script setup>
import { ref, computed, onMounted } from 'vue'
import axiosInstance from '@/plugins/axios'

const marcas = ref([])
const modelos = ref([])
const vehiculos = ref([])
const clientes = ref([])

const idMarca = ref('')
const idModelo = ref('')

const idVehiculo = ref('')
const idCliente = ref('')
const numDias = ref('')
const fechaInic = ref('')

const paso = ref(1)
const error = ref('')
const resumen = ref(null)

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

const modelosDeMarca = computed(() => {
  if (!idMarca.value) {
    return []
  }
  return modelos.value.filter((m) => m.idMarca === idMarca.value)
})

const vehiculosDelModelo = computed(() => {
  if (!idModelo.value) {
    return []
  }
  return vehiculos.value.filter((v) => v.idModelo === idModelo.value)
})

const botonBuscarHabilitado = computed(() => {
  return idMarca.value && idModelo.value
})

function getNombreMarca(id) {
  const marca = marcas.value.find((m) => m.id === id)
  if (marca && marca.nombre) {
    return marca.nombre
  }
  return ''
}

function getNombreModelo(id) {
  const modelo = modelos.value.find((m) => m.id === id)
  if (modelo && modelo.modelo) {
    return modelo.modelo
  }
  return ''
}

function getExtraModelo(id) {
  const modelo = modelos.value.find((m) => m.id === id)
  if (modelo && modelo.extraPorModelo) {
    return modelo.extraPorModelo
  }
  return 0
}

function formatFecha(dateStr) {
  const partes = dateStr.split('-')
  const y = partes[0]
  const m = partes[1]
  const d = partes[2]
  return d + '/' + m + '/' + y
}

function onMarcaChange() {
  idModelo.value = ''
  paso.value = 1
  resetFormulario()
}

function onModeloChange() {
  paso.value = 1
  resetFormulario()
}

function resetFormulario() {
  idVehiculo.value = ''
  idCliente.value = ''
  numDias.value = ''
  fechaInic.value = ''
  error.value = ''
  resumen.value = null
}

function mostrarFormulario() {
  resetFormulario()
  paso.value = 2
}

async function realizarAlquiler() {
  error.value = ''

  if (!idVehiculo.value || !idCliente.value || !numDias.value || !fechaInic.value) {
    error.value = 'Todos los campos son obligatorios.'
    return
  }

  try {
    const cliente = clientes.value.find((c) => c.id === idCliente.value)
    const vehiculo = vehiculos.value.find((v) => v.id === idVehiculo.value)
    const extra = getExtraModelo(idModelo.value)

    const nuevoAlquiler = {
      idVehiculo: idVehiculo.value,
      numDias: Number(numDias.value),
      fechaInic: formatFecha(fechaInic.value)
    }

    let alquileresActuales = []
    if (cliente && cliente.alquileres && Array.isArray(cliente.alquileres)) {
      alquileresActuales = cliente.alquileres
    }

    const clienteActualizado = {
      ...cliente,
      alquileres: [...alquileresActuales, nuevoAlquiler]
    }

    await axiosInstance.put(
      'http://localhost:3000/clientes/' + cliente.id,
      clienteActualizado
    )

    const idx = clientes.value.findIndex((c) => c.id === cliente.id)
    clientes.value[idx] = clienteActualizado

    resumen.value = {
      marca: getNombreMarca(idMarca.value),
      modelo: getNombreModelo(idModelo.value),
      nombre: cliente.nombre,
      dni: cliente.dni,
      numDias: Number(numDias.value),
      fechaInic: formatFecha(fechaInic.value),
      precioTotal: (vehiculo.precioDia + extra) * Number(numDias.value)
    }

    paso.value = 3
  } catch (e) {
    error.value = 'Error al registrar el alquiler.'
  }
}

function nuevoAlquilerReset() {
  idMarca.value = ''
  idModelo.value = ''
  paso.value = 1
  resetFormulario()
}
</script>

<template>
  <div>
    <h3 class="mb-4">Alquiler de Vehículos</h3>

    <div class="row mb-4">
      <div class="col-md-4">
        <label class="form-label">Marca</label>
        <select
          v-model="idMarca"
          class="form-select"
          @change="onMarcaChange"
        >
          <option value="">-- Selecciona una marca --</option>
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
          v-model="idModelo"
          class="form-select"
          :disabled="!idMarca"
          @change="onModeloChange"
        >
          <option value="">-- Selecciona un modelo --</option>
          <option
            v-for="m in modelosDeMarca"
            :key="m.id"
            :value="m.id"
          >
            {{ m.modelo }}
          </option>
        </select>
      </div>

      <div class="col-md-4 d-flex align-items-end">
        <button
          class="btn btn-primary"
          :disabled="!botonBuscarHabilitado"
          @click="mostrarFormulario"
        >
          <i class="bi bi-search me-1"></i>
          Buscar vehículos
        </button>
      </div>
    </div>

    <div v-if="paso === 2">
      <hr />

      <h5 class="mb-3">
        Vehículos disponibles —
        <span class="text-primary">
          {{ getNombreMarca(idMarca) }} {{ getNombreModelo(idModelo) }}
        </span>
      </h5>

      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Vehículo</label>
          <select
            v-model="idVehiculo"
            class="form-select"
            required
          >
            <option value="">-- Selecciona un vehículo --</option>
            <option
              v-for="v in vehiculosDelModelo"
              :key="v.id"
              :value="v.id"
            >
              {{ getNombreModelo(v.idModelo) }} — {{ v.precioDia }}€/día ({{ v.puertas }} puertas{{ v.sillaInfantil ? ', silla infantil' : '' }})
            </option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label">Cliente</label>
          <select
            v-model="idCliente"
            class="form-select"
            required
          >
            <option value="">-- Selecciona un cliente --</option>
            <option
              v-for="c in clientes"
              :key="c.id"
              :value="c.id"
            >
              {{ c.nombre }} — {{ c.dni }}
            </option>
          </select>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-3">
          <label class="form-label">Número de días</label>
          <input
            v-model="numDias"
            type="number"
            min="1"
            class="form-control"
            placeholder="Ej: 3"
            required
          />
        </div>

        <div class="col-md-3">
          <label class="form-label">Fecha de inicio</label>
          <input
            v-model="fechaInic"
            type="date"
            class="form-control"
            required
          />
        </div>
      </div>

      <div v-if="error" class="alert alert-danger py-2">
        {{ error }}
      </div>

      <button
        class="btn btn-success"
        @click="realizarAlquiler"
      >
        <i class="bi bi-key me-1"></i>
        Alquilar
      </button>
    </div>

    <div v-if="paso === 3 && resumen">
      <hr />

      <div class="card border-success">
        <div class="card-header bg-success text-white fw-semibold">
          <i class="bi bi-check-circle me-2"></i>
          Alquiler registrado con éxito
        </div>

        <div class="card-body">
          <table class="table table-sm mb-3">
            <tbody>
              <tr>
                <th>Marca</th>
                <td>{{ resumen.marca }}</td>
              </tr>
              <tr>
                <th>Modelo</th>
                <td>{{ resumen.modelo }}</td>
              </tr>
              <tr>
                <th>Cliente</th>
                <td>{{ resumen.nombre }}</td>
              </tr>
              <tr>
                <th>DNI</th>
                <td>{{ resumen.dni }}</td>
              </tr>
              <tr>
                <th>Días</th>
                <td>{{ resumen.numDias }}</td>
              </tr>
              <tr>
                <th>Fecha de inicio</th>
                <td>{{ resumen.fechaInic }}</td>
              </tr>
              <tr class="table-success">
                <th>Precio total</th>
                <td class="fw-bold fs-5">
                  {{ resumen.precioTotal.toFixed(2) }}€
                </td>
              </tr>
            </tbody>
          </table>

          <button
            class="btn btn-primary"
            @click="nuevoAlquilerReset"
          >
            <i class="bi bi-plus-circle me-1"></i>
            Nuevo alquiler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>