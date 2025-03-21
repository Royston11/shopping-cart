import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Users } from "lucide-react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("user");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { name, email, password, userType };

        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(userData),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                navigate("/login");
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Network error. Try again later.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Sign Up</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <div className="d-flex align-items-center border rounded p-2">
                            <User className="me-2 text-secondary" size={20} />
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <div className="d-flex align-items-center border rounded p-2">
                            <Mail className="me-2 text-secondary" size={20} />
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <div className="d-flex align-items-center border rounded p-2">
                            <Lock className="me-2 text-secondary" size={20} />
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>User Type</Form.Label>
                        <Form.Select value={userType} onChange={(e) => setUserType(e.target.value)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        Sign Up
                    </Button>
                </Form>
                <Row className="mt-3 text-center">
                    <Col>
                        Already have an account? <Link to="/login">Login</Link>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default Register;
