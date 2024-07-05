import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled components for custom styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #666;
  text-align: center;
  margin-bottom: 3rem;
`;

const Button = styled(Link)`
  padding: 1rem 2rem;
  background-color: #007bff;
  color: #fff;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
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
      <Subtitle>Your central hub for organizing projects & microtasks efficiently.</Subtitle>
      <Button to={redirectPath}>Get Started</Button>
    </Container>
  );
};

export default Home;
