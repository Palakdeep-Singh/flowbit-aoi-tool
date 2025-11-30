import create from 'zustand';
type State = {
  wmsVisible: boolean;
  savedGeojson: any | null;
  selectedIds: string[];
  setWmsVisible: (v: boolean)=>void;
  setSavedGeojson: (g:any|null)=>void;
  setSelectedIds: (ids:string[])=>void;
};
const useStore = create<State>((set)=>({
  wmsVisible:true,
  savedGeojson:null,
  selectedIds:[],
  setWmsVisible:(v)=>set({wmsVisible:v}),
  setSavedGeojson:(g)=>set({savedGeojson:g}),
  setSelectedIds:(ids)=>set({selectedIds:ids})
}));
export default useStore;
