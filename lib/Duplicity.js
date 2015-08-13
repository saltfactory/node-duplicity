var shell = require('shelljs');
var nodemailer = require('nodemailer');

module.exports = Duplicity = function (config) {
  this.config = config;
};

Duplicity.prototype.send_mail = function (subject, content, isHTML) {
  var self = this;
  var transporter = nodemailer.createTransport({
    service: self.config.notification.mail.smtp.service,
    auth: {
      user: self.config.notification.mail.smtp.auth.user,
      pass: self.config.notification.mail.smtp.auth.pass
    }
  });

  var mailOptions = {
    from: self.config.notification.mail.from,
    to: self.config.notification.mail.recipients.join(),
    subject: subject
  };

  if (isHTML) {
    mailOptions.html = content;
  } else {
    mailOptions.text = content;
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);

  });

};

Duplicity.prototype.backup = function () {
  var self = this;

  var items = self.config.backup;
  var gnupg_key = self.config.gnupg.key;

  items.forEach(function(item){

    var remotes = self.config.remotes;

    remotes.forEach(function(remote){

        var command = 'duplicity --encrypt-key ' + gnupg_key +' ' + item.src + ' scp://'+ remote.user + '@' + remote.host + item.dest;

        //console.log(command);

        shell.exec(command, {async: false}, function (code, output) {
          //console.log(output);
          self.send_mail(item.title, output);
        });



    });


  });

};