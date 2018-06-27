import getHomePath from 'home-path';
import path from 'path';
import fs from 'fs-extra';
import express from 'express';
import { execSync } from 'child_process';
import https from 'https';

import logger from './logger';

export default (prog) => {
  prog
    .command('dev-server', 'Run a dev server for your addons')
    .argument('[dir]', 'The directory that contains your Addon', prog.STRING, `${getHomePath()}/.diptox/c3-dev-webserver/`)
    .option('--http-port <httpPort>', 'Set the HTTPwebserver Port', prog.INT, 8080)
    .option('--https-port <httpsPort>', 'Set the HTTPS webserver Port', prog.INT, 4430)
    .option('--certsDir <certsDir>', `Set where to save the SSL certs`, prog.STRING, `${getHomePath()}/.diptox/c3-dev-webserver/certs`)
    .action((args, options) => {
      const dir = path.resolve(args.dir);

      if(!fs.existsSync(dir)) {
        logger.error(`"${dir}" does not exist, but I am going to create it :D`);
        fs.ensureDirSync(dir);
      }

      logger.info(args);
      logger.info(options);

      startServer(dir, options.certsDir, options.httpPort, options.httpsPort);
    });
}

const startServer = (dir,certsDir,httpPort, httpsPort) => {
  const app = express();

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.all('/', (req,res) => {
    const message = `This is a C3 developement server made by DipToX<br><br>Your addons Url is <strong>${req.protocol}://${req.get('host')}/addons/</strong><br>Your addons are located in <strong>${dir}</strong>`;
    res.status(200).send(message);
  });

  app.use('/addons', express.static(dir));

  app.listen(httpPort, (err) => {
    if(err) {
      throw err;
      process.exit(0);
    }
    logger.info(`You addons are located in : \r\nHTTP  : "http://localhost:${httpPort}/addons/"\r\nHTTPS : "https://localhost:${httpsPort}/addons/"`);
  });

  try {
    // Check certs
    checkCerts(certsDir);

    const options = {
      cert: fs.readFileSync(path.join(certsDir,'localhost.cert')),
      key: fs.readFileSync(path.join(certsDir,'localhost.key'))
    };

    https.createServer(options, app).listen(httpsPort);

  } catch(error) {
    logger.error(error);
    logger.info("An error occured when generating your SSL certificate,There will be no HTTPS on your webserver");
    logger.info("You still can use the HTTP webserver");
  }
}

const checkCerts = (certsDir) => {
  // Check if https certificates exists or no
  if( !fs.existsSync(path.join(certsDir,'localhost.key')) || !fs.existsSync(path.join(certsDir,'localhost.cert')) ) {
    fs.removeSync(certsDir);
    createCerts(certsDir);
  } else {
    logger.info(`SSL certificate exists in ${certsDir}, going to use it`);
  }
}

const createCerts = (certsDir) => {
  fs.ensureDirSync(certsDir);
  execSync('openssl genrsa -out localhost.key 2048',{
    cwd: certsDir
  });
  execSync('openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650 -subj /CN=localhost',{
    cwd: certsDir
  });
}