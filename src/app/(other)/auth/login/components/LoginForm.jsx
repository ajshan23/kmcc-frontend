import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import { useAuthContext } from "@/context/useAuthContext";
import { useNotificationContext } from "@/context/useNotificationContext";
import TextFormInput from "@/components/form/TextFormInput";
import PasswordFormInput from "@/components/form/PasswordFormInput";
import axiosInstance from "@/globalFetch/api";

const loginFormSchema = yup.object({
  identifier: yup
    .string()
    .required("Please enter your Iqama Number or Member ID"),
  password: yup.string().required("Please enter your password"),
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
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/auth/signin", values);

      if (data?.success && data?.data?.token) {
        const { user, token } = data.data;

        if (!user.isAdmin && !user.isSuperAdmin) {
          showNotification({
            message: "Access denied! You are not an admin.",
            variant: "danger",
          });
          return;
        }

        saveSession({ token, user });
        showNotification({
          message: "Successfully logged in. Redirecting....",
          variant: "success",
        });

        const redirectLink = searchParams.get("redirectTo") || "/";
        setTimeout(() => navigate(redirectLink), 500);
      } else {
        showNotification({
          message: data.message || "Unexpected response. Please try again.",
          variant: "danger",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      showNotification({
        message:
          error.response?.data?.message || "Login failed. Please try again.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextFormInput
        name="identifier"
        control={control}
        label="Iqama Number or Member ID"
      />
      <PasswordFormInput name="password" control={control} label="Password" />
      <Button type="submit" disabled={loading} className="w-100 mt-3">
        {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
      </Button>
    </Form>
  );
};

export default LoginForm;
