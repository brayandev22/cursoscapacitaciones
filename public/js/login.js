
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector(".form-login");

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Evita el envío del formulario

        const emailInput = loginForm.elements['userEmail'];
        const passwordInput = loginForm.elements['userPassword'];
        const errorAlert = loginForm.querySelector(".alerta-error");
        const successAlert = loginForm.querySelector(".alerta-exito");
        const correo = loginForm.querySelector(".correo");
        const contraseña = loginForm.querySelector(".contraseña")

        let valid = true;
        let errorMessage = "Todos los campos son obligatorios";

        // Reset de mensajes y clases de error
        errorAlert.style.display = "none";
        successAlert.style.display = "none";
        correo.classList.remove("error");
        contraseña.classList.remove("error");

        // Validación del email
        if (!emailInput.value) {
            correo.classList.add("error");
            valid = false;
        } else if (!emailInput.value.endsWith("@unfv.edu.pe")) {
            correo.classList.add("error");
            valid = false;
            errorMessage = "El correo debe terminar en @unfv.edu.pe";
        }

        // Validación de la contraseña
        if (!passwordInput.value) {
            contraseña.classList.add("error");
            valid = false;
            errorMessage = "contraseña incorrecta";
        }

        if (valid) {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailInput.value,
                        password: passwordInput.value
                    })
                });

                if (response.ok) {
                    // Aquí es donde obtienes los datos del servidor
                    const data = await response.json();
                    console.log('Datos recibidos:', data);
                    // Almacenar los datos del usuario en localStorage
                    localStorage.setItem('userData', JSON.stringify(data.user));
            

                    // Redirigir a la página de menú
                    window.location.href = '/html/menu.html';
                } else {
                    const result = await response.text();
                    throw new Error(result);
                }
            } catch (error) {
                errorAlert.textContent = error.message || "Error al iniciar sesión";
                errorAlert.classList.add("alertaError");
                errorAlert.style.display = "block";
                successAlert.style.display = "none";
            }
        } else {
            errorAlert.textContent = errorMessage;
            errorAlert.classList.add("alertaError");
            errorAlert.style.display = "block";
            successAlert.style.display = "none";
        }
    });
});

