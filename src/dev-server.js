#!/usr/bin/env node

import express from 'express';
import program from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import https from 'https';
import getHomePath from 'home-path';

let dir = program.args[0] || null;
let certs = program.certs || `${getHomePath()}/.diptox/c3-dev-webserver/`;
const port = program.port || 8080;
const hport = program.hport || 4430;

if(!dir) {
  console.log('Missing Addons directory,usage "c3-webserver [options] <dir>"');
  process.exit(0);
} else {
  dir = path.resolve(dir);
  if(!fs.existsSync(dir)) {
    console.log(`"${dir}" does not exist`);
    process.exit(0);
  }
}

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/addons', express.static(dir));

app.listen(8080, (err) => {
  if(err) {
    throw err;
    process.exit(0);
  }
  console.log(`You addons are located in "http://localhost:${port}/addons/" or "https://localhost:${hport}/addons/"`);
});

try {
  // Check certs
  function checkCerts() {
    if( !fs.existsSync(path.join(certs,'localhost.key')) || !fs.existsSync(path.join(certs,'localhost.cert')) ) {
      fs.removeSync(certs);
      createCerts();
    } else {
      console.log(`SSL certificate exists in ${certs}, going to use it`);
    }
  }

  function createCerts() {
    fs.ensureDirSync(certs);
    execSync('openssl genrsa -out localhost.key 2048',{
      cwd: certs
    });
    execSync('openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650 -subj /CN=localhost',{
      cwd: certs
    });
  }

  if(!certs) {
    console.log(`missing --certs`);
    process.exit(0);
  } else {
    certs = path.resolve(certs);
    checkCerts();
  }

  const options = {
    cert: fs.readFileSync(path.join(certs,'localhost.cert')),
    key: fs.readFileSync(path.join(certs,'localhost.key'))
  };

  https.createServer(options, app).listen(hport);

} catch(error) {
  console.error(error);
  console.log("An error occured when generating your SSL certificate,There will be no HTTPS on your webserver");
  console.log("You still can use the HTTP webserver");
}


