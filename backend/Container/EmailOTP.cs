namespace backend.Container
{
    public class EmailOTP
    {
        public string GenerateOtpEmailBody(string otp)
        {
            var emailBody = $@"
            <!DOCTYPE html>
            <html lang='vi'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Email OTP</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }}
                    .email-container {{
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }}
                    .email-header {{
                        text-align: center;
                    }}
                    .email-header img {{
                        max-width: 150px;
                    }}
                    .email-body {{
                        margin-top: 20px;
                    }}
                    .email-body h3 {{
                        font-size: 18px;
                        color: #333;
                    }}
                    .otp-code {{
                        font-size: 24px;
                        color: #1a73e8;
                        font-weight: bold;
                    }}
                    .email-footer {{
                        margin-top: 40px;
                        font-size: 12px;
                        color: #888;
                        text-align: center;
                    }}
                </style>
            </head>
            <body>
                <div class='email-container'>
                    <div class='email-header'>
                        <img src='https://drive.google.com/uc?export=view&id=1QFGIVQyn9mkNitNeQy1w9YuxIyy3F9zh' alt='Inno Trade Logo'>
                    </div>
                    <div class='email-body'>
                        <h3>Chào bạn,</h3>
                        <p>Bạn đang Đăng Ký Tài Khoản InnoTrade, Mã xác nhận là <span class='otp-code'>{otp}</span>.</p>
                        <p>Vui lòng hoàn thành xác nhận trong vòng 5 phút.</p>
                        <br>
                        <p>Inno Trade</p>
                    </div>
                    <div class='email-footer'>
                        <p>Đây là thư từ hệ thống, vui lòng không trả lời thư.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

            return emailBody;
        }
    }
}