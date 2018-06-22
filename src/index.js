#!/usr/bin/env node

import prog from 'caporal';
import path from 'path';
import readPkg from 'read-pkg';

import createAddon from './create-addon';

prog.version(readPkg.sync(path.join(__dirname, 'package.json')).version, '-v, --version')
createAddon(prog);

prog.parse(process.argv);


