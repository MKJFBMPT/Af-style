import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Firebase Services & Store
import { loginWithEmail, registerWithEmail, loginWithGoogle } from '../../services/auth/authService';
import useAuthStore from '../../store/useAuthStore';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const user = await loginWithEmail(formData.email, formData.password);
        setUser(user);
        toast.success(`Welcome back, ${user.displayName || 'Guest'}`);
        navigate('/');
      } else {
        const user = await registerWithEmail(formData.email, formData.password, formData.name);
        setUser(user);
        toast.success('Registration successful. Welcome to AF Style.');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      setUser(user);
      toast.success(`Welcome to AF Style, ${user.displayName}`);
      navigate('/');
    } catch (error: any) {
      toast.error('Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white pt-[80px]">
      
      {/* Left Side - Cinematic Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-luxury-charcoal">
        <img 
          src={isLogin 
            ? "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            : "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop"
          }
          alt="Luxury Fashion" 
          className="w-full h-full object-cover opacity-80 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-20 left-20 text-white">
          <h2 className="text-5xl font-serif italic mb-4">{isLogin ? "Welcome Back" : "Join the Legacy"}</h2>
          <p className="text-xs tracking-[0.3em] uppercase opacity-80">AF Style Luxury Maison</p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative">
        <div className="absolute top-10 right-10 flex gap-4 text-[10px] tracking-widest uppercase opacity-40">
          <Link to="/" className="hover:text-brand-gold transition-colors">Return Home</Link>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-widest mb-4">
              {isLogin ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-xs tracking-widest uppercase text-luxury-charcoal/50">
              Please enter your details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {!isLogin && (
              <div className="relative animate-slide-up">
                <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-luxury-charcoal/40" />
                <input 
                  type="text" 
                  name="name"
                  placeholder="FULL NAME"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-luxury-platinum py-3 pl-8 pr-4 text-xs tracking-widest uppercase outline-none focus:border-brand-gold transition-colors placeholder:text-luxury-charcoal/30"
                  required={!isLogin}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-luxury-charcoal/40" />
              <input 
                type="email" 
                name="email"
                placeholder="EMAIL ADDRESS"
                value={formData.email}
                onChange={handleChange}
                /* uppercase সরিয়ে দেওয়া হয়েছে */
                className="w-full bg-transparent border-b border-luxury-platinum py-3 pl-8 pr-4 text-xs tracking-widest outline-none focus:border-brand-gold transition-colors placeholder:text-luxury-charcoal/30"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-luxury-charcoal/40" />
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="PASSWORD"
                value={formData.password}
                onChange={handleChange}
                /* uppercase সরিয়ে দেওয়া হয়েছে */
                className="w-full bg-transparent border-b border-luxury-platinum py-3 pl-8 pr-10 text-xs tracking-widest outline-none focus:border-brand-gold transition-colors placeholder:text-luxury-charcoal/30"
                required
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-luxury-charcoal/40 hover:text-brand-gold transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-[9px] tracking-[0.2em] uppercase text-luxury-charcoal/60 hover:text-brand-gold transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-premium group flex items-center justify-center gap-4 w-full mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Register"}
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-luxury-platinum/50 flex flex-col gap-6">
            <p className="text-[10px] text-center tracking-[0.3em] uppercase text-luxury-charcoal/50">Or continue with</p>
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 border border-luxury-platinum flex items-center justify-center gap-4 text-xs tracking-widest uppercase hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
            >
              <span>Google Login</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] tracking-widest uppercase text-luxury-charcoal/60">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isLoading}
                className="ml-2 text-brand-gold hover:text-luxury-charcoal transition-colors border-b border-brand-gold pb-0.5"
              >
                {isLogin ? "Register Now" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;