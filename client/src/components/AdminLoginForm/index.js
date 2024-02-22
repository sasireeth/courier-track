import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate,Link } from 'react-router-dom';
import './index.css'

const UserLoginForm = () => {
  const [state, setState] = useState({
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  });

  const navigate = useNavigate();

  const onChangeUsername = event => {
    setState({ ...state, username: event.target.value });
  };

  const onChangePassword = event => {
    setState({ ...state, password: event.target.value });
  };

  const onSubmitSuccess = async jwtToken => {
    Cookies.set('admin_token', jwtToken, {
      expires: 30,
    });
    navigate('/adminhome');
  };

  const onSubmitFailure = errorMsg => {
    console.log(errorMsg);
    setState({ ...state, showSubmitError: true, errorMsg });
  };

  const submitForm = async event => {
    event.preventDefault();
    const { username, password } = state;
    const userDetails = { username, password };
    const url = 'http://localhost:7000/api/admin/login';
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok === true) {
        onSubmitSuccess(data.token);
      } else {
        onSubmitFailure(data.error);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const renderPasswordField = () => {
    const {password} = state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={onChangePassword}
        />
      </>
    )
  }

  const renderUsernameField = () => {
    const {username} = state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={onChangeUsername}
        />
      </>
    )
  }

  return (
    <div className="login-form-container">
      <>
      <h1>Admin Login</h1>
      <form className="form-container" onSubmit={submitForm}>
      <div className="input-container">{renderUsernameField()}</div>
       <div className="input-container">{renderPasswordField()}</div>
        <button type="submit" className="login-button">
          Login
        </button>
        <Link to='/adminsign'><p>New Admin ? Sign Up</p></Link>
        {state.showSubmitError && <p className="error-message">*{state.errorMsg}</p>}
      </form>
      </>
    </div>
  );
};

export default UserLoginForm;
