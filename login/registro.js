// Función para validar el formato del email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar la contraseña
function validarContrasena(contrasena) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return regex.test(contrasena);
}

// Manejar el envío del formulario de registro
document.getElementById('formulario-registro').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;

    // Validaciones
    if (!nombre || !apellidos || !telefono || !email || !contrasena || !confirmarContrasena) {
        alert('Por favor complete todos los campos');
        return;
    }

    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    if (!validarEmail(email)) {
        alert('Por favor, ingresa un email válido.');
        return;
    }

    if (!validarContrasena(contrasena)) {
        alert('La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.');
        return;
    }

    // Verificar si el usuario ya existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios.some(user => user.email === email)) {
        alert('El email ya está registrado.');
        return;
    }

    // Crear objeto usuario
    const nuevoUsuario = {
        nombre,
        apellidos,
        telefono,
        email,
        contrasena
    };

    // Guardar usuario (SOLO registro, SIN iniciar sesión)
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Feedback y redirección
    alert(`Registro exitoso ${nombre}! Ahora puedes iniciar sesión`);
    window.location.href = 'login.html'; // Redirigir a login
});