export default async function refreshAccessToken(refreshToken) {

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}token/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            "refresh": refreshToken
        })
        })

        if (!response.ok) {
            throw new Error(response.status)
        }
        
        const data = await response.json()

        return data['access']

    } catch(error) {
        console.error(`error code: ${error}`);
    }

    
}