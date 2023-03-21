//renderiza categorias
const catUnicas = (array, contenedor) => {
  let arrayCateg = array.map((e) => e.category);
  let arrayFiltrado = new Set(arrayCateg);
  let cats = "";
  arrayFiltrado.forEach((e, i) => {
    cats += `              <label class="me-2 form-label">
     <input class="me-1 form-check-input" type="checkbox" value="${e}" id="category${
      i + 1
    }">${e}
               </label>`;
  });
  return (contenedor.innerHTML = cats);
};
//renderiza las tarjetas
const renderTarjetas = (array, contenedor, categ = []) => {
  const success = document.getElementById("success");
  success.innerHTML = "";
  if (categ.length)
    success.innerHTML =
      categ.length > 0 && categ.length < 7
        ? `Resultados en Categorias: ${categ.join(", ")}`
        : `Resultados en todas las Categorias:`;
  if (array.length === 0) {
    let resultadoBusq = `<div style="text-align:center;height: 40vw;">
         
      <h5>Sorry, No events found.</h5>
      <p class="card-text">Adjust filters to find an event.</p>
     
      </div>`;
    return (cardConatiner.innerHTML = resultadoBusq);
  }
  const cardsFiltrado = array.reduce((acc, cadaElem) => {
    return (
      acc +
      `<div class="card bg-success">
    <img alt="${cadaElem.name}" src="${cadaElem.image}">
    <div class="card-body d-flex flex-column">
    <h5 class="card-title">${cadaElem.name}</h5>
    <p class="card-text">${cadaElem.description}</p>
    <div class="mt-auto fill-space">
    <div class="d-flex align-items-center justify-content-between mx-0">
    <p class="card-precio">Price: $${cadaElem.price}</p>
    <p><a alt="Detail" href="./details.html?id=${cadaElem._id}" class="btn btn-secondary hover">Datails</a></p>
    </div>
    </div>
     </div>
        </div>`
    );
  }, "");
  return (contenedor.innerHTML = cardsFiltrado);
};
//retorna checkbox tildados
const checkboxTildados = () => {
  let tildados = Array.from(document.querySelectorAll('input[type="checkbox"]'))
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  return tildados;
};
//filtra texto en busqueda
const filtrarEventosPorTexto = (tarjetas, arrayTexto) => {
  const tarjetasconTexto = tarjetas.filter((evento) => {
    const palabras = arrayTexto.every((palabra) => {
      return evento.name.toLowerCase().includes(palabra);
    });
    return palabras;
  });
  return tarjetasconTexto;
};
//Resalta texto encontrado en busqueda
function resaltaBusqueda(clase, text) {
  let arrayClassTitulos = Array.from(document.querySelectorAll(clase));
  arrayClassTitulos.forEach((clases) => {
    let innerHTML = clases.innerHTML;
    let index = innerHTML.toLowerCase().indexOf(text.toLowerCase());

    if (index >= 0) {
      innerHTML = ` ${innerHTML.substring(
        0,
        index
      )}<span style="text-decoration: underline red;font-weight: 710">
    ${innerHTML.substring(
      index,
      index + text.length
    )}</span>${innerHTML.substring(index + text.length)}`;
      clases.innerHTML = innerHTML;
    } else {
      clases.innerHTML = innerHTML;
    }
  });
}
const filtrarEventos = (eventos, textoABuscar) => {
  const tildados = checkboxTildados();
  const texto = textoABuscar.trim().toLowerCase();
  const arrayTexto = texto.split(" ");
  let tarjetasFiltradas = eventos;
  if (tildados.length) {
    tarjetasFiltradas = tarjetasFiltradas.filter((evento) =>
      tildados.includes(evento.category)
    );
  }
  tarjetasFiltradas = filtrarEventosPorTexto(tarjetasFiltradas, arrayTexto);
  if (tarjetasFiltradas) {
    renderTarjetas(tarjetasFiltradas, cardConatiner, tildados);
    dataInput = inputSearch.value;
    resaltaBusqueda(".card-title", dataInput);
  }
};
//captura el nombre de la pagina actual
function paginas() {
  let url = location.pathname.split("/").pop();
  return url;
}
/////// FUNCION POR SI FALLA LA API
const apiDatos = async () => {
  try {
    let response = await fetch("https://mindhub-xj03.onrender.com/api/amazing");
    return await response.json();
  } catch (error) {
    if (error) {
      let response = await fetch("./assets/js/amazing.json");
      return await response.json();
    }
  }
};
//funcion principal

async function fetchAPI() {
  try {
    let data = await apiDatos();
    //segun la pagina que estamos carga un array especifico
    if (paginas() == "index.html" || paginas() == "") {
      eventosaImprimir = data.events;
    } else if (paginas() == "upcoming_events.html") {
      eventosaImprimir = data.events.filter(
        (evento) => evento.date > data.currentDate
      );
    } else if (paginas() == "past_events.html") {
      eventosaImprimir = data.events.filter(
        (evento) => evento.date < data.currentDate
      );
    }
    catUnicas(eventosaImprimir, checkboxCategorias);
    renderTarjetas(eventosaImprimir, cardConatiner);
  } catch (error) {
    console.log("🚀 ~ file: index_data.js:11 ~ fetchAPI ~ error:", error);
  }
}
let eventosaImprimir = [];
const checkboxCategorias = document.querySelector(".checkboxCat");
const cardConatiner = document.querySelector(".card-contenido");
const inputSearch = document.getElementById("inputSearch");
const form = document.querySelector('button[type="submit"]');
let dataInput = "";
form.addEventListener("click", (e) => {
  e.preventDefault();
  dataInput = inputSearch.target.value;
  filtrarEventos(eventosaImprimir, dataInput);
});

checkboxCategorias.addEventListener("change", () => {
  filtrarEventos(eventosaImprimir, dataInput);
});

inputSearch.addEventListener("keyup", (event) => {
  dataInput = event.target.value;

  filtrarEventos(eventosaImprimir, dataInput);
});
fetchAPI();
