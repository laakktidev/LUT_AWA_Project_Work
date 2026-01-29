import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPublicLinkEmail(to: string, publicUrl: string) {
  
  //console.log("sendPublicLinkEmail is currently disabled.", process.env.RESEND_API_KEY);
  //console.log(`Would send email to ${to} with link: ${publicUrl}`);
  
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
