const ADMIN_EMAIL = "admin@duoc.cl";

function leerUsuarios() {
    let texto = localStorage.getItem("usuarios");
    if (!texto) return [];
    try {
        let lista = JSON.parse(texto);
        if (Array.isArray(lista)) return lista;
        return [];
    } catch (e) {
        return [];
    }
}

function guardarUsuarios(lista) {
    localStorage.setItem("usuarios", JSON.stringify(lista));
}

function guardarSesion(sesion) {
    localStorage.setItem("sesion", JSON.stringify(sesion));
}

function obtenerSesion() {
    let texto = localStorage.getItem("sesion");
    if (!texto) return null;
    try {
        return JSON.parse(texto);
    } catch (e) {
        return null;
    }
}

function cerrarSesion() {
    localStorage.removeItem("sesion");
    window.location.href = "index.html";
}

function protegerPagina(rolEsperado) {
    let sesion = obtenerSesion();
    if (!sesion) {
        window.location.href = "login.html";
        return;
    }
    if (rolEsperado && sesion.rol !== rolEsperado) {
        if (sesion.rol === "admin") window.location.href = "admin-home.html";
        else window.location.href = "cliente-home.html";
        return;
    }
    let nombreSesion = document.getElementById("nombre-sesion");
    if (nombreSesion) nombreSesion.textContent = sesion.nombre;
}

function validarLogin(event) {
    event.preventDefault();

    let correo = document.getElementById("correo").value.trim();
    let password = document.getElementById("password").value.trim();
    let errorCorreo = document.getElementById("errorCorreo");
    let errorPassword = document.getElementById("errorPassword");

    let esValido = true;
    if (errorCorreo) errorCorreo.textContent = "";
    if (errorPassword) errorPassword.textContent = "";

    const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    let dominioValido = dominiosPermitidos.some(domain => correo.endsWith(domain));

    if (!correo || correo.length > 100 || !dominioValido) {
        if (errorCorreo) errorCorreo.textContent = "Correo inválido o dominio no permitido (@duoc.cl, @profesor.duoc.cl, @gmail.com)";
        else alert("Correo inválido o dominio no permitido.");
        esValido = false;
    }

    if (!password || password.length < 4 || password.length > 10) {
        if (errorPassword) errorPassword.textContent = "La contraseña debe tener entre 4 y 10 caracteres";
        else alert("La contraseña debe tener entre 4 y 10 caracteres.");
        esValido = false;
    }

    if (!esValido) return;

    let usuarios = leerUsuarios();
    let usuario = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === correo) usuario = usuarios[i];
    }

    if (!usuario) {
        if (errorCorreo) errorCorreo.textContent = "Correo no registrado. Regístrate primero.";
        else alert("Correo no registrado. Regístrate primero.");
        return;
    }

    if (usuario.password !== password) {
        if (errorPassword) errorPassword.textContent = "Contraseña incorrecta.";
        else alert("Contraseña incorrecta.");
        return;
    }

    guardarSesion({ correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol });

    if (usuario.rol === "admin") {
        alert("¡Bienvenido Administrador!");
        window.location.href = "admin-home.html";
    } else {
        alert("¡Inicio de sesión exitoso!");
        window.location.href = "cliente-home.html";
    }
}

function validarContacto(event) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let comentario = document.getElementById("comentario").value.trim();

    if (!nombre || nombre.length > 100) {
        alert("El nombre es requerido y debe tener máximo 100 caracteres.");
        return;
    }

    const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    let dominioValido = dominiosPermitidos.some(domain => correo.endsWith(domain));

    if (correo && (correo.length > 100 || !dominioValido)) {
        alert("Correo no válido o dominio no permitido.");
        return;
    }

    if (!comentario || comentario.length > 500) {
        alert("El comentario es requerido y no debe exceder 500 caracteres.");
        return;
    }

    alert("Mensaje enviado con éxito");
}

function validarRegistroUsuario(event) {
    event.preventDefault();

    let run = document.getElementById("run").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let apellidos = document.getElementById("apellidos").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmar = document.getElementById("confirmar").value.trim();

    let errorRun = document.getElementById("errorRun");
    let errorNombre = document.getElementById("errorNombre");
    let errorApellidos = document.getElementById("errorApellidos");
    let errorCorreo = document.getElementById("errorCorreo");
    let errorPassword = document.getElementById("errorPassword");
    let errorConfirmar = document.getElementById("errorConfirmar");

    let esValido = true;
    if (errorRun) errorRun.textContent = "";
    if (errorNombre) errorNombre.textContent = "";
    if (errorApellidos) errorApellidos.textContent = "";
    if (errorCorreo) errorCorreo.textContent = "";
    if (errorPassword) errorPassword.textContent = "";
    if (errorConfirmar) errorConfirmar.textContent = "";

    let runRegex = /^[0-9]{7,8}[0-9kK]$/;
    if (!runRegex.test(run) || run.length < 7 || run.length > 9) {
        if (errorRun) errorRun.textContent = "RUN inválido. Sin puntos ni guion (Ej: 19011022K).";
        else alert("RUN inválido. Debe ingresar sin puntos ni guion (Ej: 19011022K).");
        esValido = false;
    }

    if (!nombre || nombre.length > 50) {
        if (errorNombre) errorNombre.textContent = "Nombre requerido (Máx 50 caracteres).";
        else alert("Nombre requerido (Máx 50 caracteres).");
        esValido = false;
    }

    if (!apellidos || apellidos.length > 100) {
        if (errorApellidos) errorApellidos.textContent = "Apellidos requeridos (Máx 100 caracteres).";
        else alert("Apellidos requeridos (Máx 100 caracteres).");
        esValido = false;
    }

    const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    let dominioValido = dominiosPermitidos.some(d => correo.endsWith(d));
    if (!correo || correo.length > 100 || !dominioValido) {
        if (errorCorreo) errorCorreo.textContent = "Correo inválido o dominio no permitido (@duoc.cl, @profesor.duoc.cl, @gmail.com)";
        else alert("Correo obligatorio con dominio válido (@duoc.cl, @profesor.duoc.cl, @gmail.com).");
        esValido = false;
    }

    if (!password || password.length < 4 || password.length > 10) {
        if (errorPassword) errorPassword.textContent = "La contraseña debe tener entre 4 y 10 caracteres";
        else alert("La contraseña debe tener entre 4 y 10 caracteres.");
        esValido = false;
    }

    if (!confirmar) {
        if (errorConfirmar) errorConfirmar.textContent = "Debes confirmar tu contraseña";
        else alert("Debes confirmar tu contraseña.");
        esValido = false;
    } else if (confirmar !== password) {
        if (errorConfirmar) errorConfirmar.textContent = "Las contraseñas no coinciden";
        else alert("Las contraseñas no coinciden.");
        esValido = false;
    }

    if (!esValido) return;

    let usuarios = leerUsuarios();
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === correo) {
            if (errorCorreo) errorCorreo.textContent = "Este correo ya está registrado.";
            else alert("Este correo ya está registrado.");
            return;
        }
    }

    let rol = correo === ADMIN_EMAIL ? "admin" : "cliente";
    usuarios.push({ run: run, nombre: nombre, apellidos: apellidos, correo: correo, password: password, rol: rol });
    guardarUsuarios(usuarios);
    guardarSesion({ correo: correo, nombre: nombre, rol: rol });

    if (rol === "admin") {
        alert("Administrador registrado exitosamente.");
        window.location.href = "admin-home.html";
    } else {
        alert("Usuario registrado exitosamente.");
        window.location.href = "cliente-home.html";
    }
}
