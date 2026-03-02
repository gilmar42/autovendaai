const fs = require('fs');
const path = require('path');
const isTestEnv = process.env.NODE_ENV === 'test';
const logFile = path.join(__dirname, '../../logs_auth.txt');

function logToFile(msg) {
  try {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
  } catch (err) {
    console.error('Erro ao escrever no arquivo de log:', err.message);
  }
}

function info(...args) {
  const msg = args.join(' ');
  console.log(msg);
  if (!isTestEnv) logToFile(`INFO: ${msg}`);
}

function warn(...args) {
  const msg = args.join(' ');
  console.warn(msg);
  if (!isTestEnv) logToFile(`WARN: ${msg}`);
}

function error(...args) {
  const msg = args.join(' ');
  console.error(msg);
  if (!isTestEnv) logToFile(`ERROR: ${msg}`);
}

module.exports = {
  info,
  warn,
  error,
};