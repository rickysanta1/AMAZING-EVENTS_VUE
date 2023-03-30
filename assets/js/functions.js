import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const app = createApp({
  data() {
    return {
      paginas: location.pathname.split("/").pop(),
      urlApi: "https://mindhub-xj03.onrender.com/api/amazing",
      localApi: "./assets/js/amazing.json",
      event: [],
      filteredEvents: [],
      checked: [],
      categories: null,
      valueSearch: "",
      info: null,
      loading: false,
      errored: false,
      textoNoencontrado: "Sorry, No events found.",
      textoAjuste: "Adjust filters to find an event.",
      nameMax: null,
      capacMax: null,
      asistenciaMax: null,
      nameMin: null,
      capacMin: null,
      asistenciaMin: null,
      maxPorc: null,
      minPorc: null,
      name: null,
      cap: null,
      categFuturos: {},
      categPasados: {},
    };
  },
  created() {
    this.apiDatos();
  },
  methods: {
    apiDatos() {
      fetch(this.urlApi)
        .then((response) => response.json())
        .then((datosApi) => {
          this.event = datosApi.events;
          this.currentDate = datosApi.currentDate;
          this.cargaPagina();
        })
        .catch((error) => {
          this.errored = true;
          console.log(error);
        })
        .finally(() => {
          if (!this.event.length) {
            fetch(this.localApi)
              .then((response) => response.json())
              .then((api) => {
                this.event = api.events;
                this.filteredEvents = this.event;
                this.currentDate = api.currentDate;
                this.cargaPagina();
              });
          }
        });
    },
    cargaPagina: function () {
      this.loading = true;
      //segun la pagina que estamos carga un array especifico

      if (this.paginas.includes("index") || this.paginas == "") {
        this.filteredEvents = this.event;
      } else if (this.paginas.includes("upcoming_events")) {
        this.filteredEvents = this.event.filter(
          (evento) => evento.date > this.currentDate
        );
      } else if (this.paginas.includes("past_events")) {
        this.filteredEvents = this.event.filter(
          (evento) => evento.date < this.currentDate
        );
      } else if (this.paginas.includes("stats")) {
        const filtroEventsPasados = this.event.filter(
          (elem) => elem.date < this.currentDate
        );

        const filtroEventsFuturos = this.event.filter(
          (elem) => elem.date > this.currentDate
        );
        const maxValue = filtroEventsPasados.reduce((max, cap) => {
          return cap.capacity > max.capacity ? cap : max;
        });
        const { name, capacity: cap } = maxValue;
        this.name = name;
        this.cap = cap;
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
        this.nameMax = nameMax;
        this.capacMax = capacMax;
        this.asistenciaMax = asistenciaMax;
        this.nameMin = nameMin;
        this.capacMin = capacMin;
        this.asistenciaMin = asistenciaMin;
        this.maxPorc = ((asistenciaMax * 100) / capacMax).toFixed(2);
        this.minPorc = ((asistenciaMin * 100) / capacMin).toFixed(2);

        this.categFuturos = this.categoriasTotal(
          filtroEventsFuturos.sort((a, b) => {
            if (a.category < b.category) return -1;
            else if (a.category > b.category) return 1;
            else return 0;
          })
        );
        this.categPasados = this.categoriasTotal(filtroEventsPasados);
      } else if (this.paginas.includes("details")) {
        const queryString = document.location.search;
        const id = new URLSearchParams(queryString).get("id");
        this.filteredEvents = this.event.find(
          (item) => item._id === parseInt(id)
        );
      }
    },
    filtros: function () {
      let filtroCatego = this.filteredEvents.filter((event) => {
        return (
          (this.checked.includes(event.category) ||
            this.checked.length === 0) &&
          event.name.toLowerCase().includes(this.valueSearch.toLowerCase())
        );
      });

      this.resaltaBusqueda();
      return filtroCatego;
    },
    resaltaBusqueda() {
      let text = this.valueSearch;
      let arrayClassTitulos = Array.from(
        document.querySelectorAll(".card-title")
      );
      arrayClassTitulos.forEach((clases) => {
        let textCont = clases.textContent;
        let index = textCont.toLowerCase().indexOf(text.toLowerCase());

        if (index >= 0) {
          textCont = ` ${textCont.substring(
            0,
            index
          )}<span style="text-decoration: underline red;font-weight: 710">${textCont.substring(
            index,
            index + text.length
          )}</span>${textCont.substring(index + text.length)}`;
          clases.innerHTML = textCont;
        } else {
          clases.innerHTML = textCont;
        }
      });
    },
    categoriasTotal(eventos) {
      return eventos.reduce((totals, event) => {
        const { category } = event;
        let asistenciaTotal =
          event.estimate != null ? event.estimate : event.assistance;
        let capacidadTotal = event.capacity;
        let total = event.price * asistenciaTotal;
        let name = category;
        if (!totals[category]) {
          totals[category] = { name, total, asistenciaTotal, capacidadTotal };
        } else {
          totals[category].name = name;
          totals[category].total += total;
          totals[category].asistenciaTotal += asistenciaTotal;
          totals[category].capacidadTotal += capacidadTotal;
        }

        return totals;
      }, {});
    },
  },
  computed: {
    compCatego() {
      return [...new Set(this.event.map((event) => event.category))];
    },
    mensaje() {
      if (this.checked.length) {
        let arrayFiltrado = [...new Set(this.filtros().map((e) => e.category))];
        let enComas = arrayFiltrado.join(", ");
        if (arrayFiltrado.length === 0) return;
        const catFitra =
          arrayFiltrado.length > 0 &&
          arrayFiltrado.length < this.compCatego.length
            ? `Results in Categories: <span style="font-weight:720;">${enComas}</span>`
            : `Results in all Categories:`;
        return catFitra;
      }
    },
  },
}).mount("#render-pagina");
