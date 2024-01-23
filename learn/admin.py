from django.contrib import admin
from .models import User, UserProgress, Course, CourseContent, CourseComments, Enrollment, Workouts, CorrectExerciseForm, WrongExerciseForm, Blog, BlogComments


# Register your models here.
admin.site.register(User)
admin.site.register(UserProgress)
admin.site.register(Course)
admin.site.register(CourseContent)
admin.site.register(CourseComments)
admin.site.register(Enrollment)
admin.site.register(Workouts)
admin.site.register(CorrectExerciseForm)
admin.site.register(WrongExerciseForm)
admin.site.register(Blog)
admin.site.register(BlogComments)
