import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const AdminSignUp = () => {
  const [state, setState] = useState({
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  });


  const onChangeUsername = event => {
    setState({ ...state, username: event.target.value });
  };

  const onChangePassword = event => {
    setState({ ...state, password: event.target.value });
  };

  const onSubmitSuccess = async errorMsg => {
    setState({ ...state, showSubmitError: true, errorMsg });
    
  };

  const onSubmitFailure = errorMsg => {
    console.log(errorMsg);
    setState({ ...state, showSubmitError: true, errorMsg });
  };

  const submitForm = async event => {
    event.preventDefault();
    const { username, password } = state;
    const userDetails = { username, password };
    const url = 'http://localhost:7000/api/admin/register';
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
        onSubmitSuccess(data.message);
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
        <br/>
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
        <br/>
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
    <div className="login-form-container1">
      <>
      <h1>Register Admin</h1>
      <form className="form-container" onSubmit={submitForm}>
      <div className="input-container">{renderUsernameField()}</div>
       <div className="input-container">{renderPasswordField()}</div>
        <button type="submit" className="login-button">
          Login
        </button>
        <Link className='link' to='/adminlogin'>Sign In</Link>
        {state.showSubmitError && <p className="error-message">*{state.errorMsg}</p>}
      </form>
      </>
    </div>
  );
};

export default AdminSignUp;
