import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendLessonReminder(to: string, studentName: string) {
  if (!resend || !process.env.EMAIL_FROM) return;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your daily English lesson is ready",
    html: `<p>Hi ${studentName}, your next spoken English lesson is waiting for you. Keep your streak alive today.</p>`
  });
}
