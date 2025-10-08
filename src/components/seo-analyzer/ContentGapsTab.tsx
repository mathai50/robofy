import React from 'react';
import type { ContentGap } from '../../types';
import { LightBulbIcon } from '../../constants';

interface ContentGapsTabProps {
  contentGaps: ContentGap[];
}

const ContentGapsTab: React.FC<ContentGapsTabProps> = ({ contentGaps }) => {
  return (
    <div className="animate-fade-in">
       <h3 className="text-2xl font-bold text-white mb-1">Content Gap Analysis</h3>
       <p className="text-slate-400 mb-6">Opportunities to expand your content based on what top competitors are covering.</p>
       <div className="space-y-4">
        {contentGaps.map((gap, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                 <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">
                       <LightBulbIcon className="w-6 h-6 text-yellow-400"/>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-100">{gap.topic}</h4>
                        <p className="mt-1 text-sm text-slate-400">{gap.description}</p>
                    </div>
                 </div>
            </div>
        ))}
       </div>
    </div>
  );
};

export default ContentGapsTab;