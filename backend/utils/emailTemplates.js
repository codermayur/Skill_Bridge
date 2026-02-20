export const forgotPasswordEmail = (resetToken, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You requested to reset your password for your Skill Bridge account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          <p><strong>This link will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2024 Skill Bridge. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const testScoreEmail = (userName, language, score, totalQuestions, percentage) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .score-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; border: 2px solid #667eea; }
        .score-number { font-size: 48px; font-weight: bold; color: #667eea; margin: 10px 0; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; font-size: 14px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Test Results</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>Congratulations on completing the <strong>${language}</strong> test!</p>
          <div class="score-box">
            <div class="score-number">${percentage}%</div>
            <p>Your Score: ${score} / ${totalQuestions}</p>
          </div>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">${score}</div>
              <div class="stat-label">Correct</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${totalQuestions - score}</div>
              <div class="stat-label">Incorrect</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${totalQuestions}</div>
              <div class="stat-label">Total</div>
            </div>
          </div>
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Continue Practicing</a>
          </p>
        </div>
        <div class="footer">
          <p>© 2024 Skill Bridge. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
