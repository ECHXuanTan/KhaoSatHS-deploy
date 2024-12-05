import React, { useState } from 'react';
import logo from '../../../assets/images/logo ptnk.svg';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from '../../../services/authServices';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  const styles = {
    header: {
      backgroundColor: '#ecfeff',
      color: '#333',
      padding: '10px 120px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    logo: {
      maxHeight: '100px',
      marginRight: '10px',
      padding: '2px 0',
    },
    userMenu: {
      display: 'flex',
      alignItems: 'center',
    },
    '@media (max-width: 768px)': {
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '10px',
      },
      logo: {
        maxHeight: '60px',
      },
    },
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Phổ Thông Năng Khiếu Logo" style={styles.logo} />
      </div>
      <div style={styles.userMenu}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </div>
    </header>
  );
}

export default Header;
