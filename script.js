const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const city = document.getElementById("city");
const condition = document.getElementById("condition");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const forecast = document.getElementById("forecast");


searchBtn.addEventListener("click", getWeather);


cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


async function getWeather() {

    const cityName = cityInput.value.trim();

    if (cityName === "") {
        alert("Please enter a city.");
        return;
    }


    city.textContent = "Loading...";
    condition.textContent = "Getting weather...";
    temperature.textContent = "--";
    humidity.textContent = "--";
    wind.textContent = "--";

    forecast.innerHTML = "<p>Loading 5-day forecast...</p>";


    try {

        // Find the city

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        );


        const locationData = await locationResponse.json();


        if (!locationData.results ||
            locationData.results.length === 0) {

            throw new Error("City not found.");

        }


        const location = locationData.results[0];


        const latitude = location.latitude;
        const longitude = location.longitude;


        // Get weather data

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`
        );


        const weatherData = await weatherResponse.json();


        // Current weather

        const current = weatherData.current;


        city.textContent =
            `${location.name}, ${location.country}`;


        temperature.textContent =
            Math.round(current.temperature_2m);


        humidity.textContent =
            current.relative_humidity_2m;


        wind.textContent =
            Math.round(current.wind_speed_10m);


        condition.textContent =
            getWeatherDescription(current.weather_code);


        // Create 5-day forecast

        createForecast(weatherData.daily);


    } catch (error) {

        console.error(error);

        city.textContent = "Error";

        condition.textContent =
            "Could not get weather data.";

        temperature.textContent = "--";

        humidity.textContent = "--";

        wind.textContent = "--";

        forecast.innerHTML =
            "<p>Please check the city name and try again.</p>";

    }

}


/* Create the 5 forecast cards */

function createForecast(daily) {

    forecast.innerHTML = "";


    for (let i = 0; i < daily.time.length; i++) {

        const date = new Date(daily.time[i]);


        const dayName = date.toLocaleDateString(
            "en-US",
            {
                weekday: "short"
            }
        );


        const maxTemp =
            Math.round(daily.temperature_2m_max[i]);


        const minTemp =
            Math.round(daily.temperature_2m_min[i]);


        const rain =
            daily.precipitation_probability_max[i];


        const weather =
            getWeatherDescription(daily.weather_code[i]);


        const icon =
            getWeatherIcon(daily.weather_code[i]);


        const card =
            document.createElement("div");


        card.className = "forecast-card";


        card.innerHTML = `
            <h3>${dayName}</h3>

            <div class="forecast-icon">
                ${icon}
            </div>

            <p>${weather}</p>

            <p>
                <strong>${maxTemp}°</strong>
                / ${minTemp}°
            </p>

            <p>🌧️ ${rain}%</p>
        `;


        forecast.appendChild(card);

    }

}


/* Weather descriptions */

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1) {
        return "Mainly clear";
    }

    if (code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 85 && code <= 86) {
        return "Snow showers";
    }

    if (code >= 95 && code <= 99) {
        return "Thunderstorm";
    }

    return "Unknown";

}


/* Weather icons */

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 57) {
        return "🌦️";
    }

    if (code >= 61 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code >= 85 && code <= 86) {
        return "🌨️";
    }

    if (code >= 95 && code <= 99) {
        return "⛈️";
    }

    return "🌡️";

}