import React from 'react';
import Topbar from '../components/Topbar';
import LeftNav from '../components/LeftNav';
import AOIPanel from '../components/AOIPanel';
import MapContainer from '../components/MapContainer';

export default function Home(){
  return (
    <div className="min-h-screen bg-panelBg flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <LeftNav />
        <AOIPanel />
        <main className="flex-1 map-root relative">
          <MapContainer />
        </main>
      </div>
    </div>
  );
}
