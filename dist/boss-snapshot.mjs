export function reconcileBossSnapshot(state,bundled){
 const override=state.bossDataOverride;
 if(override&&override.version!==bundled.version){
  state.bossDataArchive??=[];
  if(!state.bossDataArchive.some(x=>JSON.stringify(x)===JSON.stringify(override)))state.bossDataArchive.push(override);
  delete state.bossDataOverride;
  return true;
 }
 return false;
}
