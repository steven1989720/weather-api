const request = require('supertest');
const app = require('../src/index'); // Import your Express app

let chai, expect;

describe('GET /weather/coordinates/:lat,:lon?time=14', function() {
    before(async () => {
        chai = await import('chai');
        expect = chai.expect;
    });
    it('should return weather data for Moscow', async function() {
        this.timeout(5000);
        const res = await request(app).get('/api/weather/coordinates/55.76,37.6?time=14');
        expect(res.statusCode).to.equal(200);
        expect(res._body.length).to.equal(4);
        // Add more assertions as needed
    });
});

describe('GET /weather/city/:name?time=14', function() {
    before(async () => {
        chai = await import('chai');
        expect = chai.expect;
    });
    it('should return weather data for London', async function() {
        this.timeout(5000);
        const res = await request(app).get('/api/weather/city/london?time=14');
        expect(res.statusCode).to.equal(200);
        expect(res._body.length).to.equal(4);
        // Add more assertions as needed
    });
});
// npm run test
