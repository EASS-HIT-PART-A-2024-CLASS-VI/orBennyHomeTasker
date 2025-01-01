import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Registration failed");
            }
            alert("Registered successfully!");
            navigate("/login"); // go to login page
        } catch (err) {
            console.error(err);
            alert("Registration failed");
        }
    };

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default Register;
