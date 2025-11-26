import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import { taskService } from '../services/api';

const ViewTask = ({ taskId, onClose, onEdit }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getTaskById(taskId);
      setTask(data);
    } catch (err) {
      setError('Failed to load task: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'todo':
        return { label: 'To Do', color: '#9CA3AF', bgColor: '#F3F4F6' };
      case 'in-progress':
        return { label: 'In Progress', color: '#F97316', bgColor: '#FFF7ED' };
      case 'completed':
        return { label: 'Completed', color: '#10B981', bgColor: '#ECFDF5' };
      default:
        return { label: 'To Do', color: '#9CA3AF', bgColor: '#F3F4F6' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo':
        return '○';
      case 'in-progress':
        return '⏱';
      case 'completed':
        return '✓';
      default:
        return '○';
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
          Task Details
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#6B7280' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error || !task ? (
          <Alert severity="error">{error || 'Task not found'}</Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Title
              </Typography>
              <Typography variant="body1" sx={{ color: '#1F2937', mt: 0.5, fontWeight: 500 }}>
                {task.title}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ color: '#1F2937', mt: 0.5, lineHeight: 1.6 }}>
                {task.description || 'No description provided'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                Status
              </Typography>
              <Chip
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span>{getStatusIcon(task.status)}</span>
                    {getStatusInfo(task.status).label}
                  </Box>
                }
                sx={{
                  backgroundColor: getStatusInfo(task.status).bgColor,
                  color: getStatusInfo(task.status).color,
                  fontWeight: 500,
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Created
              </Typography>
              <Typography variant="body2" sx={{ color: '#1F2937', mt: 0.5 }}>
                {formatDate(task.createdAt)}
              </Typography>
            </Box>

            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <Box>
                <Typography variant="caption" sx={{ color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Last Updated
                </Typography>
                <Typography variant="body2" sx={{ color: '#1F2937', mt: 0.5 }}>
                  {formatDate(task.updatedAt)}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: '#374151' }}>
          Close
        </Button>
        {task && (
          <Button
            onClick={() => onEdit(task._id)}
            variant="contained"
            startIcon={<Edit />}
            sx={{
              textTransform: 'none',
              backgroundColor: '#3B82F6',
              '&:hover': {
                backgroundColor: '#2563EB',
              },
            }}
          >
            Edit Task
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ViewTask;

