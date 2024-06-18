const readline = require('readline');
const getSoundcloud = require('./handlers/getSoundcloud.js');
const getYoutube = require('./handlers/getYoutube.js');
const getSpotify = require('./handlers/getSpotify.js');

/**
 * @type {Array.<string>}
 */
const foundLinks = [];

/**
 * Creates an interface for reading input from the command line.
 * @type {readline.Interface}
 */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('close', () => {
    rl.close();
});

/**
 * Asks a question via the command line and returns the user's response.
 * @param {string} question - The question to ask the user.
 * @returns {Promise<string>} The user's response.
 */
const askQuestion = (question) => {
    return new Promise((resolve) => rl.question(question, resolve));
};

const parseArgs = () => {
    const args = process.argv.slice(2);
    const params = {};

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-n':
                params.name = args[i + 1];
                i++;
                break;
            case '-a':
                params.author = args[i + 1];
                i++;
                break;
        }
    }

    return params;
};

const main = async () => {
    try {
        const args = parseArgs();
        let searchTarget = args.name;
        let artist = args.author || '';

        if (!searchTarget) {
            searchTarget = await askQuestion('Enter the search target: ');
            if (!searchTarget) {
                console.error('Search target cannot be empty.');
                rl.close();
                process.exit(1);
            }

            artist = await askQuestion('Artist (leave empty to not specify): ');
            rl.close();
        }

        // Prepare an array to hold promises for each asynchronous function call
        const promises = [];

        // Call getSoundcloud and push its promise to the array
        promises.push(getSoundcloud(searchTarget, artist));

        // Example: Call getYoutube and push its promise to the array
        // Replace 'getYoutube' with your actual function call
        promises.push(getYoutube(searchTarget, artist)); // Assuming getYoutube is defined similarly

        promises.push(getSpotify(searchTarget, artist));

        // Example: Add more functions to execute in parallel as needed
        // promises.push(getAnotherService(searchTarget, artist));

        // Execute all promises in parallel
        const results = await Promise.all(promises);

        // Handle results as needed
        //   console.log('Results:', results);
        foundLinks.push(...results);

    } catch (error) {
        console.error('An error occurred:', error);
        rl.close();
        process.exit(1);
    }
};

main()
    .then(() => {
        if (foundLinks.length !== 0) {
            // console.info(foundLinks);
            rl.close();
            process.exit(0);
        }
    })
    .catch((error) => {
        console.error('An error occurred:', error);
        rl.close();
        process.exit(1);
    });
