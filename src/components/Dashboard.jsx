import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';

const Dashboard = ({ onAddTask, onEditTask, onViewTask, onDeleteTask }) => {
  const { tasks, loading, error, loadTasks, deleteTask, getTaskCounts } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // apply client-side filtering (search + status) — keeps UI snappy and consistent
  useEffect(() => {
    if (!tasks || !Array.isArray(tasks)) {
      setFilteredTasks([]);
      return;
    }

    const q = searchQuery.trim().toLowerCase();
    const status = statusFilter; // 'all' | 'todo' | 'in-progress' | 'completed'

    const filtered = tasks.filter((task) => {
      // status filter (apply client-side in case backend didn't)
      if (status !== 'all' && task.status !== status) return false;

      // search filter
      if (!q) return true;
      const inTitle = task.title?.toLowerCase().includes(q);
      const inDesc = !!task.description && task.description.toLowerCase().includes(q);
      return inTitle || inDesc;
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleFilterButtonClick = (status) => {
    setStatusFilter(status);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId);
      if (onDeleteTask) onDeleteTask();
    } catch (err) {
      // Error is already handled in context
    }
  };

  const counts = getTaskCounts();

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ fontSize: '48px' }}>
          📋
        </Typography>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage and track your tasks efficiently
          </Typography>
        </Box>
      </Box>

      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5, alignItems: 'center' }}>
        <TextField
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">All Tasks</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Filter Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant={statusFilter === 'all' ? 'contained' : 'outlined'}
          onClick={() => handleFilterButtonClick('all')}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            ...(statusFilter === 'all' && {
              backgroundColor: '#3B82F6',
              '&:hover': { backgroundColor: '#2563EB' },
            }),
          }}
        >
          All ({counts.all})
        </Button>
        <Button
          variant={statusFilter === 'todo' ? 'contained' : 'outlined'}
          onClick={() => handleFilterButtonClick('todo')}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            ...(statusFilter === 'todo' && {
              backgroundColor: '#3B82F6',
              '&:hover': { backgroundColor: '#2563EB' },
            }),
          }}
        >
          To Do ({counts.todo})
        </Button>
        <Button
          variant={statusFilter === 'in-progress' ? 'contained' : 'outlined'}
          onClick={() => handleFilterButtonClick('in-progress')}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            ...(statusFilter === 'in-progress' && {
              backgroundColor: '#3B82F6',
              '&:hover': { backgroundColor: '#2563EB' },
            }),
          }}
        >
          In Progress ({counts.inProgress})
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'contained' : 'outlined'}
          onClick={() => handleFilterButtonClick('completed')}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            ...(statusFilter === 'completed' && {
              backgroundColor: '#3B82F6',
              '&:hover': { backgroundColor: '#2563EB' },
            }),
          }}
        >
          Completed ({counts.completed})
        </Button>
      </Box>

      {/* Tasks Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      ) : filteredTasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No tasks found. Create your first task!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5} sx={{ alignItems: 'stretch' }}>
          {filteredTasks.map((task) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={task._id || task.id}
              sx={{
                display: 'flex',
                height: '320px'
              }}
            >
              <TaskCard
                task={task}
                onView={onViewTask}
                onEdit={onEditTask}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
