# gamemodels_app/urls.py
from django.urls import path
from .views import (
    UserDashboardView,
    PlayerProfileDetailView,
    UserCompletedQuestsView,
    UserActiveQuestsView,
)

app_name = 'gamemodels' # Good practice for namespacing

urlpatterns = [
    path('dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
    path('profile/', PlayerProfileDetailView.as_view(), name='user-profile-detail'),
    path('quests/completed/', UserCompletedQuestsView.as_view(), name='user-completed-quests'),
    path('quests/active/', UserActiveQuestsView.as_view(), name='user-active-quests'),
]