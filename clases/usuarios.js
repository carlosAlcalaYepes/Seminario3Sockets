//clase usuarios que gestiona las operaciones que se realizan sobre la lista de usuarios conectados
class Usuarios {
    constructor() {
        this.usuarios = [];
    }
    addUsuario(id, name) {
        let usuario = { id, name };
        this.usuarios.push(usuario);
    }
    listUsuarios() {
        let nameUser = this.usuarios.map((usuario) => usuario.name);
        return nameUser;
    }
    getName(id) {
        return this.usuarios.filter((usuario) => usuario.id === id)[0];
    }
    getID(name) {
        return this.usuarios.filter((usuario) => usuario.name === name)[0]
    }
    removeUsuario(id) {
        let usuario = this.getName(id);
        if (usuario) {
            this.usuarios = this.usuarios.filter((usuario) => usuario.id != id);
        }
        return usuario;
    }
}
module.exports.Usuarios = Usuarios;