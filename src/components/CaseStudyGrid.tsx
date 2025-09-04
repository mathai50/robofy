'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import caseStudies from '@/data/case-studies.json';

interface CaseStudy {
  id: number;
  title: string;
  industry: string;
  summary: string;
  keyMetrics: string[];
  technologies: string[];
  imageUrl: string;
  slug: string;
}

interface CaseStudyGridProps {
  initialStudies?: CaseStudy[];
}

export default function CaseStudyGrid({ initialStudies = caseStudies }: CaseStudyGridProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  
  // Get unique industries for filter
  const industries = useMemo(() => {
    const uniqueIndustries = Array.from(new Set(initialStudies.map(study => study.industry)));
    return ['All', ...uniqueIndustries];
  }, [initialStudies]);

  // Filter case studies by selected industry
  const filteredStudies = useMemo(() => {
    if (selectedIndustry === 'All') {
      return initialStudies;
    }
    return initialStudies.filter(study => study.industry === selectedIndustry);
  }, [initialStudies, selectedIndustry]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filter Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Case Studies
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedIndustry === industry
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-white/10 text-gray-300 border border-gray-600 hover:bg-white/20 hover:text-white'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStudies.map((study) => (
          <div
            key={study.id}
            className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105"
          >
            {/* Image with lazy loading */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={study.imageUrl}
                alt={study.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-blue-500/80 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                  {study.industry}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                {study.title}
              </h3>
              
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {study.summary}
              </p>

              {/* Key Metrics */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">Key Results:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {study.keyMetrics.slice(0, 2).map((metric, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      {metric}
                    </li>
                  ))}
                  {study.keyMetrics.length > 2 && (
                    <li className="text-blue-400 text-xs">
                      +{study.keyMetrics.length - 2} more results
                    </li>
                  )}
                </ul>
              </div>

              {/* Technologies */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-purple-400 mb-2">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {study.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-400/30"
                    >
                      {tech}
                    </span>
                  ))}
                  {study.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-600/30 text-gray-400 text-xs rounded-full">
                      +{study.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* View More Button */}
              <button className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 hover:text-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                View Full Case Study
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No case studies found for this industry.</p>
        </div>
      )}
    </div>
  );
}