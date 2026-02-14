import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email containing a public document link.
 *
 * @remarks
 * This function uses the Resend API to deliver a simple HTML email
 * notifying the recipient that a document has been shared with them.
 *
 * The email includes:
 * - a greeting
 * - a short explanation
 * - a clickable link to the public document
 *
 * This service does **not** perform:
 * - permission checks
 * - validation of the recipient address
 * - visibility checks (`isPublic`)
 *
 * Those responsibilities belong to the controller layer.
 *
 * @param to - The recipient's email address.
 * @param publicUrl - The public URL of the shared document.
 *
 * @returns The result of the Resend API call.
 */
export async function sendPublicLinkEmail(to: string, publicUrl: string) {
  return resend.emails.send({
    from: "noreply@laakki.dev",
    to,
    subject: "A document was shared with you",
    html: `
      <p>Hello,</p>
      <p>A document has been shared with you.</p>
      <p>You can view it here:</p>
      <p><a href="${publicUrl}">${publicUrl}</a></p>
    `
  });
}
