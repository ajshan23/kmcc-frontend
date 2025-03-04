// import { yupResolver } from '@hookform/resolvers/yup'
// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { useNavigate, useSearchParams } from 'react-router-dom'
// import * as yup from 'yup'
// import { useAuthContext } from '@/context/useAuthContext'
// import { useNotificationContext } from '@/context/useNotificationContext'
// import axios from 'axios'
// import { base_url } from '../../../../../Constants/authConstant'

// const useSignIn = () => {
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()
//   const { saveSession } = useAuthContext()
//   const [searchParams] = useSearchParams()
//   const { showNotification } = useNotificationContext()

//   const loginFormSchema = yup.object({
//     identifier: yup.string().required('Please enter your Iqama Number or Member ID'),
//     password: yup.string().required('Please enter your password'),
//   })

//   const { control, handleSubmit } = useForm({
//     resolver: yupResolver(loginFormSchema),
//     defaultValues: {
//       identifier: '',
//       password: '',
//     },
//   })

//   const redirectUser = () => {
//     const redirectLink = searchParams.get('redirectTo') || '/'
//     setTimeout(() => navigate(redirectLink), 500) // Add delay for smooth transition
//   }

//   const login = handleSubmit(async (values) => {
//     console.log("cloc");
    
//     setLoading(true) // ✅ Fix: Ensure loading state is updated before API call
//     try {
//       const res = await axios.post(`${base_url}/auth/signin`, values)

//       if (res.data.success && res.data.data.token) {
//         const { user, token } = res.data.data

//         if (!user.isAdmin && !user.isSuperAdmin) {
//           showNotification({
//             message: 'Access denied! You are not an admin.',
//             variant: 'danger',
//           })
//           return
//         }

//         saveSession({ token, user })
//         redirectUser()

//         showNotification({
//           message: 'Successfully logged in. Redirecting....',
//           variant: 'success',
//         })
//       }
//     } catch (e) {
//       showNotification({
//         message: e.response?.data?.message || 'Login failed. Please try again.',
//         variant: 'danger',
//       })
//     } finally {
//       setLoading(false) // ✅ Fix: Ensure loading state is reset properly
//     }
//   })

//   return {
//     loading,
//     login,
//     control,
//   }
// }

// export default useSignIn
