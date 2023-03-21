const eventosHtml = [];
const cardConatiner = document.querySelector(".card-contenido");
const inputSearch = document.getElementById("inputSearch");
const checkboxCategorias = document.querySelector(".checkboxCat");
const form = document.forms[0];
let arrayCheckboxSelect = [];
let eventosFiltrados = [];

//funcion de renderizado de cada html
renderPagina = (array, contenedor, busqueda = false, categ = []) => {
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
    <p class="d-flex align-items-center justify-content-between card-precio">Price: $${cadaElem.price}
    <a alt="Detail" href="./details.html?id=${cadaElem._id}" class="btn btn-secondary hover">Datails</a></p>
    </div>
    
    </div>
    `
    );
  }, "");
  return (contenedor.innerHTML = cardsFiltrado);
};

//eventosFiltrados = eventosFiltrados.length > 0 ? eventosFiltrados : eventosHtml;
///renderiza al inicio segun html
//renderPagina(eventosFiltrados, cardConatiner);

//filtros en base a categorias en ckeckboxs
const busquedaCheckbox = (array) => {
  eventosFiltrados = array.filter((categorias) =>
    arrayCheckboxSelect.includes(categorias.category)
  );
  //
  if (eventosFiltrados.length !== 0) {
    renderPagina(eventosFiltrados, cardConatiner, true, arrayCheckboxSelect);
  } else {
    eventosFiltrados = array;
    renderPagina(eventosFiltrados, cardConatiner, true, arrayCheckboxSelect);
  }
  //busqueda si hay valor en el input
  if (inputSearch.value != "") {
    busqueda(eventosFiltrados);
  }
};
checkboxCategorias.addEventListener("change", (e) => {
  var value = e.target.value;
  if (e.target.checked) {
    arrayCheckboxSelect.push(value);
  } else {
    arrayCheckboxSelect = arrayCheckboxSelect.filter((item) => item !== value);
  }
  busquedaCheckbox(eventosFiltrados);
});
//funcionde busqueda gral
const busqueda = (array) => {
  let valorIngresado = inputSearch.value.toLowerCase();
  let filtroBusqueda = array.filter((elem) =>
    elem.name.toLowerCase().includes(valorIngresado)
  );
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
