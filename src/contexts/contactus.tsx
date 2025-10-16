import React, { useState } from 'react';

// Main App component to display the contact form
export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center font-sans">
      <ContactForm />
    </div>
  );
}

// Contact Form Component
function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // Corrected: Explicitly define the type for the errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'
  const [submitted, setSubmitted] = useState(false);


  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!message.trim()) {
      newErrors.message = 'Message is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Corrected: Type the event parameter for the form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
        setStatus('error');
        return;
    }

    setStatus('sending');
    setErrors({});

    // Simulate an API call
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // In a real application, you would send the data to a server here.
        console.log('Form submitted successfully:', { name, email, message });
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        setSubmitted(false);

    } catch (error) {
        console.error('Submission failed:', error);
        setStatus('error');
    }
  };
  
  const getBorderColor = (field: string) => {
      if (!submitted) return 'border-gray-300';
      return errors[field] ? 'border-red-500' : 'border-green-500';
  }


  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Contact Us</h2>
      <p className="text-gray-600 mb-8 text-center">ZipTales - Breaking News, Not Trust</p>

      {status === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your message has been sent. We'll get back to you soon.</span>
        </div>
      )}

      {status === 'error' && !Object.keys(errors).length && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Oops!</strong>
          <span className="block sm:inline"> Something went wrong. Please try again later.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 text-gray-700 bg-gray-50 border ${getBorderColor('name')} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 text-gray-700 bg-gray-50 border ${getBorderColor('email')} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="mb-8">
          <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">
            Message
          </label>
          <textarea
            id="message"
            // Corrected: Use a number for the rows prop, not a string
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full px-4 py-2 text-gray-700 bg-gray-50 border ${getBorderColor('message')} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            required
          ></textarea>
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending...' : 'Submit Message'}
        </button>
      </form>
    </div>
  );
}
