import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication
export const register = (userData) => api.post("/users/register", userData);
export const login = (userData) => api.post("/users/login", userData);

// Tasks
export const getTasks = async (authToken, page, limit=10) => {
  try {
    const response = await api.get("/tasks", {
      params: {
        page,
        limit,
      },
      headers: {
        "x-auth-token": authToken,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const createTask = (taskData) => api.post("/tasks", taskData);
export const createTask = async (authToken, taskData) => {
  try {
    const response = await api.post("/tasks", taskData, {
      headers: {
        "x-auth-token": authToken,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// export const updateTask = (taskId, taskData) =>
//   api.put(`/tasks/${taskId}`, taskData);

export const updateTask = async (authToken, taskId, taskData) => {
  // console.log(authToken, taskData, taskId)
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData, {
      headers: {
        "x-auth-token": authToken,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteTask = async (authToken, taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`, {
      headers: {
        "x-auth-token": authToken,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Projects
export const getProjects = async (authToken) => {
  try {
    const response = await api.get("/projects", {
      headers: {
        "x-auth-token": authToken,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProject = async (authToken, projectData) => {
  try {
    const response = await api.post("/projects", projectData, {
      headers: {
        "x-auth-token": authToken,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// export const updateProject = (projectId, projectData) =>
//   api.put(`/projects/${projectId}`, projectData);

  export const updateProject = async (authToken, projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData, {
        headers: {
          "x-auth-token": authToken,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const deleteProject = async (authToken, projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`, {
      headers: {
        "x-auth-token": authToken,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
