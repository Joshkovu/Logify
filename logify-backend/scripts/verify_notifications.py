import os
import sys
import django

# Set up Django environment
sys.path.append("/home/joash/Documents/school-project/Logify/logify-backend")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.notifications.services import MailjetService

def test_mail_service():
    print("Testing MailjetService...")
    service = MailjetService()
    
    # Test methods (these will be mocked/logged if no API keys)
    print("Testing send_otp...")
    service.send_otp("student@example.com", "123456")
    
    print("Testing send_supervisor_signup_notification...")
    service.send_supervisor_signup_notification("supervisor@example.com")
    
    print("Testing send_supervisor_approval_notification...")
    service.send_supervisor_approval_notification("supervisor@example.com")
    
    print("Testing send_supervisor_assignment_notification...")
    service.send_supervisor_assignment_notification("supervisor@example.com", "John Doe")
    
    print("Testing send_student_approval_notification...")
    service.send_student_approval_notification("student@example.com", "Supervisor Jane")
    
    print("All tests passed (check logs for 'MOCK EMAIL' if keys are missing).")

if __name__ == "__main__":
    test_mail_service()
