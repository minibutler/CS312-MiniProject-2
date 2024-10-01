const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Static folder for CSS
app.use(express.static('public'));

// Home route to render the joke form
app.get('/', (req, res) => {
    res.render('index', { joke: null, userName: null, error: null });
});

// Route to get the joke based on user input
app.get('/getjoke', (req, res) => {
    const userName = req.query.name; 
    const category = req.query.category; 
    const jokeType = req.query.jokeType === "twopart" ? "twopart" : "single";  // Handle joke type
    
    const blacklistFlag = req.query.filter === "safe" ? "explicit" : "";

    // Create the API URL based on user inputs
    let apiUrl = `https://v2.jokeapi.dev/joke/${category}?type=${jokeType}`;
    
    // Append blacklist flag if filtering is applied
    if (blacklistFlag) {
        apiUrl += `&blacklistFlags=${blacklistFlag}`;
    }

    // Make an API request to JokeAPI
    axios.get(apiUrl)
        .then(response => {
            const jokeData = response.data;

            // Check if it's a single-part or two-part joke
            let joke = "";
            if (jokeData.type === "single") {
                joke = jokeData.joke;
            } else if (jokeData.type === "twopart") {
                joke = `${jokeData.setup} - ${jokeData.delivery}`;
            }

            // Render joke and userName to the EJS template
            res.render('index', { joke: joke, userName: userName, error: null });
        })
        .catch(error => {
            console.error('Error fetching joke:', error);

            // Pass userName and error to the template in case of failure
            res.render('index', { joke: null, userName: userName, error: 'Error fetching joke, please try again!' });
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
