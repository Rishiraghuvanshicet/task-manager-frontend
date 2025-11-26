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

/**
 * TaskCard - styled to match the provided screenshot:
 *  - Rounded card with a colored top border (accent)
 *  - Title left, status chip right (small rounded pill)
 *  - Description clamps to ~4 lines
 *  - Created date above bottom action icons
 *  - Action icons (view/edit/delete) aligned bottom-right
 */

const STATUS = {
  "todo": {
    key: "todo",
    label: "To Do",
    color: "#6B7280",    // gray
    bg: "#F3F4F6",
    topColor: "#E5E7EB"
  },
  "in-progress": {
    key: "in-progress",
    label: "In Progress",
    color: "#B45309",   // darker orange text
    bg: "#FFF7ED",
    topColor: "#F97316" // orange top strip
  },
  "completed": {
    key: "completed",
    label: "Completed",
    color: "#166534",   // dark green text
    bg: "#ECFDF5",
    topColor: "#16A34A" // green top strip
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
        // top colored strip (rounded ends)
        "::before": {
          content: '""',
          position: "absolute",
          left: 12,
          right: 12,
          top: 8,
          height: 8,
          borderRadius: "8px",
          backgroundColor: statusInfo.topColor,
          zIndex: 1
        },
        // card style
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        height: 340
      }}
    >
      {/* ensure content sits above the top strip */}
      <CardContent
        sx={{
          position: "relative",
          zIndex: 2,
          px: 2.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          height: "100%"
        }}
      >
        {/* top row: title (left) and status chip (right) */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "#111827",
              fontSize: 18,
              maxWidth: "76%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
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
            color: "#4B5563",
            fontSize: 14,
            lineHeight: 1.6,
            mt: 0.5,
            // clamp to ~4 lines
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: 84
          }}
        >
          {task.description || "No description"}
        </Typography>

        {/* spacer to push created date and actions down */}
        <Box sx={{ flex: 1 }} />

        {/* created date + horizontal divider (subtle) */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "#9CA3AF", fontSize: 12 }}>
            Created: {createdDate}
          </Typography>

          {/* actions: view / edit / delete */}
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
