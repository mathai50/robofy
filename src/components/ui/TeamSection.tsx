import React from 'react';
import ProfileCard from './ProfileCard';

export interface TeamMember {
  avatarUrl: string;
  name: string;
  role: string;
  bio: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ teamMembers }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our diverse team of AI experts and digital innovators is dedicated to 
            transforming businesses through cutting-edge automation and intelligent 
            solutions. We combine human creativity with artificial intelligence to 
            deliver exceptional results.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <ProfileCard
              key={index}
              avatarUrl={member.avatarUrl}
              name={member.name}
              role={member.role}
              bio={member.bio}
              linkedinUrl={member.linkedinUrl}
              twitterUrl={member.twitterUrl}
              githubUrl={member.githubUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;