from rest_framework.routers import DefaultRouter
from learn.api.urls import (user_router, user_progress_router, course_router, 
                            course_content_router, course_comments_router, enrollment_router, 
                            workouts_router, correct_exercise_form_router, wrong_exercise_form_router,
                            blog_router, blog_comments_router)

from django.urls import path, include

router = DefaultRouter()

router.registry.extend(user_router.registry)
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
    path('', include(router.urls))
]