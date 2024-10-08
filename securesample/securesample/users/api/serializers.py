from rest_framework import serializers
from dj_rest_auth.serializers import LoginSerializer, TokenSerializer, UserDetailsSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["username", "name", "url", "profile_image"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "username"},
        }
class CustomUserDetailsSerializer(UserDetailsSerializer):
    profile_image = serializers.ImageField(read_only=True)

    class Meta:
        model = UserDetailsSerializer.Meta.model
        fields = UserDetailsSerializer.Meta.fields + ('profile_image',)

class CustomTokenSerializer(TokenSerializer):
    user = CustomUserDetailsSerializer(read_only=True)  # Use your custom user serializer

    class Meta:
        model = User
        fields = ('key', 'user')  # Include the user details in the login response