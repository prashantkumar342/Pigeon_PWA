import { Divider, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const CustomContextMenu = ({ menuPosition, options, onClose }) => {
  return (
    <Menu
      open={!!menuPosition}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        menuPosition ? { top: menuPosition.y, left: menuPosition.x } : undefined
      }
      PaperProps={{
        style: {
          maxHeight: 200,
          width: "20ch",
        },
      }}
    >
      {options.map((option, index) => (
        <div key={index}>
          <MenuItem
            onClick={() => {
              option.onClick();
              onClose();
            }}
          >
            {option.label}
          </MenuItem>
          {index < options.length - 1 && <Divider />}
        </div>
      ))}
    </Menu>
  );
};

CustomContextMenu.propTypes = {
  menuPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomContextMenu;
