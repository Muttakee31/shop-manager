import React from 'react';
import Sidebar from './Sidebar';
import { Route } from 'react-router-dom';
import { useLocation } from 'react-router';

// @ts-ignore
const ParentRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <Route
      {...rest}
      render={props => {
        return (
          <div className='app-container'>
            <div>
              <Sidebar />
              <div className='main-content'
                   style={{ marginLeft: '256px', paddingLeft: '8px', paddingRight: '8px' }}>
                <Component {...props} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

export default ParentRoute;
