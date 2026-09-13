let carrito = []
let cupon = ""

let textoCarrito = localStorage.getItem("carrito")
if (textoCarrito === null) {
  carrito = []
} else {
  carrito = JSON.parse(textoCarrito)
}

let textoCupon = localStorage.getItem("cupon")
if (textoCupon === null) {
  cupon = ""
} else {
  cupon = textoCupon
}

function guardar() {
  localStorage.setItem("carrito", JSON.stringify(carrito))
  localStorage.setItem("cupon", cupon)
  actualizarContadorCarrito()
}

function buscarEnCatalogo(id) {
  for (let i = 0; i < listaProductos.length; i++) {
    if (listaProductos[i].id === id) {
      return listaProductos[i]
    }
  }
  return null
}

function buscarEnCarrito(id) {
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      return carrito[i]
    }
  }
  return null
}

function agregarAlCarrito(id, cantidad) {
  let numeroId = parseInt(id)
  let numeroCantidad = parseInt(cantidad)
  if (isNaN(numeroCantidad)) {
    numeroCantidad = 1
  }
  if (numeroCantidad < 1) {
    numeroCantidad = 1
  }
  let producto = buscarEnCatalogo(numeroId)
  if (producto === null) {
    alert("Producto no encontrado")
    return
  }
  let item = buscarEnCarrito(numeroId)
  let cantidadActual = 0
  if (item !== null) {
    cantidadActual = item.cantidad
  }
  if (cantidadActual + numeroCantidad > producto.stock) {
    alert("No hay stock suficiente, stock disponible: " + producto.stock)
    return
  }
  if (item !== null) {
    item.cantidad = item.cantidad + numeroCantidad
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: numeroCantidad
    })
  }
  guardar()
  alert(producto.nombre + " agregado al carrito")
  cargarVistaCarrito()
}

function cambiarCantidad(id, cambio) {
  let numeroId = parseInt(id)
  let numeroCambio = parseInt(cambio)
  let item = buscarEnCarrito(numeroId)
  if (item === null) {
    return
  }
  let producto = buscarEnCatalogo(numeroId)
  let stock = producto.stock
  let nuevaCantidad = item.cantidad + numeroCambio
  if (nuevaCantidad < 1) {
    eliminarDelCarrito(numeroId)
    return
  }
  if (nuevaCantidad > stock) {
    alert("Stock maximo disponible: " + stock)
    return
  }
  item.cantidad = nuevaCantidad
  guardar()
  cargarVistaCarrito()
}

function setCantidad(id, valor) {
  let numeroId = parseInt(id)
  let nuevaCantidad = parseInt(valor)
  if (isNaN(nuevaCantidad)) {
    nuevaCantidad = 1
  }
  if (nuevaCantidad < 1) {
    nuevaCantidad = 1
  }
  let item = buscarEnCarrito(numeroId)
  if (item === null) {
    return
  }
  let producto = buscarEnCatalogo(numeroId)
  let stock = producto.stock
  if (nuevaCantidad > stock) {
    alert("Stock maximo disponible: " + stock)
    nuevaCantidad = stock
  }
  item.cantidad = nuevaCantidad
  guardar()
  cargarVistaCarrito()
}

function eliminarDelCarrito(id) {
  let numeroId = parseInt(id)
  let nuevoCarrito = []
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id !== numeroId) {
      nuevoCarrito.push(carrito[i])
    }
  }
  carrito = nuevoCarrito
  guardar()
  cargarVistaCarrito()
}

function vaciarCarrito() {
  let confirma = confirm("Vas a vaciar el carrito, quieres continuar?")
  if (confirma === false) {
    return
  }
  carrito = []
  guardar()
  cargarVistaCarrito()
}

function aplicarCupon() {
  let input = document.getElementById("input-cupon")
  let texto = input.value
  texto = texto.trim()
  texto = texto.toUpperCase()
  if (texto === "") {
    cupon = ""
    guardar()
    cargarVistaCarrito()
    return
  }
  if (texto !== "DUOC10") {
    alert("Cupon invalido, prueba con DUOC10")
    return
  }
  cupon = texto
  guardar()
  cargarVistaCarrito()
}

function quitarCupon() {
  cupon = ""
  guardar()
  cargarVistaCarrito()
}

function actualizarContadorCarrito() {
  let totalUnidades = 0
  for (let i = 0; i < carrito.length; i++) {
    totalUnidades = totalUnidades + carrito[i].cantidad
  }
  let elementos = document.querySelectorAll("#cant-carrito")
  for (let j = 0; j < elementos.length; j++) {
    elementos[j].textContent = totalUnidades
  }
}

function cargarVistaCarrito() {
  let tbody = document.getElementById("lista-carrito")
  if (tbody === null) {
    return
  }
  let subtotal = 0
  for (let i = 0; i < carrito.length; i++) {
    subtotal = subtotal + carrito[i].precio * carrito[i].cantidad
  }
  let descuento = 0
  if (cupon === "DUOC10") {
    descuento = Math.round(subtotal * 0.1)
  }
  let total = subtotal - descuento
  let neto = Math.round(total / 1.19)
  let iva = total - neto
  let input = document.getElementById("input-cupon")
  if (input !== null) {
    input.value = cupon
  }
  let mensaje = document.getElementById("cupon-msg")
  if (mensaje !== null) {
    if (cupon === "DUOC10") {
      mensaje.textContent = "Cupon DUOC10 aplicado, 10% de descuento"
    } else {
      mensaje.textContent = ""
    }
  }
  tbody.innerHTML = ""
  if (carrito.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">El carrito esta vacio. <a href="productos.html">Ver catalogo</a></td></tr>'
  } else {
    for (let i = 0; i < carrito.length; i++) {
      let item = carrito[i]
      let sublinea = item.precio * item.cantidad
      let fila = document.createElement("tr")
      fila.innerHTML = "<td>" + item.nombre + "</td><td>$" + item.precio.toLocaleString("es-CL") + "</td><td>" + '<button class="btn-cant" onclick="cambiarCantidad(' + item.id + ", -1)" + '">-</button>' + '<input type="number" min="1" value="' + item.cantidad + '" style="width:55px;text-align:center" onchange="setCantidad(' + item.id + ', this.value)">' + '<button class="btn-cant" onclick="cambiarCantidad(' + item.id + ", 1)" + '">+</button>' + "</td><td>$" + sublinea.toLocaleString("es-CL") + "</td>" + '<td><button class="btn-eliminar" onclick="eliminarDelCarrito(' + item.id + ')">Eliminar</button></td>'
      tbody.appendChild(fila)
    }
  }
  document.getElementById("res-subtotal").textContent = subtotal.toLocaleString("es-CL")
  document.getElementById("res-descuento").textContent = descuento.toLocaleString("es-CL")
  document.getElementById("res-total").textContent = total.toLocaleString("es-CL")
  document.getElementById("res-neto").textContent = neto.toLocaleString("es-CL")
  document.getElementById("res-iva").textContent = iva.toLocaleString("es-CL")
  document.getElementById("total-precio").textContent = total.toLocaleString("es-CL")
  let filaDescuento = document.getElementById("fila-descuento")
  if (descuento > 0) {
    filaDescuento.style.display = ""
  } else {
    filaDescuento.style.display = "none"
  }
  let botonQuitar = document.getElementById("btn-quitar-cupon")
  if (cupon === "DUOC10") {
    botonQuitar.style.display = ""
  } else {
    botonQuitar.style.display = "none"
  }
}

function procesarPago() {
  if (carrito.length === 0) {
    alert("Agrega productos antes de realizar la compra")
    return
  }
  let subtotal = 0
  for (let i = 0; i < carrito.length; i++) {
    subtotal = subtotal + carrito[i].precio * carrito[i].cantidad
  }
  let descuento = 0
  if (cupon === "DUOC10") {
    descuento = Math.round(subtotal * 0.1)
  }
  let total = subtotal - descuento
  let neto = Math.round(total / 1.19)
  let iva = total - neto
  alert("Compra realizada, total pagado $" + total.toLocaleString("es-CL") + ", neto $" + neto.toLocaleString("es-CL") + ", IVA $" + iva.toLocaleString("es-CL"))
  carrito = []
  cupon = ""
  guardar()
  cargarVistaCarrito()
}

document.addEventListener("DOMContentLoaded", function() {
  actualizarContadorCarrito()
  cargarVistaCarrito()
})
