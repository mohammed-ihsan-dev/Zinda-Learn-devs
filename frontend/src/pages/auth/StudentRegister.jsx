import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

const StudentRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const levels = [
      { label: '', color: '' },
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-green-500' },
      { label: 'Very Strong', color: 'bg-emerald-500' },
    ];
    return { score, ...levels[score] };
  }, [formData.password]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) errs.terms = 'You must accept the terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password, role: 'student' });
      toast.success('Account created successfully! 🎉');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast.error('Firebase is not configured. Please add your API keys to the .env file.');
      return;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const payload = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        token: token
      };

      setLoading(true);
      await googleLogin(payload);
      toast.success('Signed in with Google!');
      navigate('/student/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Login cancelled');
      } else {
        toast.error(err.message || 'Google login failed');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <Link to="/" className="flex items-center mb-16">
            <img src="/zinda-learn-logo.png" alt="Zinda Learn" className="h-10 object-contain brightness-0 invert" />
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold font-display text-white leading-tight mb-6">
            Start your
            <br />
            <span className="text-primary-200">learning journey</span>
          </h1>
          <p className="text-lg text-white/60 mb-12 max-w-md leading-relaxed">
            Join thousands of students who are advancing their careers with premium courses.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              'Access 500+ premium courses',
              'Learn from industry experts',
              'Get certified & boost your career',
              'Join a community of 50K+ learners',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-white/80 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center mb-8">
            <img src="/zinda-learn-logo.png" alt="Zinda Learn" className="h-8 object-contain" />
          </div>

          <div className="glass rounded-3xl p-8 lg:p-10 shadow-card">
            <h2 className="text-2xl font-bold font-display text-surface-900 mb-2">Create Account</h2>
            <p className="text-surface-500 text-sm mb-8">Start your learning journey today.</p>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-surface-200 bg-white hover:bg-surface-50 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium text-surface-700">Sign up with Google</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-surface-200"></div>
              <span className="text-xs text-surface-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-surface-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                icon={User}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  icon={Lock}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < passwordStrength.score ? passwordStrength.color : 'bg-surface-200'} transition-colors`}></div>
                      ))}
                    </div>
                    <p className={`text-xs ${passwordStrength.score >= 4 ? 'text-green-600' : passwordStrength.score >= 3 ? 'text-yellow-600' : 'text-red-500'}`}>
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                icon={Shield}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
              />

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-xs text-surface-500 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 font-medium">Terms of Service</a> and{' '}
                  <a href="#" className="text-primary-600 font-medium">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-surface-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
