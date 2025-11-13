import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface IssueReportPayload {
  issueType: string
  description: string
  conversationId?: string
  conversationTitle?: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const body: IssueReportPayload = await request.json()

    const { issueType, description, conversationId, conversationTitle, timestamp } = body

    // Validate required fields
    if (!issueType || !description) {
      return NextResponse.json(
        { error: "Issue type and description are required" },
        { status: 400 }
      )
    }

    // Format issue type for display
    const issueTypeDisplay = {
      outdated: "Outdated Information",
      incorrect: "Incorrect Response",
      incomplete: "Incomplete Answer",
      unclear: "Unclear or Confusing",
      other: "Other",
    }[issueType] || issueType

    // Get issue type color
    const issueTypeColor = {
      outdated: "#F59E0B",
      incorrect: "#EF4444",
      incomplete: "#3B82F6",
      unclear: "#8B5CF6",
      other: "#6B7280",
    }[issueType] || "#6B7280"

    // Format timestamp
    const formattedTimestamp = new Date(timestamp).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })

    // Prepare email content
    const subject = `Issue Report: ${issueTypeDisplay}${conversationTitle ? ` - ${conversationTitle}` : ""}`

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Issue Report</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f8fb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f8fb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color: #0073a8; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Issue Report Submission
              </h1>
            </td>
          </tr>

          <!-- Issue Type Badge -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <div style="display: inline-block; background-color: ${issueTypeColor}; color: #ffffff; padding: 10px 20px; border-radius: 24px; font-size: 14px; font-weight: 600;">
                ${issueTypeDisplay}
              </div>
            </td>
          </tr>

          <!-- Description -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="margin-bottom: 16px;">
                <strong style="color: #0f2233; font-size: 16px;">Issue Description</strong>
              </div>
              <div style="background-color: #f0f6fb; border-left: 4px solid ${issueTypeColor}; padding: 20px; border-radius: 8px;">
                <p style="margin: 0; color: #2f4f62; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${description}</p>
              </div>
            </td>
          </tr>

          ${conversationTitle ? `
          <!-- Conversation Context -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="background-color: #e3edf4; border-radius: 8px; padding: 16px; border-left: 3px solid #3cb2fd;">
                <p style="margin: 0; color: #0f2233; font-size: 13px;">
                  <strong>Related Conversation:</strong> ${conversationTitle}
                </p>
              </div>
            </td>
          </tr>
          ` : ""}

          <!-- Footer -->
          <tr>
            <td style="background-color: #e3edf4; padding: 24px 32px; border-top: 1px solid #c8d9e4; text-align: center;">
              <p style="margin: 0; color: #2f4f62; font-size: 12px;">
                This issue was reported via the <strong>Beaird Harris Knowledge Bot</strong> issue reporting system.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    const textBody = `
Issue Report Submission
=======================

Issue Type: ${issueTypeDisplay}

Issue Description:
${description}
${conversationTitle ? `\n\nRelated Conversation: ${conversationTitle}` : ""}

---
This issue was reported via the Beaird Harris Knowledge Bot issue reporting system.
    `.trim()

    // Send email via Resend
    try {
      await resend.emails.send({
        from: process.env.SYSTEM_EMAIL || "onboarding@resend.dev",
        to: process.env.ISSUE_REPORT_EMAIL || "support@beairdharris.com",
        subject: subject,
        html: htmlBody,
        text: textBody,
      })

      console.log("Issue report email sent successfully")
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Failed to send email:", emailError)
      // Still log to console as backup
      console.log("=== Issue Report Received ===")
      console.log("Subject:", subject)
      console.log("Body:", textBody)
      console.log("============================")
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Issue report submitted successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing issue report:", error)
    return NextResponse.json(
      {
        error: "Failed to process issue report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
