import React from 'react';
import type { GroundingChunk } from '../../types';
import { LinkIcon } from '../../constants';

interface SourceLinksProps {
    chunks: GroundingChunk[];
}

const SourceLinks: React.FC<SourceLinksProps> = ({ chunks }) => {
    // FIX: Filter out chunks that don't have a valid web uri to render.
    const validChunks = chunks.filter(chunk => chunk.web && chunk.web.uri);

    if (validChunks.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-3">
                <LinkIcon className="w-5 h-5" />
                Technical Analysis Sources
            </h3>
            <p className="text-sm text-slate-400 mb-4">The technical SEO analysis was informed by the following sources, accessed via Google Search.</p>
            <ul className="space-y-2">
                {validChunks.map((chunk, index) => (
                    <li key={index}>
                        <a 
                            href={chunk.web!.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sky-400 hover:text-sky-300 text-sm hover:underline truncate block"
                            title={chunk.web!.uri}
                        >
                            {chunk.web!.title || chunk.web!.uri}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SourceLinks;