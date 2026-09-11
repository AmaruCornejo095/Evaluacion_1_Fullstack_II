const listaProductos = [
    { id: 1, codigo: "PROD01", nombre: "Notebook Gamer", precio: 450000, stock: 10, categoria: "Electrónica", imagen: "https://cl-media.hptiendaenlinea.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/3/1/310J5LA-1_T1679636502.png" },
    { id: 2, codigo: "PROD02", nombre: "Monitor 24 Pulgadas", precio: 180000, stock: 15, categoria: "Electrónica", imagen: "https://media.spdigital.cl/thumbnails/products/86nrx9gw_2415ea40_thumbnail_4096.png" },
    { id: 3, codigo: "PROD03", nombre: "Zapatillas Deportivas", precio: 65000, stock: 20, categoria: "Calzado", imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop" },
    { id: 4, codigo: "PROD04", nombre: "Chaqueta Térmica", precio: 120000, stock: 5, categoria: "Vestuario", imagen: "https://via.placeholder.com/150" }
];

document.addEventListener("DOMContentLoaded", () => {
    const catalogo = document.getElementById("contenedor-catalogo");
    if (catalogo && typeof listaProductos !== 'undefined') {
        catalogo.innerHTML = "";
        listaProductos.forEach(p => {
            catalogo.innerHTML += `
        <div class="card">
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p class="categoria-tag">${p.categoria}</p>
          <p class="precio">$${p.precio.toLocaleString('es-CL')}</p>
          <div class="card-acciones">
            <a href="detalle-producto.html?id=${p.id}" class="btn-secundario">Detalle</a>
            <button class="btn" onclick="agregarAlCarrito(${p.id})">Añadir</button>
          </div>
        </div>
      `;
        });
    }
});