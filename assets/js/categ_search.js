const eventosHtml = filtroEventos;
const cardConatiner = document.querySelector(".card-contenido");
//const toCapitalCase = (letra) => letra.charAt(0).toUpperCase() + letra.slice(1);
const inputSearch = document.getElementById("inputSearch");
const checkboxCategorias = document.querySelector(".checkboxCat");
const form = document.forms[0];
let arrayCheckboxSelect = [];
let eventosFiltrados = [];

//filtrado categorias unicas
let arrayCateg = data.events.map((e) => e.category);
let arrayFiltrado = arrayCateg.filter(function (item, index) {
  return arrayCateg.indexOf(item) === index;
});
//

const categorias = arrayFiltrado.reduce((acc, arr, i) => {
  return (
    acc +
    `              <label class="me-2 form-label">
    <input class="me-1 form-check-input" type="checkbox" value="${arr}" id="category${
      i + 1
    }">${arr}
              </label>`
  );
}, "");
checkboxCategorias.innerHTML = categorias;

//funcion de renderizado de cada html
const renderPagina = (array, contenedor, busqueda = false, categ = []) => {
  const success = document.getElementById("success");

  if (busqueda)
    success.innerHTML =
      categ.length > 0 && categ.length < 7
        ? `Resultados en Categorias: ${categ.join(", ")}`
        : `Resultados en todas las Categorias:`;
  if (array.length === 0) {
    let resultadoBusq = `<div style="height: 40vw;">
         
      <h5>No se encontró ningún evento.</h5>
      <p class="card-text">Ajuste los filtros para encontrar un evento.</p>
     
      </div>`;
    return (cardConatiner.innerHTML = resultadoBusq);
  }
  const cardsFiltrado = array.reduce((acc, cadaElem) => {
    return (
      acc +
      `<div class="card bg-success">
    <img alt="${cadaElem.name}" src="${cadaElem.image}" class="card-img-top">
    
    <div class="card-body">
    <h5 class="card-title">${cadaElem.name}</h5>
    <p class="card-text">${cadaElem.description}</p>
    <p class="card-precio">$${cadaElem.price}</p>
    <a alt="Detail" href="./details.html?id=${cadaElem._id}" class="btn btn-secondary hover">Datails</a>
    </div>
    
    </div>
    `
    );
  }, "");
  return (contenedor.innerHTML = cardsFiltrado);
};

eventosFiltrados = eventosFiltrados.length > 0 ? eventosFiltrados : eventosHtml;
///renderiza al inicio segun html
renderPagina(eventosFiltrados, cardConatiner);

//filtros en base a categorias en ckeckboxs
checkboxCategorias.addEventListener("change", (e) => {
  var value = e.target.value;
  if (e.target.checked) {
    arrayCheckboxSelect.push(value);
  } else {
    arrayCheckboxSelect = arrayCheckboxSelect.filter((item) => item !== value);
  }
  eventosFiltrados = eventosHtml.filter((categorias) =>
    arrayCheckboxSelect.includes(categorias.category)
  );
  //
  if (eventosFiltrados.length !== 0) {
    renderPagina(eventosFiltrados, cardConatiner, true, arrayCheckboxSelect);
  } else {
    eventosFiltrados = eventosHtml;
    renderPagina(eventosFiltrados, cardConatiner, true, arrayCheckboxSelect);
  }
  //busqueda si hay valor en el input
  if (inputSearch.value != "") {
    busqueda(eventosFiltrados);
  }
});
//funcionde busqueda gral
const busqueda = (array) => {
  let valorIngresado = inputSearch.value.toLowerCase();

  filtroBusqueda = [];
  array.forEach((elem) => {
    let names = elem.name.toLowerCase();
    if (names.includes(valorIngresado)) {
      filtroBusqueda.push(elem);
    }
  });
  renderPagina(filtroBusqueda, cardConatiner);
};
//busqueda boton
form.addEventListener("submit", (e) => {
  e.preventDefault();
  busqueda(eventosFiltrados);
});
//busqueda mientras se escribe
inputSearch.addEventListener("keyup", (e) => {
  busqueda(eventosFiltrados);
});
