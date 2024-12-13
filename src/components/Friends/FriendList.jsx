import { Box, Typography } from "@mui/material";

function FriendList() {
  return (
    <div className="flex flex-col h-full max-sm:w-screen overflow-y-auto border-gray">
      <Box sx={{ px: 1, pt: 1 }}>
      </Box>
      <Typography variant="subtitle1" sx={{ px: 1, pt: 1, color: "gray" }}>
        Friends..
      </Typography>
    </div>
  );
}

export default FriendList