const eventos = data.events;
const cardConatiner = document.querySelector(".card-contenido");
const queryString = document.location.search;
const id = new URLSearchParams(queryString).get("id");
const detail = eventos.find((item) => item._id === parseInt(id));

const renderPagina = (array, contenedor) => {
  return (contenedor.innerHTML = `<div class="card mb-3 bg-success" style="width:80%">
    <div class="row g-0">
    <div class="col-md-5">
          <img alt="${array.name}" src="${array.image}" class="card-img-top">
    </div>
    <div class="col-md-7">
        <div class="card-body">
    <h5 class="mb-4 card-title">${array.name}</h5>
    <p class="card-subtitle mb-2 text-wrap"><strong>Description:</strong> ${array.description}</p>
    <p class="card-text"><strong>Category:</strong> ${array.category}</p>
    <p class="card-text"><strong>Place:</strong> ${array.place}</p>
    <p class="card-text"><strong>Date:</strong> ${array.date}</p>
    <p class="card-precio"><strong>Price:</strong> $${array.price}</p>
        <a alt="Go Back" onclick="history.back()" href="#" class="btn btn-secondary hover">Go Back</a>

    </div>
    </div>
    </div>
    `);
};
renderPagina(detail, cardConatiner);
