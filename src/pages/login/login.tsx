import React, { FC, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { setCookie } from '../../utils/cookie';
import { setAuth, setUser } from '../../services/slice/authSlice';
import { loginUserApi } from '@api';
import { LoginUI } from '@ui-pages';

interface LoginPageProps {}

export const Login: FC<LoginPageProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{
    type: 'idle' | 'error' | 'success';
    message: string;
  }>({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    if (!email || !password) {
      setStatus({
        type: 'error',
        message: 'Пожалуйста, заполните все поля'
      });
      setIsSubmitting(false);
      return;
    }

    if (!email.includes('@')) {
      setStatus({
        type: 'error',
        message: 'Пожалуйста, введите корректный email'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await loginUserApi({ email, password });

      dispatch(setAuth(true));
      dispatch(setUser(data.user));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);

      setStatus({
        type: 'success',
        message: 'Вход выполнен успешно!'
      });

      setTimeout(() => {
        navigate(location.state?.from || '/');
      }, 1500);
    } catch (error: unknown) {
      const err = error as Error;
      let errorMessage = 'Ой, произошла ошибка!';

      if (err.message === 'email or password are incorrect') {
        errorMessage = 'Неверный email или пароль';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginUI
      errorText={status.type === 'error' ? status.message : ''}
      successText={status.type === 'success' ? status.message : ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
