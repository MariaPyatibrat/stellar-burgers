import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { setAuth, setUser } from '../../services/slice/authSlice';
import { registerUserApi } from '@api';
import { registerUser } from '../../services/slice/authSlice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    dispatch(registerUser({ name: userName, email, password }))
      .then((data) => {
        if (data) {
          navigate(location.state?.from || '/');
        }
      })
      .catch((err: { message?: string }) => {
        setErrorText(err?.message || 'Ошибка регистрации');
      });
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      userName={userName}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
