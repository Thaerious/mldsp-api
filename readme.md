# Installation
## Step 1: Install MLDSP
    sudo apt install python3.10-venv
    python3 -m venv ./venv
    source venv/bin/activate
    git clone git@github.com:HillLab/MLDSP.git
    cd MLDSP
    pip install .

## Step 2: Install MLDSP-API
    git clone git@github.com:Thaerious/MLDSP-api.git
    cd MLDSP-api
    npm i 
    node .

# Run Tests & Coverage
To run tests which output coverage to /www/coverage

    npx c8 -r html -o www/coverage mocha

# Start the Server
    npm run server

Browse to http://localhost:7632/ to view test page.

