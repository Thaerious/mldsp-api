# Installation
## Step 1: Install MLDSP
    sudo apt install python3.10-venv
    python3 -m venv ./venv
    source venv/bin/activate
    git clone git@github.com:HillLab/MLDSP.git
    cd MLDSP
    pip install .

## Step 2: Install MLDSP-API from Github
    git clone git@github.com:Thaerious/MLDSP-api.git
    cd MLDSP-api
    npm i 

# Run Tests & Coverage
To run tests which output coverage to /www/coverage

    npx c8 -r html -o www/coverage mocha

# Start the Server
Start the server with npm (package.json script) or directly with node.

    npm run server
    node src/main.js

## Start the server on a specific port
    npm run server -- --port PORT
    node src/main.js --port PORT

Browse to http://localhost:7632/ to view test page.

## Specify the data path
When running multiple instances on the same server the data path for each instance
needs to be specified.

    npm run server -- --data path
    node src/main.js --data path
