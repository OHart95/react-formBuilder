import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css';
import React, { useState, useEffect } from 'react'; // 👈 IMPORT useEffect
import FormBuilder from './components/formBuilder/formBuilder.jsx';
import FormRenderer from './components/formRenderer';
import Header from './components/Header/header.jsx';
import Footer from './components/Footer/Footer.jsx'

// We only need to import the required pieces (auth and sign-in function)
import { auth } from './firebaseConfig.js'; // Ensure auth is exported from firebaseConfig.js
import { signInWithEmailAndPassword } from 'firebase/auth'; 
// NOTE: You don't need 'app' if you use the exported 'auth' instance.

function App() {
  const [view, setView] = useState('builder'); 
  
  // 🎯 SOLUTION: Use useEffect to run the sign-in ONLY ONCE
  useEffect(() => {
    // Use your new admin credentials here!
    signInWithEmailAndPassword(auth, 'admin@formbuilder.com', 'Password123')
      .then((userCredential) => {
        const adminUID = userCredential.user.uid;
        console.log("Admin signed in successfully!", adminUID);
      })
      .catch((error) => {
        // You should see a clearer error here now if it fails (e.g., auth/wrong-password)
        console.error("Admin sign-in failed:", error);
      });
  }, []); // The empty dependency array [] ensures this runs only after the initial render

  return (
    <div className='app-main'>
      <Header />

    <div className='app-content'>
        {/* Simple Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setView('builder')} disabled={view === 'builder'} className='secondary-button'>
            Form Builder
          </button>
          <button onClick={() => setView('viewer')} disabled={view === 'viewer'}  className='secondary-button'>
            View & Use Forms
          </button>
        </div>

        {/* Conditional Rendering */}
        {view === 'builder' && <FormBuilder />}
        {view === 'viewer' && <FormRenderer />}
    </div>
      <Footer />

    </div>
  );
}

export default App;