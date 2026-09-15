import React from 'react';
import {
  GitFork,
  ExternalLink,
  LayoutTemplate,
  Award,
  Globe,
  FileCode2,
  Rocket,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react';
import type { ProofLink, ProofPlatform } from '../../types';

interface ProjectProofLinksProps {
  links: ProofLink[];
  layout?: 'row' | 'grid';
}

const getPlatformConfig = (platform: ProofPlatform) => {
  switch (platform) {
    case 'github':
      return {
        label: 'GITHUB REPOSITORY',
        badge: 'Open Source',
        icon: <GitFork className="w-3.5 h-3.5 text-[#1A1A19]" />,
        actionText: 'View Repository',
        borderColor: 'border-[#1A1A19]/20 hover:border-[#1A1A19]',
      };
    case 'demo':
      return {
        label: 'LIVE DEMO',
        badge: 'Production',
        icon: <Rocket className="w-3.5 h-3.5 text-[#F9BE08]" />,
        actionText: 'Launch Live Demo',
        borderColor: 'border-[#F9BE08]/60 hover:border-[#F9BE08]',
      };
    case 'figma':
      return {
        label: 'FIGMA DESIGN SYSTEM',
        badge: 'UI/UX Specs',
        icon: <LayoutTemplate className="w-3.5 h-3.5 text-[#1A1A19]" />,
        actionText: 'Open Figma Prototype',
        borderColor: 'border-[#DFDFD9] hover:border-[#1A1A19]',
      };
    case 'behance':
    case 'dribbble':
      return {
        label: `${platform.toUpperCase()} SHOWCASE`,
        badge: 'Visual Design',
        icon: <Globe className="w-3.5 h-3.5 text-[#1A1A19]" />,
        actionText: 'View Case Study',
        borderColor: 'border-[#DFDFD9] hover:border-[#1A1A19]',
      };
    case 'leetcode':
    case 'gfg':
    case 'codeforces':
      return {
        label: `${platform.toUpperCase()} PROFILE`,
        badge: 'Competitive Proof',
        icon: <FileCode2 className="w-3.5 h-3.5 text-[#1A1A19]" />,
        actionText: 'Verify Ranking',
        borderColor: 'border-[#DFDFD9] hover:border-[#1A1A19]',
      };
    case 'certificate':
      return {
        label: 'VERIFIED CREDENTIAL',
        badge: 'Accredited',
        icon: <Award className="w-3.5 h-3.5 text-[#F9BE08]" />,
        actionText: 'Verify Credential',
        borderColor: 'border-[#F9BE08]/70 hover:border-[#1A1A19]',
      };
    case 'producthunt':
      return {
        label: 'PRODUCT HUNT',
        badge: 'Community Launch',
        icon: <ExternalLink className="w-3.5 h-3.5 text-[#1A1A19]" />,
        actionText: 'View Product Page',
        borderColor: 'border-[#DFDFD9] hover:border-[#1A1A19]',
      };
    default:
      return {
        label: 'EXTERNAL PROOF',
        badge: 'Verified Source',
        icon: <Globe className="w-3.5 h-3.5 text-[#1A1A19]" />,
        actionText: 'Visit Link',
        borderColor: 'border-[#DFDFD9] hover:border-[#1A1A19]',
      };
  }
};

export const ProjectProofLinks: React.FC<ProjectProofLinksProps> = ({
  links,
  layout = 'grid',
}) => {
  if (!links || links.length === 0) return null;

  return (
    <div
      className={
        layout === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3'
          : 'flex flex-wrap gap-2 my-2'
      }
    >
      {links.map((link) => {
        const config = getPlatformConfig(link.platform);
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`group p-2.5 sm:p-3 rounded-lg bg-white border ${config.borderColor} transition-all shadow-subtle hover:shadow-md flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded bg-[#F9F8F4] border border-[#DFDFD9]">
                    {config.icon}
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#1A1A19]/70">
                    {config.label}
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#F9F8F4] text-[#1A1A19]/60 border border-[#DFDFD9]">
                  {config.badge}
                </span>
              </div>
              <h4 className="font-bold text-xs text-[#1A1A19] group-hover:text-black line-clamp-1">
                {link.title}
              </h4>
              {link.meta && (
                <p className="text-[11px] font-mono text-[#1A1A19]/60 mt-0.5 truncate">
                  {link.meta}
                </p>
              )}
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#DFDFD9]/60 flex items-center justify-between text-[11px] font-bold text-[#1A1A19]/80 group-hover:text-[#1A1A19]">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-[#F9BE08]" />
                {config.actionText}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>
        );
      })}
    </div>
  );
};
