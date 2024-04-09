
// fetches the list of courses 
export async function getCourses() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`);
  
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
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