import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import validateManyFields from '../validations';
import Input from './utils/Input';
import Loader from './utils/Loader';

const SignupForm = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [fetchData, { loading }] = useFetch();
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const errors = validateManyFields('signup', formData); // Validate form fields
    setFormErrors({}); // Clear previous errors

    // If validation errors exist, set them in state and exit
    if (errors.length > 0) {
      setFormErrors(errors.reduce((acc, err) => ({ ...acc, [err.field]: err.err }), {}));
      return;
    }

    // Prepare request configuration
    const config = {
      url: '/auth/signup',
      method: 'post',
      data: formData,
    };

    try {
      // Call fetchData and handle success
      const response = await fetchData(config);
      console.log('Signup response:', response); // Debug API response

      if (response && response.success) {
        navigate('/login'); // Redirect to login on success
      // } else {
      //   console.error('Signup error:', response?.message || 'Unexpected error');
        // setFormErrors({ general: response?.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error); // Debug error
      setFormErrors({ general: error?.message || 'An error occurred. Please try again.' });
    }
  };

  // Render field error message
  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? 'block' : 'hidden'}`}>
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <form
      className="m-auto my-16 max-w-[500px] p-8 bg-white border-2 shadow-md rounded-md"
      onSubmit={handleSubmit} // Attach form submit handler here
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className="text-center mb-4">Welcome user, please signup here</h2>

          {/* Name Field */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Name
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              placeholder="Your name"
              onChange={handleChange}
            />
            {fieldError('name')}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              placeholder="youremail@domain.com"
              onChange={handleChange}
            />
            {fieldError('email')}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              placeholder="Your password.."
              onChange={handleChange}
            />
            {fieldError('password')}
          </div>

          {/* General Errors */}
          {formErrors.general && (
            <p className="mt-4 text-pink-600 text-sm">
              <i className="mr-2 fa-solid fa-circle-exclamation"></i>
              {formErrors.general}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit" // Use type="submit" to ensure proper form submission
            className="bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark"
          >
            Submit
          </button>

          {/* Login Redirect */}
          <div className="pt-4">
            <Link to="/login" className="text-blue-400">
              Already have an account? Login here
            </Link>
          </div>
        </>
      )}
    </form>
  );
};

export default SignupForm;
