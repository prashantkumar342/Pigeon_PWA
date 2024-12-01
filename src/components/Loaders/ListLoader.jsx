
import { List, ListItem, ListItemAvatar, ListItemText, Divider, Skeleton } from '@mui/material';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const blink = keyframes`
  50% { opacity: 0.5; }
`;

const BlinkingListWrapper = styled.div`
  animation: ${blink} 1.5s linear infinite;
`;

function ListLoader({ count = 5 }) {
  return (
    <BlinkingListWrapper className='flex-grow overflow-auto'>
      <List>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            <ListItem>
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton variant="text" width="80%" />}
                secondary={<Skeleton variant="text" width="60%" />}
              />
            </ListItem>
            {index < count - 1 && <Divider />}
          </div>
        ))}
      </List>
    </BlinkingListWrapper>
  );
}
ListLoader.propTypes = {
  count: PropTypes.number,
}
export default ListLoader;
