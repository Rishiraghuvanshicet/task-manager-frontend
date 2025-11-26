import { createContext, useContext, useState, useCallback } from 'react';
import { taskService } from '../services/api';
import { toast } from 'react-toastify';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all tasks from API
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks('', '');
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err?.message || 'Failed to load tasks';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error loading tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      toast.success('Task created successfully!');
      return newTask;
    } catch (err) {
      const errorMessage = err?.message || 'Failed to create task';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Update an existing task
  const updateTask = useCallback(async (id, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task._id === id || task.id === id ? updatedTask : task))
      );
      toast.success('Task updated successfully!');
      return updatedTask;
    } catch (err) {
      const errorMessage = err?.message || 'Failed to update task';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id && task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (err) {
      const errorMessage = err?.message || 'Failed to delete task';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Get task by ID
  const getTaskById = useCallback(async (id) => {
    try {
      const task = await taskService.getTaskById(id);
      return task;
    } catch (err) {
      const errorMessage = err?.message || 'Failed to fetch task';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Get task counts
  const getTaskCounts = useCallback(() => {
    if (!tasks || !Array.isArray(tasks)) {
      return { all: 0, todo: 0, inProgress: 0, completed: 0 };
    }
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };
  }, [tasks]);

  const value = {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTaskCounts,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

