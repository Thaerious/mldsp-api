# Installation

## Prequel
In order to log into the API servers from the portal server you will need to forward
your ssh key.  After setting up the ssh agent on your local computer you can then use
the -A flag with ssh to forward authentication.  This will also be required to fetch
the git repo.

### Setup SSH agent

Add the following to your local .bashrc file to enable ssh agent [1]:

    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_rsa

### Install prerequisite packages on the server.

    sudo apt -y update
    sudo apt -y upgrade
    sudo apt install -y git vim python3.10-venv

## Step 1: Download & Install MLDSP portal from Github
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

## Step 3: Set .env values
Add the PORT and DATA values to the .env file.  Alternatively these values can be be set
as environment variables.

    PORT=9000
    DATA=data/

## Step 4: Start the Server
Start the server with npm (package.json script) or directly with node.

    node src/main.js

Check that the server is running (replace PORT with port set in .env).

    curl localhost:PORT/status

If running locally browse to http://localhost:PORT/ to view test page.

## Step 5: Add system.d info
Systemd is a system and service manager for Linux operating
systems. When run as first process on boot (as PID 1), it acts as
init system that brings up and maintains userspace services.
Separate instances are started for logged-in users to start their
services [2].

### Systemctl commands

    sudo systemctl start mldsp-api
    sudo systemctl stop mldsp-api
    sudo systemctl enable mldsp-api

### Systemctl setup
To enable system control add the following to /etc/systemd/system/mldsp-api.service.
Execute 'sudo systemctl enable mldsp-api' to start-up on boot.

    [Unit]
    Description=MLDSP API Server

    [Service]
    User=ubuntu
    WorkingDirectory=/home/ubuntu/MLDSP-api
    ExecStart=node src/main.js
    Restart=always

    [Install]
    WantedBy=multi-user.target

# Addendum
## Check the remote server
Replace the url and port with respective values from the API server instance.

    curl 192.168.2.100:9000/status

Use port forwarding to access the api test page.  Note we assume that the username
for logging into the portal server is the same as the api servers.

    ssh 192.168.2.100 -N -L 0.0.0.0:8000:192.168.2.100:9000

## Run Tests & Coverage
To run tests without coverage

    npx mocha

To run tests with coverage that outputs to /www/coverage

    npx c8 -r html -o www/coverage mocha

## Notes & References
[1] Alternately add the '-o ForwardAgent=true' when using SSH to access the server.  
[2] https://man7.org/linux/man-pages/man1/systemd.1.html  