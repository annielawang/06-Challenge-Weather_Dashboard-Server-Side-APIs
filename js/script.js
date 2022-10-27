/**
 * Acceptance criteria:
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
 */
// -----------------------------------Variables--------------------------------
var $searchBtn = $('.btn');
var $cityName = $('#city');
var $cardParent = $('#five-days-weather');

var $currentCity = $('#current_city');
var $currentDate = $('#current_date');
var $currentCityTemp = $('#current_city_temp');
var $currentCityWind = $('#current_city_wind');
var $currentCityHum = $('#current_city_hum');
var $currentCityIcon = $('#current_city_icon');

var $leftSide = $('#leftside');
var localCitiesKey = "LOCAL_CITIES";
var localCitiesCurrent = [];
var currentCity;


// ---------------------------------Functions-------------------------------
// generate url request for api

function generateUrl(event){
    // prevent default behavior of forms
    event.preventDefault();
    // append a button
    currentCity = $cityName.val();
    // When the input is empty, alert and do nothing.
    if(currentCity == ""){
        alert("Please enter a city name.");
        return;
    }

    generateCurrentUrl(currentCity);
    generateForecastUrl(currentCity);
    
    var newBtnHtml = `<div class="row justify-content-center mt-2"><button type="button" class="btn btn-primary history_city">${currentCity}</button> </div>`;
    if(localCitiesCurrent.indexOf(currentCity) == -1) {
        // append the new city name button if it doesn't exist in history buttons
        $leftSide.prepend(newBtnHtml);
        // add new city name to local storage
        localCitiesCurrent.push(currentCity);
        // add history to local storage
        localStorage.setItem(localCitiesKey, JSON.stringify(localCitiesCurrent));
    }
}

// send url requests to weather API using the history city name of the button clicked
function historyBtnListener() {
    $('.history_city').on("click", function(){
        currentCity = $(this).html();
        generateCurrentUrl(currentCity);
        generateForecastUrl(currentCity);
    });
}

// generate url for current weather
function generateCurrentUrl(cityName){
    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=e677746088bd5891b31a29b800f81424`
    sendUrlAndUseCurrentData(requestUrl);
}

// send current weather api request and use the response
function sendUrlAndUseCurrentData(requestUrl) {
    $.ajax({
        url: requestUrl,
    }).then(function(response){
        // use response to render .jumbotron sub-elements
        $currentCity.text(currentCity);
        $currentDate.text("(" + getCurrentDate() + ")");
        $currentCityTemp.text("Temp: " + response.main.temp + " °F");
        $currentCityWind.text("Wind: " + response.wind.speed + " MPH");
        $currentCityHum.text("Humidity: " + response.main.humidity + "%");
        var currentIcon = response.weather[0].icon;
        var imgStr = `<img src="http://openweathermap.org/img/wn/${currentIcon}@2x.png">`
        $currentCityIcon.html(imgStr);
    });
}

function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
}

// generate url for future weather
function generateForecastUrl(cityName){
    // get input content and use it as a parameter value in url
    let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=e677746088bd5891b31a29b800f81424`
    sendForecastUrlAndUseResponseData(requestUrl);
}

// send weather forecast api request, get api response and use response data
function sendForecastUrlAndUseResponseData(requestUrl){
    $.ajax({
        url: requestUrl,
    }).then(function(response){
        $cardParent.html("");
        // use api response to render weather forecast cards
        for(let i = 0; i < response.list.length; i+=8){
            // for 5 days forecast
            var weatherObj = response.list[i];
            var futureTemperature = weatherObj.main.temp;
            var futureDate = weatherObj.dt_txt;
            // get rid of hour info using substring method
            futureDate = futureDate.substring(0, futureDate.indexOf(" "));
            var futureIcon = weatherObj.weather[0].icon;
            var futureHumidity = weatherObj.main.humidity;
            var futureWind = weatherObj.wind.speed;
            var newElem = 
            `<div class="card col-2 bg-info" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title weather-date">${futureDate}</h5>
                    <p class="card-text">
                    <ul>
                        <img src="http://openweathermap.org/img/wn/${futureIcon}@2x.png">        
                        <li>Temperature:${futureTemperature} °F</li>
                        <li>Humidity:${futureHumidity} MPH</li>
                        <li>Wind speed:${futureWind} %</li>
                    </ul>
                    </p>
                </div>
            </div>`
            $cardParent.append(newElem);
        }
    })
}

// get history city names from local storage
function getCurrentCities() {
    var localStoredCities = localStorage.getItem(localCitiesKey);
    if(localStoredCities != null && localStoredCities != "") {
        localCitiesCurrent = JSON.parse(localStoredCities);
        currentCity = localCitiesCurrent[0];
        renderHistory();
    }
}

// render history city names on page as buttons and send url requests based on the button clicked
function renderHistory(){
    if(localCitiesCurrent.length > 0) {
        // render right side use the first city
        generateCurrentUrl(currentCity);
        generateForecastUrl(currentCity);
        // append all buttons to the left side
        for (let index = 0; index < localCitiesCurrent.length; index++) {
            var newBtnHtml = `<div class="row justify-content-center mt-2"><button type="button" class="btn btn-primary history_city">${localCitiesCurrent[index]}</button> </div>`;
            $leftSide.append(newBtnHtml);
        }
        historyBtnListener();
    }
}

// ---------------------Main entry----------------------

// render last researched city and weather on page
getCurrentCities();
$searchBtn.on("click", generateUrl);
