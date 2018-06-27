# c3-cli
The Construct 3 Command Line Interface (CLI) is a unified tool to manage your C3 dev environment.

## Prerequisites
* Nodejs 6.1 or newer (8.1 is recommended)
## Installation

```bash
npm install -g c3-cli
```

## Usage

```bash
c3 1.0.0

USAGE
  c3 <command>

COMMANDS
  create <type> <id> <dir>      Create an addon into a given directory
  dev-server [dir]              Run a dev server for your addons
  help <command>                Display help for a specific command

OPTIONS
  --plugin-type <plugintype>      Select a plugin type single-global|drawing|editor-text, type plugin ONLY!!      optional      default: "single-global"

GLOBAL OPTIONS
  -h, --help         Display help
  -V, --version      Display version
  --no-color         Disable colors
  --quiet            Quiet mode - only displays warn and error messages
  -v, --verbose      Verbose mode - will also output debug messages
```

### create <type> <id> <dir>
```bash
USAGE
  c3 create <type> <id> <dir>

ARGUMENTS
  <type>      Addon type must be plugin|behavior|effect|theme                  required
  <id>        Addon id, Will be replaced automatically in the addon files      required
  <dir>       The directory where to create the Addon                          required

OPTIONS
  --plugin-type <plugintype>      Select a plugin type single-global|drawing|editor-text, type plugin ONLY!!      optional      default: "single-global"
```
#### Examples
```bash
# Create an Editor-Text plugin with the id "thisIsMyPluginID" inside the directory "~/myPlugins/"
c3 create plugin thisIsMyPluginID ~/myPlugins/ --plugin-type="editor-text"

# Create a behavior addon with the id "thisIsABehavior" inside the directory "~/myBehavior/"
c3 create behavior thisIsABehavior ~/myBehavior/

# Create an effect addon with the id "thisIsAnEffect" inside the directory "~/myEffects/"
c3 create effect thisIsAnEffect ~/myEffects/

# Create a theme addon with the id "thisIsMyTheme" inside the directory "~/myThemes/"
c3 create theme thisIsMyTheme ~/myThemes/

```

### dev-server [dir]
```bash
USAGE
  c3 dev-server [dir]

ARGUMENTS
  [dir]      The directory that contains your Addon      optional      default: "/root/.diptox/c3-dev-webserver/"

OPTIONS
  --http-port <httpPort>        Set the HTTPwebserver Port           optional      default: 8080
  --https-port <httpsPort>      Set the HTTPS webserver Port         optional      default: 4430
  --certsDir <certsDir>         Set where to save the SSL certs      optional      default: "/root/.diptox/c3-dev-webserver/certs"
```
#### Examples
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
c3 dev-server --http-port 8000 --https-port 4431 ~/diptox/addons/
```
then in C3 the Url of your plugin addon.json will be
```bash
# HTTP
http://localhost:8000/plugins/TransitionLayout/addon.json
# HTTPS
https://localhost:4431/plugins/TransitionLayout/addon.json
```

