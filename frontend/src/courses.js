
// fetches the list of courses 
export async function getCourses() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}courses`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  }

  export async function getCourse(id) {
    //TODO 
  }

  
  class HttpError extends Error {
    constructor(statusCode, message, ...params) {
      super(...params);
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, HttpError);
      }
  
      this.statusCode = statusCode;
      this.message = message;
    }
  }
  
  export async function createCourse(courseFormData) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}courses`, {
        method: 'POST',
        credentials: 'include',
        body: courseFormData
      });
      if (!response.ok) {
        const message = await response.text();
        throw new HttpError(response.status, message);
      }
      const data = await response.json();
      return data;
    }
    catch(err) {
      console.error('An error occurred:', err)
      return err;
    }
  }

  export async function createCourseContent(courseId, courseContentFormData) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}course/${courseId}/course-content`, {
        method: 'POST',
        credentials: 'include',
        body: courseContentFormData
      });
      if (!response.ok) {
        const message = await response.text();
        throw new HttpError(response.status, message);
      }

      const data = await response.json();
      return data;
    } 
    catch (err) {
      console.error('An error occured', err)
      return err;
    }
  }
  

  // in which is called when user creates an accordion
  export async function createSection(courseContentId, sectionFormData) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}sections/course-content/${courseContentId}`, {
        method: 'POST',
        credentials: 'include',
        body: sectionFormData
      });

      if (!response.ok) {
        const message = await response.text();
        throw new HttpError(response.status, message);
      }

      const data = await response.json();
      return data;
    }
    catch (err) {
      console.error('An error occured', err)
      return err;
    }
  }



  export async function updateCourse(id, updates){
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}course/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: updates 
      });
      if (!response.ok) {
        const message = await response.text();
        throw new HttpError(response.status, message)
      }

      const data = await response.json();
      return data;
    }
    catch (err) {
      console.error('An error occured', err);
      return err;
    }
  }

  export async function updateCourseContent(id, updates){ 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}course/${id}/course-content`, {
        method: 'PUT',
        credentials: 'include',
        body: updates
      });
      if (!response.ok) {
        const message = await response.text();
        throw new HttpError(response.status, message);
      }
      const data = await response.json();
      return data;
    }
    catch (err) {
      console.error('An error occured', err);
      return err;
    }
  }