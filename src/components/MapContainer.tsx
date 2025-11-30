import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Select from "ol/interaction/Select";
import Snap from "ol/interaction/Snap";
import { click } from "ol/events/condition";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import CircleStyle from "ol/style/Circle";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import MapToolbar from "./MapToolbar";
import useStore from "../state/store";
import { v4 as uuidv4 } from "uuid";
import * as turf from "@turf/turf";
import { WMS_URL } from "../utils/wms";
const STORAGE_KEY = "flowbit:aoi";
export default function MapContainer() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<Map | null>(null);
  const vectorSrc = useRef<VectorSource | null>(null);
  const selectInteraction = useRef<Select | null>(null);
  const snapInteraction = useRef<Snap | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { setSavedGeojson, setSelectedIds } = useStore() as any;
  const polygonStyle = new Style({
    stroke: new Stroke({ color: "#F3E3C9", width: 3 }),
    fill: new Fill({ color: "rgba(243,227,201,0.06)" }),
  });
  const selectedStyle = new Style({
    stroke: new Stroke({ color: "#D48C4C", width: 3 }),
    fill: new Fill({ color: "rgba(212,140,76,0.08)" }),
  });
  useEffect(() => {
    if (!mapRef.current) return;
    const baseOSM = new TileLayer({ source: new OSM() });
    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url: WMS_URL,
        params: { LAYERS: "nw_dop", FORMAT: "image/png" },
        crossOrigin: "anonymous",
      }),
    });
    const v = new VectorSource({ wrapX: false });
    vectorSrc.current = v;
    const vLayer = new VectorLayer({
      source: v,
      style: polygonStyle,
    });
    const map = new Map({
      target: mapRef.current,
      layers: [baseOSM, wmsLayer, vLayer],
      controls: [],
      view: new View({
        center: fromLonLat([7.1, 50.95]),
        zoom: 11,
      }),
    });
    mapObj.current = map;
    // @ts-ignore
    window.mapOL = map;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const feats = new GeoJSON().readFeatures(parsed);
        v.addFeatures(feats);
      }
    } catch (e) {}
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "search") {
        searchLocation(e.data.query);
      }
    };
    window.addEventListener("message", handler);
    enableSelectMode();
    return () => {
      window.removeEventListener("message", handler);
      map.setTarget(null);
    };
  }, []);
  const persist = () => {
    if (!vectorSrc.current) return;
    const geo = new GeoJSON().writeFeaturesObject(vectorSrc.current.getFeatures());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(geo));
    setSavedGeojson(geo);
  };
  const clearInteractions = () => {
    const map = mapObj.current;
    if (!map) return;
    map.getInteractions().getArray().slice().forEach((i:any)=> {
      const name = i.constructor.name;
      if (["Draw","Modify","Select","Snap"].includes(name)) map.removeInteraction(i);
    });
    selectInteraction.current = null;
    snapInteraction.current = null;
  };
  const enableSelectMode = () => {
    const map = mapObj.current;
    const v = vectorSrc.current;
    if (!map || !v) return;
    clearInteractions();
    const select = new Select({ condition: click, multi: true, style: selectedStyle });
    map.addInteraction(select);
    selectInteraction.current = select;
    const snap = new Snap({ source: v });
    map.addInteraction(snap);
    snapInteraction.current = snap;
    select.on("select", ()=> {
      const feats = select.getFeatures().getArray();
      const ids = feats.map((f:any)=>f.getId()).filter(Boolean);
      setSelectedIds(ids);
      if (ids.length>0) { setTooltipVisible(true); setTimeout(()=>setTooltipVisible(false),2000); }
    });
  };
  const enableModifyMode = () => {
    const map = mapObj.current;
    const v = vectorSrc.current;
    if (!map || !v) return;
    clearInteractions();
    const modify = new Modify({ source: v });
    map.addInteraction(modify);
    const snap = new Snap({ source: v });
    map.addInteraction(snap);
    snapInteraction.current = snap;
    modify.on("modifyend", persist);
  };
  const startDrawPolygon = () => {
    const map = mapObj.current;
    const v = vectorSrc.current;
    if (!map || !v) return;
    clearInteractions();
    const draw = new Draw({ source: v, type: "Polygon" });
    map.addInteraction(draw);
    const snap = new Snap({ source: v });
    map.addInteraction(snap);
    snapInteraction.current = snap;
    draw.on("drawend", (evt:any)=> {
      const feat: Feature<Geometry> = evt.feature;
      const id = uuidv4();
      feat.setId(id);
      feat.set("title", `Area ${id.slice(0,6)}`);
      persist();
      map.removeInteraction(draw);
      enableSelectMode();
    });
  };
  const startFreehand = () => {
    const map = mapObj.current;
    const v = vectorSrc.current;
    if (!map || !v) return;
    clearInteractions();
    const draw = new Draw({ source: v, type: "Polygon", freehand:true });
    map.addInteraction(draw);
    const snap = new Snap({ source: v });
    map.addInteraction(snap);
    snapInteraction.current = snap;
    draw.on("drawend", (evt:any)=> {
      const feat = evt.feature;
      feat.setId(uuidv4());
      persist();
      map.removeInteraction(draw);
      enableSelectMode();
    });
  };
  const eraseSelected = ()=> {
    const select = selectInteraction.current;
    if (!select || !vectorSrc.current) return;
    const feats = select.getFeatures().getArray().slice();
    feats.forEach((f:any)=> vectorSrc.current!.removeFeature(f));
    persist();
    select.getFeatures().clear();
  };
  const cutSelected = ()=> {
    const select = selectInteraction.current;
    if (!select || !vectorSrc.current || !mapObj.current) return;
    const selected = select.getFeatures().item(0);
    if (!selected) { alert('Select one polygon to cut'); return; }
    clearInteractions();
    const map = mapObj.current;
    const draw = new Draw({ source: vectorSrc.current, type: 'Polygon' });
    map.addInteraction(draw);
    draw.on('drawend', (e:any)=> {
      const cutterFeature = e.feature;
      const format = new GeoJSON();
      const selectedObj = format.writeFeatureObject(selected);
      const cutterObj = format.writeFeatureObject(cutterFeature);
      if (!selectedObj.geometry || !cutterObj.geometry) {
        alert('Invalid geometry'); map.removeInteraction(draw); enableSelectMode(); return;
      }
      try {
        const diff = turf.difference(selectedObj.geometry as any, cutterObj.geometry as any);
        if (!diff) { alert('Cut resulted in no geometry'); }
        else {
          vectorSrc.current!.removeFeature(selected);
          const newFeat = format.readFeature(diff);
          newFeat.setId(uuidv4());
          vectorSrc.current!.addFeature(newFeat);
          persist();
        }
      } catch(err){ console.error('Cut error', err); alert('Cut failed'); }
      map.removeInteraction(draw);
      enableSelectMode();
    });
  };
  const searchLocation = async (q:string)=> {
    if (!q || !mapObj.current) return;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
      const r = await fetch(url);
      const data = await r.json();
      if (!data || data.length===0) { alert('Not found'); return; }
      const {lon, lat} = data[0];
      const view = mapObj.current.getView();
      view.animate({ center: fromLonLat([Number(lon), Number(lat)]), zoom: 13, duration:700 });
      flashLocation(Number(lon), Number(lat));
    } catch(e){ console.error(e); }
  };
  const flashLocation = (lon:number, lat:number)=> {
    if (!vectorSrc.current) return;
    const pt = new Feature({ geometry: new Point(fromLonLat([lon, lat])) });
    pt.setStyle(new Style({ image: new CircleStyle({ radius:10, fill:new Fill({ color:'rgba(212,140,76,0.2)' }), stroke:new Stroke({ color:'#D48C4C', width:2 }) }) }));
    vectorSrc.current.addFeature(pt);
    setTimeout(()=> vectorSrc.current && vectorSrc.current.removeFeature(pt),1500);
  };
  const zoomIn = ()=> { const view = mapObj.current?.getView(); if (!view) return; view.animate({ zoom:(view.getZoom()??11)+1, duration:200 }); };
  const zoomOut = ()=> { const view = mapObj.current?.getView(); if (!view) return; view.animate({ zoom:(view.getZoom()??11)-1, duration:200 }); };
  return (
    <>
      <div ref={mapRef} id="map" className="w-full h-full" />
      <MapToolbar
        onDrawPolygon={startDrawPolygon}
        onDrawFreehand={startFreehand}
        onSelect={enableSelectMode}
        onModify={enableModifyMode}
        onCut={cutSelected}
        onErase={eraseSelected}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />
      {tooltipVisible && (
        <div className="absolute right-[160px] top-[40%] bg-black/75 text-white p-4 rounded-xl text-sm shadow-lg max-w-[240px]">
          Multiple areas can be selected even if they are not touching.
        </div>
      )}
    </>
  );
}
