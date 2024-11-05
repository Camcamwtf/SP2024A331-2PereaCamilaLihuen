class Vehiculo {
    constructor(id, modelo, anoFabricacion, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFabricacion = anoFabricacion;
        this.velMax = velMax;
    }

    toString() {
        return `ID: ${this.id}, Modelo: ${this.modelo}, Año de Fabricación: ${this.anoFabricacion}, Velocidad Máxima: ${this.velMax}`;
    }
}

class Auto extends Vehiculo {
    constructor(id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos) {
        super(id, modelo, anoFabricacion, velMax);
        this.cantidadPuertas = cantidadPuertas;
        this.asientos = asientos;
    }

    toString() {
        return super.toString() + `, Cantidad de Puertas: ${this.cantidadPuertas}, Asientos: ${this.asientos}`;
    }
}

class Camion extends Vehiculo {
    constructor(id, modelo, anoFabricacion, velMax, carga, autonomia) {
        super(id, modelo, anoFabricacion, velMax);
        this.carga = carga;
        this.autonomia = autonomia;
    }

    toString() {
        return super.toString() + `, Carga: ${this.carga}, Autonomía: ${this.autonomia}`;
    }
}

class VehiculoComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    async fetchVehiculos() {
        try {
            const response = await fetch('https://examenesutn.vercel.app/api/VehiculoAutoCamion');
            const data = await response.json();
            return data.map(item => {
                return item.carga ? new Camion(item.id, item.modelo, item.anoFabricacion, item.velMax, item.carga, item.autonomia) : 
                new Auto(item.id, item.modelo, item.anoFabricacion, item.velMax, item.cantidadPuertas, item.asientos);
            });
        } catch (error) {
            console.error('Error fetching vehiculos:', error);
        }
    }

    async render() {
        const vehiculos = await this.fetchVehiculos();
        const vehiculoList = vehiculos.map(vehiculo => {
            return `<li>${vehiculo.toString()}</li>`;
        }).join('');
        
        this.shadowRoot.innerHTML = `
            <ul>
                ${vehiculoList}
            </ul>
        `;
    }
}

customElements.define('vehiculo-component', VehiculoComponent);
