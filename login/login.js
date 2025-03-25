/**
 * login.js - Manejo de autenticación y sesión de usuario
 * Funcionalidades:
 * 1. Validación de login
 * 2. Mostrar nombre de usuario en navbar
 * 3. Cierre de sesión
 */

// ==================== FUNCIONES PRINCIPALES ====================

function iniciarSesion(email, contrasena) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    return usuarios.find(user => user.email === email && user.contrasena === contrasena);
}

function actualizarNavbar() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const homeLogo = document.querySelector('.home-logo');
    
    if (usuarioActual && homeLogo) {
        homeLogo.innerHTML = `
            <span style="color: #333; font-weight: bold;">¡Hola, ${usuarioActual.nombre}!</span>
            <a href="#" id="cerrar-sesion" style="margin-left: 10px; color: #666;">(Cerrar sesión)</a>
        `;
        
        // Agrega el evento de cierre de sesión aquí
        document.getElementById('cerrar-sesion').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('usuarioActual');
            window.location.href = 'login.html';
        });
    }
}

function configurarCerrarSesion() {
    document.getElementById('cerrar-sesion').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('usuarioActual');
        window.location.href = 'login.html';
    });
}

// ==================== MANEJADORES DE EVENTOS ====================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión al cargar la página
    if (document.querySelector('.home-logo')) {
        actualizarNavbar();
    }

    // Manejar formulario de login si existe
    const formularioLogin = document.getElementById('formulario-login');
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('usuario').value.trim();
            const contrasena = document.getElementById('contrasena').value.trim();

            if (!email || !contrasena) {
                alert('Por favor complete todos los campos');
                return;
            }

            const usuario = iniciarSesion(email, contrasena);

            if (usuario) {
                localStorage.setItem('usuarioActual', JSON.stringify(usuario));
                alert(`Bienvenido ${usuario.nombre}!`);
                
                // Pequeño retraso para mejor experiencia de usuario
                setTimeout(() => {
                    window.location.href = '../Index/.html';
                }, 800);
            } else {
                alert('Credenciales incorrectas. Por favor intente nuevamente.');
                document.getElementById('contrasena').value = '';
            }
        });
    }
});

// ==================== FUNCIONALIDAD ADICIONAL ====================

// Verificar autenticación en páginas protegidas
function verificarAutenticacion() {
    if (!JSON.parse(localStorage.getItem('usuarioActual')) && 
        !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Ejecutar verificación en páginas que lo requieran
// (Agrega esto al inicio de otros archivos JS de páginas protegidas)
// verificarAutenticacion();