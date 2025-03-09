const apiKey = "your_api_key"; // Replace with your OpenWeatherMap API key

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Please enter a city name");
        return;
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === "404") {
            alert("City not found!");
            return;
        }
        
        document.getElementById("cityName").textContent = data.name;
        document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
        document.getElementById("description").textContent = `Weather: ${data.weather[0].description}`;
        document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById("windSpeed").textContent = `Wind Speed: ${data.wind.speed} m/s`;
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        
        changeBackground(data.weather[0].main);
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        alert("Error fetching weather data");
        console.error(error);
    }
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "<h3>5-Day Forecast</h3>";
    
    for (let i = 0; i < data.list.length; i += 8) { // Taking data every 24 hours
        const forecast = data.list[i];
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
            <p>${new Date(forecast.dt_txt).toDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
            <p>${forecast.main.temp}°C</p>
        `;
        forecastContainer.appendChild(forecastItem);
    }
}

// Auto-detect user location
window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                document.getElementById("cityInput").value = data.name;
                getWeather();
            } catch (error) {
                console.error("Error fetching location-based weather data", error);
            }
        });
    }
};

// Change background based on weather condition
function changeBackground(weather) {
    const body = document.body;
    if (weather.includes("Clear")) {
        body.style.backgroundImage = "url('images/clear.jpg')";
    } else if (weather.includes("Cloud")) {
        body.style.backgroundImage = "url('images/cloudy.jpg')";
    } else if (weather.includes("Rain")) {
        body.style.backgroundImage = "url('images/rainy.jpg')";
    } else if (weather.includes("Snow")) {
        body.style.backgroundImage = "url('images/snowy.jpg')";
    } else {
        body.style.backgroundImage = "url('images/default.jpg')";
    }
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
}

// Dark Mode Toggle
const toggleThemeButton = document.getElementById("toggleTheme");
toggleThemeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
