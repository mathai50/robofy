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
    <section className="py-16 md:py-32 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            Meet Our Team
          </h2>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto px-4">
            Our diverse team of AI experts and digital innovators is dedicated to
            transforming businesses through cutting-edge automation and intelligent
            solutions. We combine human creativity with artificial intelligence to
            deliver exceptional results.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
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