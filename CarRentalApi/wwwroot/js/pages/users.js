const userList = document.getElementById('user-list');
const userModal = document.getElementById('userModal');

document.addEventListener('DOMContentLoaded', async function(){
    if (getRole() !== 0) {
        window.location.href = 'index.html';
    }
    await getUsers();
    showUserList();
})

function showUserList(){
    let buffer = [];
    let otherUsers = USERS_DATA.filter(u => u.username !== 'admin');
    if (otherUsers.length > 0){
        buffer.push(`
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Nombre Completo</th>
                        <th scope="col">Última vez activo</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `);


        for (user of otherUsers){
            console.log(user);
            buffer.push(
                `
                <tr>
                    <th scope="row">${user.username}</th>
                    <td>${user.name}</td>
                    <td>${formatDate(user.lastSession, true)}</td>
                    <td>
                        <button type="button" class="btn btn-danger" onclick="deleteUser('${user.id}')">Eliminar</button>
                    </td>
                </tr>
                `
            );
        }
        userList.innerHTML = buffer.join('\n');
    } else {
        userList.innerHTML = '<h5>No existen otros usuarios<h5>'
    }

}

async function getUsers() {
    // obtener datos de clientes
    try {
        const response = await fetch("http://localhost:5175/api/users", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        const users = await response.json();
        USERS_DATA = users;
    } catch (error) {
        console.error('Error:', error);
    }
}


async function deleteUser(id) {
    try {
        const response = await fetch(`http://localhost:5175/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (response.status === 204) {
            console.log('El usuario fue borrado exitosamente.');
            await getUsers();
        } else {
            console.error('Error al actualizar el usuario. Código de estado:', response.status);
        }
    } catch (error) {
        document.getElementById('error').textContent = `Error: ${error.message}`;
    }
    showUserList();
}
