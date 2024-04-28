import { FaceRetouchingNatural } from "@mui/icons-material";

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

async function checkResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new HttpError(response.status, message);
  }
}


async function sendRequest(url, options) {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options
    });

    await checkResponse(response);

    if (options.method !== 'DELETE') {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.error('An error occured', err);
    return err;
  }
}

export async function getCourses() {
  return sendRequest(`${import.meta.env.VITE_API_URL}courses`, {
  });
}

export async function createCourse(courseFormData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}courses`, {
    method: 'POST',
    body: courseFormData
  });
}



// export async function getCourse(id) {
//   //TODO 
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_URL}course/${id}`);
//   }
// }

export async function updateCourse(id, updates) {
  return sendRequest(`${import.meta.env.VITE_API_URL}course/${id}`, {
    method: 'PUT',
    body: updates
  });
}

export async function createCourseContent(courseId, courseContentFormData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}course/${courseId}/course-content`, {
    method: 'POST',
    body: courseContentFormData
  });
}

export async function updateCourseContent(id, updates) {
  return sendRequest(`${import.meta.env.VITE_API_URL}course/${id}/course-content`, {
    method: 'PUT',
    body: updates
  });
}

export async function getSection(sectionId) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section/${sectionId}/course-content`, {});
}

export async function createSection(courseContentId, sectionFormData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}sections/course-content/${courseContentId}`, {
    method: 'POST',
    body: sectionFormData
  });
}

export async function updateSection(sectionId, updates) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section/${sectionId}/course-content`, {
    method: 'PUT',
    body: updates
  });
}

export async function deleteSection(sectionId) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section/${sectionId}/course-content`, {
    method: 'DELETE',
  });
}

export async function getSectionItems(sectionId) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section-items/section/${sectionId}`, {

  });
}

export async function createSectionItem(sectionId, sectionItemFormData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section-items/section/${sectionId}`, {
    method: 'POST',
    body: sectionItemFormData
  });
}

export async function updateSectionItem(sectionItemId, updates) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section-item/${sectionItemId}/section`, {
    method: 'PUT',
    body: updates
  });
}

export async function deleteSectionItem(sectionItemId) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section-item/${sectionItemId}/section`, {
    method: 'DELETE',
  })
}

export async function createWorkout(sectionItemId, workoutFormData){
  return sendRequest(`${import.meta.env.VITE_API_URL}workouts/section-item/${sectionItemId}`, {
    method: 'POST',
    body: workoutFormData
  })
}

