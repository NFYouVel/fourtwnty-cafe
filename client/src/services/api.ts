const BASE_URL = "http://localhost:5000/api"

export async function loginRequest(email: string, password: string) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        throw new Error("Login failed")
    }

    const message = response.json();
    console.log(message);
    return message
}

// export async function getPostsRequest() {
//     const response = await fetch(`${BASE_URL}/post`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     })

//     if (!response.ok) {
//         throw new Error("Get posts failed")
//     }

//     return response.json()
// }