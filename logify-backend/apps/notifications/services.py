import logging
import os

from mailjet_rest import Client

logger = logging.getLogger(__name__)


class MailjetService:
    def __init__(self):
        api_key = os.environ.get("MAILJET_API_KEY")
        api_secret = os.environ.get("MAILJET_API_SECRET")
        self.sender_email = os.environ.get("MAILJET_SENDER_EMAIL", "[EMAIL_ADDRESS]")
        self.sender_name = "Logify Notifications"

        if api_key and api_secret:
            self.client = Client(auth=(api_key, api_secret), version="v3.1")
        else:
            logger.warning("Mailjet API keys not found in environment. Emails will be logged to console.")
            self.client = None

    def send_email(self, recipient_email, subject, text_content=None, html_content=None):
        if not self.client:
            logger.info(f"MOCK EMAIL to {recipient_email}: {subject}")
            logger.info(f"Content: {text_content or html_content}")
            return {"status": "mocked"}

        data = {
            "Messages": [
                {
                    "From": {"Email": self.sender_email, "Name": self.sender_name},
                    "To": [{"Email": recipient_email}],
                    "Subject": subject,
                    "TextPart": text_content,
                    "HTMLPart": html_content,
                }
            ]
        }

        try:
            result = self.client.send.create(data=data)
            if result.status_code == 200:
                logger.info(f"Email sent successfully to {recipient_email}")
                return result.json()
            else:
                logger.error(f"Failed to send email to {recipient_email}: {result.status_code} - {result.json()}")
                return None
        except Exception as e:
            logger.exception(f"Error sending email to {recipient_email}: {str(e)}")
            return None

    def send_otp(self, email, otp):
        subject = f"Your Logify Verification Code: {otp}"
        text_content = f"Your verification code is: {otp}. It expires in 10 minutes."
        html_content = f"<h3>Logify Verification</h3><p>Your verification code is: <strong>{otp}</strong></p><p>It expires in 10 minutes.</p>"
        return self.send_email(email, subject, text_content, html_content)

    def send_supervisor_signup_notification(self, email):
        subject = "Logify Supervisor Application Received"
        text_content = "Thank you for applying. Your application is under review. You will be notified once approved."
        html_content = "<h3>Logify Application Received</h3><p>Thank you for applying. Your application is under review. You will be notified once approved.</p>"
        return self.send_email(email, subject, text_content, html_content)

    def send_supervisor_approval_notification(self, email):
        subject = "Logify Supervisor Account Approved"
        text_content = "Your supervisor account has been approved. You can now login to the Logify platform."
        html_content = "<h3>Account Approved</h3><p>Your supervisor account has been approved. You can now login to the Logify platform.</p>"
        return self.send_email(email, subject, text_content, html_content)

    def send_supervisor_assignment_notification(self, supervisor_email, student_name):
        subject = "New Student Assignment on Logify"
        text_content = f"A student ({student_name}) has selected you as their supervisor. Please login to review and approve the placement."
        html_content = f"<h3>New Student Assignment</h3><p>A student (<strong>{student_name}</strong>) has selected you as their supervisor.</p><p>Please login to review and approve the placement.</p>"
        return self.send_email(supervisor_email, subject, text_content, html_content)

    def send_student_approval_notification(self, student_email, supervisor_name):
        subject = "Logify Placement Approved"
        text_content = f"Your internship placement has been approved by {supervisor_name}."
        html_content = f"<h3>Placement Approved</h3><p>Your internship placement has been approved by <strong>{supervisor_name}</strong>.</p>"
        return self.send_email(student_email, subject, text_content, html_content)
