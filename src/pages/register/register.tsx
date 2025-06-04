import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { setAuth, setUser } from '../../services/slice/authSlice';
import { registerUserApi } from '@api';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Добавляем состояние для ошибки
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(''); // Сбрасываем ошибку перед новым запросом

    // Валидация данных перед отправкой
    if (!email || !password || !userName) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    registerUserApi({
      email: email.trim(),
      password: password.trim(),
      name: userName.trim()
    })
      .then((data) => {
        if (data.success) {
          dispatch(setAuth(true));
          dispatch(setUser(data.user));
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          navigate('/');
        } else {
          setError('Ошибка регистрации');
        }
      })
      .catch((err) => {
        setError(err.message || 'Ошибка регистрации');
      });
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
