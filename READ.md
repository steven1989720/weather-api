# Backend-api demo
Core Functionality: The service must display the daily temperature in Moscow around 14:00 for as many upcoming days as possible, using the yr.no API. This requires familiarity with external API integration and handling time-based data.
Deployment: The inclusion of a Docker file suggests that the service should be containerized, making it easy to deploy and run in any environment. This is a good practice for modern software development.
Documentation: Meaningful and useful documentation is crucial for any API. It should clearly explain how to use the API, including endpoints, parameters, and examples of requests and responses.
Testing: A set of automatic tests demonstrates the reliability of the code and helps maintain its quality over time. Tests should cover various scenarios and edge cases.
Additional Locations: The ability to specify locations by coordinates or by name adds flexibility to the service and improves user experience.
Rate Limiting and Caching: Implementing protection against overload is essential for maintaining the service’s performance and avoiding potential issues with the yr.no API.
Web Interface: Providing a web interface allows less technical users to interact with the service, broadening its accessibility.
Author’s Discretion: Encouraging additional improvements shows an interest in innovation and personal contribution, which can lead to creative and effective solutions.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run start
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Docker Build and run:
```
docker build -t weather-api . 
docker run -d -p 8088:3000 --name weather-api weather-api
```
Open `http://localhost:8088` in your browser.
```
docker save -o weather-api.tar weather-api:latest
