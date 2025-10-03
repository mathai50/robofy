import React from 'react';
import { motion } from 'framer-motion';

const MethodologySection: React.FC = () => {
  const methodologySteps = [
    {
      title: 'Analyze & Plan',
      description: 'Our BMAD Analyst conducts a comprehensive business assessment, identifying AI opportunities and creating a tailored transformation roadmap. This phase includes stakeholder interviews and process mapping.',
      icon: '🔍',
      color: 'text-blue-500 border-blue-500'
    },
    {
      title: 'Architect & Design',
      description: 'The BMAD Architect develops a scalable system architecture, ensuring seamless integration with existing infrastructure. Focus on data flow, security, and scalability for SMB environments.',
      icon: '🏗️',
      color: 'text-green-500 border-green-500'
    },
    {
      title: 'Develop & Integrate',
      description: 'BMAD Developers build custom AI solutions using agile sprints. Continuous integration and testing ensure high-quality code delivery with iterative feedback loops.',
      icon: '💻',
      color: 'text-purple-500 border-purple-500'
    },
    {
      title: 'Deploy, Test & Optimize',
      description: 'BMAD QA and Scrum Master oversee deployment, rigorous testing, and ongoing optimization. Agile retrospectives drive continuous improvement and adaptation to business needs.',
      icon: '🚀',
      color: 'text-orange-500 border-orange-500'
    }
  ];

  const agilePrinciples = [
    'Daily stand-ups for team alignment',
    'Bi-weekly sprints with clear deliverables',
    'Continuous integration and automated testing',
    'Regular retrospectives for process improvement',
    'Flexible adaptation to changing business priorities',
    'Stakeholder involvement throughout the development cycle'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] }
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Asymmetrical header */}
        <motion.div 
          className="text-left mb-16 md:pr-12"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Agile BMAD Methodology
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We leverage an agile development process powered by our BMAD agents, ensuring rapid iteration, 
            continuous feedback, and measurable results. This approach allows SMBs to evolve their AI capabilities 
            incrementally while minimizing risk and maximizing ROI.
          </p>
        </motion.div>

        {/* Organic staggered grid - asymmetrical */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 items-start mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {methodologySteps.slice(0, 2).map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-6 rounded-xl border-l-4 ${step.color}`}
              style={{ 
                marginLeft: index % 2 === 0 ? '0' : '1rem',
                marginTop: index > 0 ? '1rem' : '0'
              }}
            >
              <div className={`text-3xl mb-4 ${step.color.split(' ')[0]}`}>{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {methodologySteps.slice(2).map((step, index) => (
            <motion.div
              key={index + 2}
              variants={itemVariants}
              className={`p-6 rounded-xl border-l-4 ${step.color}`}
              style={{ 
                marginLeft: index % 2 === 0 ? '0' : '1rem',
                marginTop: index > 0 ? '1rem' : '0'
              }}
            >
              <div className={`text-3xl mb-4 ${step.color.split(' ')[0]}`}>{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Agile Principles */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Agile BMAD Development Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {agilePrinciples.map((principle, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-700 text-sm">{principle}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MethodologySection;