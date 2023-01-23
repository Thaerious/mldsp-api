# Installation

## Pre-Step 0: Setup ssh-agent
In order to log into the API servers from the portal server you will need to forward
your ssh key.  After setting up the ssh agent on your local computer you can then use
the -A flag with ssh to forward authentication.  This will also be required to fetch
the git repo.

Add the following to your .bashrc file to enable ssh agent:

    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_rsa

## Step 1: Download & Install MLDSP portal from Github
    sudo apt install -y git python3.10-venv
    python3 -m venv ./venv
    source venv/bin/activate
    git clone git@github.com:HillLab/MLDSP.git    
    cd MLDSP
    pip install .

## Step 2: Install MLDSP-API from Github
It is recommended to use the latest NodeJS and NPM packages.  A script is included in the
repo to install directly from the NodeJS site as opposed to the package manager.  Replace
the verstion (18.13.0) with the desired version.

    cd ~
    git clone git@github.com:Thaerious/MLDSP-api.git
    cd MLDSP-api
    sudo bash tools/install_node.sh 18.13.0
    npm i

## Step 3: Start the Server
Start the server with npm (package.json script) or directly with node.

    npm run server
    node src/main.js

## Step 4: Add system.d info
Permits systemctl start, stop, and enable.  Use enable to autostart the service
on boot.

    sudo systemctl start mldsp-api
    sudo systemctl stop mldsp-api
    sudo systemctl enable mldsp-api

To enable system control add the following to /etc/systemd/system/mldsp-api.service

    [Unit]
    Description=MLDSP API Server

    [Service]
    User=ubuntu
    WorkingDirectory=/home/ubuntu/MLDSP-api
    ExecStart=node src/main.js --port 9000
    Restart=always

    [Install]
    WantedBy=multi-user.target

### Start the server on a specific port
    npm run server -- --port PORT
    node src/main.js --port PORT

Check that the server is running (replace PORT with the value specified by --port).

    curl localhost:PORT/status

Browse to http://localhost:PORT/ to view test page.

### Specify the data path
When running multiple instances on the same server the data path for each instance
needs to be specified.

    npm run server -- --data path
    node src/main.js --data path

### Check the remote server
Replace the url and port with respective values from the API server instance.

    curl 192.168.2.100:9000/status

Use port forwarding to access the api test page.  Note we assume that the username
for logging into the portal server is the same as the api servers.

    ssh 192.168.2.100 -N -L 0.0.0.0:8000:192.168.2.100:9000

## Run Tests & Coverage
To run tests which output coverage to /www/coverage

    npx c8 -r html -o www/coverage mocha
