const OCR_SCRIPT='https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js';
const OCR_WORKER='https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/worker.min.js';
const OCR_CORE='https://cdn.jsdelivr.net/npm/tesseract.js-core@6.0.0';
const OCR_LANG='https://tessdata.projectnaptha.com/4.0.0';
let tesseractPromise;

export function normalizeOcrName(value){return String(value||'').normalize('NFKD').replace(/[’‘]/g,"'").toLowerCase().replace(/[^a-z0-9]/g,'')}

function metric(text,labels,percent=false){
  for(const line of String(text||'').split(/\n+/)){
    const clean=line.replace(/[|]/g,' ').replace(/\s+/g,' ').trim();
    if(!labels.some(label=>new RegExp(label,'i').test(clean)))continue;
    const values=[...clean.matchAll(/(-?\d[\d,]*(?:\.\d+)?)(\s*%?)/g)].map(m=>Number(m[1].replace(/,/g,''))).filter(Number.isFinite);
    if(values.length){const value=values.at(-1);return percent&&value<=1?value*100:value}
  }
  return null;
}

function catalogMatch(text,items){
  const normalized=normalizeOcrName(text);
  return [...items].sort((a,b)=>normalizeOcrName(b.name).length-normalizeOcrName(a.name).length).find(x=>normalized.includes(normalizeOcrName(x.name)))||null;
}

export function parseAkashaText(text,catalog={characters:[],weapons:[],artifacts:[]}){
  const source=String(text||''),chars=catalogMatch(source,catalog.characters||[]),weapon=catalogMatch(source,catalog.weapons||[]),set=catalogMatch(source,catalog.artifacts||[]);
  const levels=[...source.matchAll(/\bLv\.?\s*(\d{1,3})\s*\/\s*\d{1,3}/gi)];
  const refine=source.match(/\bR\s*([1-5])\b/i);
  const stat={
    hp:metric(source,['Max\\s*HP','HP\\s*(?=\\d)']),
    atk:metric(source,['ATK\\s*(?=\\d)']),
    def:metric(source,['DEF\\s*(?=\\d)']),
    em:metric(source,['Elemental\\s*Mastery','Mastery']),
    cr:metric(source,['Crit(?:ical)?\\s*Rate','CRIT\\s*Rate'],true),
    cd:metric(source,['Crit(?:ical)?\\s*DMG','CRIT\\s*DMG'],true),
    er:metric(source,['Energy\\s*Recharge','Recharge'],true),
    dmg:metric(source,['(?:Anemo|Cryo|Dendro|Electro|Geo|Hydro|Pyro)\\s*DMG(?:\\s*Bonus)?'],true)
  };
  return {character:chars?.name||'',element:chars?.element||'',weapon:weapon?.name||'',set:set?.name||'',level:Number(levels[0]?.[1])||90,weaponLevel:Number(levels[1]?.[1])||90,refine:Number(refine?.[1])||1,stats:stat,raw:source};
}

async function loadTesseract(){
  if(globalThis.Tesseract?.createWorker)return globalThis.Tesseract;
  if(!tesseractPromise)tesseractPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=OCR_SCRIPT;script.async=true;
    script.onload=()=>globalThis.Tesseract?.createWorker?resolve(globalThis.Tesseract):reject(new Error('OCR library did not initialize.'));
    script.onerror=()=>reject(new Error('Could not load the on-device OCR engine. Check your connection and try again.'));
    document.head.append(script);
  }).catch(error=>{tesseractPromise=null;throw error});
  return tesseractPromise;
}

function crop(file,rect){
  return createImageBitmap(file).then(bitmap=>{
    const sx=Math.round(bitmap.width*rect[0]),sy=Math.round(bitmap.height*rect[1]),sw=Math.round(bitmap.width*rect[2]),sh=Math.round(bitmap.height*rect[3]);
    const canvas=document.createElement('canvas'),scale= Math.min(2,2400/Math.max(sw,sh));canvas.width=Math.round(sw*scale);canvas.height=Math.round(sh*scale);
    const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(bitmap,sx,sy,sw,sh,0,0,canvas.width,canvas.height);bitmap.close();return canvas;
  });
}

export async function readAkashaPng(file,onProgress=()=>{}){
  if(!file||file.type!=='image/png')throw new Error('Choose an Akasha CV PNG screenshot.');
  if(file.size>18*1024*1024)throw new Error('PNG must be smaller than 18 MB.');
  const Tesseract=await loadTesseract();
  const worker=await Tesseract.createWorker('eng',1,{workerPath:OCR_WORKER,corePath:OCR_CORE,langPath:OCR_LANG,logger:m=>{if(m.status==='recognizing text')onProgress(Math.round((m.progress||0)*100))}});
  try{
    // Read the whole screenshot for names and equipment; read the dense stat area
    // again at a larger scale so the small Akasha labels are easier to recognize.
    const whole=await worker.recognize(file);onProgress(55);
    const statsCanvas=await crop(file,[.41,.17,.32,.45]);
    const stats=await worker.recognize(statsCanvas);onProgress(100);
    return `${stats.data.text}\n${whole.data.text}`;
  }finally{await worker.terminate()}
}
