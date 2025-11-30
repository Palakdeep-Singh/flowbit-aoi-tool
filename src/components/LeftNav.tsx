import React from 'react';
const NavIcon = ({children, size=28}:{children:React.ReactNode; size?:number}) => (
  <div style={{width:size,height:size}} className="flex items-center justify-center rounded-lg backdrop-blur-md">
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.18)',borderRadius:8,border:'1px solid rgba(255,255,255,0.2)'}}>
      {children}
    </div>
  </div>
);
export default function LeftNav(){
  return (
    <aside className="w-[58px] h-screen flex flex-col items-center pt-6 pb-6 gap-6 backdrop-blur-lg bg-[rgba(0,0,0,0.18)] relative border-r border-[rgba(255,255,255,0.08)]">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--primary)]"></div>
      <NavIcon size={40}>▲</NavIcon>
      <NavIcon>🏠</NavIcon>
      <NavIcon>🗂️</NavIcon>
      <div className="flex-1"></div>
      <NavIcon>⚙️</NavIcon>
      <NavIcon>👤</NavIcon>
    </aside>
  );
}
