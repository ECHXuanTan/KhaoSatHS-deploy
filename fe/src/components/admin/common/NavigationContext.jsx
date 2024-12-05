import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const NavigationContext = createContext({
  isNavExpanded: true,
  setIsNavExpanded: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  const value = {
    isNavExpanded,
    setIsNavExpanded,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

NavigationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};