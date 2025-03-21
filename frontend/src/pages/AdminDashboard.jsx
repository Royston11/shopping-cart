import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
    const [user, setUser ] = useState(null);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCart, setShowCart] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [userMessage, setUserr] = useState(""); // Fixed variable name

    useEffect(() => {
        const fetchUser  = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/user", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setUser (data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user:", error);
                setLoading(false);
            }
        };

        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/products");
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchCartItems = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/cart", {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await res.json();
                setCartItems(Array.isArray(data) ? data.map(item => ({
                    ...item,
                    Product: products.find(p => p.id === item.productId) || {}
                })) : []);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchUser ();
        fetchProducts();
        fetchCartItems();
        setLoading(false);
    }, [products]);

    const handleIncreaseQuantity = async (productId) => {
        try {
            const res = await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ productId, quantity: 1 })
            });
            if (!res.ok) throw new Error("Failed to update cart");
            const data = await res.json();
            setCartItems(prev => prev.map(item => item.productId === data.productId ? { ...item, quantity: item.quantity + 1 } : item).concat(prev.some(item => item.productId === data.productId) ? [] : [{ ...data, Product: products.find(p => p.id === data.productId) || {} }]));
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const handleDecreaseQuantity = async (productId) => {
        try {
            const res = await fetch("http://localhost:5000/api/cart/decrease", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ productId })
            });

            if (!res.ok) throw new Error("Failed to decrease quantity");

            const data = await res.json();

            setCartItems(prevCartItems => prevCartItems
                .map(item => item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item)
                .filter(item => item.quantity > 0)
            );
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    const handleDeleteCartItem = async (productId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!res.ok) throw new Error("Failed to delete cart item");
            setCartItems(prev => prev.filter((item) => item.productId !== productId));
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
    };

    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage = { sender: "user", text: userMessage };
        setChatMessages([...chatMessages, newMessage]);

        try {
            const res = await fetch("http://localhost:5000/api/chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await res.json();
            console.log("Chatbot response:", data);

            const botMessage = { sender: "bot", text: data.reply || "I didn't understand that." };
            setChatMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setUserr(""); // Clear the input field
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.Product?.price || 0) * item.quantity, 0);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>No user found.</p>;

    return (
        <div>
            <nav className="navbar navbar-dark bg-dark p-3">
                <a className="navbar-brand">Dashboard</a>
                <span className="text-light"><h5>Hi {user.name} </h5></span>
                <div>
                    <button className="btn btn-light me-2">Home</button>
                    <button className="btn btn-light me-2">Products</button>
                    <button className="btn btn-primary" onClick={() => setShowCart(true)}>Cart ({cartItems.length})</button>
                    <button className="btn btn-info" onClick={() => setShowChat(!showChat)}>💬 Chat</button>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-md-4">
                            <div className="card h-100">
                                <img
                                    src={product.imageUrl}
                                    className="card-img-top img-fluid"
                                    alt={product.name}
                                    style={{ objectFit: "cover", height: "200px", width: "100%" }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">Price: ${product.price.toFixed(2)}</p>
                                    <button className="btn btn-primary mt-auto" onClick={() => handleIncreaseQuantity(product.id)}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showCart && (
                <div className="offcanvas offcanvas-end show" tabIndex="-1">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title">Cart</h5>
                        <button type="button" className="btn-close" onClick={() => setShowCart(false)}></button>
                    </div>
                    <div className="offcanvas-body">
                        {cartItems.map(item => (
                            <div key={item.productId} className="d-flex align-items-center mb-2">
                                <img src={item.Product?.imageUrl} alt={item.Product?.name} className="img-fluid me-2" style={{ width: "50px", height: "50px" }} />
                                <span>{item.Product?.name} - ${item.Product?.price.toFixed(2)} x {item.quantity}</span>
                                <button className="btn btn-success ms-2" onClick={() => handleIncreaseQuantity(item.productId)}>+</button>
                                <button className="btn btn-warning ms-2" onClick={() => handleDecreaseQuantity(item.productId)}>-</button>
                                <button className="btn btn-danger ms-2" onClick={() => handleDeleteCartItem(item.productId)}>Delete</button>
                            </div>
                        ))}
                        <hr />
                        <h5>Total: ${totalPrice.toFixed(2)}</h5>
                    </div>
                </div>
            )}

            {showChat && (
                <div className="chatbox" style={{ position: "fixed", bottom: "20px", right: "20px", width: "300px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#fff", zIndex: 1000 }}>
                    <div className="chatbox-header" style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>
                        Chatbot
                        <button className="btn-close" style={{ float: "right" }} onClick={() => setShowChat(false)}></button>
                    </div>
                    <div className="chatbox-body" style={{ maxHeight: "200px", overflowY: "auto", padding: "10px" }}>
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={msg.sender === "user" ? "text-end" : "text-start"}>
                                <strong>{msg.sender === "user" ? "User  " : "Bot"}:</strong> {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chatbox-footer" style={{ padding: "10px" }}>
                        <input
                            type="text"
                            value={userMessage}
                            onChange={(e) => setUserr(e.target.value)} 
                            placeholder="Type a message..."
                            className="form-control"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                        />
                        <button className="btn btn-primary mt-2" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;