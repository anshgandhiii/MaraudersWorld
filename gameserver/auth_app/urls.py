# auth_app/urls.py
from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, UserDetailView, LogoutView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

app_name = 'auth_app'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('user/', UserDetailView.as_view(), name='user_detail'),
]