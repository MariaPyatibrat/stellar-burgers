import React, { FC } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';
import styles from '../common.module.css';

interface LoginUIComponentProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.SyntheticEvent) => void;
  errorText: string;
  successText: string;
  isSubmitting: boolean;
}

export const LoginUI: FC<LoginUIComponentProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  errorText,
  successText,
  isSubmitting
}) => (
  <main className={styles.container}>
    <div className={`pt-6 ${styles.wrapCenter}`}>
      <h3 className='pb-6 text text_type_main-medium'>Вход</h3>
      <form className={`pb-15 ${styles.form}`} onSubmit={handleSubmit}>
        <div className='pb-6'>
          <Input
            type='email'
            placeholder='E-mail'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name='email'
            error={!!errorText}
            errorText=''
            size='default'
          />
        </div>
        <div className='pb-6'>
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name='password'
          />
        </div>

        {errorText && (
          <p className={`${styles.error} text text_type_main-default pb-6`}>
            {errorText}
          </p>
        )}
        {successText && (
          <p className={`${styles.success} text text_type_main-default pb-6`}>
            {successText}
          </p>
        )}

        <div className={`pb-6 ${styles.button}`}>
          <Button
            type='primary'
            size='medium'
            htmlType='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </div>
      </form>
      <div className={`pb-4 ${styles.question} text text_type_main-default`}>
        Вы - новый пользователь?
        <Link to='/register' className={`pl-2 ${styles.link}`}>
          Зарегистрироваться
        </Link>
      </div>
      <div className={`${styles.question} text text_type_main-default pb-6`}>
        Забыли пароль?
        <Link to='/forgot-password' className={`pl-2 ${styles.link}`}>
          Восстановить пароль
        </Link>
      </div>
    </div>
  </main>
);
