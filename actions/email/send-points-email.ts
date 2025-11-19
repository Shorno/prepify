"use server"
import {TransactionalEmailsApi, TransactionalEmailsApiApiKeys} from "@getbrevo/brevo";

const transactionalEmailsApi = new TransactionalEmailsApi();
transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

interface PointsEmailData {
    userEmail: string;
    userName: string;
    totalPointsEarned: number;
    newTotalPoints: number;
    newNoteCount: number;
    breakdown: Array<{reason: string; points: number}>;
    nextMilestone?: {
        count: number;
        points: number;
        remaining: number;
    };
}

export async function sendPointsEmail(data: PointsEmailData) {
    const {
        userEmail,
        userName,
        totalPointsEarned,
        newTotalPoints,
        newNoteCount,
        breakdown,
        nextMilestone
    } = data;

    const emailSubject = `🎉 You earned ${totalPointsEarned} points!`;

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .points-badge { font-size: 48px; font-weight: bold; margin: 10px 0; }
        .breakdown { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .breakdown-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .breakdown-item:last-child { border-bottom: none; }
        .milestone-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .completed-box { background: #d1ecf1; border-left: 4px solid #0dcaf0; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .total-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px; font-weight: bold; font-size: 18px; }
        .progress-bar-container { background: #fff; border-radius: 10px; height: 20px; margin-top: 10px; overflow: hidden; }
        .progress-bar { background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; transition: width 0.3s; }
        .footer { text-align: center; color: #666; margin-top: 30px; font-size: 14px; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        h3 { margin-top: 0; color: #333; }
        p { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations, ${userName}!</h1>
            <div class="points-badge">+${totalPointsEarned} Points</div>
            <p>Your note has been saved successfully!</p>
        </div>
        
        <div class="content">
            <h2>Points Breakdown</h2>
            <div class="breakdown">
                ${breakdown.map(item => `
                    <div class="breakdown-item">
                        <span>${item.reason}</span>
                        <span style="color: #28a745; font-weight: bold;">+${item.points}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="total-box">
                💰 Your Total Points: ${newTotalPoints}
            </div>
            
            ${nextMilestone ? `
                <div class="milestone-box">
                    <h3>🎯 Next Milestone</h3>
                    <p>
                        <strong>${nextMilestone.count} notes</strong> - 
                        Unlock <strong>${nextMilestone.points} bonus points</strong>
                    </p>
                    <p style="color: #666;">
                        Only ${nextMilestone.remaining} more note${nextMilestone.remaining === 1 ? '' : 's'} to go!
                    </p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${((newNoteCount / nextMilestone.count) * 100).toFixed(1)}%;"></div>
                    </div>
                </div>
            ` : `
                <div class="completed-box">
                    <h3>🏆 All Milestones Completed!</h3>
                    <p>You've reached the highest milestone. Amazing work!</p>
                </div>
            `}
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/dashboard" class="cta-button">
                    View Your Dashboard
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>Keep up the great work! 📚</p>
            <p style="font-size: 12px; color: #999;">
                You're receiving this because you created a note on Prepify
            </p>
        </div>
    </div>
</body>
</html>
`;

    const emailText = `
🎉 Congratulations, ${userName}! You earned ${totalPointsEarned} points!

Your note has been saved successfully!

POINTS BREAKDOWN:
${breakdown.map(item => `• ${item.reason}: +${item.points}`).join('\n')}

💰 Your Total Points: ${newTotalPoints}

${nextMilestone ? `
🎯 NEXT MILESTONE:
${nextMilestone.count} notes - Unlock ${nextMilestone.points} bonus points
Only ${nextMilestone.remaining} more note${nextMilestone.remaining === 1 ? '' : 's'} to go!
Progress: ${((newNoteCount / nextMilestone.count) * 100).toFixed(1)}%
` : `
🏆 ALL MILESTONES COMPLETED!
You've reached the highest milestone. Amazing work!
`}

Keep up the great work! 📚

---
You're receiving this because you created a note on Prepify
`;

    try {
        const result = await transactionalEmailsApi.sendTransacEmail({
            to: [{ email: userEmail, name: userName }],
            subject: emailSubject,
            htmlContent: emailHtml,
            textContent: emailText,
            sender: {
                email: process.env.SENDER_EMAIL || 'noreply@shorno.me',
                name: process.env.SENDER_NAME || 'Prepify'
            },
        });
        return { success: true, messageId: result.body.messageId };
    } catch (error) {
        console.error('Failed to send points email:', error);
        return { success: false, error };
    }
}