function formatDate(timestamp) {
  let date = new Date(timestamp);

  let days = [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ];
  let day = days[date.getDay()];
  return `${day}, ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function showTemp(response) {
  let dateElement = document.querySelector(`#date`);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let cityElement = document.querySelector(`#city`);
  cityElement.innerHTML = response.data.name;

  celsiusTemperature = response.data.main.temp;

  let temperatureElement = document.querySelector(`#temperature`);
  temperatureElement.innerHTML = Math.round(response.data.main.temp);

  let descriptionElement = document.querySelector(`#description`);
  descriptionElement.innerHTML = response.data.weather[0].description;

  let humidityElement = document.querySelector(`#humidity`);
  humidityElement.innerHTML = `humidity: ${response.data.main.humidity} %`;

  let windElement = document.querySelector(`#wind`);
  windElement.innerHTML = `wind: ${Math.round(response.data.wind.speed)} km/h`;

  let iconElement = document.querySelector(`#icon`);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function displayForecast(response) {
  let forecastElement = document.querySelector(`#forecast`);
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col">
            ${formatHours(forecast.dt * 1000)}
            <br />
            <img src="http://openweathermap.org/img/wn/${
              forecast.weather[0].icon
            }@2x.png"/>
            <div class="weather-forecast-temperature">
            <strong>
            ${Math.round(forecast.main.temp_max)}º
            </strong>
            |${Math.round(forecast.main.temp_min)}º
            </div>
          </div>`;
  }
}

function search(city) {
  let apiKey = `9cd8a2246f79707c08b7050e7b412588`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(showTemp);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function searchButton(event) {
  event.preventDefault();
  let cityInput = document.querySelector(`#city-input`);
  search(cityInput.value);
}

function fahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(`#temperature`);
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}
function celsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(`#temperature`);
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let cityForm = document.querySelector(`#city-form`);
cityForm.addEventListener(`submit`, searchButton);

let fahrenheitLink = document.querySelector(`#fahrenheit-link`);
fahrenheitLink.addEventListener("click", fahrenheitTemp);

let celsiusLink = document.querySelector(`#celsius-link`);
celsiusLink.addEventListener("click", celsiusTemp);

search("Porto");
