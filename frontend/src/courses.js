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

export async function createCourse(courseFormData) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}courses`, {
      method: 'POST',
      credentials: 'include',
      body: courseFormData
    });

    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error('An error occurred:', err)
    return err;
  }
}

// export async function getCourse(id) {
//   //TODO 
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_URL}course/${id}`);
//   }
// }

export async function updateCourse(id, updates) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}course/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: updates
    });

    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error('An error occured', err);
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

    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error('An error occured', err)
    return err;
  }
}

export async function updateCourseContent(id, updates) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}course/${id}/course-content`, {
      method: 'PUT',
      credentials: 'include',
      body: updates
    });

    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error('An error occured', err);
    return err;
  }
}

export async function getSection(sectionId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}section/${sectionId}/course-content`, {
      method: 'GET',
      credentials: 'include',

    });

    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error('An error occured', err);
    return err;
  }
}

export async function createSection(courseContentId, sectionFormData) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}sections/course-content/${courseContentId}`, {
      method: 'POST',
      credentials: 'include',
      body: sectionFormData
    });

    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error('An error occured', err)
    return err;
  }
}

export async function updateSection(sectionId, updates) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}section/${sectionId}/course-content`, {
      method: 'PUT',
      credentials: 'include',
      body: updates
    });

    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error('An error occured', err);
    return err;
  }
}

export async function deleteSection(sectionId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}section/${sectionId}/course-content`, {
      method: 'DELETE',
      credentials: 'include',
    });

    await checkResponse(response);
  }
  catch (err) {
    console.error('An error occured', err);
    return err;
  }
}

export async function getSectionItems(sectionId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}section-items/section/${sectionId}`, {
      method: 'GET',
      credentials: 'include'
    });

    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error('An error occured', err);
    return err;
  }
}

export async function createSectionItem(sectionId, sectionItemFormData) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}section-items/section/${sectionId}`, {
      method: 'POST',
      credentials: 'include',
      body: sectionItemFormData
    });

    await checkResponse(response);
    const data = await response.json();
    return data;

  }
  catch (err) {
    console.error('An error occured', err);
    return err;
  }
}

export async function updateSectionItem(sectionItemId, updates) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}section-item/${sectionItemId}/section`, {
      method: 'PUT',
      credentials: 'include',
      body: updates
    });

    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch(err) {
    console.error('An error occured', err);
    return err;
  }
}

export async function deleteSectionItem(sectionItemId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}section-item/${sectionItemId}/section`, {
      method: 'DELETE',
      credentials: 'include'
    })
    await checkResponse(response);
    const data = await response.json();
    return data;
  }
  catch(err) {
    console.error('An error occured', err);
    return err;
  }
}


async function checkResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new HttpError(response.status, message);
  }
}

