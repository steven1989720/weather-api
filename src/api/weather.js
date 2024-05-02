const express = require('express');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');

const weatherService = require('../services/weatherService');

const router = express.Router();

const myCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Apply the rate limiting middleware to all requests
router.use(limiter);

function fetchWeatherData(fetchFunction, cacheKey) {
    return new Promise((resolve, reject) => {
        let weatherData = myCache.get(cacheKey);
        if (weatherData) {
            resolve(weatherData);
        } else {
            fetchFunction().then(data => {
                myCache.set(cacheKey, data);
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        }
    });
}

import('queue').then(queueModule => {
    const Queue = queueModule.default;
    const apiQueue = new Queue({ concurrency: 1, autostart: true });

    function getDefaultTime() {
        // Implement logic to determine the default time
        return "14";
    }

    // Endpoint to get weather data for a specific location by coordinates
    // /api/weather/coordinates/{latitude},{longitude}?time={targetTime}
    router.get('/weather/coordinates/:lat,:lon', (req, res) => {
        const { lat, lon } = req.params;
        const time = req.query.time || getDefaultTime();
        const cacheKey = `weather-${lat}-${lon}-${time}`;

        apiQueue.push(() => {
            return fetchWeatherData(() => weatherService.getWeatherByLocation(lat, lon, time), cacheKey)
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    res.status(500).json({ error: 'Internal server error', details: error.message });
                });
        });
    });
    
    // Endpoint to get weather data for a specific location by name
    // /api/weather/city/{cityName}?time={targetTime}
    router.get('/weather/city/:name', (req, res) => {
        const name = req.params.name || "Moscow";
        const time = req.query.time || getDefaultTime();
        const cacheKey = `weather-${name}-${time}`;

        apiQueue.push(() => {
            return fetchWeatherData(() => weatherService.getWeatherByName(name, time), cacheKey)
                .then(data => {
                    res.json(data);
                })
                .catch(error => {
                    res.status(500).json({ error: 'Internal server error', details: error.message });
                });
        });
    });
}).catch(error => {
    console.error('Error loading module:', error);
});
  
module.exports = router;
