const listaProductos = [
    { id: 1, codigo: "PROD01", nombre: "Notebook Gamer", precio: 450000, stock: 10, categoria: "Electrónica", imagen: "https://cl-media.hptiendaenlinea.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/3/1/310J5LA-1_T1679636502.png" },
    { id: 2, codigo: "PROD02", nombre: "Monitor 24 Pulgadas", precio: 180000, stock: 15, categoria: "Electrónica", imagen: "https://media.spdigital.cl/thumbnails/products/86nrx9gw_2415ea40_thumbnail_4096.png" },
    { id: 3, codigo: "PROD03", nombre: "Zapatillas Deportivas", precio: 65000, stock: 20, categoria: "Calzado", imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop" },
    { id: 4, codigo: "PROD04", nombre: "Chaqueta Térmica", precio: 120000, stock: 5, categoria: "Vestuario", imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&auto=format&fit=crop" },
    { id: 5, codigo: "PROD05", nombre: "Reloj Smart", precio: 89990, stock: 12, categoria: "Electrónica", imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop" },
    { id: 6, codigo: "PROD06", nombre: "Audífonos Bluetooth", precio: 35990, stock: 25, categoria: "Electrónica", imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop" },
    { id: 7, codigo: "PROD07", nombre: "Perfume Classic", precio: 42500, stock: 8, categoria: "Belleza", imagen: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&auto=format&fit=crop" },
    { id: 8, codigo: "PROD08", nombre: "Smartwatch Deportivo", precio: 59990, stock: 10, categoria: "Electrónica", imagen: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop" }
];

function mostrarProductos(idContenedor, cantidad) {
    const cont = document.getElementById(idContenedor);
    if (!cont) return;
    cont.innerHTML = "";
    listaProductos.slice(0, cantidad).forEach(p => {
        cont.innerHTML += `
      <div class="card">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p class="precio">$${p.precio.toLocaleString('es-CL')}</p>
        <a href="detalle-producto.html?id=${p.id}" class="btn-secundario">Ver Detalle</a>
      </div>`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarProductos("contenedor-catalogo", listaProductos.length);
    mostrarProductos("contenedor-index", 4);
    mostrarDetalle();
});

function mostrarDetalle() {
    const nombre = document.getElementById("nombre");
    if (!nombre) return;
    const id = new URLSearchParams(window.location.search).get("id");
    const prod = listaProductos.find(p => p.id == id);
    if (!prod) {
        nombre.textContent = "Producto no encontrado";
        return;
    }
    document.getElementById("foto").src = prod.imagen;
    document.getElementById("foto").alt = prod.nombre;
    nombre.textContent = prod.nombre;
    document.getElementById("precio").textContent = "$" + prod.precio.toLocaleString('es-CL');
    document.getElementById("stock").textContent = "Stock: " + prod.stock;
    document.getElementById("categoria").textContent = prod.categoria;
    document.getElementById("codigo").textContent = prod.codigo;
}