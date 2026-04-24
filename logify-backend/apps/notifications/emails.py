import logging

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def send_logify_email(subject, template_name, context, recipient_list):
    """
    Utility function to send HTML emails using Django's send_mail.

    Args:
        subject (str): Email subject
        template_name (str): Path to the HTML template (e.g., 'notifications/welcome.html')
        context (dict): Dictionary of context variables for the template
        recipient_list (list): List of recipient email addresses

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Render HTML content
        html_message = render_to_string(template_name, context)

        # Create plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)

        from_email = settings.DEFAULT_FROM_EMAIL

        send_mail(
            subject,
            plain_message,
            from_email,
            recipient_list,
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Email sent successfully to {recipient_list}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_list}: {str(e)}")
        return False
