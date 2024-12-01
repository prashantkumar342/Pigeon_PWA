import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { TextField, Button, Avatar, IconButton, InputAdornment, Typography } from '@mui/material';
import { Mail, Person, Lock, Delete, Edit } from '@mui/icons-material';
import ScreenLoader from "../Loaders/ScreenLoader"
//slices
import { registerUser } from '../../redux/slices/api/registerSlice';

function RegisterForm() {
  const dispatch = useDispatch();
  const [userCreds, setUserCreds] = useState({ username: "", email: "", password: "", avatar: null });
  const { loading } = useSelector((state) => state.registerUser);

  const getFieldValues = (event) => {
    setUserCreds({
      ...userCreds,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    setUserCreds({
      ...userCreds,
      avatar: file
    });
  };

  const handleDeleteAvatar = () => {
    setUserCreds({
      ...userCreds,
      avatar: null
    });
  };

  const registerData = (e) => {
    e.preventDefault();
    try {
      dispatch(registerUser(userCreds))
        .then(response => {
          console.log(response.payload);
          if (response.payload === 201) {
            toast.success('Registration successful!');
            setUserCreds({ username: "", email: "", password: "", avatar: null });
          } else if (response.payload === 409) {
            toast.error('User already exists.');
          } else if (response.payload === 400) {
            toast.error('all fields are required');
          } else {
            toast.error('failed to create user, wait for some time');
          }
        })

    } catch (err) {
      console.error('Failed to register: ', err);
      toast.error('Registration failed.');
    }
  };

  return (<>
    {
      (loading) ? <ScreenLoader /> :
        <div className='p-[10px]'>
          <Typography variant='h5'>
            Welcome 👋🏼
          </Typography>
          <Typography variant='body1'>
            Register To Start 📝
          </Typography>
          <form onSubmit={registerData}>
            <div style={{ textAlign: 'center' }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <IconButton component="span">
                  <Avatar
                    sx={{ width: 70, height: 70 }}
                    src={userCreds.avatar ? URL.createObjectURL(userCreds.avatar) : ""}
                  >
                    {!userCreds.avatar && <Edit />}
                  </Avatar>
                </IconButton>
              </label>
              {userCreds.avatar && (
                <IconButton
                  onClick={handleDeleteAvatar}
                  style={{ position: 'absolute', marginTop: -20 }}
                >
                  <Delete />
                </IconButton>
              )}
            </div>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              size='small'
              name="username"
              onChange={getFieldValues}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              size='small'
              name="email"
              onChange={getFieldValues}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              size='small'
              name="password"
              onChange={getFieldValues}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: 16, textTransform: "none", fontSize: 15 }}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </div>
    }
  </>);
}

export default RegisterForm;
