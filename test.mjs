import assert from 'node:assert/strict';
import {resistance,stats,hit,calc} from './dist/engine.mjs';
import {defaults} from './dist/data.mjs';
import {readFileSync} from 'node:fs';
import {statAt,formatSpecialized,isAscensionBoundary} from './dist/game-stats.mjs';
const bossData=JSON.parse(readFileSync(new URL('./dist/stygian-bosses.json',import.meta.url),'utf8'));assert.deepEqual(bossData.bosses.map(b=>[b.hp['105'],b.hp['110']]),[[13828562,32733500],[7606010,14743274],[10335042,21871487]]);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const record={stats:{'20':{attack:1},'20+':{attack:2}}};assert.equal(statAt(record,20,false).attack,1);assert.equal(statAt(record,20,true).attack,2);assert.equal(formatSpecialized('FIGHT_PROP_CRITICAL',0.048).value,4.8);assert.ok(isAscensionBoundary(80));close(resistance(-20),1.1);close(resistance(10),.9);close(resistance(75),.25);close(resistance(100),.2);
const t=defaults().teams[2],c=t.chars[0]; c.artifacts.forEach(a=>[a.main,...a.subs].forEach(x=>x.value=0));Object.assign(c,{baseAtk:400,weaponAtk:600,weaponValue:0,atkPct:0,atkFlat:0,cr:50,cd:100,em:0,dmg:0,level:90});t.enemyLevel=90;t.res=10;t.buffs=[];const a={mode:'normal',scaling:'atk',mult:200,hits:2,flat:0,bonus:0,reactionBonus:0};let r=hit(c,t,0,a);close(r.normal,900);close(r.crit,1800);close(r.avg,1350);close(r.total,2700);close(hit(c,t,0,{...a,mode:'melt'}).avg,2700);
c.cr=200;close(hit(c,t,0,a).avg,1800);c.cr=50;delete c.crExtra;delete c.cdExtra;assert.ok(Number.isFinite(hit(c,t,0,a).avg));
r=hit(c,t,0,{...a,mode:'ssw'});close(r.avg,2700);t.resByElement={Pyro:-20,Cryo:10};close(hit(c,t,0,a).res,1.1);close(hit({...c,element:'Cryo'},t,0,a).res,.9);t.resByElement=null;c.dmg=100;close(hit(c,t,0,{...a,mode:'ssw'}).avg,2700);t.enemyLevel=200;close(hit(c,t,0,{...a,mode:'ssw'}).avg,2700);
c.em=1000;close(hit(c,t,0,{...a,mode:'ssw'}).avg,8100);t.stacks=12;close(hit(c,t,0,{...a,mode:'ssc'}).avg,16200);
const b=hit(c,t,0,{...a,mode:'swirl'});close(b.avg,b.crit);close(b.avg,b.normal);
const s=defaults();for(const team of s.teams){const r=calc(team);assert.ok(Number.isFinite(r.total)&&r.total>0);assert.ok(r.time>0)}
console.log('PASS: Fearless/Dire boss HP table; level/ascension stat selection; elemental boss resistance; standard, amplifying and Stellar formulas; legacy CRIT safety; DEF and DMG exclusions; rotation totals.');
