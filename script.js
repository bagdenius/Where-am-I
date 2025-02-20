'use strict';
// https://countries-api-836d.onrender.com/countries/

const btn = document.querySelector('.btn-country');
const errorsContainer = document.querySelector(`.errors`);
const countriesContainer = document.querySelector('.countries');
const currentCountryContainer = document.querySelector(`.country--current`);
const neighbourCountriesContainer = document.querySelector(
  `.countries--neighbours`
);

const renderError = msg => errorsContainer.insertAdjacentText(`beforeend`, msg);

function renderCountry(data, container, className = ``) {
  const html = `
      <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
              <h3 class="country__name">${
                data.name === `Russian Federation` ? `Хуйня` : data.name
              }</h3>
              <h4 class="country__region">${data.region}</h4>
              <p class="country__row"><span>👫</span>${(
                +data.population / 1000000
              ).toFixed(1)} million people</p>
              <p class="country__row"><span>🗣️</span>${
                data.languages[0].name
              }</p>
              <p class="country__row"><span>💰</span>${
                data.currencies[0].name
              }</p>
          </div>
      </article>`;
  container.insertAdjacentHTML(`beforeend`, html);
}

const getJSON = (url, errMsg = `Something went wrong`) =>
  fetch(url).then(response => {
    if (!response.ok) throw new Error(`${response.status}: ${errMsg}`);
    return response.json();
  });

const getGeolocation = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

const getGeocode = (latitude, longitude) =>
  getJSON(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
    `Problem with geocoding`
  );

const getCountryData = countryCode =>
  getJSON(
    `https://restcountries.com/v2/alpha/${countryCode}`,
    `Problem with getting country`
  );

function clear() {
  errorsContainer.innerHTML =
    currentCountryContainer.innerHTML =
    neighbourCountriesContainer.innerHTML =
      ``;
}

async function whereAmI(e, countryCode) {
  try {
    clear();
    // Geolocation
    const geolocation = await getGeolocation();
    const { latitude, longitude } = geolocation.coords;
    // Reverse geocoding
    const geocode = await getGeocode(latitude, longitude);
    // Country data
    const country = await getCountryData(
      countryCode ? countryCode : geocode.countryCode
    );
    const neighbourPromises = country.borders.map(
      async code => await getCountryData(code)
    );
    const neighbours = await Promise.all(neighbourPromises);
    // Rendering on page
    renderCountry(country, currentCountryContainer);
    neighbours.forEach(n =>
      renderCountry(n, neighbourCountriesContainer, `neighbour`)
    );
    countriesContainer.style.opacity = 1;
  } catch (err) {
    console.error(err);
    renderError(`${err.message}`);
    countriesContainer.style.opacity = 0;
  }
}

btn.addEventListener(`click`, whereAmI);

/////////////////////////////////////////////////////////
/* // CHALLENGE #1
function whereAmI(lat, lng) {
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
  )
    .then(response => {
      if (!response.ok)
        throw new Error(`${response.status}: Problem with geocoding`);
      return response.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.countryName}`);
      getCountryData(data.countryName);
    })
    .catch(err => console.error(`${err.message} 💥`));
}

// btn.addEventListener(`click`, e => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       pos => {
//         const { latitude, longitude } = pos.coords;
//         whereAmI(latitude, longitude);
//       },
//       () => alert(`Could not get your position`)
//     );
//   }
// });

btn.addEventListener(`click`, whereAmI);

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474); */

/* // CHALLENGE #2
const imgContainer = document.querySelector(`.images`);
let curImgEl;

const wait = seconds =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));

const createImage = imgPath =>
  new Promise(function (resolve, reject) {
    const imgEl = document.createElement(`img`);
    imgEl.src = imgPath;
    imgEl.addEventListener(`load`, function () {
      imgContainer.append(this);
      resolve(this);
    });
    imgEl.addEventListener(`error`, () =>
      reject(new Error(`Image not found.`))
    );
  });

createImage(`img/img-1.jpg`)
  .then(imgEl => {
    curImgEl = imgEl;
    return wait(2);
  })
  .then(() => {
    curImgEl.style.display = `none`;
    return createImage(`img/img-2.jpg`);
  })
  .then(imgEl => {
    curImgEl = imgEl;
    return wait(2);
  })
  .then(() => {
    curImgEl.style.display = `none`;
    return createImage(`img/img-3.jpg`);
  })
  .then(imgEl => (curImgEl = imgEl))
  .catch(err => console.error(`ZALUPA: ${err}`)); */

/* // CHALLENGE #3
const imgContainer = document.querySelector(`.images`);

const wait = seconds =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));

const createImage = imgPath =>
  new Promise(function (resolve, reject) {
    const imgEl = document.createElement(`img`);
    imgEl.src = imgPath;
    imgEl.addEventListener(`load`, function () {
      imgContainer.append(this);
      resolve(this);
    });
    imgEl.addEventListener(`error`, () =>
      reject(new Error(`Image not found.`))
    );
  });

async function loadNPause() {
  try {
    let curImgEl = await createImage(`img/img-1.jpg`);
    await wait(2);
    curImgEl.style.display = `none`;
    curImgEl = await createImage(`img/img-2.jpg`);
    await wait(2);
    curImgEl.style.display = `none`;
    curImgEl = await createImage(`img/img-3.jpg`);
    await wait(2);
  } catch (err) {
    console.error(err);
  }
}
// loadNPause();

async function loadAll(imgArr) {
  try {
    const imgs = imgArr.map(async img => await createImage(img));
    const imgEls = await Promise.all(imgs);
    imgEls.forEach(img => img.classList.add(`parallel`));
  } catch (err) {
    console.error(err);
  }
}
const imgs = [`img/img-1.jpg`, `img/img-2.jpg`, `img/img-3.jpg`];
loadAll(imgs); */
