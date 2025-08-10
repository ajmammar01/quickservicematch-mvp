'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    city: '',
    contact: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-deep-gray to-gray-900 text-white overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-80 h-80 bg-electric-blue/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neon-purple/15 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-electric-blue/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>

      {/* Neon edge glow containers */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent"></div>
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-electric-blue/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-neon-purple animate-neon-glow">
              QuickServiceMatch
            </h1>
            <p className="text-gray-300 mt-2 text-sm tracking-wide">
              Connect with the best local services
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Find Trusted
              <motion.span 
                className="block text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-neon-purple to-electric-blue relative mt-4"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              >
                Local Services
                <motion.div 
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-electric-blue to-neon-purple rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </motion.span>
              <span className="block mt-6 text-white">Instantly</span>
            </h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Matching you with top-rated providers in your city
            </motion.p>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-lg mx-auto"
          >
            <div className="relative">
              {/* Glassmorphism card with neon border glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue via-neon-purple to-electric-blue rounded-3xl blur opacity-30 animate-pulse"></div>
              <motion.div
                className="relative backdrop-blur-xl bg-deep-gray/40 border border-electric-blue/30 rounded-3xl p-10 shadow-2xl"
                whileHover={{
                  boxShadow: '0 0 40px rgba(0, 246, 255, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)'
                }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-black/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/30 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </motion.div>

                  {/* Service Select */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-black/50 border border-gray-600/50 rounded-2xl text-white focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/30 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                      required
                    >
                      <option value="" className="bg-deep-gray text-gray-400">Select a service</option>
                      <option value="plumbing" className="bg-deep-gray">Plumbing</option>
                      <option value="electrical" className="bg-deep-gray">Electrical</option>
                      <option value="hvac" className="bg-deep-gray">HVAC</option>
                      <option value="cleaning" className="bg-deep-gray">Cleaning</option>
                      <option value="landscaping" className="bg-deep-gray">Landscaping</option>
                    </select>
                  </motion.div>

                  {/* City Select */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-black/50 border border-gray-600/50 rounded-2xl text-white focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/30 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                      required
                    >
                      <option value="" className="bg-deep-gray text-gray-400">Select your city</option>
                      <option value="new-york" className="bg-deep-gray">New York, NY</option>
                      <option value="los-angeles" className="bg-deep-gray">Los Angeles, CA</option>
                      <option value="chicago" className="bg-deep-gray">Chicago, IL</option>
                      <option value="houston" className="bg-deep-gray">Houston, TX</option>
                      <option value="phoenix" className="bg-deep-gray">Phoenix, AZ</option>
                    </select>
                  </motion.div>

                  {/* Contact Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    <input
                      type="email"
                      name="contact"
                      placeholder="Email or phone"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-black/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/30 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </motion.div>

                  {/* Optional Description */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <textarea
                      name="description"
                      placeholder="Describe your service needs (optional)"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-6 py-4 bg-black/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/30 focus:bg-black/70 transition-all duration-300 backdrop-blur-sm resize-none"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                  >
                    <motion.button
                      type="submit"
                      className="w-full relative overflow-hidden bg-gradient-to-r from-electric-blue to-neon-purple text-white font-bold py-5 px-8 rounded-2xl shadow-lg transition-all duration-300 group"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 0 30px rgba(0, 246, 255, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.span 
                        className="relative z-10 text-lg"
                        animate={{
                          textShadow: [
                            '0 0 5px rgba(255,255,255,0.5)',
                            '0 0 10px rgba(255,255,255,0.8)',
                            '0 0 5px rgba(255,255,255,0.5)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        Find Services
                      </motion.span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-neon-purple to-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{
                          backgroundSize: '200% 100%'
                        }}
                      />
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
