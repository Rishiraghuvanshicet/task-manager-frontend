import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Add, DarkMode, LightMode } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import ViewTask from './components/ViewTask';
import './App.css';

function AppContent() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

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
  };

  const handleCancel = () => {
    setCurrentView('dashboard');
    setSelectedTaskId(null);
  };

  const handleSuccess = () => {
    setCurrentView('dashboard');
    setSelectedTaskId(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Task Manager
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              onClick={() => setCurrentView('dashboard')}
              sx={{
                color: currentView === 'dashboard' ? 'primary.main' : 'text.secondary',
                textTransform: 'none',
                fontWeight: currentView === 'dashboard' ? 600 : 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                },
              }}
            >
              Dashboard
            </Button>
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddTask}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
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
        theme={darkMode ? 'dark' : 'light'}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
