using System.Net;
using System.Net.Mail;
using backend.Interfaces;

namespace backend.Service
{
    public class EmailSenderService : IEmailSender
    {
        private readonly string _email;
        private readonly string _password;
        private readonly string _host;
        private readonly int _port;

        public EmailSenderService(IConfiguration configuration)
        {
            var emailSettings = configuration.GetSection("EmailSettings");
            _email = emailSettings["Email"] ?? throw new ArgumentNullException("Email configuration is missing");
            _password = emailSettings["Password"] ?? throw new ArgumentNullException("Email password is missing");
            _host = emailSettings["Host"] ?? throw new ArgumentNullException("SMTP Host is missing");
            _port = int.TryParse(emailSettings["Port"], out int port) ? port : throw new ArgumentNullException("SMTP Port is missing or invalid");
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            if (string.IsNullOrEmpty(to)) throw new ArgumentNullException(nameof(to), "Recipient email is missing");
            if (string.IsNullOrEmpty(subject)) throw new ArgumentNullException(nameof(subject), "Email subject is missing");
            if (string.IsNullOrEmpty(body)) throw new ArgumentNullException(nameof(body), "Email body is missing");

            var smtpClient = new SmtpClient(_host)
            {
                Port = _port,
                Credentials = new NetworkCredential(_email, _password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_email),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(to);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}