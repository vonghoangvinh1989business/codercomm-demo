import React, { useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import PostReaction from "./PostReaction";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { deletePost } from "./postSlice";
import PostEditDialog from "./PostEditDialog";

function PostCard({ post, page }) {
  // get current user logged in
  const { user } = useAuth();

  // get author of current post
  const postAuthorId = post.author._id;

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const [openEditForm, setOpenEditForm] = useState(false);

  const handleEdit = () => {
    setOpenEditForm(true);
  };

  const handleCloseEditPostForm = () => {
    setOpenEditForm(false);
  };

  const handleDeleteConfirmation = () => {
    setOpenConfirmationDialog(true);
  };

  const handleCloseConfirmationDialog = (e) => {
    setOpenConfirmationDialog(false);
  };

  const dispatch = useDispatch();

  const handleAgreeConfirmation = () => {
    setOpenConfirmationDialog(false);
    dispatch(deletePost({ postId: post._id, userId: postAuthorId, page }));
  };

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          user._id === postAuthorId && (
            <>
              <Stack direction="row">
                <IconButton onClick={handleDeleteConfirmation}>
                  <DeleteIcon sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton onClick={handleEdit}>
                  <EditIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Stack>
              <ConfirmationDialog
                openConfirmationDialog={openConfirmationDialog}
                handleCloseConfirmationDialog={handleCloseConfirmationDialog}
                handleAgreeConfirmation={handleAgreeConfirmation}
                title="Delete Confirmation"
                content="Are you sure you want to delete this post?"
              />
              <PostEditDialog
                post={post}
                openEditForm={openEditForm}
                handleCloseEditPostForm={handleCloseEditPostForm}
              />
            </>
          )
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>{post.content}</Typography>

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
