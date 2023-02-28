// import axios from 'axios';
const axios = require('axios'); // legacy way

let body = {
    address:"0xC3aFFff54122658b89C31183CeC4F15514F34624",
    amount:"1"
}

// Make a request for a user with a given ID
axios.post('http://localhost:3001/sendToAddress',body)
    .then(function (response) {
        // handle success
        console.log(response.data);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });