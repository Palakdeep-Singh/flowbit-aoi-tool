import React from 'react';
type Props = {
  onDrawPolygon: ()=>void;
  onDrawFreehand: ()=>void;
  onSelect: ()=>void;
  onModify: ()=>void;
  onCut: ()=>void;
  onErase: ()=>void;
  onZoomIn: ()=>void;
  onZoomOut: ()=>void;
};
const IconWrapper = ({children, title}:{children:React.ReactNode; title?:string})=>(
  <div className="tool-btn" title={title}>{children}</div>
);
const SvgPolygon = ()=> (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 10.5 L7 5 L17 4 L21 10 L14 20 L6 18 Z" stroke="#D48C4C" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const SvgFreehand = ()=> (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 16c2-3 6-6 9-4s6 6 9 2" stroke="#D48C4C" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const SvgCut = ()=> (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 7 L21 7 M3 17 L21 17 M12 3 L12 21" stroke="#D48C4C" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const SvgSelect = ()=> (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#D48C4C" strokeWidth="1.6" fill="none"/></svg>);
const SvgModify = ()=> (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 21l6-6 11-11 4 4-11 11z" stroke="#D48C4C" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const SvgErase = ()=> (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6 L21 6 L13 18 L3 18 Z" stroke="#D48C4C" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const SvgPlus = ()=> (<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#D48C4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>);
const SvgMinus = ()=> (<svg width="18" height="18" viewBox="0 0 24 24"><path d="M5 12h14" stroke="#D48C4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>);
export default function MapToolbar(props:Props){ const {onDrawPolygon,onDrawFreehand,onSelect,onModify,onCut,onErase,onZoomIn,onZoomOut}=props;
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/40 flex flex-col gap-3 items-center w-[64px]">
        <IconWrapper title="Draw polygon"><button onClick={onDrawPolygon}><SvgPolygon /></button></IconWrapper>
        <IconWrapper title="Freehand draw"><button onClick={onDrawFreehand}><SvgFreehand /></button></IconWrapper>
        <IconWrapper title="Cut polygon"><button onClick={onCut}><SvgCut /></button></IconWrapper>
        <div style={{width:'100%',height:8}} />
        <IconWrapper title="Select"><button onClick={onSelect}><SvgSelect /></button></IconWrapper>
        <IconWrapper title="Edit vertices"><button onClick={onModify}><SvgModify /></button></IconWrapper>
        <IconWrapper title="Delete selected"><button onClick={onErase}><SvgErase /></button></IconWrapper>
        <div style={{width:'100%',height:8}} />
        <IconWrapper title="Zoom in"><button onClick={onZoomIn}><SvgPlus /></button></IconWrapper>
        <IconWrapper title="Zoom out"><button onClick={onZoomOut}><SvgMinus /></button></IconWrapper>
      </div>
    </div>
  );
}
