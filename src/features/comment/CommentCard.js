import React, { useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { deleteComment } from "./commentSlice";

function CommentCard({ comment, postId, page }) {
  // get current user logged in
  const { user } = useAuth();

  // get author of current comment
  const commentAuthorId = comment.author._id;

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const handleDeleteConfirmation = () => {
    setOpenConfirmationDialog(true);
  };

  const handleCloseConfirmationDialog = (e) => {
    setOpenConfirmationDialog(false);
  };

  const dispatch = useDispatch();

  const handleAgreeConfirmation = () => {
    setOpenConfirmationDialog(false);
    dispatch(deleteComment({ commentId: comment._id, postId, page }));
  };

  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(comment.createdAt)}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />
        </Box>
      </Paper>

      {user._id === commentAuthorId && (
        <Stack>
          <IconButton onClick={handleDeleteConfirmation}>
            <DeleteIcon sx={{ fontSize: 20 }} />
          </IconButton>

          <ConfirmationDialog
            openConfirmationDialog={openConfirmationDialog}
            handleCloseConfirmationDialog={handleCloseConfirmationDialog}
            handleAgreeConfirmation={handleAgreeConfirmation}
            title="Delete Confirmation"
            content="Are you sure you want to delete this comment?"
          />
        </Stack>
      )}
    </Stack>
  );
}

export default CommentCard;
