/**
 * FUNCIONES DE UTILIDAD, RELACIONADAS A DATOS Y A AUTENTICACION
 */
let VEHICLES_DATA = [];
let CLIENTS_DATA = [];
let RENTS_DATA = [];
let USERS_DATA = [];

document.addEventListener('DOMContentLoaded', async function () {
    // cuando se inicia con el rol de admin (enum 0), se muestran elementos adminOnly
    if (getRole() === 0){
        console.log("permisos de admin");
        document.querySelectorAll('.admin-only').forEach(elem => {
            elem.style.display = 'block';
        });
    }
});

// ----------------------------------------------------------------------
// AUTENTICACION
async function registerUser(e) {
    e.preventDefault();
    let username = document.getElementById('username-input').value;
    let name = document.getElementById('name-input').value;
    let password = document.getElementById('password-input').value;
    
    try {
        const response = await fetch("http://localhost:5175/api/auth/register", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, name, password })
        })
        if (!response.ok) {
            console.error('No se pudo registrar', response);
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error al registrar el usuario', error);
    }

}

async function login(e) {
    e.preventDefault();
    let username = document.getElementById('username-input').value;
    let password = document.getElementById('password-input').value;

    try {
        const response = await fetch('http://localhost:5175/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), 
        });

        if (response.ok) {
            const data = await response.json();
            // si el usuario que inicio sesion es admin (enum = 0), mostrar elementos para admins
            if (data && data.role === '0'){
                document.querySelectorAll('.admin-only').forEach(elem => {
                    elem.style.display = 'block';
                });
            }
            localStorage.setItem('username', JSON.stringify(data.username));
            localStorage.setItem('role', JSON.stringify(data.role));
            window.location.href = 'index.html'; 
        } else {
            alert(response);
        }
    } catch (error) {
        console.error('Error al hacer login', error);
    }
}

async function getCurrentUser(){
    try {
        const response = await fetch("http://localhost:5175/api/auth/me", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        if (response.ok){
            // obtener datos de la sesion (username y rol) y guardar en localstorage
            const data = await response.json(); 
            localStorage.setItem('session', data);
        } else {
            console.log('No se pudo obtener la sesión')
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
}

function getRole() {
    const role = JSON.parse(localStorage.getItem("role"));
    return role;
}

function getUsername(){
    const user = JSON.parse(localStorage.getItem("username"));
    return user;
}

async function logout() {
    try {
        const response = await fetch("http://localhost:5175/api/auth/logout", {
            method: "POST",
            credentials: "include", 
        });

        if (response.ok) {
            console.log("Logout exitoso");
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = "login.html";
        } else {
            console.error("Error al hacer logout");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


// --------------------------------------------------------------
// OTRAS FUNCIONES DE UTILIDAD

function formatDate(dateString, addHour = false){
    const date = new Date(dateString);
    // ajustar a zona horaria local
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const year = date.getFullYear();
     // si ademas se necesita la hora
    if (addHour) { //
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');    
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }
    return `${day}-${month}-${year}`;
}

function valName(name) {
    const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ' -]{1,50}$/;
    return regex.test(name);
}

function valEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function valPhone(phone) {
    const regex = /^(0[1-9][0-9]|9[0-9]{3})[0-9]{6,7}$/;
    return regex.test(phone);
}

function valId(id) {
    const regex = /^\d{7,8}$/;
    return regex.test(id);
}

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
        sessionStorage.setItem("CLIENTS_DATA", JSON.stringify(clients));
    } catch (error) {
        console.error('Error:', error);
    }
}

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
        // guardar copia para poder acceder cuando cambiemos de página
        sessionStorage.setItem('VEHICLES_DATA', JSON.stringify(VEHICLES_DATA));
        // Convertir los valores numéricos de 'type' a string
        VEHICLES_DATA = VEHICLES_DATA.map(vehicle => ({
            ...vehicle,
            type: VehicleType[vehicle.type] || "Unknown" // Convertir a string
        }));
    } catch (error) {
        console.error('Error:', error);
    }
}

