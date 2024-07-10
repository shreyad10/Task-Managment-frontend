import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getProjects } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await getProjects(authToken);
      setProjects(response.projects);
      setIsLoadingProjects(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (error.response && error.response.data.error === 'jwt expired') {
        setErrorProjects('Session expired. Please login again.');
        navigate('/login');
      } else {
        setErrorProjects('Failed to fetch projects. Please try again.');
      }
      setIsLoadingProjects(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="dashboard-animation">Transform your ideas into reality. Start by organizing your projects effectively and achieving milestones every step of the way!</h5>
        <div className="position-relative">
          <Button variant="primary" onClick={handleShow} className="btn-add-project">
            Add Project
          </Button>
        </div>
      </div>

      <ProjectList fetchProjects={fetchProjects} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectForm fetchProjects={fetchProjects} handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Projects;
