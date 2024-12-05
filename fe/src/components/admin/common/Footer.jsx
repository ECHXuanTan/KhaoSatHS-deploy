import React from 'react';

function Footer() {
  const styles = {
    footer: {
      backgroundColor: '#08244d',
      color: '#fff',
      textAlign: 'center',
      padding: '5px',
      lineHeight: '1.5',
    },
  };

  return (
    <footer style={styles.footer}>
      Copyright 2024 © Trường Phổ Thông Năng Khiếu <br />
      Ứng dụng được phát triển bởi Tổ Phát triển Chương trình và Đảm bảo chất lượng
    </footer>
  );
}

export default Footer;