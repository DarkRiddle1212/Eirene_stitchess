/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Scissors, 
  Phone, 
  Youtube, 
  Twitter, 
  Facebook, 
  Instagram, 
  Check, 
  Menu, 
  X,
  ChevronRight,
  ChevronLeft,
  Mail,
  Quote,
  Star,
  Plus,
  Trash2,
  LogIn,
  LogOut,
  AlertCircle,
  Edit2,
  Save,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, FormEvent, Component, ErrorInfo, ReactNode } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

// --- Error Handling ---

class ErrorBoundary extends (React.Component as any) {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-8">
              {error?.message?.includes('{') 
                ? "A database error occurred. Please try again later." 
                : "An unexpected error occurred."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#2f3f8f] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1a2b5f] transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Utilities ---

const optimizeUnsplashUrl = (url: string | null | undefined, width: number = 800, quality: number = 80) => {
  if (!url || typeof url !== 'string' || !url.includes('images.unsplash.com')) return url || '';
  
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', quality.toString());
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    return urlObj.toString();
  } catch (e) {
    return url;
  }
};

// --- Components ---

const TopBar = () => (
  <div className="bg-[#f0f4f8] py-2 px-4 md:px-12 border-b border-gray-200">
    <div className="max-w-7xl mx-auto flex justify-between items-center text-[8px] md:text-[10px] font-bold tracking-[0.1em] md:tracking-[0.2em] text-gray-400 uppercase">
      <span>10712 Cross Bay Blvd, Ozone Park, NY</span>
      <span className="hidden min-[480px]:inline">ODEYPEACE91@GMAIL.COM</span>
    </div>
  </div>
);

const Navbar = ({ isAdmin, user }: { isAdmin: boolean, user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Our Services', href: '#services' },
    { name: 'Our Works', href: '#works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Appointments', href: '#appointments' },
    { name: 'Online Store', href: '#store' },
    { name: 'Contacts', href: '#contacts' },
  ];

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'py-3'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-[#2f3f8f] p-1.5 rounded-full">
            <Scissors className="w-4 h-4 text-white rotate-45" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[#1a2b5f] leading-none tracking-tight">Eirene Stitches</h1>
            <p className="text-[8px] md:text-[9px] font-bold text-gray-300 tracking-[0.2em] mt-1 uppercase">Elegance and Individuality</p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-[12px] font-bold text-gray-500 hover:text-[#2f3f8f] transition-colors uppercase tracking-widest"
            >
              {link.name}
            </a>
          ))}
          
          {user ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest"
            >
              <LogOut className="w-3 h-3" />
              Logout {isAdmin && "(Admin)"}
            </button>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 text-[10px] font-bold text-[#2f3f8f] hover:text-[#1a2b5f] uppercase tracking-widest"
            >
              <LogIn className="w-3 h-3" />
              Admin Login
            </button>
          )}
        </div>

        {/* Socials & Mobile Toggle */}
        <div className="flex items-center gap-4 md:gap-5">
          <div className="hidden sm:flex items-center gap-3 text-gray-400">
            <Youtube className="w-3.5 h-3.5 cursor-pointer hover:text-[#2f3f8f] transition-colors" />
            <Twitter className="w-3.5 h-3.5 cursor-pointer hover:text-[#2f3f8f] transition-colors" />
            <Facebook className="w-3.5 h-3.5 cursor-pointer hover:text-[#2f3f8f] transition-colors" />
            <Instagram className="w-3.5 h-3.5 cursor-pointer hover:text-[#2f3f8f] transition-colors" />
          </div>
          <button 
            className="lg:hidden text-[#2f3f8f]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden bg-white/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-8 right-8 text-[#2f3f8f]"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  href={link.href} 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl font-bold text-[#1a2b5f] hover:text-[#2f3f8f] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="text-xl font-bold text-red-500 flex items-center gap-2"
                >
                  <LogOut className="w-6 h-6" />
                  Logout {isAdmin && "(Admin)"}
                </button>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="text-xl font-bold text-[#2f3f8f] flex items-center gap-2"
                >
                  <LogIn className="w-6 h-6" />
                  Admin Login
                </button>
              )}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-8 pt-12 border-t border-gray-100 text-[#2f3f8f]"
              >
                <Youtube className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
                <Twitter className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
                <Facebook className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
                <Instagram className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ settings, isAdmin, onUpdate }: { settings: any, isAdmin: boolean, onUpdate: (id: string, val: string | File) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(settings.hero_bg);
  const [uploading, setUploading] = useState(false);

  const handleSave = () => {
    onUpdate('hero_bg', tempUrl);
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        await onUpdate('hero_bg', file);
        setIsEditing(false);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <section className="relative min-h-[80vh] md:h-screen overflow-hidden flex items-center justify-center py-16 md:py-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ 
          backgroundImage: `url('${optimizeUnsplashUrl(settings.hero_bg || 'https://images.unsplash.com/photo-1598554889165-8139a49f2883', 1920, 75)}')`,
        }}
      >
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {isAdmin && (
        <div className="absolute top-4 right-4 z-20">
          {isEditing ? (
            <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col gap-3 min-w-[300px]">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Update Hero Image</label>
              
              <div className="flex flex-col gap-2">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Option 1: Upload File</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#f0f4f8] file:text-[#2f3f8f] hover:file:bg-[#e0e8f0]"
                />
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-4 text-[8px] text-gray-300 uppercase font-bold">OR</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Option 2: Image URL</span>
                <input 
                  type="text" 
                  className="bg-[#f0f4f8] border-none rounded-xl p-2 text-xs outline-none"
                  placeholder="https://..."
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleSave} 
                  disabled={uploading}
                  className="flex-grow bg-[#2f3f8f] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : <><Save className="w-3 h-3" /> Save URL</>}
                </button>
                <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all text-[#2f3f8f]"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Content Card */}
    <div className="relative z-10 w-full flex justify-center px-4">
      <motion.div 
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-white p-6 sm:p-16 md:p-24 rounded-[2.5rem] sm:rounded-[4rem] md:rounded-[6rem] shadow-[0_60px_120px_-20px_rgba(26,43,95,0.18)] w-[85%] sm:max-w-2xl text-center border border-white/50 relative overflow-hidden group"
      >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-50/30 pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-5xl md:text-7xl font-bold text-[#1a2b5f] leading-tight md:leading-[1.1] mb-3 md:mb-8">
            Elegance Tailored <br /> Just for You.
          </h2>
          
          {/* Decorative Line */}
          <div className="relative flex items-center my-5 md:my-12 justify-center">
            <div className="w-12 md:w-24 h-[1px] bg-gray-100"></div>
            <div className="px-3 md:px-4">
              <Scissors className="w-4 h-4 md:w-5 md:h-5 text-[#2f3f8f] rotate-45" />
            </div>
            <div className="w-12 md:w-24 h-[1px] bg-gray-100"></div>
          </div>

          <p className="text-gray-500 text-[13px] md:text-lg leading-relaxed mb-6 md:mb-14 max-w-md mx-auto">
            Discover the epitome of elegance and individuality at Eirene Stitches, 
            where bespoke tailoring meets craftsmanship.
          </p>

          <div className="flex flex-row gap-2 sm:gap-5 justify-center">
            <a 
              href="tel:09037737211"
              className="bg-[#2f3f8f] text-white w-[45%] sm:w-auto px-3 sm:px-12 py-3.5 sm:py-5 rounded-full font-bold flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#1a2b5f] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 group text-[11px] sm:text-base"
            >
              <Phone className="w-3 h-3 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              Call Us
            </a>
            <button className="border-2 border-[#2f3f8f] text-[#2f3f8f] w-[45%] sm:w-auto px-3 sm:px-12 py-3.5 sm:py-5 rounded-full font-bold hover:bg-[#f0f4f8] transition-all hover:-translate-y-1 active:translate-y-0 text-[11px] sm:text-base">
              Categories
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
  );
};

const About = ({ settings, isAdmin, onUpdate }: { settings: any, isAdmin: boolean, onUpdate: (id: string, val: string | File) => void }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempUrl, setTempUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const startEdit = (id: string, currentVal: string) => {
    setEditingId(id);
    setTempUrl(currentVal);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, tempUrl);
      setEditingId(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingId) {
      setUploading(true);
      try {
        await onUpdate(editingId, file);
        setEditingId(null);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <section id="about" className="bg-[#eef5f9] py-20 md:py-40 px-6 md:px-12 scroll-mt-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Images Layout */}
        <div className="relative w-full max-w-4xl h-[400px] sm:h-[500px] md:h-[700px] mb-16 md:mb-24">
          {/* Back Image with Thick Border */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute right-0 top-0 w-3/4 h-full border-[12px] md:border-[20px] border-[#2f3f8f] rounded-sm overflow-hidden shadow-2xl group"
          >
            <img 
              src={optimizeUnsplashUrl(settings.about_back || "https://images.unsplash.com/photo-1556905055-8f358a7a4bb4", 1000)} 
              alt="Elegant Fabrics" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isAdmin && (
              <button 
                onClick={() => startEdit('about_back', settings.about_back)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all text-[#2f3f8f]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </motion.div>
          
          {/* Front Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-3/5 h-3/4 bg-white p-3 md:p-4 shadow-2xl rounded-sm z-10 group"
          >
            <img 
              src={optimizeUnsplashUrl(settings.about_front || "https://images.unsplash.com/photo-1598554747436-c9293d6a588f", 800)} 
              alt="Female tailor measuring client" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isAdmin && (
              <button 
                onClick={() => startEdit('about_front', settings.about_front)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all text-[#2f3f8f]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* Edit Modal for About Images */}
          <AnimatePresence>
            {editingId && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full"
                >
                  <h3 className="text-xl font-bold text-[#1a2b5f] mb-6 uppercase tracking-wider">Update Image</h3>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Option 1: Upload File</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#f0f4f8] file:text-[#2f3f8f] hover:file:bg-[#e0e8f0]"
                      />
                    </div>

                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-gray-100"></div>
                      <span className="flex-shrink mx-4 text-[10px] text-gray-300 uppercase font-bold">OR</span>
                      <div className="flex-grow border-t border-gray-100"></div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Option 2: Image URL</label>
                      <input 
                        type="text" 
                        className="bg-[#f0f4f8] border-none rounded-xl p-4 text-sm outline-none w-full"
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={handleSave} 
                        disabled={uploading}
                        className="flex-grow bg-[#2f3f8f] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {uploading ? 'Uploading...' : <><Save className="w-4 h-4" /> Save URL</>}
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-6 py-4 rounded-xl border border-gray-200 font-bold text-gray-500">
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      {/* Content Below Images */}
      <div className="flex flex-col items-center text-center max-w-3xl">
        <span className="text-gray-300 text-xl font-medium mb-2">01</span>
        <span className="text-[#2f3f8f] text-xs font-bold tracking-[0.4em] uppercase mb-8">About Us</span>
        
        <h2 className="text-4xl md:text-6xl font-bold text-[#1a2b5f] leading-tight mb-8">
          Your Fit, Your Style, <br /> Our Expertise.
        </h2>

        {/* Decorative Line */}
        <div className="relative flex items-center mb-10 justify-center w-full max-w-xs">
          <div className="flex-grow h-[1px] bg-gray-200"></div>
          <div className="px-4">
            <Scissors className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-grow h-[1px] bg-gray-200"></div>
        </div>

        <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10">
          Welcome to Eirene Stitches, where tradition meets innovation in the art of tailoring. 
          Our journey began 10 years ago with a simple mission: to provide exceptional, 
          custom-made clothing that embodies elegance, sophistication, and individuality.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-left w-full">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
            <div className="bg-[#2f3f8f] p-1.5 rounded-full shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">Unparalleled customer service</span>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
            <div className="bg-[#2f3f8f] p-1.5 rounded-full shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">Exceptional craftsmanship.</span>
          </div>
        </div>

        <button className="bg-[#2f3f8f] text-white px-12 py-5 rounded-full font-bold hover:bg-[#1a2b5f] transition-all shadow-xl">
          More About Us
        </button>
      </div>
    </div>
  </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Bespoke Tailoring",
      description: "Custom-made garments crafted to your exact measurements and style preferences.",
      icon: <Scissors className="w-6 h-6" />
    },
    {
      title: "Alterations",
      description: "Expert adjustments to ensure your existing wardrobe fits you perfectly.",
      icon: <Check className="w-6 h-6" />
    },
    {
      title: "Bridal Gowns",
      description: "Elegant and sophisticated attire for your most special day.",
      icon: <ChevronRight className="w-6 h-6" />
    },
    {
      title: "Corporate Wear",
      description: "Professional and sharp clothing designed for the modern workplace.",
      icon: <Check className="w-6 h-6" />
    }
  ];

  return (
    <section id="services" className="bg-white py-16 md:py-32 px-6 md:px-12 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-gray-300 text-lg md:text-xl font-medium mb-2">02</span>
          <span className="text-[#2f3f8f] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6">Our Services</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a2b5f] leading-tight">
            Crafting Excellence in <br className="hidden sm:block" /> Every Stitch.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#f0f4f8] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] hover:bg-[#2f3f8f] hover:text-white transition-all group"
            >
              <div className="bg-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[#2f3f8f] mb-4 md:mb-6 group-hover:bg-white/20 group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{service.title}</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OurWorks = ({ isAdmin }: { isAdmin: boolean }) => {
  const [works, setWorks] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [newWork, setNewWork] = useState({ title: '', category: 'Bespoke', image: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching works:", error);
    } else {
      setWorks(data || []);
    }
  };

  useEffect(() => {
    fetchWorks();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('works-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'works' }, () => {
        fetchWorks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = newWork.image;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `works/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      if (!imageUrl) throw new Error("Please provide an image URL or upload a file.");

      const { error } = await supabase
        .from('works')
        .insert([
          { ...newWork, image: imageUrl, created_at: new Date().toISOString() }
        ]);
      
      if (error) throw error;
      
      setNewWork({ title: '', category: 'Bespoke', image: '' });
      setSelectedFile(null);
      setShowUpload(false);
    } catch (error) {
      console.error("Error uploading work:", error);
      alert("Failed to upload. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this work?')) return;
    try {
      const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting work:", error);
      alert("Failed to delete. Check console for details.");
    }
  };

  return (
    <section id="works" className="bg-[#f0f4f8] py-16 md:py-32 px-6 md:px-12 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-gray-300 text-lg md:text-xl font-medium mb-2">03</span>
          <span className="text-[#2f3f8f] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6">Our Works</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a2b5f] leading-tight mb-6">
            A Gallery of <br className="hidden sm:block" /> Timeless Creations.
          </h2>
          
          {isAdmin && (
            <button 
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 bg-[#2f3f8f] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#1a2b5f] transition-all"
            >
              {showUpload ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showUpload ? 'Cancel Upload' : 'Add New Work'}
            </button>
          )}
        </div>

        {/* Upload Form */}
        <AnimatePresence>
          {showUpload && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto mb-16 overflow-hidden"
            >
              <form onSubmit={handleUpload} className="bg-white p-8 rounded-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Title</label>
                  <input 
                    type="text" 
                    required
                    className="bg-[#f0f4f8] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none"
                    value={newWork.title}
                    onChange={(e) => setNewWork({...newWork, title: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Category</label>
                  <select 
                    className="bg-[#f0f4f8] border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none"
                    value={newWork.category}
                    onChange={(e) => setNewWork({...newWork, category: e.target.value})}
                  >
                    <option value="Bespoke">Bespoke</option>
                    <option value="Couture">Couture</option>
                    <option value="Ready-to-Wear">Ready-to-Wear</option>
                    <option value="Evening Wear">Evening Wear</option>
                    <option value="Tailored">Tailored</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Upload Image</label>
                  <div className="flex flex-col gap-4 p-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#2f3f8f] file:text-white hover:file:bg-[#1a2b5f]"
                    />
                    
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink mx-4 text-[10px] text-gray-300 uppercase font-bold">OR USE URL</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/..."
                      className="bg-white border border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none"
                      value={newWork.image}
                      onChange={(e) => setNewWork({...newWork, image: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={uploading}
                  className="md:col-span-2 bg-[#2f3f8f] text-white py-4 rounded-xl font-bold hover:bg-[#1a2b5f] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <><Upload className="w-5 h-5" /> Upload to Gallery</>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {works.map((work, index) => (
            <motion.div 
              key={work.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-lg"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={optimizeUnsplashUrl(work.image, 600)} 
                  alt={work.title} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b5f]/90 via-transparent to-transparent opacity-0 sm:opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6 md:p-8">
                <span className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">{work.category}</span>
                <h3 className="text-white text-lg md:text-xl font-bold">{work.title}</h3>
              </div>
              
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(work.id)}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Mobile Info Overlay */}
              <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4">
                <span className="text-[#2f3f8f] text-[10px] font-bold uppercase tracking-widest mb-1 block">{work.category}</span>
                <h3 className="text-[#1a2b5f] text-base font-bold">{work.title}</h3>
              </div>
            </motion.div>
          ))}
          
          {works.length === 0 && !showUpload && (
            <div className="col-span-full py-20 text-center text-gray-400">
              <p>No works in the gallery yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Testimonials = ({ isAdmin }: { isAdmin: boolean }) => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', quote: '', rating: 5 });

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching testimonials:", error);
    } else {
      setTestimonials(data || []);
    }
  };

  useEffect(() => {
    fetchTestimonials();

    const channel = supabase
      .channel('testimonials-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
        fetchTestimonials();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const next = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleAddTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    if (newTestimonial.name && newTestimonial.quote) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .insert([
            { ...newTestimonial, created_at: new Date().toISOString() }
          ]);
        
        if (error) throw error;

        setNewTestimonial({ name: '', quote: '', rating: 5 });
        setShowForm(false);
        setCurrentIndex(0);
        alert('Thank you for your feedback!');
      } catch (error) {
        console.error("Error adding testimonial:", error);
        alert("Failed to post testimonial.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      if (currentIndex >= testimonials.length - 1) {
        setCurrentIndex(Math.max(0, testimonials.length - 2));
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  return (
    <section id="testimonials" className="bg-white py-16 md:py-32 px-6 md:px-12 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-gray-300 text-lg md:text-xl font-medium mb-2">04</span>
          <span className="text-[#2f3f8f] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a2b5f] leading-tight">
            What Our Clients <br className="hidden sm:block" /> Are Saying.
          </h2>
        </div>

        {testimonials.length > 0 ? (
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden bg-[#f0f4f8] rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-inner relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <Quote className="w-10 h-10 md:w-16 md:h-16 text-[#2f3f8f]/20 mb-6 md:mb-8" />
                  <div className="flex gap-1 mb-4 md:mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#2f3f8f] text-[#2f3f8f]" />
                    ))}
                  </div>
                  <p className="text-lg md:text-2xl italic text-[#1a2b5f] mb-6 md:mb-8 leading-relaxed font-serif">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  <h4 className="text-base md:text-lg font-bold text-[#2f3f8f] uppercase tracking-widest">
                    — {testimonials[currentIndex].name}
                  </h4>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(testimonials[currentIndex].id)}
                      className="mt-6 text-red-500 hover:text-red-700 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Testimonial
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mt-8 md:mt-12">
              <button 
                onClick={prev}
                className="p-3 md:p-4 rounded-full border border-gray-200 hover:bg-[#2f3f8f] hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button 
                onClick={next}
                className="p-3 md:p-4 rounded-full border border-gray-200 hover:bg-[#2f3f8f] hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p>No testimonials yet. Be the first to share your experience!</p>
          </div>
        )}

        {/* Add Testimonial Button */}
        <div className="mt-16 text-center">
          {!showForm ? (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-[#2f3f8f] text-white px-8 py-4 rounded-full font-bold text-sm md:text-base hover:bg-[#1a2b5f] transition-all shadow-lg"
            >
              Share Your Experience
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto bg-[#f0f4f8] p-8 rounded-[2rem] shadow-xl text-left"
            >
              <h3 className="text-xl font-bold text-[#1a2b5f] mb-6">Write a Testimonial</h3>
              <form onSubmit={handleAddTestimonial} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    required
                    className="bg-white border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Your Experience</label>
                  <textarea 
                    required
                    rows={4}
                    className="bg-white border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none resize-none"
                    value={newTestimonial.quote}
                    onChange={(e) => setNewTestimonial({...newTestimonial, quote: e.target.value})}
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="submit"
                    className="flex-grow bg-[#2f3f8f] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#1a2b5f] transition-all"
                  >
                    Post Testimonial
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-4 rounded-xl border border-gray-300 font-bold text-sm hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const Appointments = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Appointment scheduled:', formData);
    alert('Thank you! Your appointment request has been received.');
  };

  return (
    <section id="appointments" className="bg-white py-16 md:py-32 px-6 md:px-12 scroll-mt-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-gray-300 text-lg md:text-xl font-medium mb-2">05</span>
          <span className="text-[#2f3f8f] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6">Appointments</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a2b5f] leading-tight mb-6 md:mb-8">
            Book Your Appointment
          </h2>
          
          {/* Decorative Line */}
          <div className="relative flex items-center w-full max-w-xs justify-center">
            <div className="w-12 md:flex-grow h-[1px] bg-gray-200"></div>
            <div className="px-3">
              <Scissors className="w-4 h-4 text-gray-300" />
            </div>
            <div className="w-12 md:flex-grow h-[1px] bg-gray-200"></div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-50"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="John Doe"
                className="bg-[#f0f4f8] border-none rounded-xl md:rounded-2xl p-3.5 md:p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="john@example.com"
                className="bg-[#f0f4f8] border-none rounded-xl md:rounded-2xl p-3.5 md:p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Phone Number</label>
              <input 
                type="tel" 
                required
                placeholder="+1 (555) 000-0000"
                className="bg-[#f0f4f8] border-none rounded-xl md:rounded-2xl p-3.5 md:p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Service Needed</label>
              <select 
                required
                className="bg-[#f0f4f8] border-none rounded-xl md:rounded-2xl p-3.5 md:p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none transition-all appearance-none"
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
              >
                <option value="">Select a service</option>
                <option value="bespoke">Bespoke Tailoring</option>
                <option value="alterations">Alterations</option>
                <option value="wedding">Bridal Gown</option>
                <option value="corporate">Corporate Wear</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Preferred Date</label>
              <input 
                type="date" 
                required
                className="bg-[#f0f4f8] border-none rounded-xl md:rounded-2xl p-3.5 md:p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none transition-all"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Preferred Time</label>
              <input 
                type="time" 
                required
                className="bg-[#f0f4f8] border-none rounded-xl md:rounded-2xl p-3.5 md:p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none transition-all"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 mt-4">
              <button 
                type="submit"
                className="w-full bg-[#2f3f8f] text-white py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-[#1a2b5f] transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Contact message sent:', formData);
    alert('Thank you! Your message has been sent.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contacts" className="bg-[#eef5f9] py-16 md:py-32 px-6 md:px-12 scroll-mt-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <span className="text-gray-300 text-lg md:text-xl font-medium mb-2">07</span>
          <span className="text-[#2f3f8f] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6">Contact Us</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a2b5f] leading-tight mb-6 md:mb-8">
            Get In Touch
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            Have a question or want to discuss a custom project? 
            Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white p-8 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-50"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="Your Name"
                className="bg-[#f0f4f8] border-none rounded-xl md:rounded-2xl p-3.5 md:p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="your@email.com"
                className="bg-[#f0f4f8] border-none rounded-xl md:rounded-2xl p-3.5 md:p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#1a2b5f] uppercase tracking-wider">Message</label>
              <textarea 
                required
                rows={4}
                placeholder="How can we help you?"
                className="bg-[#f0f4f8] border-none rounded-xl md:rounded-2xl p-3.5 md:p-4 text-sm focus:ring-2 focus:ring-[#2f3f8f] outline-none transition-all resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="bg-[#2f3f8f] text-white py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-[#1a2b5f] transition-all shadow-lg flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              <Mail className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const PlaceholderSection = ({ id, title, number }: { id: string, title: string, number: string }) => (
  <section id={id} className="bg-white py-24 md:py-32 px-6 md:px-12 scroll-mt-24">
    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
      <span className="text-gray-300 text-xl font-medium mb-2">{number}</span>
      <span className="text-[#2f3f8f] text-xs font-bold tracking-[0.3em] uppercase mb-6">{title}</span>
      <h2 className="text-4xl md:text-5xl font-bold text-[#1a2b5f] leading-tight">
        Coming Soon
      </h2>
      <p className="text-gray-500 mt-6 max-w-lg">
        We are currently curating our {title.toLowerCase()} collection. 
        Please check back soon for updates.
      </p>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#1a2b5f] text-white py-16 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full">
              <Scissors className="w-6 h-6 text-white rotate-45" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Eirene Stitches</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Crafting elegance and individuality through bespoke tailoring for over a decade. 
            Your style, our expertise.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com/eirenestitches" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-white/20 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://facebook.com/eirenestitches" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-white/20 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/eirenestitches" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-white/20 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-4 text-sm text-gray-400">
            <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
            <li><a href="#works" className="hover:text-white transition-colors">Our Works</a></li>
            <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
            <li><a href="#appointments" className="hover:text-white transition-colors">Book Appointment</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-6">Contact Info</h4>
          <ul className="flex flex-col gap-4 text-sm text-gray-400">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#2f3f8f]" />
              <a href="tel:09037737211" className="hover:text-white transition-colors">09037737211</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#2f3f8f]" />
              <a href="mailto:odeypeace91@gmail.com" className="hover:text-white transition-colors">odeypeace91@gmail.com</a>
            </li>
            <li className="flex items-start gap-3">
              <Scissors className="w-4 h-4 text-[#2f3f8f] mt-1" />
              <span>10712 Cross Bay Blvd, <br /> Ozone Park, NY 11417</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-bold mb-6">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">Subscribe to get the latest fashion updates.</p>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#2f3f8f] transition-colors"
            />
            <button className="bg-[#2f3f8f] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#1a2b5f] transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-xs">© 2026 Eirene Stitches. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-gray-500">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [settings, setSettings] = useState<any>({
    hero_bg: 'https://images.unsplash.com/photo-1598554889165-8139a49f2883?q=80&w=2000&auto=format&fit=crop',
    about_back: 'https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?q=80&w=1000&auto=format&fit=crop',
    about_front: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1000&auto=format&fit=crop'
  });

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    
    if (error) {
      console.error("Error fetching settings:", error);
    } else if (data) {
      const settingsMap = data.reduce((acc: any, item: any) => {
        acc[item.id] = item.value;
        return acc;
      }, {});
      setSettings((prev: any) => ({ ...prev, ...settingsMap }));
    }
  };

  const updateSetting = async (id: string, value: string | File) => {
    try {
      let finalValue = value;

      if (value instanceof File) {
        const fileExt = value.name.split('.').pop();
        const fileName = `${id}-${Math.random()}.${fileExt}`;
        const filePath = `settings/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, value);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        finalValue = publicUrl;
      }

      const { error } = await supabase
        .from('site_settings')
        .upsert({ id, value: finalValue, updated_at: new Date().toISOString() });
      
      if (error) throw error;
      setSettings((prev: any) => ({ ...prev, [id]: finalValue }));
    } catch (error) {
      console.error("Error updating setting:", error);
      alert("Failed to update image. Make sure the 'images' storage bucket exists and is public.");
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    fetchSettings();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = user?.email === 'owoadeemmy@gmail.com';

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2f3f8f]"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white font-sans selection:bg-[#2f3f8f] selection:text-white">
        <TopBar />
        <Navbar isAdmin={isAdmin} user={user} />
        <Hero settings={settings} isAdmin={isAdmin} onUpdate={updateSetting} />
        <About settings={settings} isAdmin={isAdmin} onUpdate={updateSetting} />
        <Services />
        <OurWorks isAdmin={isAdmin} />
        <Testimonials isAdmin={isAdmin} />
        <Appointments />
        <PlaceholderSection id="store" title="Online Store" number="06" />
        <ContactUs />
        <Footer />

        {/* Back to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-40 bg-[#2f3f8f] text-white p-4 rounded-full shadow-2xl hover:bg-[#1a2b5f] transition-all group"
            >
              <ChevronRight className="w-6 h-6 -rotate-90 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
