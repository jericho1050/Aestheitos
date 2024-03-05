export default async function getToken() {

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}user`, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: 'include'
        });
        const data = await response.json();

        return data;
    } catch(error) {
        console.error(error);
    }

}