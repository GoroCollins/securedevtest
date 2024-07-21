from rest_framework_simplejwt.authentication import JWTAuthentication
from django.middleware.csrf import CsrfViewMiddleware
from django.conf import settings
from rest_framework import exceptions


def enforce_csrf(request):
    """
    Enforce CSRF validation.
    """
    csrf_check = CsrfViewMiddleware(lambda req: None)
    try:
        csrf_check.process_view(request, None, (), {})
    except exceptions.PermissionDenied as e:
        raise exceptions.PermissionDenied('CSRF Failed: %s' % str(e))

class CustomJWTAuthentication(JWTAuthentication):
    """Custom authentication class"""
    def authenticate(self, request):
        header = self.get_header(request)
        
        if header is None:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        enforce_csrf(request)
        return self.get_user(validated_token), validated_token
