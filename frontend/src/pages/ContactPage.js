import React from 'react';

const ContactPage = () => {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
      color: "white",
      padding: "2rem",
    }}>
      <h1 style={{ marginBottom: "1rem", fontSize: "2.5rem" }}>Contact Us</h1>
      <p style={{ marginBottom: "2rem", fontSize: "1.1rem", textAlign: "center", maxWidth: "600px" }}>
        If you have any questions, suggestions or partnership inquiries, feel free to reach out to us below.
      </p>

      <form
        action="https://formsubmit.co/thakuraditya601@gmail.com"
        method="POST"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          style={{
            padding: '0.75rem',
            width: '100%',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem'
          }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows="5"
          style={{
            padding: '0.75rem',
            width: '100%',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem'
          }}
        ></textarea>
        <button
          type="submit"
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'gray'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
