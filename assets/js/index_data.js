let hoyDia = data.currentDate;
let eventos = data.events;
const cardConatiner = document.querySelector(".card-contentido");

const cards = (array, contenedor) => {
  let nodesCards = "";
  for (let i = 0; i < array.length; i++) {
    nodesCards += `<div class="card bg-success">
    <img alt="${array[i].name}" src="${array[i].image}" class="card-img-top">
    
    <div class="card-body">
    <h5 class="card-title">${array[i].name}</h5>
    <p class="card-text">${array[i].description}</p>
    <p class="card-precio">$${array[i].price}</p>
    <a href="./details.html" class="btn btn-secondary hover">Datails</a>
    </div>
    
    </div>
    `;
    contenedor.innerHTML = nodesCards;
  }
};
cards(eventos, cardConatiner);
