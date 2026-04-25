import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const TEMPLATES = [
  'Modern',
  'Classic',
  'ATS Friendly',
  'Minimal',
  'Creative',
  'Executive',
  'Teal Header',
  'Coral Accent',
  'Dark Sidebar',
  'Beige Sidebar',
  'Peach Split',
  'Pink Minimalist',
  'Burgundy Timeline',
  'Green Sidebar',
  'Grey Bars'
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

const renderThumbnail = (template: string) => {
  switch (template) {
    case 'Teal Header':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto">
          <div className="w-full h-5 bg-[#3b7e77]" />
          <div className="flex flex-1">
            <div className="w-[35%] h-full bg-white border-r p-1 flex flex-col gap-1">
              <div className="w-full h-[2px] bg-gray-400" />
              <div className="w-3/4 h-[1px] bg-gray-200" />
              <div className="w-full h-[2px] bg-gray-400 mt-1" />
              <div className="w-2/3 h-[1px] bg-gray-200" />
            </div>
            <div className="w-[65%] h-full bg-white p-1.5 flex flex-col gap-1">
              <div className="w-3/4 h-[2px] bg-gray-400" />
              <div className="w-full h-[1px] bg-gray-200" />
              <div className="w-5/6 h-[1px] bg-gray-200" />
              <div className="w-full h-[1px] bg-gray-200" />
            </div>
          </div>
        </div>
      );
    case 'Coral Accent':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-1.5">
          <div className="w-1/2 h-[4px] bg-gray-800 mb-1" />
          <div className="w-1/3 h-[3px] bg-[#ff6b6b] mb-1.5" />
          <div className="flex gap-2 flex-1">
            <div className="w-[60%] h-full flex flex-col gap-1">
              <div className="w-full h-[2px] bg-gray-800" />
              <div className="w-1/2 h-[2px] bg-[#ff6b6b]" />
              <div className="w-full h-[1px] bg-gray-200" />
              <div className="w-4/5 h-[1px] bg-gray-200" />
            </div>
            <div className="w-[40%] h-full flex flex-col gap-1">
              <div className="w-full h-[2px] bg-gray-800" />
              <div className="w-1/2 h-[1px] bg-gray-300" />
              <div className="w-full h-[1px] bg-gray-200" />
            </div>
          </div>
        </div>
      );
    case 'Dark Sidebar':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex overflow-hidden mx-auto">
          <div className="w-[35%] h-full bg-[#2b3544] p-1 flex flex-col gap-1">
            <div className="w-full h-[3px] bg-blue-300 mb-1" />
            <div className="w-3/4 h-[1px] bg-white" />
            <div className="w-full h-[1px] bg-gray-400 mt-2" />
            <div className="w-1/2 h-[1px] bg-gray-400" />
          </div>
          <div className="w-[65%] h-full p-1.5 flex flex-col gap-1">
            <div className="w-3/4 h-[2px] bg-gray-800" />
            <div className="w-1/2 h-[2px] bg-blue-600 mt-1" />
            <div className="w-full h-[1px] bg-gray-300" />
            <div className="w-5/6 h-[1px] bg-gray-300" />
          </div>
        </div>
      );
    case 'Beige Sidebar':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto relative">
          <div className="absolute top-0 left-0 right-0 h-4 bg-[#333538]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 30% 100%, 0 60%)' }} />
          <div className="flex flex-1 mt-2">
            <div className="w-[40%] h-full bg-[#eae6e1] pt-3 p-1 flex flex-col gap-1">
              <div className="w-full h-[2px] bg-gray-600" />
              <div className="w-3/4 h-[1px] bg-gray-400" />
              <div className="w-full h-[1px] bg-gray-400" />
            </div>
            <div className="w-[60%] h-full bg-white pt-3 p-1.5 flex flex-col gap-1">
              <div className="w-3/4 h-[2px] bg-gray-800" />
              <div className="w-full h-[1px] bg-gray-300" />
              <div className="w-5/6 h-[1px] bg-gray-300" />
            </div>
          </div>
        </div>
      );
    case 'Executive':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-1 border-gray-300 rounded-[2px]">
          <div className="w-full h-5 bg-slate-800 rounded-t-[2px] mb-1" />
          <div className="w-3/4 h-[2px] bg-gray-800 mb-1 mx-auto" />
          <div className="w-full h-[1px] bg-gray-300 mb-[2px]" />
          <div className="w-5/6 h-[1px] bg-gray-300" />
        </div>
      );
    case 'Creative':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-1.5">
          <div className="w-full h-6 bg-indigo-50 border-l-2 border-indigo-500 mb-2" />
          <div className="w-1/2 h-[3px] bg-indigo-100 mb-1" />
          <div className="w-full h-[1px] bg-gray-300 mb-[2px]" />
          <div className="w-5/6 h-[1px] bg-gray-300" />
        </div>
      );
    case 'ATS Friendly':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-2">
          <div className="w-1/2 h-[3px] bg-black mx-auto mb-1" />
          <div className="w-3/4 h-[1px] bg-gray-500 mx-auto mb-2" />
          <div className="w-1/3 h-[2px] bg-black mb-1" />
          <div className="w-full h-[1px] bg-gray-400 mb-[2px]" />
          <div className="w-full h-[1px] bg-gray-400" />
        </div>
      );
    case 'Modern':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-1.5">
          <div className="flex justify-between items-end border-b border-gray-200 pb-1 mb-1">
            <div className="w-1/2 h-[4px] bg-blue-700" />
            <div className="w-1/4 h-[1px] bg-gray-400" />
          </div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-1 h-1 bg-blue-700 rounded-full" />
            <div className="w-1/3 h-[2px] bg-blue-700" />
          </div>
          <div className="w-full h-[1px] bg-gray-300 mb-[2px]" />
          <div className="w-5/6 h-[1px] bg-gray-300" />
        </div>
      );
    case 'Classic':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-1.5">
          <div className="border-b-[1px] border-black pb-1 mb-1 flex flex-col items-center">
            <div className="w-2/3 h-[3px] bg-black mb-[2px]" />
            <div className="w-1/2 h-[1px] bg-gray-500" />
          </div>
          <div className="w-1/2 h-[2px] bg-black mx-auto mb-1" />
          <div className="w-full h-[1px] bg-gray-300 mb-[2px]" />
          <div className="w-5/6 h-[1px] bg-gray-300" />
        </div>
      );
    case 'Peach Split':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex overflow-hidden mx-auto">
          <div className="w-[35%] h-full bg-[#f6b48a] p-1 flex flex-col gap-1 items-center pt-2">
            <div className="w-4 h-4 bg-[#e86a24] mb-1" />
            <div className="w-3/4 h-[2px] bg-gray-900" />
            <div className="w-full h-[1px] bg-gray-800 mb-1" />
            <div className="w-full h-[3px] bg-[#e86a24] mb-[2px]" />
            <div className="w-5/6 h-[3px] bg-[#e86a24]" />
          </div>
          <div className="w-[65%] h-full p-1.5 flex flex-col gap-1">
            <div className="w-3/4 h-[2px] bg-gray-800" />
            <div className="w-full h-[1px] bg-gray-400 mb-1" />
            <div className="w-1/2 h-[2px] bg-gray-800" />
            <div className="w-full h-[1px] bg-gray-300" />
            <div className="w-5/6 h-[1px] bg-gray-300" />
          </div>
        </div>
      );
    case 'Pink Minimalist':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-1.5">
          <div className="w-full h-4 bg-[#f8e5e5] mb-1 flex justify-between items-center px-1">
            <div className="w-1/2 h-[2px] bg-gray-700" />
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
          </div>
          <div className="flex flex-1 gap-1">
            <div className="w-[60%] h-full flex flex-col gap-[2px]">
              <div className="w-3/4 h-[1px] bg-gray-600" />
              <div className="w-full h-[1px] bg-gray-300" />
              <div className="w-full h-[1px] bg-gray-300" />
              <div className="w-3/4 h-[1px] bg-gray-600 mt-1" />
              <div className="w-full h-[1px] bg-gray-300" />
            </div>
            <div className="w-[40%] h-full flex flex-col gap-[2px]">
              <div className="w-3/4 h-[1px] bg-gray-600" />
              <div className="w-full h-[2px] bg-[#f2a8a8]" />
              <div className="w-5/6 h-[2px] bg-[#f2a8a8] mb-1" />
              <div className="w-3/4 h-[1px] bg-gray-600" />
              <div className="w-full h-[1px] bg-gray-300" />
            </div>
          </div>
        </div>
      );
    case 'Burgundy Timeline':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-1.5">
          <div className="flex justify-between items-start mb-1">
            <div className="w-1/2 h-[3px] bg-[#7a3e48]" />
            <div className="w-4 h-4 bg-[#7a3e48] rounded-full" />
          </div>
          <div className="flex flex-1 gap-1">
            <div className="w-[30%] h-full flex flex-col gap-2 border-r border-gray-300 items-end pr-[2px]">
              <div className="w-full h-[1px] bg-[#7a3e48]" />
              <div className="w-3/4 h-[1px] bg-[#7a3e48]" />
              <div className="w-full h-[1px] bg-[#7a3e48]" />
            </div>
            <div className="w-[70%] h-full flex flex-col gap-1.5">
              <div className="w-full h-[1px] bg-gray-400" />
              <div className="w-5/6 h-[1px] bg-gray-400" />
              <div className="w-full h-[2px] bg-gray-300" />
            </div>
          </div>
        </div>
      );
    case 'Green Sidebar':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex overflow-hidden mx-auto">
          <div className="w-[35%] h-full bg-[#1e5c26] p-1 flex flex-col items-center gap-1">
            <div className="w-5 h-5 bg-gray-300 rounded-full mb-1" />
            <div className="w-3/4 h-[2px] bg-white" />
            <div className="w-full h-[1px] bg-white mb-1" />
            <div className="w-full h-[4px] rounded-full border border-green-300" />
            <div className="w-5/6 h-[4px] rounded-full border border-green-300" />
          </div>
          <div className="w-[65%] h-full p-1.5 flex flex-col gap-1">
            <div className="w-3/4 h-[2px] bg-[#1e5c26]" />
            <div className="w-full h-[1px] bg-gray-800" />
            <div className="w-5/6 h-[1px] bg-gray-400" />
            <div className="w-3/4 h-[2px] bg-[#1e5c26] mt-1" />
            <div className="w-full h-[1px] bg-gray-800" />
          </div>
        </div>
      );
    case 'Grey Bars':
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-1.5">
          <div className="w-1/2 h-[3px] bg-gray-800 mx-auto mb-1" />
          <div className="w-1/3 h-[1px] bg-gray-500 mx-auto mb-1.5" />
          <div className="w-full h-[3px] bg-gray-300 mb-[2px]" />
          <div className="w-3/4 h-[1px] bg-gray-600 mb-1" />
          <div className="w-full h-[3px] bg-gray-300 mb-[2px]" />
          <div className="flex gap-1 mb-1">
            <div className="w-1/2 h-[1px] bg-gray-600" />
            <div className="w-1/2 h-[1px] bg-gray-600" />
          </div>
        </div>
      );
    case 'Minimal':
    default:
      return (
        <div className="w-[70px] h-[90px] bg-white border shadow-sm flex flex-col overflow-hidden mx-auto p-2">
          <div className="w-1/2 h-[3px] bg-gray-800 mb-1" />
          <div className="w-1/3 h-[1px] bg-gray-400 mb-2" />
          <div className="w-1/3 h-[2px] bg-gray-600 mb-1" />
          <div className="w-full h-[1px] bg-gray-300 mb-[2px]" />
          <div className="w-5/6 h-[1px] bg-gray-300" />
        </div>
      );
  }
};

export default function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Choose Template</h3>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View All</button>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={4}
        breakpoints={{
          320: { slidesPerView: 3 },
          480: { slidesPerView: 4 },
        }}
        className="w-full pb-2"
      >
        {TEMPLATES.map((template) => (
          <SwiperSlide key={template}>
            <div
              onClick={() => onSelect(template)}
              className={`
                cursor-pointer rounded-lg overflow-hidden transition-all duration-300
                flex flex-col items-center justify-center p-2 bg-background border
                ${selectedTemplate === template 
                  ? 'border-primary ring-2 ring-primary/20 shadow-sm' 
                  : 'border-border shadow-sm hover:border-primary/50'}
              `}
            >
              <div className="mb-3 transform transition-transform duration-300 group-hover:scale-105">
                {renderThumbnail(template)}
              </div>
              <div className={`mt-1 text-[10px] font-medium font-heading tracking-wide text-center px-1 transition-colors ${selectedTemplate === template ? 'text-primary' : 'text-muted-foreground'}`}>
                {template}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
