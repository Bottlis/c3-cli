#!/usr/bin/env node

import prog from 'caporal';
import path from 'path';
import readPkg from 'read-pkg';

import createAddon from './create-addon';
import runDevServer from './dev-server';

prog.version(readPkg.sync(path.join(__dirname, 'package.json')).version, '-v, --version')
createAddon(prog);
runDevServer(prog);

prog.parse(process.argv);


