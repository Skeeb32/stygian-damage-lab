import {readFile,writeFile} from 'node:fs/promises';
const file=new URL('../dist/game-catalog.json',import.meta.url);
const endpoint='https://genshin-db-api.vercel.app/api/v5/characters?query=names&matchCategories=true&verboseCategories=true';
const hosts=new Set(['act-webstatic.hoyoverse.com','act-upload.hoyoverse.com','bbs.hoyolab.com','upload-static.hoyoverse.com','upload-os-bbs.mihoyo.com']);
const response=await fetch(endpoint,{signal:AbortSignal.timeout(20000)});
if(!response.ok)throw new Error(`Genshin-DB returned HTTP ${response.status}`);
const payload=await response.json();
if(!Array.isArray(payload)||payload.length<50)throw new Error('Refusing to overwrite catalog with an incomplete API response.');
const characters=payload.map(x=>{const candidate=x.images?.hoyowiki_icon||x.images?.mihoyo_icon||'',url=new URL(candidate||'https://invalid.local');return {id:Number(x.id),name:String(x.name||''),element:String(x.elementText||''),weaponType:String(x.weaponText||''),rarity:Number(x.rarity),image:url.protocol==='https:'&&hosts.has(url.hostname)?url.href:'',filename:String(x.images?.filename_icon||''),version:String(x.version||'')}}).filter(x=>x.id&&x.name&&['None','Anemo','Cryo','Dendro','Electro','Geo','Hydro','Pyro'].includes(x.element)&&['Sword','Claymore','Polearm','Bow','Catalyst'].includes(x.weaponType)&&[4,5].includes(x.rarity)).sort((a,b)=>a.name.localeCompare(b.name));
if(characters.length<50)throw new Error('The API response did not contain a usable character catalog.');
const catalog=JSON.parse(await readFile(file,'utf8'));
const version=characters.map(c=>c.version).filter(Boolean).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).at(-1)||'unknown';
catalog.characters=characters;catalog.meta={...(catalog.meta||{}),characterSource:'genshin-db-api',characterApiVersion:version,characterCatalogUpdatedAt:new Date().toISOString()};
await writeFile(file,JSON.stringify(catalog));
console.log(`Updated ${characters.length} playable character records from Genshin-DB API v${version}.`);

