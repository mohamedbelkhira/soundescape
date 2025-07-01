import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TeamMember = ({ member, index }) => (
  <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm">
    <CardHeader className="text-center space-y-4">
      <div className="relative mx-auto">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-all duration-300 shadow-lg">
          {member.initials}
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
      <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
        {member.name}
      </CardTitle>
      <CardDescription className="text-purple-400 font-semibold">
        {member.role}
      </CardDescription>
      <CardDescription className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
        {member.description}
      </CardDescription>
    </CardHeader>
  </Card>
);

const StatCard = ({ stat, index }) => (
  <div className="text-center group">
    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
      {stat.icon}
    </div>
    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
      {stat.value}
    </div>
    <div className="text-gray-300 text-sm">{stat.label}</div>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {title}
      </span>
    </h2>
    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
      {subtitle}
    </p>
  </div>
);

const AboutSection = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      initials: "SC",
      description: "Former Audible executive with 10+ years in audiobook industry. Passionate about making literature accessible to everyone."
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      initials: "MR", 
      description: "Ex-Spotify engineer specializing in audio streaming technology. Built the core infrastructure powering our platform."
    },
    {
      name: "Emma Thompson",
      role: "Head of Content",
      initials: "ET",
      description: "Award-winning publisher with relationships across major publishing houses. Curates our exclusive audiobook collection."
    }
  ];

  const companyStats = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: "2019",
      label: "Founded"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      value: "50+",
      label: "Team Members"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: "25",
      label: "Countries"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      value: "$50M",
      label: "Raised"
    }
  ];

  return (
    <section id="about" className="relative py-24 bg-slate-800/30">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader 
          title="About Soundscape" 
          subtitle="We're on a mission to revolutionize how people experience audiobooks. Founded by passionate storytellers and tech innovators, we believe everyone deserves access to the world's greatest stories and knowledge."
        />

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6 p-12">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <CardTitle className="text-3xl text-white">Our Mission</CardTitle>
              <CardDescription className="text-xl text-gray-300 leading-relaxed">
                To make the world's knowledge and stories accessible to everyone, anywhere, anytime. 
                We're building more than just an audiobook platform—we're creating a global community 
                of lifelong learners and story lovers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {companyStats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Meet Our Team
            </span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} member={member} index={index} />
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Our Values
            </span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Accessibility First",
                description: "We believe great stories should be available to everyone, regardless of their circumstances or abilities."
              },
              {
                title: "Quality Excellence", 
                description: "From audio production to user experience, we never compromise on quality and attention to detail."
              },
              {
                title: "Community Driven",
                description: "Our platform grows stronger through the shared passion and feedback of our amazing community."
              }
            ].map((value, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 group">
                <CardHeader className="text-center space-y-4">
                  <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                    {value.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;