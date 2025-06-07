export const loginAdmin = async (email, password) => {
    try {
        const res = await fetch("http://localhost/chorchamp-server/api/users/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Network error" };
    }
};
