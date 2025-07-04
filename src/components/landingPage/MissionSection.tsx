import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const MissionCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ delay, duration: 0.6 }}
  >
    <Card className="bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm h-full">
      <CardHeader className="space-y-4 p-8">
        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
          {icon}
        </div>
        <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
);

const StatCard = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ delay, duration: 0.6 }}
    className="text-center group"
  >
    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
      {value}
    </div>
    <div className="text-gray-400 text-sm mt-2">{label}</div>
  </motion.div>
);

const MissionSection = () => {
  const missions = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Innovation First",
      description: "We pioneer cutting-edge audio technology to transform how stories are experienced, making every listening moment extraordinary."
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
      ),
      title: "Global Accessibility",
      description: "Breaking down barriers to make premium audiobook experiences accessible to listeners worldwide, regardless of location or circumstance."
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Community Impact",
      description: "Building a thriving ecosystem where authors, narrators, and listeners connect to share knowledge and stories that matter."
    }
  ];

  const stats = [
    { value: "150+", label: "Countries Served" },
    { value: "98%", label: "User Satisfaction" },
    { value: "24/7", label: "Support Available" },
    { value: "5M+", label: "Hours Listened" }
  ];

  return (
    <section id="missions" className="relative py-24 bg-slate-800/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Our Mission
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're dedicated to revolutionizing the audiobook industry through innovation, 
            accessibility, and community. Our commitment extends beyond technology to creating 
            meaningful connections between stories and listeners.
          </p>
        </motion.div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {missions.map((mission, index) => (
            <MissionCard 
              key={index}
              icon={mission.icon}
              title={mission.title}
              description={mission.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Our Impact</h3>
            <p className="text-gray-400">Measuring success through meaningful metrics</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard 
                key={index}
                value={stat.value}
                label={stat.label}
                delay={0.6 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
              "To make the world's best stories{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                unmissable
              </span>
              {' '}— through the power of exceptional audio experiences."
            </blockquote>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;