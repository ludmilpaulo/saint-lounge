from django.urls import path, include
from .invite_views import SendInviteView
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, SignatureViewSet
from .otp_views import SendOTPView, VerifyOTPView
from .audit_views import generate_audit_report

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)
router.register(r'signatures', SignatureViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('send-invite/', SendInviteView.as_view()),
    path('audit-report/<int:document_id>/', generate_audit_report),
    path('send-otp/', SendOTPView.as_view()),
    path('verify-otp/', VerifyOTPView.as_view()),
]
