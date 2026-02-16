export const WEEKLY_REPORT_AI_PROMPT = `
Generate personalized motivational and analytical HTML content for a user's weekly learning progress report email.

User progress data:
{{progressData}}

CRITICAL REQUIREMENTS:

Return ONLY clean HTML content.
NO markdown, NO code blocks, NO backticks.

Use EXACT styling below:

SECTION TITLE:
<h3 class="dark-text" style="margin: 25px 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937;">
Your Momentum Insights
</h3>

PARAGRAPHS:
<p class="dark-text-secondary" style="margin: 0 0 18px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
Content here
</p>

HIGHLIGHT BOX:
<div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 6px; margin: 20px 0;">
<p style="margin: 0; font-size: 15px; color: #1e3a8a;">
💡 Insight text here
</p>
</div>

CONTENT GOALS:

Analyze user's weekly learning progress and provide:

1. Progress evaluation (encouraging tone)
2. Pattern recognition (consistency, improvements, drops)
3. Personalized motivation
4. Specific recommendation for next week
5. Confidence-building message

STYLE REQUIREMENTS:

- Supportive, intelligent mentor tone
- Clear and simple language
- Encouraging but honest
- No generic advice
- Make it feel personalized

Focus on helping user maintain learning momentum.

Return ONLY HTML content.
`;
