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
    } else {
      return response;
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

export async function createCourseContent(id, formData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}course/${id}/course-content`, {
    method: 'POST',
    body: formData
  });
}

export async function updateCourseContent(id, updates) {
  return sendRequest(`${import.meta.env.VITE_API_URL}course/${id}/course-content`, {
    method: 'PUT',
    body: updates
  });
}

export async function getSection(id) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section/${id}/course-content`, {});
}

export async function createSection(id, formData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}sections/course-content/${id}`, {
    method: 'POST',
    body: formData
  });
}

export async function updateSection(id, updates) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section/${id}/course-content`, {
    method: 'PUT',
    body: updates
  });
}

export async function deleteSection(id) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section/${id}/course-content`, {
    method: 'DELETE',
  });
}

export async function getSectionItems(id) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section-items/section/${id}`, {

  });
}

export async function createSectionItem(id, formData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section-items/section/${id}`, {
    method: 'POST',
    body: formData
  });
}

export async function updateSectionItem(id, updates) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section-item/${id}/section`, {
    method: 'PUT',
    body: updates
  });
}

export async function deleteSectionItem(id) {
  return sendRequest(`${import.meta.env.VITE_API_URL}section-item/${id}/section`, {
    method: 'DELETE',
  })
}

export async function getWorkouts(id) {
  return sendRequest(`${import.meta.env.VITE_API_URL}workouts/section-item/${id}`, {

  });
}

export async function createWorkout(id, formData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}workouts/section-item/${id}`, {
    method: 'POST',
    body: formData
  })
}

export async function updateWorkout(id, formData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}workout/${id}/section-item`, {
    method: 'PATCH',
    body: formData
  })
}

export async function deleteWorkout(id) {
  return sendRequest(`${import.meta.env.VITE_API_URL}workout/${id}/section-item`, {
    method: 'DELETE',
  })
}

export async function createCorrectExerciseForm(id, formData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}correct-exercises/course/workout/${id}`, {
    method: 'POST',
    body: formData
  })
}
export async function updateCorrectExerciseForm(id, formData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}correct-exercise/${id}/course/workout`, {
    method: 'PATCH',
    body: formData
  })
}

export async function deleteCorrectExerciseForm(id) {
  return sendRequest(`${import.meta.env.VITE_API_URL}correct-exercise/${id}/course/workout`, {
    method: 'DELETE',

  })
}

export async function createWrongExerciseForm(id, formData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}wrong-exercises/course/workout/${id}`, {
    method: 'POST',
    body: formData
  })
}

export async function updateWrongExerciseForm(id, formData) {
  return sendRequest(`${import.meta.env.VITE_API_URL}wrong-exercise/${id}/course/workout`, {
    method: 'PATCH',
    body: formData
  })
}

export async function deleteWrongExerciseForm(id){ 
  return sendRequest(`${import.meta.env.VITE_API_URL}wrong-exercise/${id}/course/workout`, {
    method: 'DELETE',
  })
}