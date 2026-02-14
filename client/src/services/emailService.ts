import emailjs from "@emailjs/browser";

/* =======================================================
   SEND DOCUMENT EMAIL
   ------------------------------------------------------- */
/**
 * Sends a document‑sharing email using EmailJS.
 *
 * @remarks
 * This function:
 * - uses a predefined EmailJS service, template, and public key
 * - sends an email containing a document title and public URL
 * - includes both sender and recipient information
 *
 * It is typically used when a user wants to share a public document link
 * with another person via email.
 *
 * @param toEmail - Recipient's email address.
 * @param documentTitle - Title of the shared document.
 * @param publicUrl - Public URL where the document can be viewed.
 * @param fromEmail - Sender's email address.
 *
 * @returns A Promise resolving to the EmailJS response object.
 *
 * @example
 * ```ts
 * await sendDocumentEmail(
 *   "friend@example.com",
 *   "My Notes",
 *   "https://app.com/doc/123",
 *   "me@example.com"
 * );
 * ```
 */
export async function sendDocumentEmail(
  toEmail: string,
  documentTitle: string,
  publicUrl: string,
  fromEmail: string
) {
  const serviceId = "service_rz7azjp";
  const templateId = "template_cnqon26";
  const publicKey = "dQLe3N9Qa8b59M8Du";

  const templateParams = {
    to_email: toEmail,
    document_title: documentTitle,
    public_url: publicUrl,
    from_email: fromEmail,
    sender_name: "Timo",
  };

  console.log("Sending email with params:", templateParams);

  return emailjs.send(serviceId, templateId, templateParams, publicKey);
}
