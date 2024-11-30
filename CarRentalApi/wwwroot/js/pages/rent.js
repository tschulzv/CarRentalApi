const rentList = document.getElementById('rent-list');

document.addEventListener('DOMContentLoaded', async function() {
    //si no hay usuario con la sesion iniciada, redirigir al login
    let user = getUsername();
    if (!user){
        window.location.href = 'login.html';
    }

    await getRents()
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
    console.log(RENTS_DATA);
   showRentedVehicles();
});

// obtener alquileres de la api
async function getRents(){
    try {
        const response = await fetch("http://localhost:5175/api/rents", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Error al obtener los alquileres');
        }
        RENTS_DATA = await response.json(); 
        sessionStorage.setItem("RENTS_DATA", JSON.stringify(RENTS_DATA));
    } catch (error) {
        console.error('Error:', error);
    }
}


// filtrar prestamos expirados
function filterExpired(){
    let today = new Date().toISOString().split('T')[0];
    let expired = RENTS_DATA.filter(r => r.returnDate < today && r.returned === false);
    console.log(expired);
    document.getElementById('filter-title').innerText = `Préstamos vencidos`;
    showRentedVehicles(expired);
}

// filtrar prestamos hechos entre dos fechas
function filterByDate(e){
    e.preventDefault();
    const inputStartDate = document.getElementById('input-start-date').value;
    const inputEndDate = document.getElementById('input-end-date').value;
    console.log(inputStartDate, inputEndDate);
    const filtered = RENTS_DATA.filter(r => (r.startDate >= inputStartDate && r.startDate <= inputEndDate));
    showRentedVehicles(filtered);
}


async function returnVehicle(rentId) {
    console.log("RETORNAR", rentId);
    try {
        const response = await fetch(`http://localhost:5175/api/rents/return/${rentId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
        if (!response.ok) {
            throw new Error('Error al devolver');
        } else {
            console.log("se devolvió correctamente");
            // obtener datos actualizados
            await getRents();
            await getVehicles();
            //  mostrar la tabla actualizada
            showRentedVehicles();
        }

    } catch (error) {
       console.log(`Error: ${error.message}`);
    }
}


function showRentedVehicles(rentedList = RENTS_DATA) {

    let buffer = [];
    if (rentedList.length > 0){
        console.log('mostrar tabla');
        buffer.push(`
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Patente</th>
                        <th scope="col">Marca</th>
                        <th scope="col">Modelo</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Fecha Préstamo</th>
                        <th scope="col">Fecha Devolución</th>
                        <th scope="col">Devolver</th>
                    </tr>
                </thead>
                <tbody>
        `);


        for (rent of rentedList) {
            const cliente = CLIENTS_DATA.find(c => c.id === rent.clientId);
            const vehiculo = VEHICLES_DATA.find(v => v.id === rent.vehicleId);     
                buffer.push(
                    `
                    <tr>
                        <th scope="row">${vehiculo.numberPlate}</th>
                        <td>${vehiculo.mark}</td>
                        <td>${vehiculo.model}</td>
                        <td>${cliente? cliente.name : 'N/A'}</td>
                        <td>${formatDate(rent.startDate)}</td>
                        <td>${formatDate(rent.returnDate)}</td>
                        ${rent.returned ? 
                            (
                                '<td>Devuelto</td>'
                            ) : (
                                `<td><button onclick="returnVehicle(${rent.id})" class="btn bg-blue">Devolver</button></td>`)
                        }

                    </tr>
                    `
                );
            }
            rentList.innerHTML = buffer.join('\n');
    } else {
        rentList.innerHTML = '<h5>No se encontraron préstamos<h5>'
    }

}