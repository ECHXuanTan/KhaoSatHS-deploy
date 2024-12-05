import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/pho-thong-nang-khieu-logo.png';
import styles from '../../styles/auth/Login.module.css';
import { authService } from '../../services/authServices';
import { getUser } from '../../services/authServices';


const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const userData = await getUser();
            setUser(userData.user);
            console.log("userData", userData.user);
            if (userData.user) {
                switch(userData.user.role) {
                    case 4:
                        navigate('/student-survey');
                        break;
                    case 2:
                        navigate('/teacher-dashboard');
                        break;
                    case 1:
                        navigate('/ministry-declare');
                        break;
                    case 0:
                        navigate('/admin/dashboard');
                        break;
                    default:
                        setErrorMessage('Invalid user role');
                }
            } 
        } catch (error) {
            console.error('Error fetching user data:', error);
            setErrorMessage(error.message);
        }
    };
    fetchUser();
  }, [navigate]);

  const onLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
  
    try {
      const result = await authService.checkUser({
        email: decoded.email,
        googleId: decoded.sub,
        name: decoded.name
      });
      console.log(result);
      if (result.success) {
        setErrorMessage('');
        switch(result.role) {
            case 4:
                navigate('/student-survey');
                break;
            case 2:
                navigate('/teacher-dashboard');
                break;
            case 1:
                navigate('/ministry-declare');
                break;
            case 0:
                navigate('/admin/dashboard');
                break;
            default:
                setErrorMessage('Invalid user role');
        }
      } else {
        setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.status === 404) {
        const userInfo = error.response.data.userInfo;
        setErrorMessage(
          `Không tìm thấy thông tin người dùng\nHọ và tên: ${userInfo.name}\nEmail: ${userInfo.email}`
        );
      } else {
        setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    }
  };

  const onLoginFailure = (error) => {
    console.log("LOGIN FAILED! Error: ", error);
    setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.');
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập</title>
        <meta name="description" content="Trang đăng nhập" />
      </Helmet>
      <GoogleOAuthProvider clientId={clientID}>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
            <img src={logo} alt="Pho Thong Nang Khieu Logo" className={styles.loginLogo} />
            <h1 className={styles.loginTitle}>Đăng nhập</h1>
            <p className={styles.loginSubtitle}>
            Hệ thống khảo sát của trường Phổ thông Năng khiếu
            </p>
            {errorMessage && (
            <p className={styles.errorMessage}>
                {errorMessage.split('\n').map((line, index) => (
                <span key={index} className={line.includes('Họ và tên') || line.includes('Email') ? styles.userInfo : ''}>
                    {line}<br />
                </span>
                ))}
            </p>
            )}
            <div id="signInButton">
            <GoogleLogin
                onSuccess={onLoginSuccess}
                onError={onLoginFailure}
            />
            </div>
        </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default Login;