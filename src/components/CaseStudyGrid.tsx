'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, ArrowUpDown, Calendar, TrendingUp, AArrowUp } from 'lucide-react';
import caseStudies from '@/data/case-studies.json';
import CountUpNumber from './CountUpNumber';

interface ROI {
  metric: string;
  value: number;
  suffix: string;
}

interface CaseStudy {
  id: number;
  title: string;
  industry: string;
  summary: string;
  keyMetrics: string[];
  roiMetrics: ROI[];
  technologies: string[];
  thumbnailUrl: string;
  detailsUrl: string;
  slug: string;
  date?: string;
}

interface CaseStudyGridProps {
  initialStudies?: CaseStudy[];
  showHeader?: boolean;
}

type SortOption = 'most-recent' | 'highest-roi' | 'alphabetical';

export default function CaseStudyGrid({ initialStudies = caseStudies, showHeader = true }: CaseStudyGridProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('most-recent');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get unique industries for filter
  const industries = useMemo(() => {
    const uniqueIndustries = Array.from(new Set(initialStudies.map(study => study.industry)));
    return ['All', ...uniqueIndustries];
  }, [initialStudies]);

  // Filter and sort case studies
  const filteredAndSortedStudies = useMemo(() => {
    let studies = [...initialStudies];

    // Filter by industry
    if (selectedIndustry !== 'All') {
      studies = studies.filter(study => study.industry === selectedIndustry);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      studies = studies.filter(study =>
        study.title.toLowerCase().includes(query) ||
        study.summary.toLowerCase().includes(query) ||
        study.industry.toLowerCase().includes(query)
      );
    }

    // Sort studies
    switch (sortOption) {
      case 'most-recent':
        // Assuming studies are ordered by id descending for recency
        studies.sort((a, b) => b.id - a.id);
        break;
      case 'highest-roi':
        // Sort by extracting ROI percentage from keyMetrics
        studies.sort((a, b) => {
          const aROI = extractROIValue(a.keyMetrics);
          const bROI = extractROIValue(b.keyMetrics);
          return bROI - aROI;
        });
        break;
      case 'alphabetical':
        studies.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return studies;
  }, [initialStudies, selectedIndustry, searchQuery, sortOption]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedStudies.length / itemsPerPage);
  const currentStudies = filteredAndSortedStudies.slice(0, currentPage * itemsPerPage);

  // Helper function to extract ROI value from keyMetrics
  const extractROIValue = (metrics: string[]): number => {
    for (const metric of metrics) {
      const match = metric.match(/(\d+)%/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return 0;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {showHeader && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Case Studies
          </h2>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search case studies by title, industry, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            aria-label="Search case studies"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2">
            <Filter className="w-5 h-5 text-gray-400 mt-2" />
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                  selectedIndustry === industry
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white'
                }`}
                aria-label={`Filter by ${industry} industry`}
                aria-pressed={selectedIndustry === industry}
              >
                {industry}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              aria-label="Sort case studies"
            >
              <option value="most-recent" className="bg-gray-800">
                Most Recent
              </option>
              <option value="highest-roi" className="bg-gray-800">
                Highest ROI
              </option>
              <option value="alphabetical" className="bg-gray-800">
                Alphabetical
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 animate-pulse"
            >
              <div className="h-48 w-full bg-gray-700"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Studies Grid */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="grid" aria-label="Case studies">
            {currentStudies.map((study) => (
              <div
                key={study.id}
                className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-white transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 hover:scale-105"
                role="gridcell"
              >
                {/* Image with lazy loading */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={study.thumbnailUrl}
                    alt={study.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white text-black text-sm font-medium rounded-full">
                      {study.industry}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-300 transition-colors duration-300">
                    {study.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {study.summary}
                  </p>

                  {/* ROI Metrics with Count-up Animation */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Key Results:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {study.roiMetrics.slice(0, 4).map((roi, index) => (
                        <div key={index} className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                          <div className="text-lg font-bold text-white">
                            <CountUpNumber
                              value={roi.value}
                              suffix={roi.suffix}
                              duration={1500}
                              className="font-mono"
                            />
                          </div>
                          <div className="text-xs text-gray-300 mt-1">{roi.metric}</div>
                        </div>
                      ))}
                    </div>
                    {study.keyMetrics.length > 0 && (
                      <div className="mt-3">
                        <ul className="text-sm text-gray-300 space-y-1">
                          {study.keyMetrics.slice(0, 2).map((metric, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-400 mr-2">✓</span>
                              {metric}
                            </li>
                          ))}
                          {study.keyMetrics.length > 2 && (
                            <li className="text-gray-400 text-xs">
                              +{study.keyMetrics.length - 2} more results
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
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
                  <button
                    className="w-full py-2 bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/10"
                    aria-label={`View full case study for ${study.title}`}
                    onClick={() => window.open(study.detailsUrl, '_blank')}
                  >
                    View Full Case Study
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedStudies.length === 0 && (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-400 text-lg">No case studies found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {currentPage < totalPages && filteredAndSortedStudies.length > 0 && (
            <div className="col-span-full flex justify-center mt-12">
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-8 py-3 bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-100 transition-all duration-300 font-semibold"
                aria-label="Load more case studies"
              >
                Load More ({currentStudies.length} of {filteredAndSortedStudies.length})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}