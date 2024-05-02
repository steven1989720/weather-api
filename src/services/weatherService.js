const axios = require('axios');
const NodeCache = require('node-cache');

const BASE_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/complete';
const apiKey = 'Aty4SXk4q4O3DA55LZUOUByrNkx4Ij3hv7pA2OO_S0HbCkosYRjqbPu7801gTvHp';

const myCache = new NodeCache({ stdTTL: 0 });

async function getWeatherByLocation(latitude, longitude, time) {
    const url = `${BASE_URL}?lat=${latitude}&lon=${longitude}`;
    return await fetchData(url, latitude, longitude, time);
}

async function getWeatherByName(name, time) {
    const { latitude, longitude } = await geocodeLocation(name);
    return await getWeatherByLocation(latitude, longitude, time);
}

async function fetchData(url, latitude, longitude, time) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });
        const temperatureData = response.data.properties.timeseries;
        // const timeZone = Math.round(parseInt(longitude)/15);
        const timeZone = await getTimeZone(latitude, longitude);
        // console.log('timeZone: ', timeZone);
        var str = '';
        for (var i = 0; i < timeZone.length; i++) {
            if (timeZone[i] != ':') str += timeZone[i];
            else break;
        }
        var timestamp = '';
        var utc = '';
        if (parseInt(str) >= 0) utc = '+' + str;
        else utc = str;
        var timeNum = parseInt(time) - parseInt(str);
        if (timeNum < 0) timeNum += 24;
        if (timeNum < 10) timestamp = '0' + timeNum.toString() + ':00';
        else timestamp = timeNum.toString() + ':00';
        var weatherData = new Array();
        temperatureData.forEach(jsonData => {
            var fullTime = jsonData.time;
            var pushData = jsonData;
            var extractedTime = fullTime.substring(11, 16);
            if (extractedTime === timestamp) {
                var date = fullTime.substring(0, 10);
                if (str.length == 1) strOutput = '0' + str;
                if (str.substring(0,1) == '-' & str.length == 2) strOutput = '-0' + str.substring(1,2);
                var pushTime = date;
                pushData.time = pushTime;
                weatherData.push(pushData);
            }
        });
        var output = new Array();
        output.push({"weatherData": weatherData});
        output.push({"latitude": latitude});
        output.push({"longitude": longitude});
        output.push({"timezone": utc});
        return output;
    } catch (error) {
        throw new Error('Failed to fetch weather data');
    }
}

async function geocodeLocation(name) {
    const cacheKey = `city-${name}`;
    let geoData = myCache.get(cacheKey);
    if (geoData) {
        return geoData;
    }

    const apiUrl = `https://dev.virtualearth.net/REST/v1/Locations?q=${name}&key=${apiKey}`;

    try {
        const response = axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
        });
        const data = (await response).data;
        if (data.resourceSets && data.resourceSets.length > 0 && data.resourceSets[0].resources && data.resourceSets[0].resources.length > 0) {
            const coordinates = data.resourceSets[0].resources[0].point.coordinates;
            const latitude = coordinates[0];
            const longitude = coordinates[1];
            geoData = { latitude, longitude };
            myCache.set(cacheKey, geoData);
            // console.log(cacheKey, geoData);
            return geoData;
        } else {
            console.error('Location not found');
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to geocode location');
    }
}

async function getTimeZone(latitude, longitude) {
    const cacheKey = `slot-${latitude}-${longitude}`;
    let slotData = myCache.get(cacheKey);
    if (slotData) {
        return slotData;
    }
    const apiUrl = `https://dev.virtualearth.net/REST/v1/TimeZone/${latitude},${longitude}?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.resourceSets && data.resourceSets.length > 0 && data.resourceSets[0].resources && data.resourceSets[0].resources.length > 0 && data.resourceSets[0].resources[0].timeZone.convertedTime) {
            const timeZone = data.resourceSets[0].resources[0].timeZone;
            if (timeZone && timeZone.convertedTime && timeZone.convertedTime.hasOwnProperty("utcOffsetWithDst")){
                slotData = timeZone.convertedTime["utcOffsetWithDst"];
                myCache.set(cacheKey, slotData);
                // console.log(cacheKey, slotData);
                return slotData;
            }
        }
        console.error('Time zone not found');
    } catch (error) {
        console.error('Error:', error);
    }
    var timeNum = Math.round(parseInt(longitude)/15);
    return timeNum.toString() + ":00";
}

module.exports = {
  geocodeLocation
};


module.exports = {
    getWeatherByLocation,
    getWeatherByName
};
