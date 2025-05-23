from django.urls import path
from .views import (
    UserDashboardView,
    PlayerProfileDetailView,
    UserCompletedQuestsView,
    UserActiveQuestsView,
    GameItemListView,
    PlayerInventoryListView,
    PlayerInventoryAddView,
    MagicalLocationListView,
    MagicalLocationDetailView,
    MagicalLocationSuggestView,
    QuestAvailableListView,
    QuestDetailView,
    PlayerQuestListView,
    QuestAcceptView,
    QuestProgressUpdateView,
    QuestCompleteView,
    MapReportCreateView,
    PlayerGPSTraceCreateView,
)

app_name = 'gamemodels'

urlpatterns = [
    path('dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
    path('profile/', PlayerProfileDetailView.as_view(), name='user-profile-detail'),
    path('quests/completed/', UserCompletedQuestsView.as_view(), name='user-completed-quests'),
    path('quests/active/', UserActiveQuestsView.as_view(), name='user-active-quests'),
    path('items/', GameItemListView.as_view(), name='game-item-list'),
    path('inventory/me/', PlayerInventoryListView.as_view(), name='player-inventory-list'),
    path('inventory/me/add/', PlayerInventoryAddView.as_view(), name='player-inventory-add'),
    path('magical-locations/', MagicalLocationListView.as_view(), name='magical-location-list'),
    path('magical-locations/<int:pk>/', MagicalLocationDetailView.as_view(), name='magical-location-detail'),
    path('magical-locations/suggest/', MagicalLocationSuggestView.as_view(), name='magical-location-suggest'),
    path('quests/available/', QuestAvailableListView.as_view(), name='quest-available-list'),
    path('quests/<int:pk>/', QuestDetailView.as_view(), name='quest-detail'),
    path('quests/me/', PlayerQuestListView.as_view(), name='player-quest-list'),
    path('quests/<int:quest_id>/accept/', QuestAcceptView.as_view(), name='quest-accept'),
    path('quests/progress/<int:progress_id>/update/', QuestProgressUpdateView.as_view(), name='quest-progress-update'),
    path('quests/progress/<int:progress_id>/complete/', QuestCompleteView.as_view(), name='quest-complete'),
    path('map-reports/', MapReportCreateView.as_view(), name='map-report-create'),
    path('gps-traces/', PlayerGPSTraceCreateView.as_view(), name='gps-trace-create'),
]