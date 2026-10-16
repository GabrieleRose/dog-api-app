
const form = document.querySelector("#dog-form");
const breedInput = document.querySelector("#breed");
const temperamentInput = document.querySelector("#temperament");
const resultsContainer = document.querySelector("#results");

// run function when user submits form
form.addEventListener("submit", onFormSubmit);

function onFormSubmit(event) {
  // prevent page from refreshing
  event.preventDefault();

  // get breed and temperament from form
  const breedName = breedInput.value.toLowerCase().trim();
  const temperament = temperamentInput.value;

  // clear previous search results
  resultsContainer.innerHTML = "";
  resultsContainer.style.display = "flex";
  resultsContainer.style.flexWrap = "wrap";
  resultsContainer.style.justifyContent = "center";

  // get dog data and display matching breeds
  getDogData()
    .then((data) => {
      const filteredDogs = filterDogData(data, breedName, temperament);
      displayDogs(filteredDogs);
    })
    .catch((error) => console.error(error));
}

// get breed information from api
function getDogData() {
  const apiKey = "live_iOlfcM7abDYuMAjYo5D5c3FFXrQ8IG7O7SdXH27WTsTU9t65ToAndqQG31bcloYd";
  const url = "https://api.thedogapi.com/v1/breeds";

  return fetch(url, {
    headers: {
      "x-api-key": apiKey
    }
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

// find breeds matching search
function filterDogData(dogs, breedName, temperament) {
  const filteredDogs = [];

  // check each dog in array
  for (const dog of dogs) {
    const matchesBreed = dog.name.toLowerCase().includes(breedName);
    let matchesTemperament = true;

    // check temperament if user selected one
    if (
      temperament !== "" &&
      (!dog.temperament ||
        !dog.temperament.toLowerCase().includes(temperament.toLowerCase()))
    ) {
      matchesTemperament = false;
    }

    // add dog if both search conditions match
    if (matchesBreed && matchesTemperament) {
      filteredDogs.push(dog);
    }
  }

  return filteredDogs;
}

// display matching dogs as cards
function displayDogs(dogs) {
  // show message when no breeds match search
  if (dogs.length === 0) {
    resultsContainer.textContent = "No dogs found. Try a different search.";
    return;
  }

  // create card for each matching dog
  for (const dog of dogs) {
    const card = document.createElement("div");
    card.style.backgroundColor = "white";
    card.style.borderRadius = "1rem";
    card.style.padding = "1rem";
    card.style.width = "280px";
    card.style.margin = "1rem";

    const image = document.createElement("img");

    // show dog image or placeholder if image is missing
    if (dog.image && dog.image.url) {
      image.src = dog.image.url;
    } else {
      image.src = "https://placehold.co/300x200?text=No+Image";
    }

    image.alt = dog.name;
    image.style.width = "100%";
    image.style.height = "200px";
    image.style.objectFit = "cover";

    // display breed name
    const name = document.createElement("h2");
    name.textContent = dog.name;

    // display life span or message if unavailable
    const lifeSpan = document.createElement("p");

    if (dog.life_span) {
      lifeSpan.textContent = "Life Span: " + dog.life_span;
    } else {
      lifeSpan.textContent = "Life span unknown";
    }

    // display temperament or message if unavailable
    const dogTemperament = document.createElement("p");

    if (dog.temperament) {
      dogTemperament.textContent = "Temperament: " + dog.temperament;
    } else {
      dogTemperament.textContent = "Temperament unknown";
    }

    // add dog information to card
    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(lifeSpan);
    card.appendChild(dogTemperament);

    // add card to results section
    resultsContainer.appendChild(card);
  }
}
