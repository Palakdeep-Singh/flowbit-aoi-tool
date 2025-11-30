import React, { useState } from 'react';
export default function AOIPanel(){
  const [query,setQuery]=useState('');
  return (
    <aside className="w-[340px] bg-panelBg h-full border-r border-[#E5DFD6] px-[16px] pt-[49px] pb-4 overflow-y-auto">
      <div className="w-full h-[50px] rounded-sm mb-4 flex items-center px-3" style={{background:'var(--header-bg)'}}>
        <button className="text-[var(--text-secondary)] text-xl mr-2">◀</button>
        <h2 className="text-[var(--primary)] text-[17px] font-medium">Define Area of Interest</h2>
      </div>
      <div className="px-1">
        <h3 className="text-[20px] font-bold leading-tight text-[var(--text-primary)] mb-2">
          Define the area(s) where you will apply your object count & detection model
        </h3>
        <p className="text-[16px] text-[var(--text-secondary)] mb-4">Options:</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 h-[52px] bg-white border border-[var(--search-border)] rounded-xl px-4">
            <div className="w-[32px] h-[32px] rounded-md flex items-center justify-center" style={{background:'var(--icon-bg)'}}>🔍</div>
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search for a city, town…" className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[#A7A7A7]" />
          </div>
          <button onClick={()=>window.postMessage({type:'search', query}, '*')} className="bg-[#D48C4C] text-white text-sm py-3 rounded-lg shadow-soft w-full">Search</button>
          <p className="text-sm text-[#7A7A7A] pl-1">or draw area on map</p>
        </div>
        <div className="mt-6">
          <button className="w-full bg-beigeBtn border rounded-card py-3 px-4 shadow-sm flex items-center gap-3 text-left" style={{borderColor:'#E2D6C8'}}>
            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{background:'var(--icon-bg)'}}>📁</div>
            <div>
              <div className="text-[15px] text-[#5B4F45] font-medium">Uploading a shape file</div>
              <div className="text-xs text-[var(--text-secondary)]">Supported: GeoJSON, Shapefile (zip)</div>
            </div>
          </button>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2 text-[var(--text-primary)]">Saved AOIs</h4>
          <pre className="text-xs max-h-40 overflow-auto bg-gray-50 p-2 rounded-md border border-gray-200">No saved AOIs</pre>
        </div>
      </div>
    </aside>
  );
}
