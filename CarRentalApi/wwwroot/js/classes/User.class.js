function User(name, username, pass){
    this.id = Date.now() + Math.random().toString(36).substring(3, 9);
    this.name = name;
    this.username = username;
    this.pass = pass; // la contraseña está encriptada al hacer el registro
    this.lastSession = new Date(); // guardar ultima sesion del usuario en la app
}