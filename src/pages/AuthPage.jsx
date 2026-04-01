import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Bot, Check, ArrowRight } from "lucide-react";
import "../auth.css";

// eslint-disable-next-line react/prop-types
export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  
  // Signup State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Checklist
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      // Just console log for now so it doesn't block the user from testing the flow
      console.log("Passwords do not match, but proceeding for demo");
    }
    // Simulate auth action
    onLogin();
  };

  const formVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.3 } }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-overlay" />
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        
        {/* LEFT COMPONENT - VISUAL */}
        <div className="auth-left">
          <div className="bot-visual">
             <Bot size={72} color="var(--green)" strokeWidth={1.5} />
          </div>
          <AnimatePresence mode="wait">
            <motion.h2
              key={isLogin ? 'h2-log' : 'h2-sign'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? "Welcome Back, Chief." : "Join the Cartico Elite."}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
             <motion.p
              key={isLogin ? 'p-log' : 'p-sign'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
             >
               {isLogin 
                 ? "Access your dashboard to view saved scans, price alerts, and wishlist items."
                 : "Create an account to track unlimited products, get price drops, and write reviews."}
             </motion.p>
          </AnimatePresence>
        </div>

        {/* RIGHT COMPONENT - FORM */}
        <div className="auth-right">
          
          <div className="auth-switch">
             <button 
               className={`auth-switch-btn ${isLogin ? 'active' : ''}`}
               onClick={() => setIsLogin(true)}
             >
               Login
             </button>
             <button 
               className={`auth-switch-btn ${!isLogin ? 'active' : ''}`}
               onClick={() => setIsLogin(false)}
             >
               Sign Up
             </button>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              
              {isLogin ? (
                /* LOGIN FORM */
                <motion.div key="login-form" variants={formVariants} initial="hidden" animate="show" exit="exit">
                   <div className="auth-form-group">
                     <label>Email Address</label>
                     <div className="auth-input-wrapper">
                       <Mail size={16} className="auth-icon" />
                       <input type="email" placeholder="chief@cartico.com" value={email} onChange={e => setEmail(e.target.value)} required />
                     </div>
                   </div>

                   <div className="auth-form-group">
                     <label>Password</label>
                     <div className="auth-input-wrapper">
                       <Lock size={16} className="auth-icon" />
                       <input 
                         type={showPwd ? "text" : "password"} 
                         placeholder="••••••••" 
                         value={password} onChange={e => setPassword(e.target.value)} required
                       />
                       <button type="button" className="auth-input-btn" onClick={() => setShowPwd(!showPwd)}>
                         {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                       </button>
                     </div>
                   </div>

                   <div className="auth-sub-link">Forgot Password?</div>

                   <button type="submit" className="auth-submit">
                     Login <ArrowRight size={16} style={{ marginLeft: 8, verticalAlign: 'text-bottom' }}/>
                   </button>
                </motion.div>
              ) : (
                /* SIGNUP FORM */
                <motion.div key="signup-form" variants={formVariants} initial="hidden" animate="show" exit="exit">
                   <div className="auth-form-group">
                     <label>Full Name</label>
                     <div className="auth-input-wrapper">
                       <User size={16} className="auth-icon" />
                       <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                     </div>
                   </div>

                   <div className="auth-form-group">
                     <label>Email Address</label>
                     <div className="auth-input-wrapper">
                       <Mail size={16} className="auth-icon" />
                       <input type="email" placeholder="john@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
                     </div>
                   </div>

                   <div className="auth-form-group">
                     <label>Password</label>
                     <div className="auth-input-wrapper">
                       <Lock size={16} className="auth-icon" />
                       <input 
                         type={showPwd ? "text" : "password"} 
                         placeholder="••••••••" 
                         value={password} onChange={e => setPassword(e.target.value)} required
                       />
                       <button type="button" className="auth-input-btn" onClick={() => setShowPwd(!showPwd)}>
                         {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                       </button>
                     </div>
                   </div>

                   {/* Password Requirements Checklist */}
                   <div className="auth-checklist">
                     <div className={`checklist-item ${hasMinLen ? 'met' : ''}`}>
                       <Check size={14} color={hasMinLen ? 'var(--green)' : 'rgba(255,255,255,0.2)'} />
                       At least 8 characters
                     </div>
                     <div className={`checklist-item ${hasUpper ? 'met' : ''}`}>
                       <Check size={14} color={hasUpper ? 'var(--green)' : 'rgba(255,255,255,0.2)'} />
                       One uppercase letter
                     </div>
                     <div className={`checklist-item ${hasSpecial ? 'met' : ''}`}>
                       <Check size={14} color={hasSpecial ? 'var(--green)' : 'rgba(255,255,255,0.2)'} />
                       One special character (!@#$%)
                     </div>
                   </div>

                   <div className="auth-form-group" style={{ marginBottom: 24 }}>
                     <label>Confirm Password</label>
                     <div className="auth-input-wrapper">
                       <Lock size={16} className="auth-icon" />
                       <input 
                         type={showPwd ? "text" : "password"} 
                         placeholder="••••••••" 
                         value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                       />
                     </div>
                   </div>

                   <button type="submit" className="auth-submit">
                     Create Account <ArrowRight size={16} style={{ marginLeft: 8, verticalAlign: 'text-bottom' }}/>
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Social Logins */}
          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social">
            {/* Apple Icon */}
            <div className="social-btn" onClick={onLogin}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.82 2.76c.86-.92 1.4-2.22 1.25-3.52-1.12.06-2.52.79-3.41 1.74-.78.8-1.4 2.14-1.22 3.42 1.26.11 2.53-.74 3.38-1.64zm7.25 15.13c-.2.53-1.65 3.32-3.86 3.32-.98 0-1.52-.36-2.9-.36-1.4 0-2.02.38-2.92.38-2.18 0-3.69-2.78-3.9-3.32C3.87 11.23 6.36 7.42 8.71 7.42c1.23 0 1.95.53 2.76.53.84 0 1.76-.58 3.14-.58 2.07 0 3.23.95 3.86 1.72-2.92 1.58-2.4 5.25.6 6.8z"/></svg>
            </div>
            {/* Google Icon */}
            <div className="social-btn" onClick={onLogin}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44-3.82 0-6.92-3.1-6.92-6.92 0-3.83 3.1-6.93 6.92-6.93 1.92 0 3.52.72 4.7 1.8l2.03-2.03C17.26 3.54 14.85 2.5 12.18 2.5 6.83 2.5 2.5 6.83 2.5 12.18c0 5.34 4.33 9.68 9.68 9.68 6.07 0 9.77-4.28 9.77-9.87 0-.7-.09-1.25-.6-1.89z"/></svg>
            </div>
            {/* Github Icon */}
            <div className="social-btn" onClick={onLogin}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1-.6.1-.6.1-.6 1.2.1 1.8 1.2 1.8 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.2-1.5 3.2-1.2 3.2-1.2.7 1.7.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z"/></svg>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
