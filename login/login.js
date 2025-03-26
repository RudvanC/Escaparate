/**
 * login.js - Sistema de autenticación mejorado
 * Funcionalidades:
 * 1. Redirige a home.html después de login
 * 2. Permanece en la misma página al cerrar sesión
 */

// ==================== CONFIGURACIÓN ====================
const RUTA_HOME = '../Index/home.html';

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
            <a href="#" id="cerrar-sesion" style="margin-left: 10px;">
                <img src="../Imagenes/cerrar-sesion.png" alt="Cerrar sesión" style="vertical-align: middle;">
            </a>
        `;
        
        // Evento de cierre de sesión modificado
        document.getElementById('cerrar-sesion').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('usuarioActual');
            actualizarNavbar(); // Actualiza la UI sin redirección
        });
    } else if (homeLogo) {
        // Estado cuando no hay usuario logueado
        homeLogo.innerHTML = `
            <a href="../login/login.html">
                <img src="../Imagenes/iniciar-sesion.png" alt="Iniciar sesión">
            </a>
        `;
    }
}

// ==================== MANEJADORES DE EVENTOS ====================

document.addEventListener('DOMContentLoaded', function() {
    // Actualizar navbar al cargar
    actualizarNavbar();

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
                
                setTimeout(() => {
                    window.location.href = RUTA_HOME; // Redirige a home.html
                }, 800);
            } else {
                alert('Credenciales incorrectas. Por favor intente nuevamente.');
                document.getElementById('contrasena').value = '';
            }
        });
    }
});

// ==================== PROTECCIÓN DE RUTAS ====================
function verificarAutenticacion() {
    if (!JSON.parse(localStorage.getItem('usuarioActual')) && 
        !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Descomenta si necesitas protección automática
// verificarAutenticacion();