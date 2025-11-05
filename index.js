//state variables
let parties = [];
let oneParty;

const app = document.querySelector("#app");

const title = document.createElement("h1");
title.textContent = "Fullstack Convention Center Events";

const partiesList = document.createElement("div");
partiesList.id = "partiesList";

const partyDetails = document.createElement("div");
partyDetails.id = "partyDetails";

app.append(title, partiesList, partyDetails);

const render = () => {
  const listHTML = parties.map((party) => {
    return `
    <div class="partyName" data-id="${party.id}">
    <h2>${party.name}</h2>
    </div>
    `;
  });

  partiesList.innerHTML = listHTML.join("");

  if (!oneParty) {
    partyDetails.textContent = "Click on a party to see its details";
  } else {
    partyDetails.innerHTML = `
    <div class="party-desc">
    <h3>${oneParty.name}</h3>
    <p>ID: ${oneParty.id}</p>
    <p>Date: ${oneParty.date}</p>
    <p>Description: ${oneParty.description}</p>
    <p>Location: ${oneParty.location}</p>

    <button class="partyDelete" data-id="${oneParty.id}">Delete Party</button>
    </div>
    `;
  }
};

//async function
const fetchParties = async () => {
  try {
    const response = await fetch(
      "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2510-et-web-ft/events"
    );
    const data = await response.json();
    console.log(data.data);

    parties = data.data;
    render();
  } catch (error) {
    console.error(error);
  }
};
fetchParties();

partiesList.addEventListener("click", async (event) => {
  const card = event.target.closest(".partyName");
  if (!card) return;

  const id = Number(card.dataset.id);
  console.log("clicked id:", id);
  try {
    const response = await fetch(
      `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2510-et-web-ft/events/${id}`
    );
    const data = await response.json();

    oneParty = data.data;
    render();
  } catch (error) {
    console.error(error);
  }
});

const form = document.createElement("form");

form.innerHTML = `
<label>Name: </label>
<input name="name" required />

<label>Description:</label>
<input name="description" required />

<label>Date:</label>
<input name ="date" type="date" required />

<label>Location:</label>
<input name="location" required />

<button type="submit">Add Party</button>
`;

app.append(form);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const dataFromForm = formData.get("date");
  const isoDate = new Date(dataFromForm).toISOString();
  const newParty = {
    name: formData.get("name"),
    description: formData.get("description"),
    date: isoDate,
    location: formData.get("location"),
  };

  try {
    const response = await fetch(
      "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2510-et-web-ft/events",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newParty),
      }
    );
    const data = await response.json();
    parties.push(data.data);
    form.reset();
    render();
  } catch (error) {
    console.error(error);
  }
});

partyDetails.addEventListener("click", async (event) => {
  if (event.target.classList.contains("partyDelete")) {
    const id = Number(event.target.getAttribute("data-id"));
    console.log(id);
    try {
      const response = await fetch(
        `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2510-et-web-ft/events/${id}`,
        {
          method: "DELETE",
        }
      );
      parties = parties.filter((party) => party.id !== id);
      oneParty = null;
      render();
    } catch (error) {
      console.error(error);
    }
  }
});
