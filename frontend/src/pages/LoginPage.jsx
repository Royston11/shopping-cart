import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Container, Row, Col, Form, Button } from "react-bootstrap"; // React Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
    console.log("Rendering Login Page"); // Debugging

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { email, password };

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                toast.success("Login successful!");
                console.log("Navigating to /admin");  // Debugging
                navigate("/admin");
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error) {
            toast.error("Network error. Try again later.");
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'linear-gradient(to right,rgb(9, 8, 9),rgb(211, 198, 203))' }}>
            <Row className="w-100">
                <Col md={6} className="mx-auto">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-center mb-4">Login</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <div className="input-group">
                                    <div className="input-group-text">
                                        <Mail size={18} />
                                    </div>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="border-0 rounded-start"
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <div className="input-group">
                                    <div className="input-group-text">
                                        <Lock size={18} />
                                    </div>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="border-0 rounded-start"
                                    />
                                </div>
                            </Form.Group>

                            <Button type="submit" variant="primary" className="w-100 py-2 mt-3">
                                Login
                            </Button>
                        </Form>

                        <p className="text-center mt-3">
                            Don't have an account?{" "}
                            <Link to="/Register" className="text-primary">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;