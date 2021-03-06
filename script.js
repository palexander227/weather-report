var ApiKey = `74daefb956f8b3dbea0d7f059ab98e7a`;
var storeCity = [];
if (localStorage.getItem("history")) {
    storeCity = JSON.parse(localStorage.getItem("history"));
}
var temp = document.getElementById("temp");
var humidity = document.getElementById("humi");
var windSpeed = document.getElementById("wind");
var icon = document.getElementById("icon");
var cityName = document.getElementById("name");
var getUviClass = (uvi) => {
    if(uvi == null){
      return;
    }
    uvi = parseFloat(uvi);
    if (uvi >= 8) {
      return 'uvi-high';
    }else if (uvi >= 3) {
      return 'uvi-medium';
    }else {
      return 'uvi-low';
    }
  };


var showDetail = () => {
    /*This function retrieves and formats the API data from local storage. It calls the above
    'getUviClass to get the UV data --- tricky to get right.*/ 
    var weather = JSON.parse(localStorage.getItem("weather"));

    if (weather) {
        //format date
        var date = new Date(weather?.date * 1000);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var formattedTime = month + "/" + day + "/" + year;

        cityName.innerHTML = `${weather?.name} ${formattedTime}`;
        temp.innerHTML = `Temprature: ${weather?.temp} °F`;
        humidity.innerHTML = `Humidity: ${weather?.humidity} %`;
        windSpeed.innerHTML = `Wind speed: ${weather?.speed} MPH`;
        uvi.innerHTML = `UV Index: <span class="${getUviClass(weather?.uvi)}">${weather?.uvi}</span>`;
        icon.setAttribute(
            "src",
            `http://openweathermap.org/img/w/${weather?.icon}.png`
        );
        if (weather?.daily) {
            var forecast5Html = '';
            for (var i = 0; i < weather.daily.length && i < 5; i++) {
                date.setDate(date.getDate() + 1);
                day = date.getDate();
                month = date.getMonth() + 1;
                year = date.getFullYear();
                formattedTime = month + "/" + day + "/" + year;
                forecast5Html += `<div class="card">
                <h1>${formattedTime}</h1>
                <img src="http://openweathermap.org/img/w/${weather.daily[i].weather[0].icon}.png" alt=".." />
                <p>Temp: ${weather.daily[i].temp.day} F</p>
                <p>Humidity: ${weather.daily[i].humidity}</p>
              </div>`;
            }
            document.getElementById("forecast-cards").innerHTML = forecast5Html;
        }

    }
};

//Get and track the historical data for future reference. Note last use goes on top.
var handleCityHistory = (id) => {
    var history = JSON.parse(localStorage.getItem("history")).reverse();
    var histData = history.filter((item, ind) => {
      return history[ind] == history[id];
    });
    fetchWeatherApi(histData[0]);
  };

  //Tracking the list of cities the user has viewed on previous occasions. For use in final display.
  var renderCityList = () => {
    let cityList = "";
    var history = JSON.parse(localStorage.getItem("history"));
    if (history) {
      var revhistory = history.reverse();
      var citylist = document.getElementById("history");
      revhistory.map((city, i) => {
        cityList += `<p onclick="handleCityHistory(${i})">${city}</p>`;
      });
      citylist.innerHTML = cityList;
    }
  };



/*This does the heavy lifting of getting the data into local storage. Note the addition of
a second 'fetch' to extract the appropriate UV data.*/

var fetchWeatherApi = async(city) => {
    var res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Imperial&appid=${ApiKey}`
    );
    var data = await res.json();

    if (data?.cod == 404) {
        window.alert("City not found");
        return false;
    }

    var res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=Imperial&appid=${ApiKey}`
      );
     
      var data2 = await res2.json();

    localStorage.setItem(
        "weather",
        JSON.stringify({
            temp: data.main.temp,
            humidity: data.main.humidity,
            speed: data.wind.speed,
            icon: data.weather[0].icon,
            date: data.dt,
            name: data.name,
            uvi: data2.current.uvi,
            daily: data2.daily,
        })
    );
    renderCityList();
    showDetail();

};

//This function triggers all the work of the above in response to the user's click on icon.
var handleSearch = () => {
    var cityName = document.getElementById("city").value;
    fetchWeatherApi(cityName);
    showDetail();
    storeCity.push(cityName);
    localStorage.setItem("history", JSON.stringify(storeCity));

    document.getElementById("city").value = "";
};
renderCityList();
showDetail();