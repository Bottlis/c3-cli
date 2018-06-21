#!/usr/bin/env node

import express from 'express';
import program from 'commander';
import readPkg from 'read-pkg';
import path from 'path';
import getHomePath from 'home-path';

program
  .version(readPkg.sync(path.join(__dirname, 'package.json')).version, '-v, --version')
  .usage('[options] <dir>')
  .option('-p, --port <port>', 'Set the HTTPwebserver Port, Default=8080')
  .option('-s, --https-port <hport>', 'Set the HTTPS webserver Port, Default=4430')
  .option('-c, --certs <certs>', `Set where to save the SSL certs, Default=${getHomePath()}/.diptox/c3-dev-webserver/`)
  .parse(process.argv);