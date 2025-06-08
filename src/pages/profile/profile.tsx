import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getUser, updateUser } from '../../services/slice/authSlice';
import { ProfileUI } from '@ui-pages';
import { SerializedError } from '@reduxjs/toolkit';

interface IFormValue {
  name: string;
  email: string;
  password: string;
}

export const Profile: FC = () => {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  const [formValue, setFormValue] = useState<IFormValue | null>(null);
  const [initialValues, setInitialValues] = useState<IFormValue | null>(null);
  const [updateUserError, setUpdateUserError] = useState<string>('');

  const isReady = formValue !== null && initialValues !== null;

  useEffect(() => {
    if (user?.name && user?.email) {
      const initial = {
        name: user.name,
        email: user.email,
        password: ''
      };
      setInitialValues(initial);
      setFormValue(initial);
      setUpdateUserError('');
    }
  }, [user]);

  const isFormChanged =
    isReady &&
    (formValue!.name !== initialValues!.name ||
      formValue!.email !== initialValues!.email ||
      formValue!.password.length > 0);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged || !formValue || !initialValues) return;

    setUpdateUserError('');

    try {
      const updateData: Partial<IFormValue> = {};
      if (formValue.name !== initialValues.name)
        updateData.name = formValue.name;
      if (formValue.email !== initialValues.email)
        updateData.email = formValue.email;
      if (formValue.password.length > 0)
        updateData.password = formValue.password;

      await dispatch(updateUser(updateData)).unwrap();

      const newValues = {
        name: formValue.name,
        email: formValue.email,
        password: ''
      };

      setInitialValues(newValues);
      setFormValue(newValues);
    } catch (error) {
      const errorMessage =
        (error as SerializedError).message || 'Ошибка при обновлении данных';
      setUpdateUserError(errorMessage);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!initialValues) return;

    setFormValue(initialValues);
    setUpdateUserError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (!isReady) return null;

  // Отладочный вывод:
  console.log('Form debug:', {
    nameMatch: formValue.name === initialValues.name,
    emailMatch: formValue.email === initialValues.email,
    passwordLength: formValue.password.length,
    isFormChanged
  });

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
