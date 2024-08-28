//refister
// Obtener el formulario y los campos de entrada
const formRegister = document.querySelector('.form-register');
const fullNameInput = formRegister.elements['fullname'];
const userNameInput = formRegister.elements['userName'];
const emailInput = formRegister.elements['userEmail'];
const passwordInput = formRegister.elements['userPassword'];
const estadoSelect = formRegister.elements['estado'];
const codigoDocenteContainer = document.getElementById('codigoDocenteContainer');
const codigoDocenteInput = formRegister.elements['codigoDocente'];
const alertaError = formRegister.querySelector(".alerta-error");
const alertaExito = formRegister.querySelector(".alerta-exito");
const nombre = formRegister.querySelector(".nombre");
const usuario= formRegister.querySelector(".usuario")
const correo= formRegister.querySelector(".correo");
const contraseña= formRegister.querySelector(".contraseña");
const estade= formRegister.querySelector(".estado");

// Mostrar el campo de código docente si se selecciona "Docente"
estadoSelect.addEventListener('change', function() {
    if (estadoSelect.value === 'docente') {
        codigoDocenteContainer.style.display = 'block';
    } else {
        codigoDocenteContainer.style.display = 'none';
        codigoDocenteInput.value = ''; // Limpiar el campo si se oculta
    }
});

// Función para validar el nombre completo
function isValidFullName(fullName) {
  const fullNameRegex = /^(?!.*([aeiouAEIOU])\1{1})[a-zA-Z\s]{1,30}$/;
  return fullNameRegex.test(fullName);
}

// Función para validar el nombre de usuario
function isValidUserName(userName) {
  const userNameRegex = /^(?!.*([a-zA-Z])\1{1})[a-zA-Z][a-zA-Z0-9]{0,9}$/;
  return userNameRegex.test(userName);
}

// Función para validar el correo electrónico
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@unfv\.edu\.pe$/;
  return emailRegex.test(email);
}

// Función para validar la contraseña
function isValidPassword(password) {
  return password.length >= 8;
}

// Función para validar el código docente
function isValidDocenteCode(code) {
  return code === "docente123";
}

// Función para mostrar mensajes de error
function showError(message) {
  alertaError.textContent = message;
  alertaError.classList.add("alertaError");
  alertaError.classList.remove("alertaExito");
  alertaError.style.display = 'block';
  alertaExito.style.display = 'none';
}

// Función para mostrar mensajes de éxito
function showSuccess(message) {
  alertaExito.textContent = message;
  alertaExito.classList.add("alertaExito");
  alertaExito.classList.remove("alertaError");
  alertaExito.style.display = 'block';
  alertaError.style.display = 'none';
}

// Evento de envío del formulario
formRegister.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evitar el envío del formulario por defecto

nombre.classList.remove("error");
correo.classList.remove("error");
contraseña.classList.remove("error");
usuario.classList.remove("error");
estade.classList.remove("error");


  // Obtener los valores de los campos
  const fullName = fullNameInput.value.trim();
  const userName = userNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const estado = estadoSelect.value;
  const codigoDocente = codigoDocenteInput ? codigoDocenteInput.value.trim() : "";

  // Validar campos
  if (!fullName || !userName || !email || !password || !estado) {
    showError('Todos los campos son obligatorios.');
    return;
  }

  if (!isValidFullName(fullName)) {
    nombre.classList.add("error");
    showError('El nombre debe contener solo letras, no más de dos vocales repetidas seguidas, y tener un máximo de 30 caracteres.');
    return;
  }

  if (!isValidUserName(userName)) {
    usuario.classList.add("error");
    showError('El usuario debe comenzar con una letra, no puede tener letras repetidas consecutivas y debe tener un máximo de 10 caracteres.');
    return;
  }

  if (!isValidEmail(email)) {
    correo.classList.add("error");
    showError('El correo debe ser del dominio @unfv.edu.pe.');
    return;
  }

  if (!isValidPassword(password)) {
    contraseña.classList.add("error");
    showError('La contraseña debe tener al menos 8 caracteres.');
    return;
  }

  if (estado === 'docente') {
    if (!codigoDocente) {
      showError('El campo código está vacío.');
      return;
    }
    
    if (!isValidDocenteCode(codigoDocente)) {
      showError('El código de docente es incorrecto.');
      return;
    }
  }

  // Si todo es válido, mostrar mensaje de éxito
  showSuccess('Te registraste correctamente.');

  // Enviar los datos al servidor
  try {
    const response = await fetch('/api/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombresCompletos: fullName,
        usuario: userName,
        email: email,
        password: password,
        estado: estado,
        codigoDocente: estado === 'Docente' ? codigoDocente : null
      })
    });

    if (response.ok) {
      showSuccess('Usuario registrado exitosamente.');
    } else {
      showError('Error al registrar el usuario.');
    }
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    showError('Error al enviar los datos.');
  }
  
});

















