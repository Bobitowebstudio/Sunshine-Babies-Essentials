import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ChinaPartnerSection: React.FC = () => {
  const { companySettings } = useStore();

  if (companySettings.show_partner_section === false) {
    return null;
  }

  const partnerName = companySettings.partner_name || "Binna's Logistics Global";
  const partnerType = companySettings.partner_type || 'China Sourcing & Logistics Partner';
  const partnerDescription =
    companySettings.partner_description || 'Our trusted partner for sourcing and logistics from China.';
  const partnerWebsite = companySettings.partner_website || 'https://binnaslogisticsglobal.com.ng';
  const partnerLogo = companySettings.partner_logo || '/binnas.jpeg';

  return (
    <section
      id="china-partner-section"
      aria-label="China Sourcing & Logistics Partner"
      className="w-full bg-slate-900 border-t border-b border-slate-800 text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 lg:gap-10">
          {/* Left Column: Partnership Badging, Heading & Description */}
          <div className="space-y-2.5 text-center md:text-left max-w-2xl">
            {/* Gold / Amber Partnership Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{partnerType.toUpperCase()}</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Our China Sourcing &amp; Logistics Partner
            </h2>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {partnerDescription}
            </p>
          </div>

          {/* Right Column: Prominent Logo Card with External Link */}
          <div className="flex flex-col items-center md:items-end justify-center shrink-0">
            <a
              id="binnas-partner-logo-link"
              href={partnerWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-4 sm:p-5 shadow-md transition-all duration-200 hover:scale-[1.02] focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              title={`${partnerName} — Visit Official Website`}
              aria-label={`${partnerName} — Visit Partner Website`}
            >
              <img
                src={partnerLogo}
                alt={partnerName}
                className="h-10 sm:h-12 w-auto max-w-[220px] sm:max-w-[280px] object-contain block mx-auto transition-transform duration-200 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </a>

            {/* Small subtle external website link indicator */}
            <a
              href={partnerWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 font-medium transition-colors mt-2"
            >
              <span>Visit {partnerName}</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
