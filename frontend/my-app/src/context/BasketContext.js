// Stores the basket state and provides functions to manipulate it
// This context is used to manage the user's basket (shopping cart) throughout the application
// It uses localStorage to persist the basket state across page reloads
import React, { createContext, useContext, useState, useEffect } from 'react';

const BasketContext = createContext();

export const useBasket = () => useContext(BasketContext);

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState(() => {
    const storedBasket = localStorage.getItem('basket');
    return storedBasket ? JSON.parse(storedBasket) : [];
  });

  //  Save basket to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(basket));
  }, [basket]);

  const addToBasket = (classItem) => {
    setBasket((prevBasket) => [...prevBasket, classItem]);
  };

  const removeFromBasket = (index) => {
    setBasket((prevBasket) => prevBasket.filter((_, i) => i !== index));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  return (
    <BasketContext.Provider value={{ basket, addToBasket, removeFromBasket, clearBasket }}>
      {children}
    </BasketContext.Provider>
  );
};

