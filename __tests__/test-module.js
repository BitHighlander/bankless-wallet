// import axios from 'axios';
const axios = require('axios'); // legacy way

// Make a request for a user with a given ID
axios.get('http://localhost:3001/balance')
    .then(function (response) {
        // handle success
        console.log(response.data[0].balance);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });