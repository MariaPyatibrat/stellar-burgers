import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { setAuth, setUser } from '../../services/slice/authSlice';
import { registerUser } from '../../services/slice/authSlice';
import { RegisterUI } from '@ui-pages';

interface RegisterResponse {
  user: {
    name: string;
    email: string;
  };
  accessToken: string;
}

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
      .unwrap()
      .then((data: RegisterResponse) => {
        dispatch(setAuth(true));
        dispatch(setUser(data.user));
        navigate(location.state?.from || '/');
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
