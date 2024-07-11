import React, { useState, useEffect, useCallback } from "react";
import { createTask, getProjects } from "../api/api";
import "./TaskForm.css"; // Import custom CSS
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TaskForm = ({ fetchTasks, closeModal }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState(null);
  const navigate = useNavigate();


  const fetchProjects = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await getProjects(authToken);
      setProjects(response.projects);
    } catch (error) {
      console.error("Error fetching projects:", error.response.data);
      if (error.response.data.error === "jwt expired") {
        setErrorTasks("Session expired. please login again"); // Set error message
        navigate("/login");
      } else {
        setErrorTasks("Failed to fetch tasks. Please try again.");
      }
      setIsLoadingTasks(false);
    }
  }, [navigate])

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await createTask(authToken, {
        title,
        description,
        status,
        dueDate,
        projectId,
        priority,
      });
      if (response.message) {
      }
      toast.success(response.message);
      closeModal();
      setTitle("");
      setDescription("");
      setStatus("");
      setDueDate("");
      setProjectId("");
      setPriority("");
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      // Handle error creating task (e.g., display error message)
      setErrorTasks("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className="form-control"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select status</option>
            <option value="in-progress">In-progress</option>
            <option value="to-do">To-do</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            className="form-control"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectId">Project</label>
          <select
            className="form-control"
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            className="form-control"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">Select priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
