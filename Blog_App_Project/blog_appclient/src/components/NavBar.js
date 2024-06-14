import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';
import { useSelector, useDispatch } from 'react-redux';
import { resetState } from '../redux/slices/userauthorslice';

function NavBar() {
  let { isLogined, currentUser } = useSelector(state => state.userAuthorReducer);
  let dispatch = useDispatch();

  function SignOut() {
    // remove the token from the local storage
    localStorage.removeItem('token');
    dispatch(resetState());
  }

  return (
    <div className='navbar-container shadow-lg shadow-light' >
      <ul className='list-unstyled  d-flex gap-3 px-3 py-2 m-0 justify-content-between align-items-center'>
        <div className='d-flex gap-2 align-items-center'>
          <h3 className='text-white fs-2'>BlogHere</h3>
        </div>
        {(isLogined === false) ? 
          <>
            <div className='d-flex gap-4'>
              <li><NavLink className="fs-4  text-decoration-none ab" to=''>Home</NavLink></li>
              <li><NavLink className="fs-4  text-decoration-none ab" to='signin'>Signin</NavLink></li>
              <li><NavLink className="fs-4  text-decoration-none ab" to='signup'>Signup</NavLink></li>
            </div>
          </> :
          <>
            <div className='d-flex gap-4 align-items-center'>
              <li><p className='text-light fs-4 m-0'>Welcome, <span className='text-success'>{currentUser.username}</span></p></li>
              <li><NavLink className="fs-4 text-decoration-none ab" to='signin' onClick={SignOut}>Signout</NavLink></li>
            </div>
          </>
        }
      </ul>
    </div>
  );
}

export default NavBar;
