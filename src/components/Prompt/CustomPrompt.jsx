import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";

function CustomPrompt({
  option1,
  action1,
  action2,
  option2,
  dialogTitle,
  dialogContent,
  open,
  onClose
}) {

  return (
    <div className="backdrop-blur-md fixed inset-0 z-50">
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button
            sx={{ textTransform: "none", fontSize: 17 }}
            onClick={action1}
          >
            {option1}
          </Button>
          <Button
            sx={{ textTransform: "none", fontSize: 17 }}
            onClick={action2}
          >
            {option2}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CustomPrompt.propTypes = {
  option1: PropTypes.string.isRequired,
  option2: PropTypes.string.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  action1: PropTypes.func.isRequired,
  action2: PropTypes.func.isRequired,
  dialogContent: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomPrompt;
