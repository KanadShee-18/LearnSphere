exports.passwordReset = (name, link) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Update Confirmation</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #333333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 12px auto;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        background-color: rgb(35, 37, 61);
      }

      .logo {
        max-width: 200px;
        margin-bottom: 20px;
      }
      .link {
        text-decoration: none;
        display: flex;
        align-items: center;
      }

      .btn {
        width: fit-content;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        box-shadow: 2px 3px 6px rgb(155, 221, 233);
        border-radius: 8px;
        margin: 0 auto;
        padding: 14px;
        background-color: rgb(50, 205, 197);
        font-size: 16px;
      }
      .btn:hover {
        background-color: rgb(136, 175, 226);
      }

      .message {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
        color: rgb(0, 132, 255);
      }

      .body {
        font-size: 16px;
        margin-bottom: 20px;
        color: whitesmoke;
      }

      .support {
        font-size: 14px;
        color: #999999;
        margin-top: 20px;
      }

      .highlight {
        font-weight: bold;
      }
      .mailLink {
        color: lightcyan;
        text-decoration: none;
        font-weight: bold;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <a href="https://learn-sphere-edui.vercel.app"
        ><img
          class="logo"
          src="https://res.cloudinary.com/dtsigjdfz/image/upload/v1747237214/learnsphere-logo_vqcaft.png"
          alt="LearnSphere Logo"
      /></a>
      <div class="message">Password Reset Link</div>
      <div class="body">
        <p>Hey ${name},</p>
        <p class="message">Click on this button to reset your password.</p>
        <a href="${link}" class="link">
          <button class="btn">Reset Password</button>
        </a>
        <p>
          If you did not request this password change, please contact us
          immediately to secure your account.
        </p>
      </div>
      <div class="support">
        If you have any questions or need further assistance, please feel free
        to reach out to us at
        <a href="mailto:kanadshee18@gmail.com" class="mailLink"
          >kanadshee18.com</a
        >. We are here to help!
      </div>
    </div>
  </body>
</html>

`;
};
