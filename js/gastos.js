// Variables para los selectores
const formulario = document.getElementById('Agregar-gastos');
const listado = document.querySelector('#gastos ul');

// Creación de eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarpresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

// Clase principal
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        this.restante = this.presupuesto - this.gastos.reduce((total, gasto) => total + gasto.valor, 0);
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

// Clase que maneja la interfaz de usuario
class UI {
    insertarPresupuesto(cantidad) {
        document.querySelector('#total').textContent = cantidad.presupuesto;
        document.querySelector('#restante').textContent = cantidad.restante;
    }

    imprimirAlerta(mensaje, tipo) {
        const divmensaje = document.createElement('div');
        divmensaje.classList.add('text-center', 'alert', tipo === 'error' ? 'alert-danger' : 'alert-primary');
        divmensaje.textContent = mensaje;

        document.querySelector('.contenido-gastos').insertBefore(divmensaje, formulario);

        setTimeout(() => {
            divmensaje.remove();
        }, 3000);
    }

    agregarGastoListado(gasto) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.dataset.id = gasto.id;
        li.innerHTML = `
            ${gasto.nombre} <span style="color: black" class="badge badge-primary badge-pill">$${gasto.valor}</span>
            <button class="btn btn-danger btn-sm borrar-gasto">Borrar</button>
        `;
        listado.appendChild(li);
        this.actualizarRestante();
    }
    
    actualizarRestante() {
        document.querySelector('#restante').textContent = presupuesto.restante;
    }

    limpiarListado() {
        while (listado.firstChild) {
            listado.removeChild(listado.firstChild);
        }
    }

    actualizarGastos() {
        this.limpiarListado();
        presupuesto.gastos.forEach(gasto => this.agregarGastoListado(gasto));
    }
}

// Crear un objeto de la clase UI
const ui = new UI();
let presupuesto;

function preguntarpresupuesto() {
    const valorpre = prompt('Ingresar el valor del presupuesto');

    if (valorpre === '' || valorpre === null || isNaN(valorpre) || Number(valorpre) <= 0) {
        window.location.reload();
    } else {
        presupuesto = new Presupuesto(valorpre);
        ui.insertarPresupuesto(presupuesto);
    }
}

function agregarGasto(e) {
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const valor = Number(document.querySelector('#cantidad').value);

    if (nombre === '' || valor === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    } else if (valor <= 0 || isNaN(valor)) {
        ui.imprimirAlerta('El valor no es correcto', 'error');
    } else if (valor > presupuesto.restante){
        ui.imprimirAlerta('Presupuesto insuficiente')
    }
    else {
        const gasto = { nombre, valor, id: Date.now() };
        presupuesto.nuevoGasto(gasto);
        ui.imprimirAlerta('Gasto agregado correctamente', 'success');
        ui.insertarPresupuesto(presupuesto);
        ui.agregarGastoListado(gasto); 
        formulario.reset();
    }
}


listado.addEventListener('click', e => {
    if (e.target.classList.contains('borrar-gasto')) {
        const id = parseInt(e.target.parentElement.dataset.id);
        presupuesto.eliminarGasto(id);
        ui.insertarPresupuesto(presupuesto);
        ui.actualizarGastos();
    }
});
