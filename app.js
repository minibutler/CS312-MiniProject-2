const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Static folder for serving CSS and other static files
app.use(express.static('public'));

// Home route: Display the form for joke input
app.get('/', (req, res) => {
    res.render('index', { joke: null, userName: null, error: null });
});

app.get('/getjoke', (req, res) => {
    const userName = req.query.name;
    const category = req.query.category;
    const jokeType = req.query.jokeType === "twopart" ? "twopart" : "single";
    
    // Use "explicit" as the blacklist flag to filter explicit content
    const blacklistFlag = req.query.filter === "safe" ? "explicit" : "";

    // Create the API URL based on user inputs
    const apiUrl = `https://v2.jokeapi.dev/joke/${category}?type=${jokeType}&blacklistFlags=${blacklistFlag}&name=${userName}`;

    // Make an API request to JokeAPI
    axios.get(apiUrl)
        .then(response => {

            const jokeData = response.data;

            // Initialize the joke variable
            let joke = "";
            if (jokeData.type === "single") {
                joke = jokeData.joke;  // For single part joke
            } else if (jokeData.type === "twopart") {
                joke = `${jokeData.setup} - ${jokeData.delivery}`;  // For two-part joke
            }

            // Render the joke and user's name to the EJS template
            res.render('index', { joke: joke, userName: userName, error: null });
        })
        .catch(error => {

            // Render the error to the user
            res.render('index', { joke: null, userName: userName, error: 'Error fetching joke, please try again!' });
        });
});


// Start the server on port 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
