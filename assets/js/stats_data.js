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

async function fetchAPI() {
  let data = await apiDatos();
  let diaActual = data.currentDate;

  const filtroEventsPasados = data.events.filter(
    (elem) => elem.date < diaActual
  );
  const filtroEventsFuturos = data.events.filter(
    (evento) => evento.date > diaActual
  );

  // Maximo valor
  const maxValue = filtroEventsPasados.reduce((max, cap) => {
    return cap.capacity > max.capacity ? cap : max;
  });
  const { name, capacity: cap } = maxValue;

  const porcentajes = (array, mayor) => {
    const calcPorcentaje = array.reduce((max, cap) => {
      const capPorc = (cap.assistance * 100) / cap.capacity;
      const maxPorc = (max.assistance * 100) / max.capacity;
      if (mayor) {
        return capPorc > maxPorc ? cap : max;
      } else {
        return capPorc < maxPorc ? cap : max;
      }
    });

    return calcPorcentaje;
  };
  const {
    name: nameMax,
    capacity: capacMax,
    assistance: asistenciaMax,
  } = porcentajes(filtroEventsPasados, true);
  const {
    name: nameMin,
    capacity: capacMin,
    assistance: asistenciaMin,
  } = porcentajes(filtroEventsPasados, false);

  const maxPorc = ((asistenciaMax * 100) / capacMax).toFixed(2);
  const minPorc = ((asistenciaMin * 100) / capacMin).toFixed(2);

  let categFuturos = categoriasTotal(
    filtroEventsFuturos.sort((a, b) => {
      if (a.category < b.category) return -1;
      else if (a.category > b.category) return 1;
      else return 0;
    })
  );
  renderTabla(upcomingTab, categFuturos);
  renderTabla(pastTab, categoriasTotal(filtroEventsPasados));

  eventosTabla.innerHTML += `
    <tr><td>${nameMax}: (${maxPorc}%) </td>
    <td>${nameMin}: (${minPorc}%)</td>
    <td>${name}: (${cap})
    </td></tr>`;
}

const renderTabla = (tabla, result) => {
  let contenido = "";
  contenido += `  <tr class="titulos">
            <td>Categories</td>
            <td>Revenues</td>
            <td>Percentage of attendance</td>`;
  for (let category in result) {
    contenido += `<tr><td>${category}</td>
    <td>$${result[category].total}</td>
    <td>${(
      (result[category].asistenciaTotal * 100) /
      result[category].capacidadTotal
    ).toFixed(2)}%
    </td></tr>`;
  }
  tabla.innerHTML = contenido;
};
const categoriasTotal = (eventos) => {
  return eventos.reduce((totals, event) => {
    const { category } = event;
    let asistenciaTotal =
      event.estimate != null ? event.estimate : event.assistance;
    let capacidadTotal = event.capacity;
    let total = event.price * asistenciaTotal;

    if (!totals[category]) {
      totals[category] = { total, asistenciaTotal, capacidadTotal };
    } else {
      totals[category].total += total;
      totals[category].asistenciaTotal += asistenciaTotal;
      totals[category].capacidadTotal += capacidadTotal;
    }

    return totals;
  }, {});
};
const upcomingTab = document.getElementById("upcoming");
const pastTab = document.getElementById("past");
const eventosTabla = document.getElementById("hightest_events");
fetchAPI();
