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

    if (esValido) {
        alert("¡Inicio de sesión exitoso!");
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

    if (esValido) {
        alert("Usuario registrado exitosamente.");
    }
}
