import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Bot, Check, ArrowRight } from "lucide-react";
import API from "../api";
import "../auth.css";

// eslint-disable-next-line react/prop-types
export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Checklist
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isLogin && password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const res = await API.post('/api/auth/login', { email, password });
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);

        onLogin(user);
      } else {
        // REGISTER
        await API.post('/api/auth/register', { name, email, password });

        // Auto-login after successful registration
        const res = await API.post('/api/auth/login', { email, password });
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);

        onLogin(user);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
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
              {isLogin ? "Welcome Back, Dear." : "Join the Cartico Elite."}
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
               onClick={() => { setIsLogin(true); setErrorMsg(""); }}
             >
               Login
             </button>
             <button 
               className={`auth-switch-btn ${!isLogin ? 'active' : ''}`}
               onClick={() => { setIsLogin(false); setErrorMsg(""); }}
             >
               Sign Up
             </button>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "rgba(255,79,109,0.1)",
                border: "1px solid rgba(255,79,109,0.3)",
                color: "#ff7a92",
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {errorMsg}
            </motion.div>
          )}

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

                   <button type="submit" className="auth-submit" disabled={loading}>
                     {loading ? "Logging in..." : "Login"} <ArrowRight size={16} style={{ marginLeft: 8, verticalAlign: 'text-bottom' }}/>
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

                   <button type="submit" className="auth-submit" disabled={loading}>
                     {loading ? "Creating account..." : "Create Account"} <ArrowRight size={16} style={{ marginLeft: 8, verticalAlign: 'text-bottom' }}/>
                   </button>
                </motion.div>   
              )}     
            </AnimatePresence>
          </form>

        </div>

      </motion.div>
    </div>
  );
}
