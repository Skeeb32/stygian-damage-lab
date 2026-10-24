const MAX_BYTES=8*1024*1024,MAX_ROWS=5000;
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const text=value=>typeof value==='string'&&value.length>0;
const validInteger=(value,min,max)=>Number.isInteger(value)&&value>=min&&value<=max;

function validateRows(rows,kind,errors){
  if(rows===undefined)return [];
  if(!Array.isArray(rows)){errors.push(`${kind} must be an array.`);return []}
  if(rows.length>MAX_ROWS){errors.push(`${kind} exceeds the ${MAX_ROWS.toLocaleString()} item safety limit.`);return []}
  const valid=[];
  rows.forEach((item,index)=>{
    const at=`${kind}[${index+1}]`;
    if(!object(item)){errors.push(`${at} must be an object.`);return}
    if(kind==='characters'){
      if(!text(item.key)||!validInteger(item.level,1,90)||!validInteger(item.ascension,0,6)||!validInteger(item.constellation,0,6))errors.push(`${at} needs a character key, level 1–90, ascension 0–6, and constellation 0–6.`);
      else valid.push(item)
    }else if(kind==='weapons'){
      if(!text(item.key)||!validInteger(item.level,1,90)||!validInteger(item.ascension,0,6)||!validInteger(item.refinement,1,5)||item.location!==undefined&&typeof item.location!=='string')errors.push(`${at} has invalid key, level, ascension, refinement, or location fields.`);
      else valid.push(item)
    }else{
      const slots=['flower','plume','sands','goblet','circlet'];
      if(typeof item.setKey!=='string'||!slots.includes(item.slotKey)||!validInteger(item.rarity,1,5)||!validInteger(item.level,0,20)||!text(item.mainStatKey)||!Array.isArray(item.substats)||item.substats.length>4||item.substats.some(s=>!object(s)||s.key!==null&&!text(s.key)||!Number.isFinite(s.value)||s.value<0)||item.location!==undefined&&typeof item.location!=='string')errors.push(`${at} has invalid artifact set, slot, level, main stat, or substat fields.`);
      else valid.push(item)
    }
  });
  return valid
}

export function parseGoodJson(input){
  const raw=typeof input==='string'?input:JSON.stringify(input);
  if(!raw||new TextEncoder().encode(raw).byteLength>MAX_BYTES)throw Error('GOOD file is empty or larger than 8 MB.');
  let data;try{data=typeof input==='string'?JSON.parse(input):input}catch{throw Error('This file is not valid JSON.')}
  if(!object(data)||data.format!=='GOOD')throw Error('This is not a GOOD inventory file (expected format: "GOOD").');
  if(!validInteger(data.version,1,3))throw Error(`GOOD version ${String(data.version??'unknown')} is not supported. This importer supports versions 1–3.`);
  const errors=[],warnings=[];
  const characters=validateRows(data.characters,'characters',errors),weapons=validateRows(data.weapons,'weapons',errors),artifacts=validateRows(data.artifacts,'artifacts',errors);
  if(!data.characters)warnings.push('Character roster section is absent; this file cannot confirm which characters you own.');
  if(!data.weapons)warnings.push('Weapon inventory section is absent; weapon inventory may be incomplete.');
  if(!data.artifacts)warnings.push('Artifact inventory section is absent; artifact inventory may be incomplete.');
  if(data.artifacts?.some(x=>x&&x.setKey===''))warnings.push('Some artifact set keys are blank; those records are preserved but cannot be matched to a named set yet.');
  if(!characters.length&&!weapons.length&&!artifacts.length)errors.push('No character, weapon, or artifact records were found.');
  if(errors.length)throw Error(errors.slice(0,4).join(' ')+(errors.length>4?` And ${errors.length-4} more validation issue(s).`:''));
  return {format:'GOOD',version:data.version,source:text(data.source)?data.source:'Unknown source',characters,weapons,artifacts,warnings,raw:data};
}

export function goodSummary(profile){return {characters:profile.characters?.length||0,weapons:profile.weapons?.length||0,artifacts:profile.artifacts?.length||0}}
