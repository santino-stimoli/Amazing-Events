// Variables
const divCards = document.getElementById(`events`)
const tituloCards = document.getElementById(`title-card`)
const inputSearch = document.getElementById(`searchbox`)
const divCheckboxs = document.getElementById(`categories`)
const upcomingEvents = document.getElementById(`upcoming-events`)
const pastEvents = document.getElementById(`past-events`)
const documentTitle = document.title
const cards = []


// Contenido
cargarDatos("http://amazing-events.herokuapp.com/api/events")


// Funciones
// Fetch
function cargarDatos(URL) {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            var eventos = data.events
            if (documentTitle == "") { }
            else if (documentTitle == "Amazing Events | Home") {
                innerCards(eventos);
                checkboxCategoria(eventos);
                buscadorcategorias(eventos, inputSearch.value)
            }
            else if (documentTitle == "Amazing Events | Upcoming events") {
                arrayFiltrado1 = []
                let estimate = eventos.filter(x => x.estimate)
                innerCards(estimate);
                checkboxCategoria(estimate);
                buscadorcategorias(estimate, inputSearch.value)
            }
            else if (documentTitle == "Amazing Events | Past events") {
                let assistance = eventos.filter(x => x.assistance)
                innerCards(assistance);
                checkboxCategoria(assistance);
                buscadorcategorias(assistance, inputSearch.value)
            }
            else if (documentTitle == "Amazing Events | Stats") {
                let assistance = eventos.filter(x => x.assistance)
                tableUpcoming(eventos)
                tablePast(eventos)
                eventsWith(assistance)
            }
            else if (documentTitle == "Amazing Events | Details") {
                innerDetails(eventos)
            }
        })
}


// Crear cartas ✔✔
function innerCards(array) {
    divCards.innerHTML = ""
    array.forEach(event => {
        let card = document.createElement(`div`);
        card.className = "card bg-ligth"
        card.innerHTML = `
            <img src="${event.image}">
            <h3 class="title-card"><b>${event.name}</b></h3>
                <p>
                    ${event.description}
                </p>
            <div class="d-flex justify-content-between align-items-center">
                <h4><b>$${event.price}</b></h4>
                <a class="a-card pointer" href="./details.html?id=${event._id}">Show more...</a>
            </div>`
        divCards.appendChild(card)
    }
    );
}


// Checkboxs ✔✔
function checkboxCategoria(array) {
    let categorias = array.map((event) => event.category);
    let categoriasSinRepetir = new Set(categorias);
    let categoriasActual = [...categoriasSinRepetir];
    createCheckbox(categoriasActual);
}

function createCheckbox(array) {
    let inputCheckbox = "";
    array.forEach((categoria) => {
        inputCheckbox += `<li class="d-flex flex-row align-items-center user-select-none inputCheckBox">
                    <input id="${categoria}" value="${categoria}" class="checkbox" type="checkbox">
                    <label class="pointer" for="${categoria}">${categoria}</label>
                </li> `;
    });
    document.querySelector("#categories").innerHTML = inputCheckbox;
}

// Buscador combinado
function buscadorcategorias(array) {
    inputSearch.addEventListener('keyup', () => {
        let arrayFiltrado = search(array, inputSearch.value)
        innerCards(arrayFiltrado)
    });
    divCheckboxs.addEventListener(`change`, () => {
        inputSearch.value = ""
        let arrayFiltrado1 = filtrarCheckboxs(array)
        innerCards(arrayFiltrado1)
        inputSearch.addEventListener('keyup', () => {
            var arrayFiltrado = search(arrayFiltrado1, inputSearch.value)
            innerCards(arrayFiltrado)
        });
    });
}

// Buscador ✔✔
function search(array, text) {
    let arrayFiltrado = array.filter(elemento => elemento.name.toLowerCase().includes(text.toLowerCase().trim()))
    if (arrayFiltrado.length == 0) {
        let card = document.getElementById(`d-none`);
        card.classList.remove("d-none")
    } else if (arrayFiltrado.length > 0) {
        let card = document.getElementById(`d-none`);
        card.classList.add("d-none")
    }
    return arrayFiltrado
}


// Filtrar checkboxs ✔✔
function filtrarCheckboxs(array) {
    let arrayFiltrado = []
    let checkboxs = document.querySelectorAll("input[type='checkbox']")
    let arrayChecboxs = Array.from(checkboxs)
    let arrayChecboxsFiltrado = arrayChecboxs.filter(e => e.checked)
    let arrayValores = arrayChecboxsFiltrado.map(e => e.value)
    arrayFiltrado = array.filter(e => arrayValores.includes(e.category))
    if (arrayFiltrado.length == 0) {
        return array
    } else {
        return arrayFiltrado
    }
}


// Tablas ✔✔
function revenue(assistance, price) {
    return assistance * price;
};

function percentage(assistance, capacity) {
    return assistance * 100 / capacity;
};

function tableUpcoming(array) {
    let estimado = []
    estimado = array.filter(data =>
        data.estimate)
    let arrayEstimado = Array.from(estimado)
    let categories = []
    arrayEstimado.forEach(data => {
        if (!categories.includes(data.category)) {
            categories.push(data.category)
        }
    })
    for (let i = 0; i < categories.length; i++) {
        let revenuesCategory = 0
        let percentageCategory = 0
        let estimate = 0
        let capacity = 0
        let tr = document.createElement('tr')
        tr.innerHTML = `
    <td> ${categories[i]} </td>
    `
        for (let j = 0; j < arrayEstimado.length; j++) {
            if (arrayEstimado[j].category == categories[i]) {
                revenuesCategory += arrayEstimado[j].price * parseInt(arrayEstimado[j].estimate);
                estimate = +parseInt(arrayEstimado[j].estimate)
                capacity = + parseInt(arrayEstimado[j].capacity)
            }
        }
        percentageCategory = percentage(estimate, capacity).toFixed(2)
        tr.innerHTML += `
    <td> $${revenuesCategory.toLocaleString()} </td>
    <td> ${percentageCategory}% </td>
    `
        upcomingEvents.appendChild(tr)
    }
}

function tablePast(array) {
    let estimado = []
    estimado = array.filter(data =>
        data.assistance)
    let arrayEstimado = Array.from(estimado)
    let categories = []
    arrayEstimado.forEach(data => {
        if (!categories.includes(data.category)) {
            categories.push(data.category)
        }
    })
    for (let i = 0; i < categories.length; i++) {
        let revenuesCategory = 0
        let percentageCategory = 0
        let assistance = 0
        let capacity = 0
        let tr = document.createElement('tr')
        tr.innerHTML = `
    <td> ${categories[i]} </td>
    `
        for (let j = 0; j < arrayEstimado.length; j++) {
            if (arrayEstimado[j].category == categories[i]) {
                revenuesCategory += arrayEstimado[j].price * parseInt(arrayEstimado[j].assistance);
                assistance = +parseInt(arrayEstimado[j].assistance)
                capacity = + parseInt(arrayEstimado[j].capacity)
            }
        }
        percentageCategory = percentage(assistance, capacity).toFixed(2)
        tr.innerHTML += `
    <td> $${revenuesCategory.toLocaleString()} </td>
    <td> ${percentageCategory}% </td>
    `
        pastEvents.appendChild(tr)
    }
}

function eventsWith(array) {
    let percentages = []
    let capacities = []
    for (let i = 0; i < array.length; i++) {
        percentages.push((percentage(array[i].assistance, array[i].capacity)))
    };
    for (let i = 0; i < array.length; i++) {
        capacities.push(array[i].capacity)
    };
    let maxCapacity = Math.max(...capacities);
    let max = Math.max(...percentages);
    let min = Math.min(...percentages);

    let nombreMaxCapacity = capacities.indexOf(maxCapacity.toString())
    let nombreMax = percentages.indexOf(max)
    let nombreMin = percentages.indexOf(min)

    document.querySelector("#maxCapacity").innerHTML = `${array[nombreMaxCapacity].name} width: ${maxCapacity.toLocaleString()}`;
    document.querySelector("#maxPercentage").innerHTML = `${array[nombreMax].name} width: ${max}%`;
    document.querySelector("#minPercentage").innerHTML = `${array[nombreMin].name} width: ${min}%`;
}


// Details ✔
function innerDetails(array) {
    var idCarta = location.search.split("?id=").join("");
    var event = array.filter((carta) => carta._id == idCarta)[0];
    if (event.assistance) {
        var estructuraCarta = `
    <article class="d-flex justify-content-center article-ubicacion">
        <h1>${event.name}</h1>
    </article>
    <div class="d-flex justify-content-center align-items-center flex-column details-div">
            <img class="details-img" src="${event.image}" />
        <div class="details-texto">
            <p><b>Name:</b> ${event.name}</p>
            <p><b>Description:</b> ${event.description}</p>
            <p><b>Category:</b> ${event.category}</p>
            <p><b>Date:</b> ${event.date}</p>
            <p><b>Place:</b> ${event.place}</p>
            <p><b>Capacity:</b> ${event.capacity}</p>
            <p><b>Assistance:</b> ${event.assistance}</p>
            <p><b>Price:</b> $${event.price}</p>
        </div>
            <div>
                <a href="index.html" class="a-details text-decoration-none pointer">Back</a>
            </div>
    </div>
    `;
        document.querySelector("#cards-details").innerHTML = estructuraCarta;
    }
    else {
        var estructuraCarta = `
    <article class="d-flex justify-content-center article-ubicacion">
        <h1>${event.name}</h1>
    </article>
    <div class="d-flex justify-content-center align-items-center flex-column details-div">
            <img class="details-img" src="${event.image}" />
        <div class="details-texto">
            <p><b>Name:</b> ${event.name}</p>
            <p><b>Description:</b> ${event.description}</p>
            <p><b>Category:</b> ${event.category}</p>
            <p><b>Date:</b> ${event.date}</p>
            <p><b>Place:</b> ${event.place}</p>
            <p><b>Capacity:</b> ${event.capacity}</p>
            <p><b>Estimate:</b> ${event.estimate}</p>
            <p><b>Price:</b> $${event.price}</p>
        </div>
            <div><a href="index.html" class="a-details text-decoration-none pointer">Back</a>   
        </div>
    </div>
    `;
        document.querySelector("#cards-details").innerHTML = estructuraCarta;
    }
}