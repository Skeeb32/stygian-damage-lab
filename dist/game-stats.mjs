const API='https://genshin-db-api.vercel.app/api/v5/stats';
const CACHE_KEY='stygian-game-stat-cache-v1';
const CACHE_TTL=12*60*60*1000;
const LEVEL_BREAKS=[20,40,50,60,70,80];
const aliases={Mizuki:'Yumemizuki Mizuki','Cryo Traveler':'Aether'};
const statTypes={
  FIGHT_PROP_ATTACK:'atkFlat',FIGHT_PROP_HP:'hpFlat',FIGHT_PROP_DEFENSE:'defFlat',FIGHT_PROP_ATTACK_PERCENT:'atkPct',FIGHT_PROP_HP_PERCENT:'hpPct',FIGHT_PROP_DEFENSE_PERCENT:'defPct',
  FIGHT_PROP_ELEMENT_MASTERY:'em',FIGHT_PROP_CRITICAL:'cr',FIGHT_PROP_CRITICAL_HURT:'cd',
  FIGHT_PROP_CHARGE_EFFICIENCY:'er',FIGHT_PROP_PHYSICAL_ADD_HURT:'physicalDmg',
  FIGHT_PROP_FIRE_ADD_HURT:'pyroDmg',FIGHT_PROP_ICE_ADD_HURT:'cryoDmg',FIGHT_PROP_WATER_ADD_HURT:'hydroDmg',
  FIGHT_PROP_ELEC_ADD_HURT:'electroDmg',FIGHT_PROP_WIND_ADD_HURT:'anemoDmg',FIGHT_PROP_ROCK_ADD_HURT:'geoDmg',
  FIGHT_PROP_GRASS_ADD_HURT:'dendroDmg',FIGHT_PROP_HEAL_ADD:'heal'
};
const percentStats=new Set(['atkPct','hpPct','defPct','cr','cd','er','physicalDmg','pyroDmg','cryoDmg','hydroDmg','electroDmg','anemoDmg','geoDmg','dendroDmg','heal']);
function readCache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch{return {}}}
function writeCache(cache){try{localStorage.setItem(CACHE_KEY,JSON.stringify(cache))}catch{}}
export function isAscensionBoundary(level){return LEVEL_BREAKS.includes(Number(level))}
export function normalizeStatType(type){return statTypes[type]||''}
export function formatSpecialized(type,value){const stat=normalizeStatType(type),n=Number(value)||0;return {stat,value:percentStats.has(stat)?n*100:n}}
export function statAt(record,level,ascended=false){if(!record?.stats)return null;const key=ascended&&record.stats[`${level}+`]?`${level}+`:String(level);return record.stats[key]||record.stats[String(level)]||null}
export async function getGameStatRecord(folder,name,{refresh=false}={}){
  const query=(aliases[name]||name).replace(/[’‘]/g,"'"),key=`${folder}:${query.toLowerCase()}`;const cache=readCache(),saved=cache[key];
  if(!refresh&&saved?.at&&Date.now()-saved.at<CACHE_TTL)return saved.data;
  const url=`${API}?folder=${encodeURIComponent(folder)}&query=${encodeURIComponent(query)}&dumpResult=true`;
  const response=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error(`Genshin-DB returned HTTP ${response.status}`);
  const payload=await response.json();if(!payload?.result?.name||!payload?.stats||!payload?.stats['90'])throw Error('No level-by-level stats are available for this item.');
  const data={name:payload.result.name,filename:payload.filename,result:payload.result,stats:payload.stats};cache[key]={at:Date.now(),data};writeCache(cache);return data
}
