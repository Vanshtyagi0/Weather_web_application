const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".Loading-container")
const userInfoContainer = document.querySelector(".user-info-container")

// initially vairable need???

let currenTab = userTab;
const API_KEY = "27264a70dd0acaf8afb9ca38d5c3e37c";
currenTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if (clickedTab != currenTab){
        currenTab.classList.remove("current-tab");
        currenTab = clickedTab;
        currenTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // mai phle serach wale tab pr tha ab your weather tab vissible krna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mai your weather tab mai hu, toh weather bhi display krna pdega, so check local storage first
            //for cordinates, if we have save them there.     
            getfromSessionStorage();
        }
    }

}

userTab.addEventListener("click", () =>{
    //pass clicked tab as input paramete
    switchTab(userTab);
})
searchTab.addEventListener("click", () =>{
    //pass clicked tab as input paramete
    switchTab(searchTab);
})

//check if cordinate are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nhi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, log} = coordinates;
    //make grandcontainer invisiable
    grantAccessContainer.classList.remove("active");
    //make loader visiable
    loadingScreen.classList.add("active");
    //api call
    console.log(`lat:${lat}, log:${log}`)
    try{
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${API_KEY}&units=metric`
            );
        const data = await res.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        console.log("data going to render of city by your weather:",data?.name)
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("data not fecth",err);
    }
}

function renderWeatherInfo(weatherInfo){
    //  firstly we have to fetch the elememts
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const temp = document.querySelector("[data-temp]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch  values from weather info objects and put in ui elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `http://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    console.log(`"desc:${desc.innerText}, cloudiness:${cloudiness.innerText}, humidity:${humidity.innerText}`)

}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert for no geolocation support available
        console.log("location not find")
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        log: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAcessButton = document.querySelector("[data-grantAcess]");
grantAcessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;
    console.log("city name input",searchInput.value)

    if(cityName === "")
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function  fetchSearchWeatherInfo(cityName) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active")

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)

    }
    catch(err){
        console.log("search weather not fetch")
    }
    
}
