

const IVA_TASA = 0.19;
const CUPONES = {
  DUOC10: 0.10,
  BIENVENIDA15: 0.15
};

function obtenerCarrito() {
  let raw = [];
  try {
    raw = JSON.parse(localStorage.getItem("carrito")) || [];
  } catch (e) {
    raw = [];
  }
  if (!Array.isArray(raw)) return [];

  const agrupado = {};
  raw.forEach((item) => {
    if (!item || item.id == null) return;
    const id = Number(item.id);
    if (!agrupado[id]) {
      agrupado[id] = {
        id: id,
        codigo: item.codigo || "",
        nombre: item.nombre || "Producto",
        precio: Number(item.precio) || 0,
        imagen: item.imagen || "",
        cantidad: 0
      };
    }
    agrupado[id].cantidad += Number(item.cantidad) > 0 ? Number(item.cantidad) : 1;
  });
  return Object.values(agrupado);
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function obtenerCupon() {
  return (localStorage.getItem("cupon") || "").trim().toUpperCase();
}

function guardarCupon(code) {
  if (!code) {
    localStorage.removeItem("cupon");
    return;
  }
  localStorage.setItem("cupon", code.trim().toUpperCase());
}

function buscarProducto(id) {

  if (typeof listaProductos !== "undefined") {
    return listaProductos.find((p) => Number(p.id) === Number(id));
  }
  return null;
}

function agregarAlCarrito(idProducto, cantidadPedida) {
  const id = Number(idProducto);
  let qty = Number(cantidadPedida) || 1;
  if (qty < 1) qty = 1;

  const producto = buscarProducto(id);
  if (!producto) {
    alert("Producto no encontrado.");
    return;
  }

  let carrito = obtenerCarrito();
  const existente = carrito.find((i) => Number(i.id) === id);
  const enCarrito = existente ? existente.cantidad : 0;

  if (enCarrito + qty > producto.stock) {
    const disponible = producto.stock - enCarrito;
    alert(
      disponible <= 0
        ? `Sin stock disponible para ${producto.nombre} (stock: ${producto.stock}).`
        : `Solo puedes agregar ${disponible} más de ${producto.nombre} (stock: ${producto.stock}).`
    );
    return;
  }

  if (existente) {
    existente.cantidad += qty;
  } else {
    carrito.push({
      id: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: qty
    });
  }

  guardarCarrito(carrito);
  alert(`${producto.nombre} añadido al carrito (cantidad: ${qty})`);

  if (typeof cargarVistaCarrito === "function" && document.getElementById("lista-carrito")) {
    cargarVistaCarrito();
  }
}

function cambiarCantidad(idProducto, delta) {
  const id = Number(idProducto);
  let carrito = obtenerCarrito();
  const item = carrito.find((i) => Number(i.id) === id);
  if (!item) return;

  const producto = buscarProducto(id);
  const stock = producto ? producto.stock : 99;

  const nueva = item.cantidad + Number(delta);
  if (nueva < 1) {
    eliminarDelCarrito(id);
    return;
  }
  if (nueva > stock) {
    alert(`Stock máximo disponible: ${stock}.`);
    return;
  }
  item.cantidad = nueva;
  guardarCarrito(carrito);
  cargarVistaCarrito();
}

function setCantidad(idProducto, valor) {
  const id = Number(idProducto);
  let qty = parseInt(valor, 10);
  if (isNaN(qty) || qty < 1) qty = 1;

  let carrito = obtenerCarrito();
  const item = carrito.find((i) => Number(i.id) === id);
  if (!item) return;

  const producto = buscarProducto(id);
  const stock = producto ? producto.stock : 99;
  if (qty > stock) {
    alert(`Stock máximo disponible: ${stock}.`);
    qty = stock;
  }
  item.cantidad = qty;
  guardarCarrito(carrito);
  cargarVistaCarrito();
}

function eliminarDelCarrito(idProducto) {
  const id = Number(idProducto);
  let carrito = obtenerCarrito().filter((i) => Number(i.id) !== id);
  guardarCarrito(carrito);
  if (document.getElementById("lista-carrito")) cargarVistaCarrito();
}

function vaciarCarrito() {
  if (!confirm("¿Estás seguro de que deseas vaciar el carrito?")) return;
  localStorage.removeItem("carrito");
  actualizarContadorCarrito();
  if (document.getElementById("lista-carrito")) cargarVistaCarrito();
}

function aplicarCupon(code) {
  const input = document.getElementById("input-cupon");
  const raw = (code !== undefined ? code : input ? input.value : "").trim().toUpperCase();
  const msg = document.getElementById("cupon-msg");

  if (!raw) {
    guardarCupon("");
    if (msg) {
      msg.textContent = "";
    }
    cargarVistaCarrito();
    return;
  }

  if (!CUPONES[raw]) {
    if (msg) msg.textContent = "Cupón inválido. Prueba con DUOC10.";
    alert("Cupón inválido. Prueba con DUOC10.");
    return;
  }

  guardarCupon(raw);
  if (msg) msg.textContent = `Cupón ${raw} aplicado (${CUPONES[raw] * 100}% dcto).`;
  cargarVistaCarrito();
}

function quitarCupon() {
  guardarCupon("");
  cargarVistaCarrito();
}

function calcularTotales(carrito, cuponCode) {
  const items = carrito || [];
  const subtotalBruto = items.reduce((acc, i) => acc + Number(i.precio) * Number(i.cantidad), 0);
  const code = (cuponCode !== undefined ? cuponCode : obtenerCupon()).trim().toUpperCase();
  const pct = CUPONES[code] || 0;
  const descuento = Math.round(subtotalBruto * pct);
  const totalAPagar = subtotalBruto - descuento;
  const neto = Math.round(totalAPagar / (1 + IVA_TASA));
  const iva = totalAPagar - neto;
  return { subtotalBruto, pct, code, descuento, totalAPagar, neto, iva };
}

function actualizarContadorCarrito() {
  const totalUnidades = obtenerCarrito().reduce((acc, i) => acc + Number(i.cantidad), 0);
  document.querySelectorAll("#cant-carrito").forEach((el) => {
    el.textContent = totalUnidades;
  });
}

function formatoCL(n) {
  return Number(n || 0).toLocaleString("es-CL");
}

function cargarVistaCarrito() {
  const tbody = document.getElementById("lista-carrito");
  if (!tbody) return;

  const carrito = obtenerCarrito();
  const t = calcularTotales(carrito);

  const input = document.getElementById("input-cupon");
  if (input && document.activeElement !== input) input.value = obtenerCupon();
  const msg = document.getElementById("cupon-msg");
  if (msg && t.pct > 0) msg.textContent = `Cupón ${t.code} aplicado (${t.pct * 100}% dcto).`;

  tbody.innerHTML = "";

  if (carrito.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">El carrito está vacío. <a href="productos.html">Ver catálogo</a></td></tr>`;
    actualizarResumen(t);
    return;
  }

  carrito.forEach((item) => {
    const sublinea = Number(item.precio) * Number(item.cantidad);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nombre}</td>
      <td>$${formatoCL(item.precio)}</td>
      <td>
        <button class="btn-cant" onclick="cambiarCantidad(${item.id}, -1)">−</button>
        <input type="number" min="1" value="${item.cantidad}" style="width:55px;text-align:center"
          onchange="setCantidad(${item.id}, this.value)">
        <button class="btn-cant" onclick="cambiarCantidad(${item.id}, 1)">+</button>
      </td>
      <td>$${formatoCL(sublinea)}</td>
      <td><button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });

  actualizarResumen(t);
}

function actualizarResumen(t) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = formatoCL(val);
  };
  set("res-subtotal", t.subtotalBruto);
  set("res-descuento", t.descuento);
  set("res-total", t.totalAPagar);
  set("res-neto", t.neto);
  set("res-iva", t.iva);


  const legacy = document.getElementById("total-precio");
  if (legacy) legacy.textContent = formatoCL(t.totalAPagar);

  const rowDesc = document.getElementById("fila-descuento");
  if (rowDesc) rowDesc.style.display = t.descuento > 0 ? "" : "none";

  const btnQuitar = document.getElementById("btn-quitar-cupon");
  if (btnQuitar) btnQuitar.style.display = t.pct > 0 ? "" : "none";
}

function procesarPago() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    alert("Agrega productos antes de realizar la compra.");
    return;
  }
  const t = calcularTotales(carrito);
  alert(
    `¡Compra procesada con éxito!\n\n` +
    `Subtotal: $${formatoCL(t.subtotalBruto)}\n` +
    (t.descuento > 0 ? `Descuento ${t.code}: -$${formatoCL(t.descuento)}\n` : "") +
    `Total pagado: $${formatoCL(t.totalAPagar)} (Neto $${formatoCL(t.neto)} + IVA $${formatoCL(t.iva)})\n\n` +
    `Gracias por tu preferencia.`
  );
  localStorage.removeItem("carrito");
  actualizarContadorCarrito();
  cargarVistaCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  if (document.getElementById("lista-carrito")) cargarVistaCarrito();
});
