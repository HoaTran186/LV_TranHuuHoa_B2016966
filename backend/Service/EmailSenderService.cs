using System.Net;
using System.Net.Mail;
using backend.Interfaces;

namespace backend.Service
{
   public class EmailSenderService : IEmailSender
    {
        private readonly IConfiguration _configuration;

        public EmailSenderService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(string email, string subject, string message)
        {
            var mail = _configuration["EmailSettings:SenderEmail"];
            var pw = _configuration["EmailSettings:SenderPassword"];
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);

            using (var mailMessage = new MailMessage(from: mail, to: email, subject: subject, body: message))
            {
                mailMessage.BodyEncoding = System.Text.Encoding.UTF8;
                mailMessage.SubjectEncoding = System.Text.Encoding.UTF8;
                mailMessage.IsBodyHtml = true;
                mailMessage.ReplyToList.Add(new MailAddress(mail));
                mailMessage.Sender = new MailAddress(mail);

                using (SmtpClient client = new SmtpClient(smtpServer))
                {
                    client.Port = smtpPort;
                    client.Credentials = new NetworkCredential(mail, pw);
                    client.EnableSsl = true;

                    return await SendMail(mailMessage, client);
                }
            }
        }

        private static async Task<bool> SendMail(MailMessage message, SmtpClient client)
        {
            try
            {
                await client.SendMailAsync(message);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}