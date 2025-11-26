import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import ViewTask from './components/ViewTask';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddTask = () => {
    setCurrentView('add');
  };

  const handleEditTask = (task) => {
    setSelectedTaskId(task._id || task);
    setCurrentView('edit');
  };

  const handleViewTask = (task) => {
    setSelectedTaskId(task._id || task);
    setCurrentView('view');
  };

  const handleDeleteTask = () => {
    // Trigger refresh of dashboard
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setCurrentView('dashboard');
    setSelectedTaskId(null);
  };

  const handleSuccess = () => {
    setCurrentView('dashboard');
    setSelectedTaskId(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          color: '#1F2937',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontSize: '24px' }}>
              📋
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
              Task Manager
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              onClick={() => setCurrentView('dashboard')}
              sx={{
                color: currentView === 'dashboard' ? '#3B82F6' : '#6B7280',
                textTransform: 'none',
                fontWeight: currentView === 'dashboard' ? 600 : 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#3B82F6',
                },
              }}
            >
              Dashboard
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddTask}
              sx={{
                backgroundColor: '#3B82F6',
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: '#2563EB',
                },
              }}
            >
              Add Task
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main">
        {currentView === 'dashboard' && (
          <Dashboard
            key={refreshKey}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onViewTask={handleViewTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
        {currentView === 'add' && <AddTask onCancel={handleCancel} onSuccess={handleSuccess} />}
        {currentView === 'edit' && selectedTaskId && (
          <EditTask taskId={selectedTaskId} onCancel={handleCancel} onSuccess={handleSuccess} />
        )}
        {currentView === 'view' && selectedTaskId && (
          <ViewTask taskId={selectedTaskId} onClose={handleCancel} onEdit={handleEditTask} />
        )}
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}

export default App;
