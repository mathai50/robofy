import React, { useState } from 'react';
import { Linkedin, Twitter, Github, User } from 'lucide-react';

interface ProfileCardProps {
  avatarUrl: string;
  name: string;
  role: string;
  bio: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name,
  role,
  bio,
  linkedinUrl,
  twitterUrl,
  githubUrl,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-gray-800">
      <div className="p-6 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-800 shadow-lg group-hover:border-gray-600 transition-colors duration-300">
            {imageError ? (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-bold text-2xl">
                {getInitials(name)}
              </div>
            ) : (
              <img
                src={avatarUrl}
                alt={`${name} avatar`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            )}
          </div>
        </div>

        {/* Name and Role */}
        <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
        <p className="text-gray-300 text-sm font-medium mb-3">{role}</p>

        {/* Bio */}
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{bio}</p>

        {/* Social Links */}
        <div className="flex space-x-3">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label={`Visit ${name}'s LinkedIn profile`}
            >
              <Linkedin size={20} />
            </a>
          )}
          {twitterUrl && (
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label={`Visit ${name}'s Twitter profile`}
            >
              <Twitter size={20} />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label={`Visit ${name}'s GitHub profile`}
            >
              <Github size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;