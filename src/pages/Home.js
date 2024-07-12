import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled components for custom styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  animation: ${fadeIn} 1s ease-out;
  padding-top: 0vh; /* Adjusted this value to move the text upwards */
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #343a40;
  text-align: center;
  animation: ${fadeIn} 1.5s ease-out;
  animation: ${pulse} 2s infinite;

  &::before {
    content: "🚀 ";
  }

  &::after {
    content: " 🚀";
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #495057;
  text-align: center;
  margin-bottom: 2rem;
  max-width: 600px;
  animation: ${fadeIn} 2s ease-out;

  &::before {
    content: "💼 ";
  }

  &::after {
    content: " 💼";
  }
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  background-color: #007bff;
  color: #fff;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
  animation: ${fadeIn} 2.5s ease-out;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-5px);
  }

  &::before {
    content: "🚀 ";
  }

  &::after {
    content: " 🚀";
  }
`;

const Home = () => {
  const [redirectPath, setRedirectPath] = useState('/login');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setRedirectPath('/dashboard');
    }
  }, []);

  return (
    <Container>
      <Title>Welcome to Project Manager</Title>
      <Subtitle>
        Your central hub for organizing projects & microtasks efficiently. 
        Stay on top of your tasks and collaborate seamlessly with your team.
      </Subtitle>
      <Button to={redirectPath}>Get Started</Button>
    </Container>
  );
};

export default Home;
