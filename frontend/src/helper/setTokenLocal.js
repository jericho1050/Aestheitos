export default function setJWTLocatStorage(token) {
    if (!localStorage.getItem('jwt')) {

        localStorage.setItem('jwt', token);
    }
    const jwt = localStorage.getItem('jwt');

    return jwt;
    
}

