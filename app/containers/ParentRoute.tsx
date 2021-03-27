import React from 'react';
import Sidebar from './Sidebar';
import { Route } from 'react-router-dom';

// @ts-ignore
const ParentRoute = ({ component: Component, ...rest }) => {
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
