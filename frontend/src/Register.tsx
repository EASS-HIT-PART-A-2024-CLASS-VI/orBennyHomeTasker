import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    TextField,
    Box,
    Typography,
    Stack,
    Snackbar,
    Alert
} from "@mui/material";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //const [confirmPassword, setConfirmPassword] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

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
            setSuccessOpen(true);
            setTimeout(() => navigate("/login"), 1500);//go to login page
        } catch (err) {
            setErrorOpen(true);
            setErrorMsg((err as Error).message);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: "auto",
                mt: 5,
                p: 4,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" mb={3} textAlign="center">
                Register
            </Typography>
            <form onSubmit={handleRegister}>
                <Stack spacing={3}>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button variant="contained" type="submit">
                        Sign Up
                    </Button>
                </Stack>
            </form>

            {/* Success Snackbar */}
            <Snackbar
                open={successOpen}
                autoHideDuration={3000}
                onClose={() => setSuccessOpen(false)}
            >
                <Alert onClose={() => setSuccessOpen(false)} severity="success">
                    Registered successfully!
                </Alert>
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar
                open={errorOpen}
                autoHideDuration={3000}
                onClose={() => setErrorOpen(false)}
            >
                <Alert onClose={() => setErrorOpen(false)} severity="error">
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Register;
