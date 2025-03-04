import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import TextFormInput from '@/components/form/TextFormInput';
import PasswordFormInput from '@/components/form/PasswordFormInput';

const loginFormSchema = yup.object({
  identifier: yup.string().required('Please enter your Iqama Number or Member ID'),
  password: yup.string().required('Please enter your password'),
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saveSession } = useAuthContext();
  const { showNotification } = useNotificationContext();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      console.log('Sending login request...');
      const response = await fetch('http://13.203.184.112:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok && data?.success && data?.data?.token) {
        console.log('Login successful!');

        const { user, token } = data.data;

        if (!user.isAdmin && !user.isSuperAdmin) {
          showNotification({
            message: 'Access denied! You are not an admin.',
            variant: 'danger',
          });
          return;
        }

        saveSession({ token, user });
        showNotification({
          message: 'Successfully logged in. Redirecting....',
          variant: 'success',
        });

        const redirectLink = searchParams.get('redirectTo') || '/';
        setTimeout(() => navigate(redirectLink), 500);
      } else {
        console.error('Unexpected Response Structure:', data);
        showNotification({
          message: data.message || 'Unexpected response. Please try again.',
          variant: 'danger',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification({
        message: 'Login failed. Please try again.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextFormInput name="identifier" control={control} label="Iqama Number or Member ID" />
      <PasswordFormInput name="password" control={control} label="Password" />
      <Button type="submit" disabled={loading} className="w-100 mt-3">
        {loading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
      </Button>
    </Form>
  );
};

export default LoginForm;
