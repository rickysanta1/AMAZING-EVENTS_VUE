const cardConatiner = document.querySelector(".card-contenido");

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
  const queryString = document.location.search;
  const id = new URLSearchParams(queryString).get("id");
  try {
    let data = await apiDatos();
    const detail = data.events.find((item) => item._id === parseInt(id));
    renderPagina(detail, cardConatiner);
  } catch (error) {
    console.log("🚀 ~ file: index_data.js:11 ~ fetchAPI ~ error:", error);
  }
}
const renderPagina = (array, contenedor) => {
  return (contenedor.innerHTML = `<div class="card mb-3 bg-success" style="width:80%">
    <div class="row g-0">
    <div class="col-md-6">
          <img alt="${array.name}" src="${array.image}" class="card-img-top" id="detail-img">
    </div>
    <div class="col-md-6">
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
fetchAPI();
