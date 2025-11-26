import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { useTasks } from '../context/TaskContext';

const EditTask = ({ taskId, onCancel, onSuccess }) => {
  const { getTaskById, updateTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setFetching(true);
      const task = await getTaskById(taskId);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
      });
    } catch (err) {
      const errorMessage = 'Failed to load task: ' + (err.message || '');
      setError(errorMessage);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await updateTask(taskId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMessage = err.message || 'Failed to update task';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box
        sx={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          backgroundColor: '#F3F4F6',
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 600,
            borderRadius: 3,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2, color: '#6B7280' }}>Loading task...</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        backgroundColor: '#F3F4F6',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 600,
          borderRadius: 3,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937', mb: 3 }}>
            Edit Task
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Task Title *"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Description"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
                startIcon={<Cancel />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  color: '#3B82F6',
                  borderColor: '#3B82F6',
                  '&:hover': {
                    borderColor: '#2563EB',
                    backgroundColor: '#EFF6FF',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  backgroundColor: '#3B82F6',
                  '&:hover': {
                    backgroundColor: '#2563EB',
                  },
                }}
              >
                {loading ? 'Updating...' : 'Update Task'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditTask;

