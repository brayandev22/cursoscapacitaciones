document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        document.getElementById('perfil-nombre').textContent = userData.nombresCompletos;
        document.getElementById('perfil-usuario').textContent = userData.usuario;
        document.getElementById('perfil-email').textContent = userData.email;
        document.getElementById('perfil-estado').textContent = userData.estado;
        document.getElementById('perfil-codigo').textContent = userData.codigoDocente;
    } else {
        alert("No se han encontrado datos del usuario.");
    }
});
