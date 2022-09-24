let callRandom = true
let searchIndex = 0

const getSearchString = async () => {
    const res = await fetch("theme.json")
    const data = await res.json()
    const searchTheme = Array.from(data)
    /*console.log("searchstring "+ searchTheme + "length "+ searchTheme.length)
    console.log("callRandom " + callRandom)*/
    if (callRandom) {
        searchIndex = Math.floor(Math.random() * searchTheme.length)
        callRandom = false
    }
    console.log("searchIndex " + searchIndex + "searchTheme[searchIndex] "+searchTheme[searchIndex])
    return `https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${searchTheme[searchIndex]}`
   
}



const fetchNewPictures = async () => {
    /* function fetchNewPictures() { */
    try {
        const url = await getSearchString()
        console.log("url aa" + url)
        const res = await fetch(url)
        const data = await  res.json()

        console.log(data)
        document.body.style.backgroundImage = `url(${data.urls.full})`
        document.querySelector(".author").textContent=`By ${data.user.name}`
            
        let descriptionText = ''
        const descriptionMain = data.description
        const descriptionAlt = data.alt_description

        descriptionMain && descriptionAlt ? 
                descriptionText = descriptionMain + ": " + descriptionAlt 
            : descriptionMain ?
                    descriptionText = descriptionMain
            :    descriptionText = descriptionAlt
        
        document.querySelector(".small-text").textContent = descriptionText
    } catch(err) {
        document.querySelector(".small-text").textContent = "cannot load pictures, try again later"
    }
}
 
/*setInterval(fetchNewPictures, 10000)  */

const fetchCoinData = async () => {
    const coinId = [
        "bitcoin",
        "dogecoin",
        "ethereum",
        "litecoin"]

   let string = "" 

    for (x of coinId) {
        
        try {
            const res = await fetch(`https://api.coingecko.com/api/v3/coins/${x}?market_data=true`)
            const data = await res.json()
            console.log(data)
            string += `
            <div class="coin-display">
                <img src="${data.image.thumb}"> 
                <span>${data.name}</span> 
                <span>${data.market_data.current_price.usd}</span>
            </div>
             `
        } catch(err) {
            string += ` 
            <div class="coin-display">
               
                <div>0</div> 
                <div>0</div>
            </div>
             `
        }   
    }                
    document.querySelector(".crypo").innerHTML = string
}

/* */

    const getTimeDate = () => {
        const today = new Date()
        const  time = today.toLocaleTimeString("en-us", {timeStyle: "short"})
        const  date = today.toDateString()
        
        document.querySelector('.time-display').innerHTML =  time
        document.querySelector(".date").textContent = date
    }


/* getting geolocation (latitude & longitude) */   
const weatherMsg =     document.querySelector(".weather")
    
function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        /*weatherMsg.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;*/
        fetchWeather(latitude, longitude)
  }


  const fetchWeather = async (latitude,longitude) => {
    

    try {
        const weatherUrl = `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial`

     /*  const aa= `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial`
        */

        console.log(weatherUrl)
        const res = await fetch(weatherUrl)
        const data = await res.json()
        console.log(data)
        document.querySelector(".temp").textContent =`
            ${Math.round(data.main.temp)}º feels like ${Math.round(data.main.feels_like)}º   
           `
           console.log("degree"+ data.wind.deg)    
        document.querySelector(".wind").textContent = `wind: ${Math.round(data.wind.speed)} mph ${windDirection(data.wind.deg)}`
        document.querySelector(".weather-icon").innerHTML = `
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
        `
        document.querySelector(".city").textContent = data.name
    } catch (err) {
        console.log("error")
    }
    
  }

const windDirection = (degree) => {  
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    const index = Math.floor((degree / 22.5) + 0.5)
    return arr[(index % 16)]
   
}

function error() {
        weatherMsg.textContent = 'Unable to retrieve your location';
  }

  if(!navigator.geolocation) {
    weatherMsg.textContent = 'Geolocation is not supported by your browser';
  } else {
    /*weatherMsg.textContent = 'Locating…';*/
    navigator.geolocation.getCurrentPosition(success, error);
  }


fetchNewPictures()

setInterval(fetchNewPictures, 80000)

setInterval(getTimeDate, 1000)

setInterval(fetchCoinData,5000)