import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Sidebar />
      <main style={{
        marginLeft: 220, // Sidebar width
        marginTop: 60,   // Header height
        padding: 32,
      }}>
        {children}
      </main>
    </>
  );
};

export default Layout;
