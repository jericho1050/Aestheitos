from rest_framework.routers import DefaultRouter
from learn.api.urls import *

from django.urls import path, include

router = DefaultRouter()

# API ROUTES FOR ALL MODELS

# router.registry.extend(user_router.registry)
router.registry.extend(user_progress_router.registry)
router.registry.extend(course_router.registry)
router.registry.extend(course_content_router.registry)
router.registry.extend(course_comments_router.registry)
router.registry.extend(enrollment_router.registry)
router.registry.extend(workouts_router.registry)
router.registry.extend(correct_exercise_form_router.registry)
router.registry.extend(wrong_exercise_form_router.registry)
router.registry.extend(blog_router.registry)
router.registry.extend(blog_comments_router.registry)

urlpatterns = [
    path('', include(router.urls)),
]