import logging
import threading

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def _send_email_thread(subject, plain_message, from_email, recipient_list, html_message):
    """Internal function to be run in a separate thread."""
    try:
        send_mail(
            subject,
            plain_message,
            from_email,
            recipient_list,
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Email sent successfully to {recipient_list}")
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_list}: {str(e)}")


def send_logify_email(subject, template_name, context, recipient_list):
    """
    Utility function to send HTML emails asynchronously.

    Args:
        subject (str): Email subject
        template_name (str): Path to the HTML template (e.g., 'notifications/welcome.html')
        context (dict): Dictionary of context variables for the template
        recipient_list (list): List of recipient email addresses

    Returns:
        bool: True (always returns True as email is sent in background)
    """
    try:
        # Add frontend URL to context if not already there
        if "frontend_url" not in context:
            context["frontend_url"] = getattr(settings, "FRONTEND_URL", "http://localhost:3000")

        # Render HTML content
        html_message = render_to_string(template_name, context)

        # Create plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)

        from_email = settings.DEFAULT_FROM_EMAIL

        # Start a background thread for sending the email
        thread = threading.Thread(
            target=_send_email_thread,
            args=(subject, plain_message, from_email, recipient_list, html_message),
        )
        thread.start()

        return True
    except Exception as e:
        logger.error(f"Error preparing email for {recipient_list}: {str(e)}")
        return False
