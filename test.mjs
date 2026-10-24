import assert from 'node:assert/strict';
import {resistance,stats,hit,calc} from './dist/engine.mjs';
import {defaults} from './dist/data.mjs';
import {readFileSync} from 'node:fs';
import {statAt,formatSpecialized,isAscensionBoundary} from './dist/game-stats.mjs';
import {parseAkashaText} from './dist/akasha.mjs';
import {elementIconUrl} from './dist/element-icons.mjs';
const bossData=JSON.parse(readFileSync(new URL('./dist/stygian-bosses.json',import.meta.url),'utf8'));assert.deepEqual(bossData.bosses.map(b=>[b.hp['105'],b.hp['110']]),[[13581631,32436188],[7606009,14916723],[10335048,21871500]]);assert.deepEqual(bossData.bosses.map(b=>b.traits.map(t=>t.name)),[['Big-Mouthed Jack Frost','Creative Frenzy'],['Preemptive Sweeper Mode','Forced Counterstrike Mode','Damage-Resistant Structure'],['Ice Coffin: Twinned Crystal Lattice','Ice Coffin: Warped Crystal Lattice']]);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const elements=['Anemo','Cryo','Dendro','Electro','Geo','Hydro','Pyro'];for(const element of elements){const icon=elementIconUrl(element);assert.equal(icon,`./assets/element-${element.toLowerCase()}.svg`);assert.match(readFileSync(new URL(`./dist/${icon.slice(2)}`,import.meta.url),'utf8'),/<svg/)}assert.equal(elementIconUrl('None'),null);

const akasha=parseAkashaText(`Sandrone\nLv. 90/90\nWolf's Gravestone\nR1 Lv. 90/90\nMax HP 19,895\nATK 3,084\nDEF 799\nElemental Mastery 207\nCrit Rate 65.0%\nCrit DMG 172.0%\nEnergy Recharge 140.8%\nCryo DMG Bonus 46.6%\nDisenchantment in Deep Shadow x4`,{characters:[{name:'Sandrone',element:'Cryo'}],weapons:[{name:"Wolf's Gravestone"}],artifacts:[{name:'Disenchantment in Deep Shadow'}]});assert.equal(akasha.character,'Sandrone');assert.equal(akasha.weapon,"Wolf's Gravestone");assert.equal(akasha.set,'Disenchantment in Deep Shadow');assert.equal(akasha.weaponLevel,90);assert.deepEqual(akasha.stats,{hp:19895,atk:3084,def:799,em:207,cr:65,cd:172,er:140.8,dmg:46.6});
const record={stats:{'20':{attack:1},'20+':{attack:2}}};assert.equal(statAt(record,20,false).attack,1);assert.equal(statAt(record,20,true).attack,2);assert.equal(formatSpecialized('FIGHT_PROP_CRITICAL',0.048).value,4.8);assert.ok(isAscensionBoundary(80));close(resistance(-20),1.1);close(resistance(10),.9);close(resistance(75),.25);close(resistance(100),.2);
const t=defaults().teams[2],c=t.chars[0]; c.artifacts.forEach(a=>[a.main,...a.subs].forEach(x=>x.value=0));Object.assign(c,{baseAtk:400,weaponAtk:600,weaponValue:0,atkPct:0,atkFlat:0,cr:50,cd:100,em:0,dmg:0,level:90});t.enemyLevel=90;t.res=10;t.buffs=[];const a={mode:'normal',scaling:'atk',mult:200,hits:2,flat:0,bonus:0,reactionBonus:0};let r=hit(c,t,0,a);close(r.normal,900);close(r.crit,1800);close(r.avg,1350);close(r.total,2700);close(hit(c,t,0,{...a,mode:'melt'}).avg,2700);
c.cr=200;close(hit(c,t,0,a).avg,1800);c.cr=50;delete c.crExtra;delete c.cdExtra;assert.ok(Number.isFinite(hit(c,t,0,a).avg));
r=hit(c,t,0,{...a,mode:'ssw'});close(r.avg,2700);t.resByElement={Pyro:-20,Cryo:10};close(hit(c,t,0,a).res,1.1);close(hit({...c,element:'Cryo'},t,0,a).res,.9);t.resByElement=null;c.dmg=100;close(hit(c,t,0,{...a,mode:'ssw'}).avg,2700);t.enemyLevel=200;close(hit(c,t,0,{...a,mode:'ssw'}).avg,2700);
c.em=1000;close(hit(c,t,0,{...a,mode:'ssw'}).avg,8100);t.stacks=12;close(hit(c,t,0,{...a,mode:'ssc'}).avg,16200);
const b=hit(c,t,0,{...a,mode:'swirl'});close(b.avg,b.crit);close(b.avg,b.normal);
const s=defaults();for(const team of s.teams){const r=calc(team);assert.ok(Number.isFinite(r.total)&&r.total>0);assert.ok(r.time>0)}
const imported={...s.teams[0].chars[0],akashaTotals:{atk:3084,hp:19895,def:799,em:207,cr:65,cd:172,er:140.8}};assert.deepEqual(stats(imported),{atk:3084,hp:19895,def:799,em:207,cr:65,cd:172,er:140.8,dmg:0});
console.log('PASS: Stygian boss trait table and Fearless/Dire HP; level/ascension stat selection; elemental boss resistance; standard, amplifying and Stellar formulas; Akasha screenshot OCR parsing and total-stat overrides; legacy CRIT safety; DEF and DMG exclusions; rotation totals.');
