"use strict";

const baseURL = "https://api.weatherapi.com/v1/";
const apiKey = "47d2900457ea40d6973114201241006";
const urlApi = `${baseURL}forecast.json?key=${apiKey}`;
const search = document.getElementById("searchBtn");
const weatherDisplay = document.getElementById("weatherData");
const changeMode = document.getElementById("changeMode");
const displayAllDataBtn = document.getElementById("displayAllDataBtn");

changeMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
search.value = "cairo";
getWeather();

async function getWeather() {
  try {
    const response = await fetch(`${urlApi}&q=${search.value}&days=14`);
    const data = await response.json();
    console.log(data);
    displayWeather(data);
  } catch (error) {
    console.log("Invalid input", error);
  }
}

function displayAllDays() {
  const elements = document.querySelectorAll(".day.d-none");
  elements.forEach((element) => {
    element.classList.remove("d-none");
  });
  const btn = document.getElementById("displayAllDataBtn");
  btn.classList.add("d-none");
}

function displayWeather(data) {
  const localTime = formatTime(data.location.localtime);
  const weatherHTML = generateWeatherHTML(data, localTime);
  weatherDisplay.innerHTML = weatherHTML;
}

function formatTime(localTime) {
  let time = localTime.split(" ")[1];
  const hours = +time.split(":")[0];
  const minutes = time.split(":")[1];
  if (hours > 12) {
    time = `${hours - 12}:${minutes} PM`;
  } else if (hours === 12) {
    time += " PM";
  } else if (hours === 0) {
    time = `12:${minutes} AM`;
  } else {
    time += " AM";
  }
  return time;
}

function generateWeatherHTML(data, localTime) {
  let weatherHTML = `
    <div class="location m-auto my-3">
      <p class="name">Location: ${data.location.name}</p>
      <p class="region">Region: ${data.location.region}</p>
      <p class="time">Time: ${localTime}</p>
      <p class="country">Country: ${data.location.country}</p>
    </div>
          <div class="location m-auto my-3">
          <h3 class="my-3">Current Weather For ${data.location.name}</h3>
          <p>${data.current.temp_c}&deg;C</p>
          <img src="${data.current.condition.icon}" alt="Weather icon" />
          <p class="text">${data.current.condition.text}</p>
          <div class="w-100 d-flex justify-content-around">
          <span class="wind">
            <i class="fa-solid fa-wind"></i> ${data.current.gust_kph} k/h
          </span>
          <span class="wind">
            <i class="fa-solid fa-umbrella"></i> ${data.current.vis_km}
          </span>
          <span class="wind">
            <i class="fa-solid fa-circle-up" style="rotate: ${data.current.wind_degree}deg;"></i> ${data.current.wind_dir}
          </span>
          </div>
        </div>
    <div class="container">
      <div class="row">
  `;

  data.forecast.forecastday.forEach((forecast, index) => {
    const date = new Date(forecast.date);
    const dayOfWeekName = date.toLocaleDateString("en-US", { weekday: "long" });
    const fullDate = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
    let displayElement =
      index > 2
        ? '<div class="day col-lg-4 col-md-6 d-none">'
        : '<div class="day col-lg-4 col-md-6">';
    weatherHTML += `
        ${displayElement}
        <div class="date d-flex justify-content-between">
          <p>${fullDate}</p>
          <p>${dayOfWeekName}</p>
        </div>
        <div class="temp d-flex justify-content-center flex-column align-items-center">
          <p class="max-temp">${forecast.day.maxtemp_c}&deg;C</p>
          <p class="min-temp">${forecast.day.mintemp_c}&deg;C</p>
          <img src="${forecast.day.condition.icon}" alt="Weather icon" />
          <p class="text">${forecast.day.condition.text}</p>
          <span class="wind">
            <i class="fa-solid fa-umbrella"></i> ${forecast.day.maxwind_kph} k/h
          </span>
        </div>
      </div>
    `;
  });

  weatherHTML += `
      </div>
      <div id="displayAllDataBtn" onclick="displayAllDays()">Show All Days</div>
    </div>
  `;
  return weatherHTML;
}

search.addEventListener("input", () => getWeather());
