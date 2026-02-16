export const WEEKLY_REPORT_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0">
<tr>
<td align="center" style="padding:40px 20px;">

<table width="600" style="background:white;border-radius:8px;border:1px solid #e5e7eb;">

<tr>
<td style="padding:40px;">

<!-- Header -->
<div style="display:flex;align-items:center;gap:12px;margin-bottom:30px;">
<div style="width:40px;height:40px;background:linear-gradient(135deg,#60a5fa,#3b82f6);border-radius:8px;display:flex;align-items:center;justify-content:center;">
<span style="color:white;font-size:24px;font-weight:700;">M</span>
</div>
<span style="font-size:24px;font-weight:700;color:#1f2937;">Momentum</span>
</div>

<!-- Title -->
<h1 style="font-size:26px;color:#1f2937;margin-bottom:20px;">
Your Weekly Learning Report 📊
</h1>

<!-- Greeting -->
<p style="font-size:16px;color:#4b5563;margin-bottom:20px;">
Hello {{name}}, here’s your learning progress summary for this week:
</p>

<!-- Stats Card -->
<div style="background:#f8fafc;padding:20px;border-radius:8px;margin:25px 0;border:1px solid #e5e7eb;">

<p style="margin:0 0 10px 0;font-size:15px;color:#374151;">
📚 Total Projects: <strong>{{totalProjects}}</strong>
</p>

<p style="margin:0 0 10px 0;font-size:15px;color:#374151;">
✅ Completed Projects: <strong>{{completedProjects}}</strong>
</p>

<p style="margin:0;font-size:15px;color:#374151;">
📈 Overall Progress: <strong>{{progress}}%</strong>
</p>

</div>

<!-- AI GENERATED MESSAGE -->
{{aiMessage}}

<!-- CTA -->
<div style="text-align:center;margin-top:30px;">
<a href="{{dashboardUrl}}" 
style="display:inline-block;background:linear-gradient(135deg,#60a5fa,#3b82f6);color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">
View Dashboard →
</a>
</div>

<!-- Footer -->
<div style="margin-top:40px;border-top:1px solid #e5e7eb;padding-top:20px;text-align:center;">

<p style="margin:0;font-size:14px;color:#6b7280;">
Keep your momentum going strong 🚀
</p>

<p style="margin:5px 0 0 0;font-size:12px;color:#9ca3af;">
Momentum • Build consistent learning habits
</p>

</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
