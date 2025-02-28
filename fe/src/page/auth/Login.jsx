import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import logo from '../../assets/images/pho-thong-nang-khieu-logo.png';
import styles from '../../styles/auth/Login.module.css';

const LoginRedirect = () => {
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          // Redirect after countdown reaches zero
          window.location.href = 'https://portal.ptnk.edu.vn';
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Thông báo - Trang đã dừng hoạt động</title>
        <meta name="description" content="Trang đăng nhập đã dừng hoạt động" />
      </Helmet>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <img src={logo} alt="Pho Thong Nang Khieu Logo" className={styles.loginLogo} />
          <h1 className={styles.loginTitle}>Thông báo</h1>
          <div className={styles.alertMessage}>
            <p>Địa chỉ web này đã dừng hoạt động.</p>
            <p>Vui lòng truy cập <strong>portal.ptnk.edu.vn</strong> để thực hiện khảo sát.</p>
          </div>
          <div className={styles.countdown}>
            <p>Tự động chuyển hướng sau <span className={styles.timer}>{countdown}</span> giây</p>
          </div>
          <div className={styles.redirectButton}>
            <a href="https://portal.ptnk.edu.vn" className={styles.redirectLink}>
              Chuyển ngay
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRedirect;