from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .auth import PasswordResetConfirmView, PasswordResetView, UserListView, UserLoginView, UserProfileView, UserSignupView, delete_account_by_user_id, get_user_profile, restore_user_account
from .user_profile import update_user_profile
from .views import UserViewSet, GroupViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
        path("password-reset/", PasswordResetView.as_view(), name="password_reset"),
    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path("signup/", UserSignupView.as_view(), name="signup"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("account/user/<int:user_id>/", UserProfileView.as_view(), name="user-profile"),
    path("account/profile/<int:user_id>/", get_user_profile, name="get-user-profile"),
    path("update/<int:user_id>/", update_user_profile, name="update-user-profile"),
    path("users/delete/", delete_account_by_user_id, name="delete_account_by_user_id"),
    path("users/restore/", restore_user_account, name="restore_user_account")
]
