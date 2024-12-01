import { useState } from 'react';
import { TextField, Button, InputAdornment, Typography, Divider } from '@mui/material';
import toast from 'react-hot-toast';
import { Person, Lock } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/slices/api/loginSlice';
import { useNavigate } from 'react-router-dom';
//slices
import { authenticateUser } from '../../redux/slices/api/authenticateSlice';
import { useSocket } from '../../socket/socket';

function LoginForm() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userCreds, setUserCreds] = useState({ username: "", password: "" });

  const getFieldValues = (event) => {
    setUserCreds({
      ...userCreds,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const login = (e) => {
    e.preventDefault();
    dispatch(loginUser(userCreds))
      .then(response => {
        const status = response.payload;
        console.log(status);
        if (status === 200) {
          if(socket){socket.connect()}
          navigate('/dashboard');
          dispatch(authenticateUser(true));
          toast.success('Login successful!');
        } else if (status === 400) {
          toast.error('All fields are required');
        } else if (status === 404) {
          toast.error('User not found!');
        } else if (status === 409) {
          toast.error('Check your username or password');
        } else {
          toast.error('Login failed, wait for some time');
        }

      });
    setUserCreds({ username: "", password: "" });
  };

  return (
    <div className='p-[10px]'>
      <Typography variant='h5'>
        Welcome Back 🙋🏼‍♂️
      </Typography>
      <Typography variant='body1'>
        Login To Continue ✅
      </Typography>
      <Divider sx={{ border: "solid 1px gray", margin: "10px 0 15px 0" }} />
      <form onSubmit={login}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          size='small'
          name='username'
          onChange={getFieldValues}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          size='small'
          fullWidth
          margin="normal"
          name='password'
          onChange={getFieldValues}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 16, textTransform: "none", fontSize: 15 }}
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
