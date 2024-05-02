const weatherService = require('../src/services/weatherService');
const request = require('supertest');

describe('Weather Service', function() {
    before(async () => {
        chai = await import('chai');
        expect = chai.expect;
    });

    describe('getWeatherByLocation()', function() {
        it('should return weather data for a location specified by coordinates', async function() {
            const latitude = 55.7558;
            const longitude = 37.6176;
            const time = 14;
            const weatherData = await weatherService.getWeatherByLocation(latitude, longitude, time);
            expect(weatherData).to.exist;
            // Add more specific assertions based on the structure of the response
        });
    });

    describe('getWeatherByName()', function() {
        it('should return weather data for a location specified by name', async function() {
            const locationName = 'London';
            const time = 14;
            const weatherData = await weatherService.getWeatherByName(locationName, time);
            expect(weatherData).to.exist;
            // Add more specific assertions based on the structure of the response
        });
    });
});
