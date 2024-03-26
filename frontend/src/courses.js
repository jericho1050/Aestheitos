
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

  
// creates a new course 
export async function createCourse(formData) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

  }
  catch(err) {
    console.error('An error occurred:', error)
  }
}