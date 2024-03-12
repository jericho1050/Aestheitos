export default async function validateJWTToken() {
  
    // GET request 
    // ask the server to check or verify the access cookie's signature. and for user authentication purposes
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}user`, { headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
  
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