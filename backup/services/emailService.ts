import emailjs from "@emailjs/browser";

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
    sender_name: "Timo"
  };
  console.log("Sending email with params:", templateParams);
  return emailjs.send(serviceId, templateId, templateParams, publicKey);
}
