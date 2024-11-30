const rentModal = document.getElementById('rentModal');
// para almacenar el vehiculo que se selecciona para alquilar
let selectedVehicle; 
let selectedClient;
let timer; // temporizador para el keyup del modal
const inputClient = document.getElementById('client-name');

document.addEventListener('DOMContentLoaded', async function() {
    // obtener datos de los vehiculos de sessionStorage, o de la api si no existen aun
    let ve = sessionStorage.getItem('VEHICLES_DATA');
    if (!ve) {
        await getVehicles();
    } else {
        VEHICLES_DATA = JSON.parse(ve);
    }
    // obtener datos de los clientes de sessionStorage, o de la api si no existen aun
    let cli = sessionStorage.getItem('CLIENTS_DATA');
    if (!cli) {
        await getClients();
    } else {
        CLIENTS_DATA = JSON.parse(cli);
    }
    //si no hay usuario con la sesion iniciada, redirigir al login
    let user = getUsername();
    if (!user){
        window.location.href = 'login.html';
    }

    // carga la lista completa de vehiculos, sin filtros
   showVehicles(VEHICLES_DATA);
   // obtener detalles de los vehiculos para los filtros
   getMarks();
   getModels();
   getColors();
   getYears();
});

// manipular el contenido del modal de alquiler
if (rentModal) {
    // fijar fecha minima ( hoy) para inputs de fecha
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const today = new Date().toISOString().split('T')[0]; 
    startDate.setAttribute('min', today);
    endDate.setAttribute('min', today);
    
    rentModal.addEventListener('show.bs.modal', event => {
        // Obtener el botón relacionado al modal
        const button = event.relatedTarget;
        // Extraer id del vehículo del atributo data-bs-vehicle y hallar el vehiculo
        let idVehicle = button.getAttribute('data-bs-vehicle');
        selectedVehicle = VEHICLES_DATA.find(ve => ve.numberPlate === idVehicle);
        console.log('selected', selectedVehicle)
        // Cambiar el contenido del modal con la información del vehículo
        const vehicleInfo = document.getElementById('vehicle-info')
        vehicleInfo.innerHTML = `
            <p>${selectedVehicle.mark} ${selectedVehicle.model} ${selectedVehicle.year}</p>
            <p>Patente ${selectedVehicle.numberPlate} - Color ${selectedVehicle.color}</p>
        `;
    });
    inputClient.addEventListener('keyup', function(){
        clearTimeout(timer);  // Limpia el temporizador anterior
        timer = setTimeout(function() {
             // obtener el cliente del nombre pasado
            let client = CLIENTS_DATA.find(cli => cli.name.startsWith(inputClient.value));
            const clientMsg = document.getElementById('client-msg');
            selectedClient = client;
            // si no encuentra el cliente, se muestra mensaje de error
            if (!client){
                clientMsg.innerHTML = '<span>El cliente no existe. <a href="clients.html">Crear nuevo cliente</a><span>'
                return;
            } else {
                clientMsg.innerHTML = `<span>Cliente:${client.name}<span>`
            }
            clientMsg.style.display = 'block';
        }, 500);  // Tiempo de espera de 500 ms
    })
    
}

function showVehicles(vehicleList = VEHICLES_DATA){
    let buffer = [];
    if (vehicleList.length > 0){
        for (ve of vehicleList){
            buffer.push(`
                <div class="card mb-3" style="max-width: 600px;">
                    <div class="row g-0">
                        <div class="col-md-6 d-flex align-items-center">
                            <img src=${ve.image} class="img-fluid rounded-start" alt=${ve.model}>
                        </div>
                        <div class="col-md-6">
                            <div class="card-body">
                                <h5 class="card-title">${ve.mark} ${ve.model} ${ve.year}</h5>
                                <ul>
                                    <li class="card-text">Costo por día: ${ve.costPerDay} US$</li>
                                    <li class="card-text">Color: ${ve.color}</li>
                                    <li class="card-text">Número de asientos: ${ve.seatsNum}</li>
                                </ul>
                                ${
                                    ve.available ? (
                                        `<span class="badge text-bg-success">Disponible</span>
                                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#rentModal" data-bs-vehicle='${ve.numberPlate}'>Alquilar</button>
                                        `
                                    ) : (
                                        `<span class="badge text-bg-danger">No disponible</span>
                                        `
                                    )
                                }
                            </div>   
                        </div>
                    </div>
                </div> 
            `);
    
        }
        document.getElementById('product-list').innerHTML = buffer.join('\n');
    } else {
        document.getElementById('product-list').innerHTML = '<h5>No se encontraron vehículos<h5>'
    }

}
/*
// obtener vehiculos de la api
async function getVehicles() {
    try {
        const response = await fetch("http://localhost:5175/api/vehicles", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Error al obtener los vehículos');
        }

        const VehicleType = {
            1: "Auto",
            2: "Moto",
            3: "Bici"
        };

        VEHICLES_DATA = await response.json();
        sessionStorage.setItem('VEHICLES_DATA', JSON.stringify(VEHICLES_DATA));
        // Convertir los valores numéricos de 'type' a string
        VEHICLES_DATA = VEHICLES_DATA.map(vehicle => ({
            ...vehicle,
            type: VehicleType[vehicle.type] || "Unknown" // Convertir a string
        }));
    } catch (error) {
        console.error('Error:', error);
    }
    
}*/


// funcion para filtrar el rango de precios
function isInRange(x, range) {
    return (range[0] < x) && (x <= range[1]);
}

function filterVehicles(e){
    e.preventDefault();

    const type = document.getElementById('type-filter').value;
    const mark = document.getElementById('mark-filter').value;
    const model = document.getElementById('model-filter').value;
    const year = document.getElementById('year-filter').value;
    const price = document.getElementById('price-filter').value;
    const color = document.getElementById('color-filter').value;
    const seats = Number(document.getElementById('seats-filter').value);
    const available = Boolean(document.getElementById('available-filter').value);
    
    // determinar el rango de precio para filtrar
    const priceRange = [0, 500];
    switch(price) {
        case '$':
            priceRange[0] = 0;
            priceRange[1] = 50;
            break;
        case '$$':
            priceRange[0] = 50;
            priceRange[1] = 100;
            break;
        case '$$$':
            priceRange[0] = 100;
            priceRange[1] = 500;
            break;
    }

    const filteredVehicles = VEHICLES_DATA.filter((vehicle) => {
        return (
          (type === "any" || vehicle.type === type) &&
          (mark === "any" || vehicle.mark === mark) &&
          (model === "any" || vehicle.model === model) &&
          (isInRange(vehicle.costPerDay, priceRange)) &&
          (year === "any" || String(vehicle.year) === year) &&
          (color === "any" || vehicle.color === color) &&
          (!seats || vehicle.seatsNum === seats) &&
          (available === "any" || vehicle.available == available)
        );
      });
    console.log("filtrados", filteredVehicles);
    showVehicles(filteredVehicles);
}

// mapear vehiculos y obtener atributos, para el form de filtros
// logica para filtrar https://www.tutorjoes.in/JS_tutorial/ecommerce_product_filter_in_javascript
function getMarks(){
    const allMarks = VEHICLES_DATA.map((ve) => ve.mark);
    const markList = [
        ...allMarks.filter((ve, index) => { 
            return allMarks.indexOf(ve) === index;
        })
    ]

    const markFilter = document.getElementById('mark-filter');
    const buffer = [];
    buffer.push('<option value="any" selected>Cualquiera</option>')
    for (mark of markList){
        buffer.push(`<option value=${mark}>${mark}</option>`);
    }
    markFilter.innerHTML = buffer.join('\n');
}

function getModels(){
    const allModels = VEHICLES_DATA.map((ve) => ve.model);
    const modelList = [
        ...allModels.filter((ve, index) => { 
            return allModels.indexOf(ve) === index;
        })
    ]
    const modelFilter = document.getElementById('model-filter');
    const buffer = [];
    buffer.push('<option value="any" selected>Cualquiera</option>')
    for (model of modelList){
        console.log(model);
        buffer.push(`<option value='${model}'>${model}</option>`);
    }
    modelFilter.innerHTML = buffer.join('\n');
}

function getColors(){
    const allColors = VEHICLES_DATA.map((ve) => ve.color);
    const colorList = [
        ...allColors.filter((ve, index) => { 
            return allColors.indexOf(ve) === index;
        })
    ]
    const colorFilter = document.getElementById('color-filter');
    const buffer = [];
    buffer.push('<option value="any" selected>Cualquiera</option>')
    for (color of colorList){
        buffer.push(`<option value='${color}'>${color}</option>`);
    }

    colorFilter.innerHTML = buffer.join('\n');
}

function getYears(){
    const allYears = VEHICLES_DATA.map((ve) => ve.year);
    const yearList = [
        ...allYears.filter((ve, index) => { 
            return allYears.indexOf(ve) === index;
        }).sort()
    ]
    const yearFilter = document.getElementById('year-filter');
    const buffer = [];
    buffer.push('<option value="any" selected>Cualquiera</option>')
    for (year of yearList){
        buffer.push(`<option value=${year}>${year}</option>`);
    }

    yearFilter.innerHTML = buffer.join('\n');
}

function getTotalCost(){
    const inputStartDate = new Date(document.getElementById('start-date').value);
    const inputEndDate = new Date(document.getElementById('end-date').value);
    const total =  document.getElementById('total-cost')
    total.innerText = `Total: ${selectedVehicle.costPerDay * Math.round((inputEndDate.getTime() - inputStartDate.getTime()) / (1000 * 3600 * 24))} US$`;
    total.style.display = 'block';
}


async function rentVehicle(){
    // obtener datos del modal de alquiler 
    const inputStartDate = document.getElementById('start-date').value;
    const inputEndDate = document.getElementById('end-date').value;

    // crear el objeto alquiler y enviar a la api
    const rent = { vehicleId: selectedVehicle.id, 
                   clientId: selectedClient.id, 
                   startDate: inputStartDate,
                   returnDate: inputEndDate,
                   returned: false
    };

    try {
        const response = await fetch("http://localhost:5175/api/rents",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rent),
                credentials: 'include'
            })
        if (!response.ok) {
            throw new Error('Error al crear el alquiler');
        }
        console.log('ALQUILER EXITOSO');
        await getVehicles();

    } catch (error) {
        document.getElementById('error').textContent = `Error: ${error.message}`;
    }
    
    showVehicles(VEHICLES_DATA);
}

/*
async function getClients() {
    // obtener datos de clientes
    try {
        const response = await fetch("http://localhost:5175/api/clients", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Error al obtener los clientes');
        }
        const clients = await response.json();
        window.CLIENTS_DATA = clients;
    } catch (error) {
        console.error('Error:', error);
    }
}*/