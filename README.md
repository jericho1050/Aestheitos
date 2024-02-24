# Aestheitos

As someone who is a fitness and calisthenic enthusiast, I've set my goal of building a web app around my passion.There are many beginners who make lots of mistakes when starting their journey in fitness or calisthenics and don't know where to start. from a poorly structured workout or bad workout routine. That's the primary reason why I've wanted to create a learning management system or a learning platform particularly aimed at fitness.

I myself, who have trained and also made some mistakes for almost 4 years, I wanted to share my testimonies and teach them what I've learned from my research, which is the purpose of this web application.


> Motivation gets you going, But discipline keeps you growing

---

## Distinctiveness and Complexity

This project is an online learning platform dedicated to fitness and calisthenics. It allows users to enroll in training programs and courses created by verified users. Creating a course is never easy without a nice user interface.Each course includes a series of video lessons and a discussion or comment where users can interact with each other. The platform emphasizes community learning and engagement, making fitness education accessible and enjoyable for everyone. In addition, I've also implemented a blog where users can create and post their own and let other users read their very own published blog. Of course, it should be easy to create a blog, in which I've integrated a WYSIWYG (What You See Is What You Get) for a nice UI/UX, which, in my opinion, is the reason why it is ***distinct*** from other apps.

Before I've started the implementation or coding of this project, I've first created my pseudocode, an outline, a UML diagram for my models, and read Django's Rest Framework (DRF), React and React-router documentation, etc.The main reason is that I wanted it to be interactive.React serves as the frontend, which is SSR (server-side rendering) of our user interface via communicating through the backend server, which is Django.

In my outline i have my own **specifications** for my project, as follows:

> I'll just keep it short, I swear
    
- **Models**: User, Blog, BlogComments Course, CourseComments, UserProgress, CourseContent, Workouts, WrongExerciseForm, CorrectExerciseForm and Enrollment.
- **Register**: allows users to create or register for an account.
- **Create Course**: Users that are signed should be able to create their own training program or course by visiting the Create page.
- **Pending Courses**: Admins and staff should be able to visit a Pending page.displays all courses with the status pending
- **Course Catalog**: Index page, where a list of available courses created by instructors is displayed. Each course must include a title, description, thumbnail, difficulty level, number of enrollees, rating, and posted time. All users can see this.
- **Course**: Clicking a course should redirect the user to a page where they can view the course’s details.
- **Edit**: The admins or the authenticated Users should be able to edit their own Courses or Blogs.
- *optional* **Animation**: Use ReactSpring for the home page implemented it yourself through trial and error
- **Enrollment**: Users who are authenticated should be able to enroll in a course.
- **Comments**: Allows users to comment on course material and on a blog post.
- **Create Blog**: An authenticated user who is signed in should be able to write a new blog in an editor and then click the submit post button.
- **Blogs**: Users should be able to see all Blog posts from users, with the most recent posts first
- **Pagination**: On the page that display courses and blogs, for courses there should be only be 15 cards and 10 blog post on a page. If there are more than that, A “Next” button should appear to take the user to the next page of courses or blog posts (which should be older than the current page of courses and blog posts). if not on the first page, a “Previous” button should appear to take the user to the previous page as well

This is my UML Diagram for my models:

![UML diagram of my Django model that i've created in lucidchart](/images/images/Capstone.jpeg)
  
Here's also my rough idea or flowchart for my system:

![Flowchart of my LMS that i've created in lucidchart](/images/images/APP%20FLOW%20-%20UI%20FLOW.jpeg)
![Flowchart of my LMS that i've created in lucidchart](/images/images/APP%20FLOW%20-%20UI%20FLOW-2.jpeg)

Lastly, this is my **NOT** final of my UI tree:

![UI TREE of my Frontend that i've created in lucidchart](/images/images/Capstone%20UI%20TREE%20-%20hiearchy%20(React).jpeg)
 

Based on my explanations and everything that I've included, I would say that my project is fairly complex, if not much more complex than the given project that I've done in CS50W.

---

# Documentation

The spec is avaiable on SwaggerHub.

You can find the [REST API documentation here](https://app.swaggerhub.com/apis-docs/jerichokunserrano_gmail.com/AestheitosLMS/1.0.0).

TODO


# File Structure

## Backend (learn)

    learn
    ├── __pycache__
    ├──  migrations
    ├──  __init__.py 
    ├──  .gitignore 
    ├──  admin.py
    ├──  apps.py 
    ├──  custom_serializer.py
    ├──  helpers.py
    ├──  models.py
    ├──  serializers.py
    ├──  test_api.py
    ├──  test_api2.py
    ├──  test_models.py
    ├──  urls.py
    └──  views.py

Tells Git don't track files in here to be pushed.

    .gitignore


register models for Django's admin interface

    admin.py
```
admin.site.register(User)
admin.site.register(UserProgress)
admin.site.register(Course)
admin.site.register(CourseContent)
admin.site.register(CourseRating)
admin.site.register(CourseComments)
admin.site.register(Enrollment)
admin.site.register(Workouts)
admin.site.register(CorrectExerciseForm)
admin.site.register(WrongExerciseForm)
admin.site.register(Blog)
admin.site.register(BlogComments)
```

a mock or custom serializer that is only for documentation purposes

TODO


    


    



 


    







