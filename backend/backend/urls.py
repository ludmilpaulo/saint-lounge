from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('doc/', include('documents.urls')),
    path('careers/', include('careers.urls')),
    path('account/', include('accounts.urls')),
    path('email/', include('emailmarketing.urls')),
    path(
        "ckeditor5/", include("django_ckeditor_5.urls"), name="ck_editor_5_upload_file"
    ),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
