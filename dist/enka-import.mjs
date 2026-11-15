const numberFrom = value => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (value && typeof value === 'object') return numberFrom(value.ival ?? value.val ?? value.value);
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export function validateUid(value) {
  const uid = String(value ?? '').trim();
  if (!/^\d{9}$/.test(uid)) throw new Error('Enter the 9-digit UID shown on your in-game profile.');
  return uid;
}

const artifactStats={FIGHT_PROP_HP:'hpFlat',FIGHT_PROP_ATTACK:'atkFlat',FIGHT_PROP_DEFENSE:'defFlat',FIGHT_PROP_HP_PERCENT:'hpPct',FIGHT_PROP_ATTACK_PERCENT:'atkPct',FIGHT_PROP_DEFENSE_PERCENT:'defPct',FIGHT_PROP_ELEMENT_MASTERY:'em',FIGHT_PROP_CRITICAL:'cr',FIGHT_PROP_CRITICAL_HURT:'cd',FIGHT_PROP_CHARGE_EFFICIENCY:'er',FIGHT_PROP_HEAL_ADD:'heal',FIGHT_PROP_PHYSICAL_ADD_HURT:'physicalDmg',FIGHT_PROP_FIRE_ADD_HURT:'pyroDmg',FIGHT_PROP_ICE_ADD_HURT:'cryoDmg',FIGHT_PROP_WATER_ADD_HURT:'hydroDmg',FIGHT_PROP_ELEC_ADD_HURT:'electroDmg',FIGHT_PROP_WIND_ADD_HURT:'anemoDmg',FIGHT_PROP_ROCK_ADD_HURT:'geoDmg',FIGHT_PROP_GRASS_ADD_HURT:'dendroDmg'};
const percentStats=new Set(['hpPct','atkPct','defPct','cr','cd','er','heal','physicalDmg','pyroDmg','cryoDmg','hydroDmg','electroDmg','anemoDmg','geoDmg','dendroDmg']);
const artifactSlots={EQUIP_BRACER:'Flower',EQUIP_NECKLACE:'Feather',EQUIP_SHOES:'Sands',EQUIP_RING:'Goblet',EQUIP_DRESS:'Circlet'};
function artifactStat(row){const id=row?.mainPropId||row?.appendPropId||row?.appendPropID||row?.propId||row?.propType;const stat=artifactStats[id]||'';let value=numberFrom(row?.statValue??row?.propValue??row?.value);if(value===null)return null;if(percentStats.has(stat)&&Math.abs(value)<=1.5)value*=100;return stat?{stat,value}:null}
export function normalizeEnkaShowcase(payload, catalog = {}) {
  if (!payload || typeof payload !== 'object' || !payload.playerInfo) throw new Error('Enka returned an incomplete player profile.');
  if (!Array.isArray(payload.avatarInfoList) || payload.avatarInfoList.length === 0) {
    return { uid: String(payload.uid || ''), fetchedAt: payload.fetchedAt || new Date().toISOString(), ttl: Number(payload.ttl) || 30, nickname: String(payload.playerInfo.nickname || ''), level: numberFrom(payload.playerInfo.level), characters: [], warnings: ['No public showcase characters were returned. Enka only provides showcase builds, not the full account inventory.'] };
  }
  const characters = new Map((catalog.characters || []).map(item => [Number(item.id), item]));
  const weapons = new Map((catalog.weapons || []).map(item => [Number(item.id), item]));
  const artifacts = new Map((catalog.artifacts || []).map(item => [Number(item.id), item]));
  const rows = payload.avatarInfoList.slice(0, 32).map(avatar => {
    const base = characters.get(Number(avatar.avatarId));
    const equipList = Array.isArray(avatar.equipList) ? avatar.equipList : [];
    const weaponEquip = equipList.find(item => item.weapon || item.flat?.weapon);
    const weaponId = Number(weaponEquip?.itemId ?? weaponEquip?.weapon?.itemId);
    const weaponBase = weapons.get(weaponId);
    const weaponDetails = weaponEquip?.weapon || {};
    const relics = equipList.filter(item => item.reliquary || item.flat?.reliquary).map(item => {
      const relic = item.reliquary || item.flat?.reliquary || {};
      const set = artifacts.get(Number(relic.setId));
      const flat=item.flat||{},main=artifactStat(flat.reliquaryMainstat||relic.reliquaryMainstat),subs=(flat.reliquarySubstats||relic.reliquarySubstats||[]).map(artifactStat).filter(Boolean).slice(0,4);
      return {
        setId: Number(relic.setId) || null,
        setName: set?.name || '',
        level: Math.max(0, Math.min(20, numberFrom(relic.level) ?? 0)),
        rarity: Math.max(1, Math.min(5, numberFrom(flat.rankLevel ?? item.rankLevel) ?? 5)),
        slot: artifactSlots[String(flat.equipType || item.equipType || '')] || String(flat.equipType || item.equipType || ''),
        mainStat:main,substats:subs,
      };
    });
    const level = numberFrom(avatar.propMap?.['4001']) || numberFrom(avatar.level) || 1;
    const talents = Object.values(avatar.skillLevelMap || {}).map(Number).filter(Number.isFinite);
    return {
      avatarId: Number(avatar.avatarId),
      name: base?.name || `Character ${avatar.avatarId}`,
      element: base?.element || 'Anemo',
      weaponType: base?.weaponType || '',
      level: Math.max(1, Math.min(90, level)),
      constellation: Math.max(0, Math.min(6, Array.isArray(avatar.talentIdList) ? avatar.talentIdList.length : 0)),
      talents,
      weapon: weaponBase ? { id: weaponBase.id, name: weaponBase.name.replace(/^"|"$/g, ''), level: Math.max(1, Math.min(90, numberFrom(weaponDetails.level) || 1)), refinement: Math.max(1, Math.min(5, Object.keys(weaponDetails.affixMap || {}).length ? Math.max(1, ...Object.values(weaponDetails.affixMap).map(v => Number(v) || 0)) : 1)) } : null,
      artifacts: relics,
      artifactSets: [...new Set(relics.map(x => x.setName).filter(Boolean))],
    };
  });
  return {
    uid: String(payload.uid || ''),
    fetchedAt: payload.fetchedAt || new Date().toISOString(),
    ttl: Math.max(1, Math.min(3600, Number(payload.ttl) || 30)),
    nickname: String(payload.playerInfo.nickname || ''),
    level: numberFrom(payload.playerInfo.level),
    worldLevel: numberFrom(payload.playerInfo.worldLevel),
    characters: rows,
    warnings: ['Only characters in the public Enka showcase are imported. Unshown characters and unequipped items are not available through this UID lookup.', 'Character, weapon, and artifact stats are imported when returned by Enka. Verify artifact values and manually configure weapon passives and other effects.'],
  };
}
