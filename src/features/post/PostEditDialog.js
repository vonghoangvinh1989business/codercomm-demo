import React, { useCallback } from "react";
import {
  Stack,
  alpha,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, FTextField, FUploadImage } from "../../components/form";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "./postSlice";

const UpdatePostSchema = yup.object().shape({
  content: yup.string().required("Content is required"),
});

function PostEditDialog({ post, openEditForm, handleCloseEditPostForm }) {
  const isLoading = useSelector((state) => state.user.isLoading);

  const defaultValues = {
    content: post?.content || "",
    image: post?.image || "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdatePostSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(updatePost({ postId: post._id, ...data }));
    handleCloseEditPostForm(false);
  };

  const handleClose = () => {
    handleCloseEditPostForm(false);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <Dialog
      open={openEditForm}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="alert-dialog-title">{"Edit Post"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <FTextField
              name="content"
              multiline
              fullWidth
              rows={4}
              placeholder="Share what you are thinking here..."
              sx={{
                "& fieldset": {
                  borderWidth: `1px !important`,
                  borderColor: alpha("#919EAB", 0.32),
                },
              }}
            />

            <FUploadImage
              name="image"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
            />
          </Stack>

          <DialogActions sx={{ mt: 1 }}>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              sx={{ backgroundColor: "red" }}
              type="submit"
              variant="contained"
              loading={isSubmitting || isLoading}
            >
              Save Changes
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}

export default PostEditDialog;
