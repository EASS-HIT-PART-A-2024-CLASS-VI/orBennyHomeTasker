import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // FastAPI OAuth2PasswordRequestForm expects username/password in form-data
            // We'll pass username = email
            const params = new URLSearchParams();
            params.append("username", email);
            params.append("password", password);

            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Login failed");
            }

            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            alert("Login successful");
            navigate("/"); // go to main page
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
