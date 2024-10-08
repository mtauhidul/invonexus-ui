import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HeroImg from '../../assets/hero-img.jpg';
import { login } from '../../reducers/userReducer';
import { userLogin } from '../../services/services';
import Styles from './Home.module.css';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await userLogin(username, password);
    if (res) {
      toast.success('Login successful');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      dispatch(
        login({
          userID: res.data.userID,
          username: res.data.username,
          token: res.data.token,
        })
      );
      setUsername('');
      setPassword('');
      setIsSubmitting(false);
      navigate('/dashboard');
    } else {
      setIsSubmitting(false);
      toast.error('Login failed');
    }
  };

  return (
    <div className={Styles.homeContainer}>
      <div className={Styles.authContainer}>
        <Box
          className={Styles.authBox}
          component='form'
          noValidate
          autoComplete='off'>
          <div>
            <h1 className={Styles.authTitle}>Documents Management System</h1>
            <p className={Styles.authBoxSubTitle}>
              Manage your documents with ease and efficiency.
            </p>
          </div>
          <div className={Styles.heroContainerOne}>
            <img src={HeroImg} alt='Electronic Document Management' />
          </div>
          <div>
            <h2 className={Styles.authBoxTitle}>Login</h2>

            <TextField
              onChange={(e) => setUsername(e.target.value)}
              required
              className={Styles.authInput}
              id='outlined-basic'
              label='Username'
              variant='outlined'
            />

            <TextField
              onChange={(e) => setPassword(e.target.value)}
              required
              className={Styles.authInput}
              id='outlined-password-input'
              label='Password'
              type='password'
              autoComplete='current-password'
            />
            <Button
              disabled={username === '' || password === ''}
              type='
            submit'
              onClick={(e) => {
                handleSubmit(e);
              }}
              className={Styles.authButton}
              variant='contained'>
              {isSubmitting ? (
                <ThreeDots
                  height='80'
                  width='80'
                  radius='9'
                  color='#4fa94d'
                  ariaLabel='three-dots-loading'
                  wrapperStyle={{}}
                  wrapperClassName=''
                  visible={true}
                />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </Box>
      </div>
      <div className={Styles.heroContainer}>
        <img src={HeroImg} alt='Electronic Document Management' />
      </div>
    </div>
  );
};

export default Home;
