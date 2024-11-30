const clientList = document.getElementById('client-list');
const clientModal = document.getElementById('clientModal');

document.addEventListener('DOMContentLoaded', async function(){
    //si no hay usuario con la sesion iniciada, redirigir al login
    let user = getUsername();
    if (!user){
        window.location.href = 'login.html';
    }

    // obtener datos de los clientes de sessionStorage, o de la api si no existen aun
    let cli = sessionStorage.getItem('CLIENTS_DATA');
    if (!cli) {
        await getClients();
    } else {
        CLIENTS_DATA = JSON.parse(cli);
    }

    showClientList();
})

// modificar comportamiento del modal segun se esté creando o editando
if (clientModal) {
    clientModal.addEventListener('show.bs.modal', event => {
        // Obtener el botón relacionado al modal
        const button = event.relatedTarget;
        // si se le pasa un atributo data-bs-client es modo edicion
        const clientModalFooter = document.getElementById('clientModalFooter')
        const editClient = JSON.parse(button.getAttribute('data-bs-client'));

        if (editClient) {
            // mostrar atributos del cliente a editar
            document.getElementById('nameTxt').value = editClient.name;
            document.getElementById('emailTxt').value = editClient.email;
            document.getElementById('phoneTxt').value = editClient.phone;
           

            clientModalFooter.innerHTML = `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="clientModalBtn" onclick="editClient(${editClient.id})">Editar</button>
            `;
        } else {
            document.getElementById('nameTxt').value = '';
            document.getElementById('emailTxt').value = '';
            document.getElementById('phoneTxt').value = '';
            clientModalFooter.innerHTML = `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="clientModalBtn" onclick="createClient()">Crear</button>
            `;
        }

    });
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
        CLIENTS_DATA = clients; 
        sessionStorage.setItem('CLIENTS_DATA', JSON.stringify(clients));
    } catch (error) {
        console.error('Error:', error);
    }
}*/

function showClientList(){
    let buffer = [];
    if (CLIENTS_DATA.length > 0){
        buffer.push(`
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `);


        for (cli of CLIENTS_DATA){
            buffer.push(
                `
                <tr>
                    <th scope="row">${cli.id}</th>
                    <td>${cli.name}</td>
                    <td>${cli.email}</td>
                    <td>${cli.phone}</td>
                    <td>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#clientModal" data-bs-client='${JSON.stringify(cli)}'>Editar</button>
                        <button type="button" class="btn btn-danger" onclick="deleteClient(${cli.id})">Eliminar</button>
                    </td>
                </tr>
                `
            );
        }
        clientList.innerHTML = buffer.join('\n');
    } else {
        clientList.innerHTML = '<h5>No existen clientes<h5>'
    }

}

async function createClient(){
    const name = document.getElementById('nameTxt').value;
    const email = document.getElementById('emailTxt').value;
    const phone = document.getElementById('phoneTxt').value;

    if (validateClient()){
        const cli = JSON.stringify({
            name: name,
            email: email,
            phone: phone
        });
        console.log("en create client", cli)
        try {
            const response = await fetch('http://localhost:5175/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: cli, // Convertimos el objeto a JSON
                credentials: 'include'
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // Captura el cuerpo de la respuesta de error
                console.log('Errores de validación:', errorData); // Muestra los errores de validación en consola
                throw new Error('Error al crear el cliente');
            }
    
            const data = await response.json();
            document.getElementById('message').textContent = 'Cliente creado con éxito';
            await getClients();
        } catch (error) {
           console.log(`Error: ${error.message}`);
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
        modal.hide();
        showClientList();
    }
}

async function editClient(id){
    const name = document.getElementById('nameTxt').value;
    const email = document.getElementById('emailTxt').value;
    const phone = document.getElementById('phoneTxt').value;
    const cli = {
        id: id,
        name: name,
        email: email,
        phone: phone
    }

    if (validateClient()){
        try {
            const response = await fetch(`http://localhost:5175/api/clients/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(cli), // Convertimos el objeto a JSON
                credentials: 'include'
            });
            if (response.status === 204) {
                console.log('El cliente fue actualizado exitosamente.');
                document.getElementById('message').textContent = 'Cliente editado con éxito';
                await getClients();
            } else {
                console.error('Error al actualizar el cliente. Código de estado:', response.status);
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
        modal.hide();
        showClientList();
    }
}

async function deleteClient(id){
    try {
        const response = await fetch(`http://localhost:5175/api/clients/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials: 'include'
        });

        if (response.status === 204) {
            console.log('El cliente fue borrado exitosamente.');
            await getClients();
        } else {
            console.error('Error al actualizar el cliente. Código de estado:', response.status);
        }

    } catch (error) {
        document.getElementById('error').textContent = `Error: ${error.message}`;
    }
    showClientList();
}

function validateClient(){
    let valid = true;
    const name = document.getElementById('nameTxt').value;
    const email = document.getElementById('emailTxt').value;
    const phone = document.getElementById('phoneTxt').value;
    // mensajes de error 
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');

    if (!valName(name)){
        nameError.style.display = 'block';
        valid = false;
    } else {
        nameError.style.display = 'none';
    }
    if (!valEmail(email)){
        emailError.style.display = 'block';
        valid = false;
    } else {
        emailError.style.display = 'none';
    }
    if (!valPhone(phone)){
        document.getElementById('phone-error').style.display = 'block';
        valid = false;
    } else {
        phoneError.style.display = 'none';
    }
    return valid;
}