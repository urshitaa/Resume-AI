import React, { forwardRef } from 'react';
import { ParsedResume } from '../utils/resumeParser';

interface ResumePreviewProps {
  data: ParsedResume;
  template: string;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data, template }, ref) => {
    
    // Helper to group sections into main and sidebar based on keywords
    const categorizeSections = () => {
      const sidebar: any[] = [];
      const main: any[] = [];

      data.sections.forEach(section => {
        const title = section.title.toLowerCase();
        if (title.includes('skill') || title.includes('education') || title.includes('degree') || title.includes('license') || title.includes('cert') || title.includes('activit')) {
          sidebar.push(section);
        } else {
          main.push(section);
        }
      });
      return { sidebar, main };
    };

    const { sidebar, main } = categorizeSections();

    // Specific renders for each template

    const renderTealHeader = () => {
      return (
        <div ref={ref} className="bg-white w-full max-w-4xl mx-auto text-left shadow-sm print:shadow-none min-h-[1123px]" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          {/* Header */}
          <div className="bg-[#3b7e77] text-white p-6 text-center">
            <h1 className="text-5xl font-serif tracking-widest uppercase mb-2">{data.name}</h1>
            <p className="text-xl font-serif italic tracking-wider text-teal-50 uppercase">{data.summary?.split('\n')[0] || "Professional Title"}</p>
          </div>
          
          <div className="flex">
            {/* Left Column */}
            <div className="w-[30%] p-5 bg-white border-r border-gray-100">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-900 inline-block pb-1">CONTACT</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  {data.contact.map((c, i) => <div key={i}>{c}</div>)}
                </div>
              </div>
              
              {sidebar.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-900 inline-block pb-1 uppercase">{section.title}</h2>
                  <div className="text-sm text-gray-600 space-y-2">
                    {section.content.map((line, i) => {
                      const cleanLine = line.replace(/^[-•*]\s*/, '');
                      return <div key={i} className={line.length < 50 && !line.includes('.') ? "font-semibold text-gray-800" : ""}>{cleanLine}</div>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Column */}
            <div className="w-[70%] p-5 bg-white">
              {data.summary && (
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase">Summary</h2>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {data.summary}
                  </div>
                </div>
              )}
              {main.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">{section.title}</h2>
                  <div className="text-sm text-gray-800 space-y-1">
                    {section.content.map((line, i) => {
                       const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                       const cleanLine = line.replace(/^[-•*]\s*/, '');
                       if (isBullet) {
                         return <div key={i} className="flex gap-2 ml-4 mb-1"><span className="text-gray-400">•</span><span>{cleanLine}</span></div>;
                       }
                       const isDateOrLocation = line.includes('20') && line.length < 60;
                       if (isDateOrLocation) return <div key={i} className="text-gray-500 text-xs mb-2 italic">{cleanLine}</div>;
                       const isSubheading = line.length < 80 && !line.endsWith('.');
                       if (isSubheading) return <div key={i} className="font-semibold text-base mt-4 text-gray-900">{cleanLine}</div>;
                       return <p key={i} className="mb-1 text-gray-700 leading-relaxed">{cleanLine}</p>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const renderCoralAccent = () => {
      return (
        <div ref={ref} className="bg-white w-full max-w-4xl mx-auto text-left shadow-sm print:shadow-none min-h-[1123px] p-6 font-sans" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          {/* Header */}
          <div className="mb-3">
            <h1 className="text-5xl font-black tracking-tight text-gray-900 uppercase mb-1">{data.name}</h1>
            <p className="text-2xl font-bold text-[#ff6b6b] mb-4">{data.summary?.split('\n')[0] || "Professional Title"}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {data.contact.map((c, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="text-gray-300">|</span> {c}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-6">
            {/* Left Column (Main) */}
            <div className="w-[60%]">
              {main.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b-[3px] border-gray-900 pb-1">{section.title}</h2>
                  <div className="text-sm text-gray-800">
                    {section.content.map((line, i) => {
                       const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                       const cleanLine = line.replace(/^[-•*]\s*/, '');
                       if (isBullet) return <div key={i} className="flex gap-2 ml-4 mb-1"><span className="text-gray-400">•</span><span className="leading-relaxed">{cleanLine}</span></div>;
                       const isSubheading = line.length < 80 && !line.endsWith('.');
                       if (isSubheading) return <div key={i} className="font-semibold text-lg mt-5 mb-1 text-[#ff6b6b]">{cleanLine}</div>;
                       return <p key={i} className="mb-2 text-gray-500 italic text-xs">{cleanLine}</p>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Column (Sidebar) */}
            <div className="w-[40%]">
              {sidebar.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase border-b-[3px] border-gray-900 pb-1">{section.title}</h2>
                  <div className="text-sm text-gray-800 space-y-1">
                    {section.content.map((line, i) => {
                       const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                       const cleanLine = line.replace(/^[-•*]\s*/, '');
                       if (isBullet) return <div key={i} className="flex gap-2 ml-2"><span className="text-gray-400">•</span><span>{cleanLine}</span></div>;
                       const isSubheading = line.length < 80 && !line.endsWith('.');
                       if (isSubheading) return <div key={i} className="font-semibold text-gray-900 mt-3">{cleanLine}</div>;
                       return <div key={i} className="text-[#ff6b6b] text-sm">{cleanLine}</div>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const renderDarkSidebar = () => {
      return (
        <div ref={ref} className="bg-white w-full max-w-4xl mx-auto text-left shadow-sm print:shadow-none min-h-[1123px] flex" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          {/* Left Column (Sidebar) */}
          <div className="w-[35%] bg-[#2b3544] text-white p-5">
            <h1 className="text-4xl font-light text-blue-300 uppercase tracking-wide leading-tight mb-2">{data.name}</h1>
            <p className="text-white font-medium mb-4 text-sm">{data.summary?.split('\n')[0] || "Professional Title"}</p>
            
            <div className="text-xs text-gray-300 space-y-3 mb-10">
              {data.contact.map((c, i) => <div key={i} className="flex items-center gap-2">{c}</div>)}
            </div>

            {data.summary && (
              <div className="mb-4">
                <h2 className="text-sm font-bold text-white mb-3 uppercase border-b border-gray-500 pb-1 border-dotted">Summary</h2>
                <div className="text-xs text-gray-300 leading-relaxed">
                  {data.summary}
                </div>
              </div>
            )}
            
            {sidebar.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h2 className="text-sm font-bold text-white mb-3 uppercase border-b border-gray-500 pb-1 border-dotted">{section.title}</h2>
                <div className="text-xs text-gray-300 space-y-2">
                  {section.content.map((line, i) => {
                    const cleanLine = line.replace(/^[-•*]\s*/, '');
                    return <div key={i}>• {cleanLine}</div>;
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Column (Main) */}
          <div className="w-[65%] p-5 bg-white">
            {main.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase border-b border-gray-300 pb-1">{section.title}</h2>
                <div className="text-sm text-gray-800">
                  {section.content.map((line, i) => {
                     const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                     const cleanLine = line.replace(/^[-•*]\s*/, '');
                     if (isBullet) return <div key={i} className="flex gap-2 ml-4 mb-1"><span className="text-gray-400">•</span><span className="text-xs leading-relaxed">{cleanLine}</span></div>;
                     const isSubheading = line.length < 80 && !line.endsWith('.');
                     if (isSubheading) return <div key={i} className="font-bold text-sm mt-5 mb-1 text-blue-600">{cleanLine}</div>;
                     return <p key={i} className="mb-2 text-gray-500 italic text-xs">{cleanLine}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderBeigeSidebar = () => {
      return (
        <div ref={ref} className="bg-white w-full max-w-4xl mx-auto text-left shadow-sm print:shadow-none min-h-[1123px] flex flex-col font-sans" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          
          {/* Content Row */}
          <div className="flex flex-1 relative">
            {/* Angled Header - Positioned Absolutely */}
            <div className="absolute top-0 left-0 right-0 h-[180px] bg-[#333538] flex items-center justify-center text-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 35% 100%, 0 70%)', zIndex: 10 }}>
              <div className="text-center ml-[30%] -mt-4">
                <h1 className="text-4xl font-light tracking-wide mb-1">{data.name}</h1>
                <p className="text-gray-300 font-light tracking-widest uppercase text-sm">{data.summary?.split('\n')[0] || "Professional Title"}</p>
              </div>
            </div>

            {/* Left Column (Sidebar) */}
            <div className="w-[35%] bg-[#eae6e1] pt-[200px] p-5 z-0">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Details</h2>
                <div className="text-xs text-gray-700 space-y-3 font-medium">
                  {data.contact.map((c, i) => <div key={i}>{c}</div>)}
                </div>
              </div>
              
              {sidebar.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 capitalize">{section.title}</h2>
                  <div className="text-xs text-gray-700 space-y-2">
                    {section.content.map((line, i) => {
                      const cleanLine = line.replace(/^[-•*]\s*/, '');
                      return <div key={i} className={line.length < 50 && !line.includes('.') ? "font-bold mt-2" : ""}>{cleanLine}</div>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Column (Main) */}
            <div className="w-[65%] bg-white pt-[200px] p-6 z-0">
              {data.summary && (
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-900 pb-1">Summary</h2>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {data.summary}
                  </div>
                </div>
              )}
              {main.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-900 pb-1">{section.title}</h2>
                  <div className="text-sm text-gray-800">
                    {section.content.map((line, i) => {
                       const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                       const cleanLine = line.replace(/^[-•*]\s*/, '');
                       if (isBullet) return <div key={i} className="flex gap-2 ml-4 mb-2"><span className="text-gray-400">•</span><span className="text-xs leading-relaxed">{cleanLine}</span></div>;
                       const isSubheading = line.length < 80 && !line.endsWith('.');
                       if (isSubheading) return <div key={i} className="font-bold text-sm mt-5 mb-1">{cleanLine}</div>;
                       return <p key={i} className="mb-2 text-gray-500 text-xs italic">{cleanLine}</p>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const renderPeachSplit = () => {
      return (
        <div ref={ref} className="bg-white w-full max-w-4xl mx-auto text-left shadow-sm print:shadow-none min-h-[1123px] flex font-sans" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div className="w-[35%] bg-[#ffb38a] p-5 pt-16 flex flex-col gap-5">
            <div>
              <h1 className="text-4xl font-black text-gray-900 leading-none tracking-tighter mb-4">{data.name.split(' ').map((n, i) => <div key={i}>{n.toUpperCase()}</div>)}</h1>
              <div className="w-10 h-0.5 bg-gray-900 mb-3" />
              <div className="text-sm text-gray-900 space-y-4 font-medium">
                {data.contact.map((c, i) => <div key={i} className="flex items-center gap-3"><div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#e86a24] text-xs">●</div>{c}</div>)}
              </div>
            </div>
            {sidebar.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-sm font-bold text-gray-900 mb-4 tracking-widest uppercase">{section.title}</h2>
                <div className="text-sm text-gray-900 space-y-4">
                  {section.content.map((line, i) => {
                    const cleanLine = line.replace(/^[-•*]\s*/, '');
                    if (section.title.toLowerCase().includes('skill')) {
                      return (
                        <div key={i}>
                          <div className="mb-1">{cleanLine}</div>
                          <div className="w-full h-1.5 bg-white flex"><div className="w-3/4 h-full bg-[#e86a24]"></div></div>
                        </div>
                      );
                    }
                    return <div key={i} className={line.length < 50 && !line.includes('.') ? "font-bold" : "text-xs"}>{cleanLine}</div>;
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="w-[65%] flex flex-col">
            <div className="bg-[#fff3eb] p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-3 tracking-widest uppercase">Resume Objective</h2>
              <p className="text-sm text-gray-800 leading-relaxed">{data.summary || "Dedicated professional with a proven track record."}</p>
            </div>
            <div className="bg-white p-6 flex-1">
              {main.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h2 className="text-sm font-bold text-gray-900 mb-4 tracking-widest uppercase">{section.title}</h2>
                  <div className="text-sm text-gray-800 space-y-2">
                    {section.content.map((line, i) => {
                       const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                       const cleanLine = line.replace(/^[-•*]\s*/, '');
                       if (isBullet) return <div key={i} className="flex gap-2 ml-4 mb-1"><span className="text-gray-400">•</span><span className="text-xs leading-relaxed">{cleanLine}</span></div>;
                       const isSubheading = line.length < 80 && !line.endsWith('.');
                       if (isSubheading) return <div key={i} className="font-bold text-sm mt-5 mb-1">{cleanLine}</div>;
                       return <p key={i} className="mb-2 text-gray-500 text-xs italic">{cleanLine}</p>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const renderPinkMinimalist = () => {
      return (
        <div ref={ref} className="bg-white w-full max-w-4xl mx-auto text-left shadow-sm print:shadow-none min-h-[1123px] font-serif" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div className="bg-[#f9e7e7] p-5 flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-600 tracking-wider uppercase mb-3">{data.name}</h1>
              <div className="text-xs font-sans text-gray-700 flex gap-3">
                {data.contact.map((c, i) => <span key={i}>{c} {i < data.contact.length - 1 && "|"}</span>)}
              </div>
            </div>
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-3xl text-gray-500 font-bold">
              {data.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="flex p-5 gap-5 font-sans">
            <div className="w-[60%] border-r border-gray-200 pr-8">
              {data.summary && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest border-b border-gray-200 pb-2">Professional Summary</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
                </div>
              )}
              {main.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">{section.title}</h2>
                  <div className="text-sm text-gray-800">
                    {section.content.map((line, i) => {
                       const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                       const cleanLine = line.replace(/^[-•*]\s*/, '');
                       if (isBullet) return <div key={i} className="flex gap-2 ml-4 mb-2"><span className="text-gray-400">•</span><span className="text-xs leading-relaxed">{cleanLine}</span></div>;
                       const isSubheading = line.length < 80 && !line.endsWith('.');
                       if (isSubheading) return <div key={i} className="font-bold text-sm mt-5 mb-1 text-gray-800">{cleanLine}</div>;
                       return <p key={i} className="mb-2 text-gray-500 text-xs italic">{cleanLine}</p>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-[40%]">
              {sidebar.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">{section.title}</h2>
                  <div className="text-sm text-gray-600 space-y-3">
                    {section.content.map((line, i) => {
                      const cleanLine = line.replace(/^[-•*]\s*/, '');
                      if (section.title.toLowerCase().includes('skill')) {
                        return (
                          <div key={i}>
                            <div className="mb-1 text-xs">{cleanLine}</div>
                            <div className="w-full h-1.5 bg-gray-100 flex"><div className="w-4/5 h-full bg-[#f2a8a8]"></div></div>
                          </div>
                        );
                      }
                      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                      if (isBullet) return <div key={i} className="flex gap-2 text-xs"><span>•</span><span>{cleanLine}</span></div>;
                      return <div key={i} className={line.length < 50 && !line.includes('.') ? "font-bold text-gray-800 mt-2" : "text-xs"}>{cleanLine}</div>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const renderBurgundyTimeline = () => {
      return (
        <div ref={ref} className="bg-white w-full max-w-4xl mx-auto text-left shadow-sm print:shadow-none min-h-[1123px] p-6 font-serif" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div className="flex justify-between items-start mb-10 border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-5xl font-light text-[#7a3e48] mb-2">{data.name}</h1>
              <div className="text-xs text-gray-600 flex gap-4 font-sans">
                {data.contact.map((c, i) => <span key={i} className="flex items-center gap-1"><span className="text-[#7a3e48]">●</span> {c}</span>)}
              </div>
            </div>
            <div className="w-16 h-16 bg-[#7a3e48] rounded-full flex items-center justify-center text-white text-2xl tracking-widest font-sans">
              {data.name.split(' ').map(n => n[0]).join('|')}
            </div>
          </div>
          
          <div className="font-sans text-sm text-gray-800">
             {data.summary && (
              <div className="flex mb-3 relative">
                <div className="w-[20%] text-right pr-6 font-bold text-[#7a3e48] text-xs tracking-wider uppercase pt-1">Professional Summary</div>
                <div className="w-[80%] border-l border-gray-300 pl-6 pb-6">
                  <div className="absolute left-[20%] w-3 h-3 border-2 border-[#7a3e48] bg-white rounded-full -translate-x-1.5 translate-y-1" />
                  <p className="leading-relaxed">{data.summary}</p>
                </div>
              </div>
            )}
            {data.sections.map((section, idx) => (
              <div key={idx} className="flex relative">
                <div className="w-[20%] text-right pr-6 font-bold text-[#7a3e48] text-xs tracking-wider uppercase pt-1">{section.title}</div>
                <div className="w-[80%] border-l border-gray-300 pl-6 pb-8">
                  <div className="absolute left-[20%] w-3 h-3 border-2 border-[#7a3e48] bg-white rounded-full -translate-x-1.5 translate-y-1" />
                  {section.content.map((line, i) => {
                     const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                     const cleanLine = line.replace(/^[-•*]\s*/, '');
                     if (isBullet) return <div key={i} className="flex gap-2 ml-4 mb-2"><span className="text-[#7a3e48]">•</span><span className="text-xs leading-relaxed">{cleanLine}</span></div>;
                     const isSubheading = line.length < 80 && !line.endsWith('.');
                     if (isSubheading) return <div key={i} className="font-bold text-sm mt-4 mb-1 text-gray-900">{cleanLine}</div>;
                     return <p key={i} className="mb-2 text-gray-500 text-xs italic">{cleanLine}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderGreenSidebar = () => {
      return (
        <div ref={ref} className="bg-white w-full max-w-4xl mx-auto text-left shadow-sm print:shadow-none min-h-[1123px] flex font-sans" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div className="w-[35%] bg-[#124d1a] text-white p-5">
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl font-bold text-gray-500 shadow-inner">
               {data.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h1 className="text-3xl font-bold mb-3 text-center">{data.name.replace(' ', '\n')}</h1>
            
            <div className="bg-[#0d3b14] -mx-8 px-8 py-4 mb-4">
              <h2 className="text-lg font-bold mb-3">Contact</h2>
              <div className="text-xs space-y-2 text-green-100">
                {data.contact.map((c, i) => <div key={i}>{c}</div>)}
              </div>
            </div>

            {sidebar.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h2 className="text-lg font-bold mb-4">{section.title}</h2>
                <div className="flex flex-col gap-2">
                  {section.content.map((line, i) => {
                    const cleanLine = line.replace(/^[-•*]\s*/, '');
                    if (section.title.toLowerCase().includes('skill')) {
                      return <div key={i} className="border border-green-400 rounded-full px-4 py-1.5 text-xs text-center">{cleanLine}</div>;
                    }
                    return <div key={i} className="text-xs text-green-100">{cleanLine}</div>;
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-[65%] p-6 bg-white">
            {data.summary && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed italic">{data.summary}</p>
              </div>
            )}
            {main.map((section, idx) => (
              <div key={idx} className="mb-4">
                <h2 className="text-xl font-bold text-[#124d1a] mb-4 border-b border-gray-200 pb-2">{section.title}</h2>
                <div className="text-sm text-gray-800">
                  {section.content.map((line, i) => {
                     const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                     const cleanLine = line.replace(/^[-•*]\s*/, '');
                     if (isBullet) return <div key={i} className="flex gap-2 ml-4 mb-2"><span className="text-gray-400">•</span><span className="text-xs leading-relaxed">{cleanLine}</span></div>;
                     const isSubheading = line.length < 80 && !line.endsWith('.');
                     if (isSubheading) return <div key={i} className="font-bold text-sm mt-5 mb-1 text-gray-900">{cleanLine}</div>;
                     return <p key={i} className="mb-2 text-gray-500 text-xs italic">{cleanLine}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderGreyBars = () => {
      return (
        <div ref={ref} className="bg-white w-full max-w-4xl mx-auto text-left shadow-sm print:shadow-none min-h-[1123px] p-6 font-sans" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div className="text-center mb-4">
            <h1 className="text-4xl font-light text-gray-800 tracking-widest uppercase mb-3">{data.name}</h1>
            <div className="text-xs text-gray-600 flex justify-center gap-2">
              {data.contact.map((c, i) => <span key={i}>{c} {i < data.contact.length - 1 && "|"}</span>)}
            </div>
          </div>

          {data.summary && (
            <div className="mb-3">
              <div className="w-full bg-gray-300 py-1.5 px-4 mb-3">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Resume Objective</h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed px-4">{data.summary}</p>
            </div>
          )}

          {data.sections.map((section, idx) => (
            <div key={idx} className="mb-3">
              <div className="w-full bg-gray-300 py-1.5 px-4 mb-3">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest">{section.title}</h2>
              </div>
              
              {section.title.toLowerCase().includes('skill') ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-4 text-xs text-gray-700">
                  {section.content.map((line, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      {line.replace(/^[-•*]\s*/, '')}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 text-sm text-gray-800">
                  {section.content.map((line, i) => {
                     const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                     const cleanLine = line.replace(/^[-•*]\s*/, '');
                     if (isBullet) return <div key={i} className="flex gap-2 ml-4 mb-1"><span className="text-gray-400">•</span><span className="text-xs leading-relaxed">{cleanLine}</span></div>;
                     const isSubheading = line.length < 80 && !line.endsWith('.');
                     if (isSubheading) return <div key={i} className="font-bold text-sm mt-4 mb-1">{cleanLine}</div>;
                     return <p key={i} className="mb-1 text-gray-600 text-xs">{cleanLine}</p>;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };

    const renderOriginal = () => {
      const renderHeader = () => {
        switch (template) {
          case 'Executive':
            return (
              <div className="bg-slate-800 text-white p-5 mb-3 rounded-t-lg">
                <h1 className="text-4xl font-serif tracking-tight mb-2">{data.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                  {data.contact.map((c, i) => <span key={i}>{c}</span>)}
                </div>
              </div>
            );
          case 'Classic':
            return (
              <div className="text-center mb-3 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-serif font-bold uppercase tracking-widest mb-2">{data.name}</h1>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  {data.contact.map((c, i) => (
                    <span key={i}>
                      {c} {i < data.contact.length - 1 && " | "}
                    </span>
                  ))}
                </div>
              </div>
            );
          case 'Minimal':
            return (
              <div className="mb-4">
                <h1 className="text-3xl font-light tracking-wide text-gray-800 mb-2">{data.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {data.contact.map((c, i) => <span key={i}>{c}</span>)}
                </div>
              </div>
            );
          case 'Modern':
            return (
              <div className="mb-3 flex justify-between items-end border-b border-gray-200 pb-4">
                <div>
                  <h1 className="text-4xl font-bold text-blue-700 tracking-tight">{data.name}</h1>
                </div>
                <div className="text-right text-sm text-gray-600 flex flex-col">
                  {data.contact.map((c, i) => <span key={i}>{c}</span>)}
                </div>
              </div>
            );
          case 'ATS Friendly':
            return (
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold mb-1">{data.name}</h1>
                <div className="text-sm">
                  {data.contact.join(" | ")}
                </div>
              </div>
            );
          case 'Creative':
            return (
              <div className="mb-4 bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
                <h1 className="text-4xl font-black text-indigo-900 tracking-tighter mb-2">{data.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-indigo-700 font-medium">
                  {data.contact.map((c, i) => <span key={i}>{c}</span>)}
                </div>
              </div>
            );
          default:
            return null;
        }
      };

      const renderSectionHeader = (title: string) => {
        switch (template) {
          case 'Executive':
            return <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 mb-3 uppercase tracking-wider">{title}</h2>;
          case 'Classic':
            return <h2 className="text-lg font-serif font-bold text-black border-b border-black mb-3 uppercase text-center tracking-widest">{title}</h2>;
          case 'Minimal':
            return <h2 className="text-lg font-semibold text-gray-800 mb-3 tracking-widest uppercase text-gray-400">{title}</h2>;
          case 'Modern':
            return <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2"><span className="w-4 h-4 bg-blue-700 rounded-full inline-block"></span>{title}</h2>;
          case 'ATS Friendly':
            return <h2 className="text-lg font-bold text-black mb-2 uppercase">{title}</h2>;
          case 'Creative':
            return <h2 className="text-xl font-extrabold text-indigo-900 mb-3 bg-indigo-100 inline-block px-3 py-1 rounded-md">{title}</h2>;
          default:
            return null;
        }
      };

      const getContainerClass = () => {
        let base = "bg-white p-5 shadow-sm print:shadow-none w-full max-w-4xl mx-auto text-left min-h-[1123px] ";
        switch(template) {
          case 'Classic': return base + "font-serif text-gray-900";
          case 'Minimal': return base + "font-sans text-gray-700 font-light";
          case 'Modern': return base + "font-sans text-gray-800";
          case 'ATS Friendly': return base + "font-mono text-black p-4 text-sm";
          case 'Executive': return base + "font-serif text-slate-900 p-0 overflow-hidden rounded-lg border border-slate-200";
          case 'Creative': return base + "font-sans text-gray-800";
          default: return base + "font-sans text-gray-800";
        }
      };

      const getContentClass = () => {
        if (template === 'Executive') return "p-5";
        return "";
      };

      return (
        <div ref={ref} className={getContainerClass()} style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          {renderHeader()}
          
          <div className={getContentClass()}>
            {data.summary && (
              <div className="mb-3">
                {renderSectionHeader('Summary')}
                <div className={`text-sm leading-relaxed ${template === 'ATS Friendly' ? '' : 'text-gray-700'}`}>
                  {data.summary.split('\n').map((line, i) => (
                    <p key={i} className="mb-1">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {data.sections.map((section, idx) => (
              <div key={idx} className="mb-3">
                {renderSectionHeader(section.title)}
                <div className={`text-sm space-y-2 ${template === 'ATS Friendly' ? '' : 'text-gray-800'}`}>
                  {section.content.map((line, i) => {
                    const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*');
                    const cleanLine = line.replace(/^[-•*]\s*/, '');
                    if (isBullet) {
                      return (
                        <div key={i} className="flex gap-2 ml-4">
                          <span className="text-gray-400">•</span>
                          <span>{cleanLine}</span>
                        </div>
                      );
                    }
                    const isSubheading = line.length < 80 && !line.endsWith('.') && (line.includes('|') || line.includes(','));
                    if (isSubheading) {
                      return <p key={i} className="font-semibold mt-3">{line}</p>;
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    switch (template) {
      case 'Teal Header': return renderTealHeader();
      case 'Coral Accent': return renderCoralAccent();
      case 'Dark Sidebar': return renderDarkSidebar();
      case 'Beige Sidebar': return renderBeigeSidebar();
      case 'Peach Split': return renderPeachSplit();
      case 'Pink Minimalist': return renderPinkMinimalist();
      case 'Burgundy Timeline': return renderBurgundyTimeline();
      case 'Green Sidebar': return renderGreenSidebar();
      case 'Grey Bars': return renderGreyBars();
      default: return renderOriginal();
    }
  }
);

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
