import bunyan from 'bunyan';
import bformat from 'bunyan-format';


const formatOut = bformat({ outputMode: 'short' })

let logger;
if (!logger) {
  logger = bunyan.createLogger({ name: 'c3-cli', stream: formatOut, level: 'debug' });
}

export default logger;