from django.contrib import admin
from .models import *

class CourseAdmin(admin.ModelAdmin):
    readonly_fields = ['course_created', 'course_updated']
    list_display = ('id', 'title')

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username')


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(UserProgress)
admin.site.register(Course, CourseAdmin)
admin.site.register(CourseContent)
admin.site.register(Section)
admin.site.register(SectionItem)
admin.site.register(CourseRating)
admin.site.register(CourseComments)
admin.site.register(Enrollment)
admin.site.register(Workouts)
admin.site.register(CorrectExerciseForm)
admin.site.register(WrongExerciseForm)
admin.site.register(Blog)
admin.site.register(BlogComments)
