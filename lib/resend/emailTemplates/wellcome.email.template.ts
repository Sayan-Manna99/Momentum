// lib/email/templates.ts

export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Welcome to Momentum</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #1f2937 !important;
                border: 1px solid #374151 !important;
            }
            .dark-bg {
                background-color: #111827 !important;
            }
            .dark-text {
                color: #ffffff !important;
            }
            .dark-text-secondary {
                color: #d1d5db !important;
            }
            .dark-text-muted {
                color: #9ca3af !important;
            }
            .dark-border {
                border-color: #374151 !important;
            }
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
            }
            .mobile-padding {
                padding: 24px !important;
            }
            .mobile-header-padding {
                padding: 24px 24px 12px 24px !important;
            }
            .mobile-text {
                font-size: 14px !important;
                line-height: 1.5 !important;
            }
            .mobile-title {
                font-size: 24px !important;
                line-height: 1.3 !important;
            }
            .mobile-button {
                width: 100% !important;
                text-align: center !important;
            }
            .mobile-button a {
                width: calc(100% - 64px) !important;
                display: block !important;
                text-align: center !important;
            }
            .mobile-outer-padding {
                padding: 20px 10px !important;
            }
            .dashboard-preview {
                padding: 0 15px 30px 15px !important;
            }
        }
        @media only screen and (max-width: 480px) {
            .mobile-title {
                font-size: 22px !important;
            }
            .mobile-padding {
                padding: 15px !important;
            }
            .mobile-header-padding {
                padding: 15px 15px 8px 15px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb;">
        <tr>
            <td align="center" class="mobile-outer-padding" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td align="left" class="mobile-header-padding" style="padding: 40px 40px 20px 40px;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <span style="color: #ffffff; font-size: 24px; font-weight: 700;">M</span>
                                </div>
                                <span style="font-size: 24px; font-weight: 700; color: #1f2937;">Momentum</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Dashboard Preview Image (Optional) -->
                    <tr>
                        <td align="center" class="dashboard-preview" style="padding: 20px 40px 0px 40px;">
                            <img src="<dashboard-preview-image-url>" alt="Momentum Dashboard Preview" width="100%" style="max-width: 520px; width: 100%; height: auto; border-radius: 12px; border: 1px solid #e5e7eb;">
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 40px 40px 40px;">
                            
                            <!-- Welcome Heading -->
                            <h1 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; color: #1f2937; line-height: 1.2;">
                                Welcome aboard, {{name}}! 🚀
                            </h1>
                            
                            <!-- Intro Text -->
                            <p class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                We're excited to have you join Momentum! Your account is ready, and you're all set to start tracking your learning journey.
                            </p>
                            
                            <p class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                Momentum helps you build consistent learning habits by tracking your progress across videos, PDFs, and quizzes. Stay organized, stay motivated, and keep your learning momentum going strong.
                            </p>
                            
                            <!-- Feature List Label -->
                            <p class="mobile-text dark-text-secondary" style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #1f2937; font-weight: 600;">
                                Here's what you can do right now:
                            </p>
                            
                            <!-- Feature List -->
                            <ul class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #4b5563;">
                                <li style="margin-bottom: 12px;">📚 Create your first learning project with a deadline</li>
                                <li style="margin-bottom: 12px;">🎥 Add YouTube videos or playlists to track your progress</li>
                                <li style="margin-bottom: 12px;">📄 Upload PDFs and monitor your reading progress</li>
                                <li style="margin-bottom: 12px;">🤖 Ask our AI assistant for help when you're stuck</li>
                                <li style="margin-bottom: 12px;">📊 Visualize your learning journey with analytics</li>
                            </ul>
                            
                            <!-- Additional Text -->
                            <p class="mobile-text dark-text-secondary" style="margin: 0 0 40px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                We'll keep you on track with smart reminders and progress updates — so you can focus on learning and growing every day.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 40px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="{{dashboardUrl}}" style="display: inline-block; background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; line-height: 1; text-align: center; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);">
                                            Start Learning →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Tips Section -->
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #1e40af;">💡 Pro Tip</p>
                                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e3a8a;">
                                    Set up study reminders in Settings to build a consistent learning habit. Small steps every day create big results!
                                </p>
                            </div>
                            
                            <!-- Separator -->
                            <div style="border-top: 1px solid #e5e7eb; margin: 30px 0;"></div>
                            
                            <!-- Footer Text -->
                            <p class="mobile-text dark-text-muted" style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">
                                Need help? Reply to this email anytime.
                            </p>
                            
                            <p class="mobile-text dark-text-muted" style="margin: 0 0 20px 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">
                                Happy Learning! 🎯<br>
                                The Momentum Team
                            </p>
                            
                            <p class="mobile-text dark-text-muted" style="margin: 0; font-size: 11px; line-height: 1.5; color: #9ca3af; text-align: center;">
                                You're receiving this email because you signed up for Momentum.<br>
                                If you didn't create this account, you can safely ignore this email.
                            </p>
                            
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;


