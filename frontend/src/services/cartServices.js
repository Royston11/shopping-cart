import axios from 'axios';

// Get cart items for the logged-in user
export const getCartItems = async (token) => {
  try {
    const response = await axios.get('API_URL/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (productId, quantity, token) => {
  try {
    const response = await axios.post(
      'API_URL/cart/add',
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (productId, token) => {
  try {
    const response = await axios.delete(`API_URL/cart/api/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};
