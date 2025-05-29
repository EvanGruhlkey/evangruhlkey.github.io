import React, { useState } from 'react';

function WaitlistSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [message, setMessage] = useState('');
  const [clientError, setClientError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setClientError('');

    // Client-side validation: Check if email is empty
    if (!email) {
      setClientError('Please enter your email address.');
      setStatus('error'); // Set status to error for styling
      return; // Stop the submission process
    }

    // Optional client-side format validation (can be added here)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setClientError('Please enter a valid email address (e.g., example@domain.com).');
      setStatus('error');
      return;
    }

    setStatus('submitting');

    // Create form data payload
    const formData = new URLSearchParams();
    formData.append('email', email); // Append email as a key-value pair

    try {
      // Use the original URL without ?callback=doPost
      const response = await fetch('https://script.google.com/macros/s/AKfycbw_4yHTKCE9OJdvZv7hYZPs95p8gUQ733c3oRQ5UVUwLSQ1jsytgmEHpP_1ZHYdjtUVfw/exec', { 
        method: 'POST',
        // Remove 'Content-Type': 'application/json',
        // The browser will automatically set Content-Type to application/x-www-form-urlencoded
        // when sending URLSearchParams data with a POST request.
        body: formData, // Send the URLSearchParams object
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for joining the waitlist!');
        setEmail(''); // Clear input on success
      } else {
        setStatus('error');
        setMessage('Failed to join waitlist. Please try again later.');
        try {
          const errorData = await response.json();
          console.error('Waitlist submission failed:', response.status, errorData);
        } catch (jsonError) {
          console.error('Waitlist submission failed: Could not parse error response JSON', response.status, jsonError);
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
      console.error('Waitlist submission error:', error);
    }
  };

  return (
    <div className="container-custom flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Join the Waitlist</h2>
        <p className="text-gray-600 mb-6">Enter your email to get notified when we launch!</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your email"
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setClientError(''); // Clear client error when typing
              setStatus('idle'); // Reset status when typing
            }}
            disabled={status === 'submitting'}
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Joining...' : 'Join Now'}
          </button>
        </form>
        {(message || clientError) && (
          <p className={`mt-4 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message || clientError}
          </p>
        )}
      </div>
    </div>
  );
}

export default WaitlistSignup; 