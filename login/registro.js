// Función para validar el formato del email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar emails
    return regex.test(email); // Retorna true si el email es válido, false si no lo es
}

// Función para validar la contraseña
function validarContrasena(contrasena) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/; // Expresión regular para validar contraseñas
    return regex.test(contrasena); // Retorna true si la contraseña es válida, false si no lo es
}

// Manejar el envío del formulario de registro
document.getElementById('formulario-registro').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que el formulario se envíe

    // Obtén los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;

    // Validar que las contraseñas coincidan
    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    // Validar el formato del email
    if (!validarEmail(email)) {
        alert('Por favor, ingresa un email válido.');
        return;
    }

    // Validar la contraseña
    if (!validarContrasena(contrasena)) {
        alert('La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.');
        return;
    }

    // Verificar si el usuario ya está registrado
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExistente = usuarios.find(user => user.email === email);

    if (usuarioExistente) {
        alert('El email ya está registrado.');
        return;
    }

    // Crear un objeto con los datos del usuario
    const usuario = {
        nombre,
        apellidos,
        telefono,
        email,
        contrasena
    };

    // Guardar el usuario en localStorage
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Mostrar mensaje de éxito y redirigir a la página principal (login.html)
    alert('Usuario creado con éxito. Serás redirigido a la página de inicio de sesión.');
    window.location.href = '../Index/home.html'; // Redirige al login
});