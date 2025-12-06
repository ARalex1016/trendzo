export const verificationEmailTemplate = (
  verificationToken: string,
  userName?: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }
    .header {
      background-color: #4f46e5;
      color: #ffffff;
      text-align: center;
      padding: 30px;
      font-size: 24px;
      font-weight: bold;
    }
    .body {
      padding: 30px;
      color: #333333;
      font-size: 16px;
      line-height: 1.5;
    }
    .body p {
      margin-bottom: 20px;
    }
    .token-container {
      text-align: center;
      margin: 30px 0;
    }
    .token {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #4f46e5;
    }
    .footer {
      padding: 20px 30px;
      font-size: 14px;
      color: #777777;
      text-align: center;
    }
    @media (max-width: 600px) {
      .container {
        margin: 20px;
      }
      .header {
        font-size: 20px;
        padding: 20px;
      }
      .body {
        padding: 20px;
      }
      .token {
        font-size: 28px;
        letter-spacing: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Verify Your Email
    </div>
    <div class="body">
      <p>Hello ${userName || "there"},</p>
      <p>Thank you for signing up! Please use the verification code below to confirm your email address. This code will expire in 15 minutes.</p>
      <div class="token-container">
        <span class="token">${verificationToken}</span>
      </div>
      <p>Enter this code on the verification page to complete your registration.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
      <p>Best regards,<br />The Support Team</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const passwordResetTemplate = (resetUrl: string, userName?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }
    .header {
      background-color: #4f46e5;
      color: #ffffff;
      text-align: center;
      padding: 30px;
      font-size: 24px;
      font-weight: bold;
    }
    .body {
      padding: 30px;
      color: #333333;
      font-size: 16px;
      line-height: 1.5;
    }
    .body p {
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .btn {
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      padding: 15px 30px;
      border-radius: 6px;
      font-weight: bold;
      display: inline-block;
      transition: background-color 0.3s ease;
    }
    .btn:hover {
      background-color: #3730a3;
    }
    .footer {
      padding: 20px 30px;
      font-size: 14px;
      color: #777777;
      text-align: center;
    }
    @media (max-width: 600px) {
      .container {
        margin: 20px;
      }
      .header {
        font-size: 20px;
        padding: 20px;
      }
      .body {
        padding: 20px;
      }
      .btn {
        padding: 12px 25px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Reset Your Password
    </div>
    <div class="body">
      <p>Hello ${userName || "there"},</p>
      <p>You recently requested to reset your password. Click the button below to set a new password. This link will expire in 15 minutes.</p>
      <div class="button-container">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </div>
      <p>If you did not request a password reset, please ignore this email or contact our support.</p>
      <p>Thank you,<br />The Support Team</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const passwordResetSuccessTemplate = (userName?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Successful</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
    }
    .header {
      background-color: #4f46e5;
      color: #ffffff;
      text-align: center;
      padding: 30px;
      font-size: 24px;
      font-weight: bold;
    }
    .body {
      padding: 30px;
      color: #333333;
      font-size: 16px;
      line-height: 1.5;
    }
    .body p {
      margin-bottom: 20px;
    }
    .checkmark-container {
      text-align: center;
      margin: 30px 0;
    }
    .checkmark {
      background-color: #4f46e5;
      color: white;
      width: 50px;
      height: 50px;
      line-height: 50px;
      border-radius: 50%;
      display: inline-block;
      font-size: 30px;
      font-weight: bold;
    }
    .body ul {
      margin: 20px 0;
      padding-left: 20px;
    }
    .footer {
      padding: 20px 30px;
      font-size: 14px;
      color: #777777;
      text-align: center;
    }
    @media (max-width: 600px) {
      .container {
        margin: 20px;
      }
      .header {
        font-size: 20px;
        padding: 20px;
      }
      .body {
        padding: 20px;
      }
      .checkmark {
        width: 45px;
        height: 45px;
        line-height: 45px;
        font-size: 28px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Password Reset Successful
    </div>
    <div class="body">
      <p>Hello ${userName || "there"},</p>
      <p>We're writing to confirm that your password has been successfully reset.</p>
      <div class="checkmark-container">
        <div class="checkmark">✓</div>
      </div>
      <p>If you did not initiate this password reset, please contact our support team immediately.</p>
      <p>For security reasons, we recommend that you:</p>
      <ul>
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication if available</li>
        <li>Avoid using the same password across multiple sites</li>
      </ul>
      <p>Thank you for helping us keep your account secure.</p>
      <p>Best regards,<br />The Support Team</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
