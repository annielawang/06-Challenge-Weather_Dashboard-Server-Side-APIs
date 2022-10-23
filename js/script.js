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
// -----------------Variables-----------------------

// city input

// currentConditions
// futureConditions
// cityHistory
// cityName
// cityDate
// cityIcon
// cityTemp
// cityHum
// cityWind
// searchBtn
var $searchBtn = $('.btn');
var $cityName = $('#city');
var $cardParent = $('#five-days-weather');





// ----------------------Functions--------------------

// add event listener to button

// generate url request for api
function generateUrl(event){
    // prevent default behavior of forms
    event.preventDefault();
    // get input content
    let cityNameText = $cityName.val();
    // put input in url
    let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityNameText}&units=imperial&appid=e677746088bd5891b31a29b800f81424`
    sendUrlAndUseResponseData(requestUrl);
}
// send api request, get api response and parse results
function sendUrlAndUseResponseData(requestUrl){
    console.log(requestUrl);
    $.ajax({
        url: requestUrl,
    }).then(function(response){
        var j = 0;
        for(let i = 0; i < response.list.length; i+=8){
            j++;

            // for 5 days predicates
            var weatherObj = response.list[i];
            var temperature = weatherObj.main.temp;
            var currentDate = weatherObj.dt_txt;
            var currentIcon = weatherObj.weather[0].icon;
            var currentHumidity = weatherObj.main.humidity;
            var currentWind = weatherObj.wind.speed;
            // var weatherDateID = "#weather-date-" + j;
            // var $weatherDate = $(weatherDateID).text(currentDate);
            // console.log($weatherDate);

            var newElem = `<div class="card col-2" style="width: 18rem;">
            <div class="card-body" id="card-1">
              <h5 class="card-title weather-date">${currentDate}</h5>
              <img src="" alt="weather-icon">
              <p class="card-text">
                <ul>
                    <li>Temperature:${temperature} °F</li>
                    <li>Humidity:${currentHumidity} MPH</li>
                    <li>Wind speed:${currentWind} %</li>
                </ul>
              </p>
            </div>
        </div>`
        $cardParent.append(newElem);

            // create card and elements and put info into this card and append child.
            // create element and render current date

            // create element and render icon
            // create element and render temperature
            // create element and render humidity
            // create element and render wind speed



        }
    })

    // "lat": 34.0901,
    //   "lon": -118.4065,
    //http://openweathermap.org/img/wn/01d@2x.png
}
// add history to local storage
function renderHistory(){
// get local storage and render on webpages
// use localStorage.getitem
// parse data from local storage
// render data on web page
}








// ---------------------Main entry----------------------

// render last researched city and weather on page
renderHistory();
$searchBtn.on("click", generateUrl);
