var ApiKey = `74daefb956f8b3dbea0d7f059ab98e7a`;
var storeCity = [];
var temp = document.getElementById("temp");
var humidity = document.getElementById("humi");
var windSpeed = document.getElementById("wind");
var icon = document.getElementById("icon");
var cityName = document.getElementById("name");


var fetchWeatherApi = async(city) => {
    var res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Imperial&appid=${ApiKey}`
    );
    var data = await res.json();
};

var handleSearch = () => {
    var cityName = document.getElementById("city").value;
    fetchWeatherApi(cityName);
    showDetail();
    storeCity.push(cityName);
    localStorage.setItem("history", JSON.stringify(storeCity));

    document.getElementById("city").value = "";
};