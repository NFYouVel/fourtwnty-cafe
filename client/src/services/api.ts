import type { OrderItem } from "../type/OrderItem";

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

export async function getUser(email: string) {
    const response = await fetch(`${BASE_URL}/auth/user?email=${encodeURIComponent(email)}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }
    );

    if (!response.ok) {
        throw new Error("Get user failed");
    }

    const message = await response.json();

    console.log(message);

    return message;
}


export async function getAllMenuRequest() {
    const response = await fetch(`${BASE_URL}/order/menu`);

    if (!response.ok) {
        throw new Error("Failed get menu");
    }

    const data = await response.json();
    return data;
}

export async function registerRequest(name: string, email: string, password: string, phone: string) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password,
            phone
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Register failed");
    }
}
export async function createNewOrder(cartItems: OrderItem[]) {

    console.log("Cart items:", cartItems);
    try {
        const response = await fetch(`${BASE_URL}/order/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}`
            },
            // Langsung kirim array-nya
            body: JSON.stringify(cartItems), 
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Gagal membuat order");
        }

        return data;
    } catch (error) {
        console.error("Error saat kirim order:", error);
        throw error;
    }
}
