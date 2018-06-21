# c3-dev-webserver
This is an NPM package that allow C3 developers to run the dev server easly

## Prerequisites
* OpenSSL (needed to generate the SSL certificate)
* Nodejs 6.1 or newer (8.1 is recommended)
## Installation

```bash
npm install -g c3-dev-webserver
```

## Usage

```bash
c3-webserver [options] <dir>

  Options:

    -v, --version             output the version number
    -p, --port <port>         Set the HTTPwebserver Port, Default=8080
    -s, --https-port <hport>  Set the HTTPS webserver Port, Default=4430
    -c, --certs <certs>       Set where to save the SSL certs, Default="~/.diptox/c3-dev-webserver/"
    -h, --help                output usage information
```

```<dir>``` is the directory that contains your addons

#### Example

```bash
~  
├── ...  
├── diptox  
│   ├── addons          # <==== The path of this directory must be set as ```<dir>```  
│      ├── behaviors  
│      ├── effects  
│      ├── plugins  
│         ├── TransitionLayout  
└── ...  
```

I am going to develop a new plugin called ```TransitionLayout```  
```~/diptox/addons/plugins``` is the parent directory of ```TransitionLayout```

My command will be
```bash
c3-webserver -p 8000 ~/diptox/addons/
```
then in C3 the Url of your plugin addon.json will be
```
http://localhost:8000/plugins/TransitionLayout/addon.json
```
