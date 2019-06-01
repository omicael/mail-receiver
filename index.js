const notifier = require('mail-notifier')
const { exec } = require('child_process')
const clipboardy = require('clipboardy')
const colors = require('colors')
const credentials = require('./credentials/credentials.json')

async function emailReceiver() {
  let mailsReceived = 0

  const imap = {
    user: credentials.user,
    password: credentials.password,
    host: credentials.host,
    port: credentials.port, // imap port
    tls: true,// use secure connection
    tlsOptions: { rejectUnauthorized: false }
  };

  const n = notifier(imap);
  n.on('end', () => n.start()) // session closed
    .on('mail', mail => {
        const textColored = (mailsReceived++ % 2 == 0) ? mail.subject.bold.green : mail.subject.bold.red
        console.log(textColored)

        const clipboardyText = mail.subject.replace('TELEFONE - ', '').replace('CONFIRMANDO - ', '') 
        clipboardy.writeSync(clipboardyText);

        exec('python play-sound.py', (err, stdout, stderr) => {
          if (err) {
            console.log(err)
          }
        })
      })
    .start();
}

emailReceiver()