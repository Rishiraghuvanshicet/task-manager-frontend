import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Box
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";

const STATUS = {
  "todo": {
    key: "todo",
    label: "To Do",
    color: "#6B7280",
    bg: "#F3F4F6",
    topColor: "#E5E7EB"
  },
  "in-progress": {
    key: "in-progress",
    label: "In Progress",
    color: "#B45309",
    bg: "#FFF7ED",
    topColor: "#F97316"
  },
  "completed": {
    key: "completed",
    label: "Completed",
    color: "#166534",
    bg: "#ECFDF5",
    topColor: "#16A34A"
  }
};

const getStatus = (s) => {
  if (!s) return STATUS["todo"];
  return STATUS[s] || STATUS["todo"];
};

const TaskCard = ({ task, onView, onEdit, onDelete }) => {
  const statusInfo = getStatus(task.status);
  const createdDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    : "";

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo":
        return "○";
      case "in-progress":
        return "⏱";
      case "completed":
        return "✓";
      default:
        return "○";
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: 2.5,
        // top colored strip (rounded ends). pointerEvents none so it doesn't block layout
        "&::before": {
          content: '""',
          position: "absolute",
          left: 12,
          right: 12,
          top: 10,
          height: 8,
          borderRadius: "8px",
          backgroundColor: statusInfo.topColor,
          zIndex: 1,
          pointerEvents: "none"
        },
        // card visual
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%"
      }}
    >
      <CardContent
        sx={{
          position: "relative",
          zIndex: 2,
          px: 2.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          // allow CardContent to grow and push actions to bottom
          flex: 1
        }}
      >
        {/* top row: title (left) and status chip (right) */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: 18,
              maxWidth: "76%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
            title={task.title}
          >
            {task.title}
          </Typography>

          <Chip
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, fontWeight: 600 }}>
                <span style={{ fontSize: 12 }}>{getStatusIcon(task.status)}</span>
                <span style={{ fontSize: 13 }}>{statusInfo.label}</span>
              </Box>
            }
            sx={{
              backgroundColor: statusInfo.bg,
              color: statusInfo.color,
              height: 28,
              borderRadius: 3,
              fontWeight: 600,
              boxShadow: "none",
              px: 1
            }}
            size="small"
          />
        </Box>

        {/* description (clamped lines) */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: 14,
            lineHeight: 1.6,
            mt: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "84px",
            flexShrink: 0
          }}
        >
          {task.description || "No description"}
        </Typography>

        {/* spacer - ensures created date + actions sit at bottom */}
        <Box sx={{ flex: 1 }} />

        {/* bottom row: created date and action icons */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 12 }}>
            Created: {createdDate}
          </Typography>

          <Box sx={{ display: "flex", gap: 0.75 }}>
            <IconButton
              size="small"
              onClick={() => onView && onView(task)}
              sx={{
                color: "#2563EB",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(37,99,235,0.08)" }
              }}
              title="View"
            >
              <Visibility fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onEdit && onEdit(task)}
              sx={{
                color: "#0ea5e9",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(14,165,233,0.08)" }
              }}
              title="Edit"
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete && onDelete(task._id || task.id)}
              sx={{
                color: "#EF4444",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "rgba(239,68,68,0.08)" }
              }}
              title="Delete"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
