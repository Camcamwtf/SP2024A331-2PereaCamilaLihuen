let vehiculos = [];
let modoActual = "";

document.addEventListener("DOMContentLoaded", () => {
    obtenerVehiculos();
});

function obtenerVehiculos() {
    fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los vehículos.");
            }
            return response.json();
        })
        .then(data => {
            vehiculos = data;
            mostrarLista();
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
}

function mostrarCamposPorTipo() {
    const tipo = document.getElementById("tipo").value;
    const camposAuto = ["cantidadPuertas", "asientos"];
    const camposCamion = ["carga", "autonomia"];

    [...camposAuto, ...camposCamion].forEach(id => {
        document.getElementById(id).style.display = "none";
        document.querySelector(`label[for="${id}"]`).style.display = "none";
    });

    if (tipo === "tipo_auto") {
        camposAuto.forEach(id => {
            document.getElementById(id).style.display = "inline-block";
            document.querySelector(`label[for="${id}"]`).style.display = "inline-block";
        });
    } else if (tipo === "tipo_camion") {
        camposCamion.forEach(id => {
            document.getElementById(id).style.display = "inline-block";
            document.querySelector(`label[for="${id}"]`).style.display = "inline-block";
        });
    }
}

function validarDatosIngresados(vehiculo) {
    const tipoVehiculo = document.getElementById("tipo").value;
    datosCorrectos = true;

    if (!vehiculo.modelo) {
        alert("El campo 'Modelo' es requerido.");
        datosCorrectos = false;
    } else if (isNaN(vehiculo.anoFabricacion)) {
        alert("El campo 'Año de Fabricación' es requerido.");
        datosCorrectos = false;
    } else if (vehiculo.anoFabricacion < 1985){
        alert("El año de fabricación del vehículo seleccionado no debe ser menor a 1985.");
        datosCorrectos = false;
    } else if (isNaN(vehiculo.velMax)) {
        alert("El campo 'Velocidad Máxima' es requerido.");
        datosCorrectos = false;
    } else if (vehiculo.velMax < 0){
        alert("La velocidad máxima del vehículo seleccionado no debe ser menor a 0.");
        datosCorrectos = false;
    } else if (tipoVehiculo === "tipo_auto" && isNaN(vehiculo.cantidadPuertas)){
        alert("Debe ingresar la cantidad de puertas del auto seleccionado.");
        datosCorrectos = false;
    } else if (tipoVehiculo === "tipo_auto" && vehiculo.cantidadPuertas < 2){
        alert("La cantidad de puertas del auto seleccionado no debe ser menor a 2.");
        datosCorrectos = false;
    } else if (tipoVehiculo === "tipo_auto" && isNaN(vehiculo.asientos)){
        alert("Debe ingresar la cantidad de asientos del auto seleccionado.");
        datosCorrectos = false;
    } else if (tipoVehiculo === "tipo_auto" && vehiculo.asientos < 2){
        alert("La cantidad de asientos del auto seleccionado no debe ser menor a 2.");
        datosCorrectos = false;
    } else if (tipoVehiculo === "tipo_camion" && isNaN(vehiculo.carga)){
        alert("Debe ingresar la cantidad de carga del camión seleccionado.");
        datosCorrectos = false;
    } else if (tipoVehiculo === "tipo_camion" && vehiculo.carga < 0){
        alert("La carga del camión seleccionado no debe ser menor a 0.");
        datosCorrectos = false;
    } else if (tipoVehiculo === "tipo_camion" && isNaN(vehiculo.autonomia)){
        alert("Debe ingresar la autonomía del auto seleccionado.");
        datosCorrectos = false;
    } else if (tipoVehiculo === "tipo_camion" && vehiculo.autonomia < 0){
        alert("La autonomía del camión seleccionado no debe ser menor a 0.");
        datosCorrectos = false;
    }

    return datosCorrectos;
}

function mostrarLista() {
    const lista = document.getElementById("lista-vehiculos");
    lista.innerHTML = "";

    vehiculos.forEach(vehiculo => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vehiculo.id}</td>
            <td>${vehiculo.modelo}</td>
            <td>${vehiculo.anoFabricacion}</td>
            <td>${vehiculo.velMax}</td>
            <td>${vehiculo.cantidadPuertas || "N/A"}</td>
            <td>${vehiculo.asientos || "N/A"}</td>
            <td>${vehiculo.carga || "N/A"}</td>
            <td>${vehiculo.autonomia || "N/A"}</td>
            <td><button onclick="modificarElemento(${vehiculo.id})">Modificar</button></td>
            <td><button onclick="eliminarElemento(${vehiculo.id})">Eliminar</button></td>
        `;
        lista.appendChild(row);
    });
}

function agregarElemento() {
    document.getElementById("formulario-lista").style.display = "none";
    document.getElementById("formulario-abm").style.display = "block";
    document.getElementById("titulo-abm").innerText = "Alta";
    document.getElementById("label-id").style.display = "none";
    document.getElementById("id").style.display = "none";

    document.getElementById("modelo").value = "";
    document.getElementById("anoFabricacion").value = "";
    document.getElementById("velMax").value = "";
    document.getElementById("tipo").value = "tipo_auto";
    document.getElementById("cantidadPuertas").value = 2;
    document.getElementById("asientos").value = 2;
    document.getElementById("carga").value = 0;
    document.getElementById("autonomia").value = 0;

    mostrarCamposPorTipo();

    modoActual = "alta";
}

function modificarElemento(id) {
    const vehiculo = vehiculos.find(v => v.id === id);

    if (vehiculo) {
        document.getElementById("formulario-lista").style.display = "none";
        document.getElementById("formulario-abm").style.display = "block";
        document.getElementById("titulo-abm").innerText = "Modificación";
        
        document.getElementById("label-id").style.display = "block";
        document.getElementById("id").style.display = "inline-block";
        document.getElementById("id").value = id;
        document.getElementById("modelo").value = vehiculo.modelo;
        document.getElementById("anoFabricacion").value = vehiculo.anoFabricacion;
        document.getElementById("velMax").value = vehiculo.velMax;
        document.getElementById("cantidadPuertas").value = vehiculo.cantidadPuertas || 2;
        document.getElementById("asientos").value = vehiculo.asientos || 2;
        document.getElementById("carga").value = vehiculo.carga || 0;
        document.getElementById("autonomia").value = vehiculo.autonomia || 0;

        mostrarCamposPorTipo();

        modoActual = "modificacion";
    }
}

function eliminarElemento(id) {
    const vehiculo = vehiculos.find(v => v.id === id);

    if (vehiculo) {
        document.getElementById("formulario-lista").style.display = "none";
        document.getElementById("formulario-abm").style.display = "block";
        document.getElementById("titulo-abm").innerText = "Eliminación";

        document.getElementById("label-id").style.display = "block";
        document.getElementById("id").style.display = "inline-block";
        document.getElementById("id").value = id;
        document.getElementById("modelo").value = vehiculo.modelo;
        document.getElementById("anoFabricacion").value = vehiculo.anoFabricacion;
        document.getElementById("velMax").value = vehiculo.velMax;
        document.getElementById("cantidadPuertas").value = vehiculo.cantidadPuertas || 2;
        document.getElementById("asientos").value = vehiculo.asientos || 2;
        document.getElementById("carga").value = vehiculo.carga || 0;
        document.getElementById("autonomia").value = vehiculo.autonomia || 0;

        mostrarCamposPorTipo();
        
        modoActual = "baja";
    }
}

function aceptarABM() {
    const id = document.getElementById("id").value;
    const modelo = document.getElementById("modelo").value;
    const anoFabricacion = document.getElementById("anoFabricacion").value;
    const velMax = document.getElementById("velMax").value;
    const cantidadPuertas = document.getElementById("cantidadPuertas").value;
    const asientos = document.getElementById("asientos").value;
    const carga = document.getElementById("carga").value;
    const autonomia = document.getElementById("autonomia").value;

    const vehiculo = {
        modelo: modelo,
        anoFabricacion: parseInt(anoFabricacion),
        velMax: parseInt(velMax),
        cantidadPuertas: cantidadPuertas ? parseInt(cantidadPuertas) : undefined,
        asientos: asientos ? parseInt(asientos) : undefined,
        carga: carga ? parseInt(carga) : undefined,
        autonomia: autonomia ? parseInt(autonomia) : undefined
    };

    if (!validarDatosIngresados(vehiculo)) {
        return;
    }

    document.getElementById("spinner").style.display = "flex";

    if (modoActual === "alta") {
        fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vehiculo)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al guardar los datos.");
            }
            return response.json();
        })
        .then(data => {
            if (data.id) {
                vehiculos.push({id: data.id, ...vehiculo});
                mostrarLista();
            }

            document.getElementById("spinner").style.display = "none";
            alert("Vehículo agregado correctamente.");
            cancelarABM();
        })
        .catch(error => {
            document.getElementById("spinner").style.display = "none";
            alert("Error al agregar el vehículo: " + error.message);
            cancelarABM();
        });
    } else if (modoActual === "modificacion") {
        fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id, ...vehiculo })
        })
        .then(response => {
            console.log("Datos a enviar:", { id: id, ...vehiculo });

            if (!response.ok) {
                throw new Error("Error al actualizar los datos.");
            }
            return response.json();
        })
        .then(data => {
            const index = vehiculos.findIndex(v => v.id === data.id);
            
            if (index !== -1) {
                vehiculos[index] = data;
            }
            document.getElementById("spinner").style.display = "none";
            alert("Vehículo actualizado correctamente.");
            mostrarLista();
            cancelarABM();
        })
        .catch(error => {
            document.getElementById("spinner").style.display = "none";
            alert("Error: No se ha podido realizar la operación. " + error.message);
            cancelarABM();
        });
    } else if (modoActual === "baja") {
        fetch("https://examenesutn.vercel.app/api/VehiculoAutoCamion", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al eliminar los datos.");
            }
            return response.json();
        })
        .then(data => {
            alert("Vehículo eliminado correctamente.");
            document.getElementById("spinner").style.display = "none";
            mostrarLista();
            cancelarABM();
        })
        .catch(error => {
            document.getElementById("spinner").style.display = "none";
            alert("Error: No se ha podido realizar la operación. " + error.message);
            cancelarABM();
        });
    }
}

function cancelarABM() {
    document.getElementById("formulario-abm").style.display = "none";
    document.getElementById("formulario-lista").style.display = "block";
}
