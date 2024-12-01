import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Skeleton } from '@mui/material';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// Define the blinking animation
const blink = keyframes`
  50% { opacity: 0.5; }
`;

// Apply the animation to the list item
const BlinkingListItem = styled(ListItem)`
  animation: ${blink} 1.5s linear infinite;
`;

function BlinkingSkeletonList() {
  return (
    <List>
      <BlinkingListItem>
        <ListItemAvatar>
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton variant="text" width="60%" />}
          secondary={<Skeleton variant="text" width="40%" />}
        />
      </BlinkingListItem>
    </List>
  );
}

export default BlinkingSkeletonList;
