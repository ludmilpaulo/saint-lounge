from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_title', 'get_departments', 'is_active')

    def get_departments(self, obj):
        return ", ".join(obj.user.groups.values_list("name", flat=True))
    get_departments.short_description = "Departments"
