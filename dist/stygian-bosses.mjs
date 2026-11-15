export default {
  "version": "7.2",
  "start": "2026-11-11",
  "end": "2026-12-23",
  "verified": "2026-11-14",
  "source": "https://www.stygian.moe/",
  "status": "Roster, HP, artwork, resistance tables, and mechanical guide text refreshed from Stygian.moe; encounter guide recommendations remain curated.",
  "sourceType": "Automatically refreshed from Stygian.moe HTML. The source documents no public boss API. Current roster, level 105/110 HP, artwork, published resistance tables, and mechanical-guide bullets are synced; traits and team recommendations remain curated when available.",
  "rules": [
    "Current season: Version 7.2, 2026-11-11 to 2026-12-23 (Stygian.moe).",
    "This calculator models the listed Fearless V (Lv 105) and Dire VI (Lv 110) HP values.",
    "Team guides are suggestions, not rankings; account builds, rotations, and challenge rules change results.",
    "A verified reward table is not included in the available source data."
  ],
  "bosses": [
    {
      "id": "stormfang",
      "name": "Wavebinder: Stormfang",
      "hp": {
        "105": 15310194,
        "110": 33517377
      },
      "phases": [
        {
          "name": "Regular",
          "res": null,
          "resByElement": {
            "Pyro": 10,
            "Hydro": 70,
            "Electro": -10,
            "Cryo": 10,
            "Dendro": 10,
            "Anemo": 10,
            "Geo": 10
          },
          "description": "Regular RES"
        },
        {
          "name": "Shielded RES",
          "res": null,
          "resByElement": {
            "Pyro": 70,
            "Hydro": 130,
            "Electro": 10,
            "Cryo": 70,
            "Dendro": 70,
            "Anemo": 70,
            "Geo": 70
          },
          "description": "Shielded RES"
        }
      ],
      "note": "Electro is the key answer to Courage and Valiant Assault. Hydro is heavily resisted throughout.",
      "mechanics": [
        "• Approximately 10s after combat begins, and every 20s thereafter, the boss takes a drink that lasts 3s and generates 600 Courage .",
        "• If affected by Stellar Glimmer during this action, the boss instead gains 540 Courage , and its next drink has a 50% chance to be replaced by a small sip that generates only 189 Courage .",
        "• Outside the drinking animation, dealing Electro DMG reduces Courage by 1.5 x Elemental Gauge Units , with a minimum reduction of 0.6. Direct Electro Stellar Glimmer DMG reduces Courage by 6 instead.",
        "• When Courage reaches its maximum of 600 , gains a shield equal to 100% of its Max HP . During this state, the boss consumes 15 Courage per second and its resistances become Electro RES 10 , Hydro RES 130% , All other RES: 70% . While in this state, Electro DMG and Electro DMG counted as Stellar Glimmer reaction DMG reduce Courage with 8x efficiency .",
        "• When Courage reaches 0 or the shield is destroyed , the boss exits Valiant State. If the shield is destroyed, Courage is also reset to 0. Upon exiting, the boss takes backlash DMG equal to 150% of the Stellar Glimmer reaction DMG and 60% of all other DMG absorbed by its shield, capped at 15% of its Max HP . All resistances return to their normal values, and the boss resumes its drinking cycle.",
        "• If the boss exits Valiant State: Assault within 18s without being affected by Radiance: Stellar Glimmer, its next big drink occurs after 23s ."
      ],
      "image": "https://bosses-cdn.stygianonslaught.com/Wavebinder_Stormfang.webp",
      "source": "https://www.stygian.moe/boss/shark",
      "traits": [
        {
          "name": "Courage Against the Cold: Hearty Draught",
          "description": "The boss periodically drinks to gain Courage. Applying Radiance: Stellar Glimmer while it drinks reduces the Courage gained. Electro damage also drains Courage; Electro Stellar Glimmer drains more."
        },
        {
          "name": "Valiant Assault",
          "description": "At full Courage the boss gains a large shield and sharply raises resistance to all elements except Electro. Courage drains over time and Electro drains it faster. Leaving the state causes backlash damage."
        }
      ],
      "guide": {
        "elements": [
          "Electro"
        ],
        "overview": "Use repeated Electro application to drain Courage. Hydro RES is 70% normally and 130% during Valiant Assault; Electro remains the least resisted option.",
        "strategy": [
          "Keep an Electro damage source active between drinks to drain Courage.",
          "If your roster can trigger Stellar Glimmer, time it with the drink animation.",
          "Select Valiant Assault only when modeling that window; regular resistances do not apply.",
          "The calculator does not simulate Courage, shield durability, or backlash."
        ],
        "mistakes": [
          "Using Hydro as the primary damage into 70–130% Hydro RES.",
          "Ignoring Courage and assuming the boss stays in its regular phase.",
          "Treating the full-HP shield as ordinary boss HP."
        ],
        "higherDifficulty": "Dire has 33,517,377 HP. Preserve energy for a high-uptime Electro window; the shield mechanic is not simulated.",
        "teams": [
          {
            "tier": "recommended",
            "name": "Electro driver + off-field damage",
            "characters": [
              {
                "name": "Clorinde",
                "role": "On-field Electro DPS"
              },
              {
                "name": "Fischl",
                "role": "Off-field Electro application"
              },
              {
                "name": "Sucrose",
                "role": "Swirl and resistance shred"
              },
              {
                "name": "Yaoyao",
                "role": "Healing and Dendro application"
              }
            ],
            "reaction": "Prioritize encounter mechanic uptime; reaction value depends on account builds.",
            "why": "Repeated Electro from Clorinde and Fischl drains Courage; sustain supports longer Dire fights. Hydro is not the main damage element.",
            "rotation": [
              "Fischl Skill",
              "Sucrose Skill/Burst after Electro Swirl",
              "Yaoyao Skill",
              "Clorinde Skill and attacks; use Burst in damage windows."
            ],
            "replacements": "Keqing or Razor for Clorinde; Kuki Shinobu or Lisa for Fischl; Jean for Yaoyao.",
            "equipment": "Standard Aggravate builds; prioritize enough ER on support bursts and maintain Electro uptime.",
            "confidence": "Mechanic-based theorycraft starting point, not a verified clear ranking."
          },
          {
            "tier": "premium",
            "name": "Premium Electro carry",
            "characters": [
              {
                "name": "Raiden Shogun",
                "role": "Electro DPS and battery"
              },
              {
                "name": "Yae Miko",
                "role": "Off-field Electro"
              },
              {
                "name": "Kazuha",
                "role": "Damage bonus and resistance shred"
              },
              {
                "name": "Jean",
                "role": "Team healing"
              }
            ],
            "reaction": "Prioritize encounter mechanic uptime; reaction value depends on account builds.",
            "why": "Multiple Electro sources maintain Courage drain; Kazuha can shred Electro RES after Swirl.",
            "rotation": [
              "Raiden Skill",
              "Yae Skill ×3",
              "Kazuha Swirl Electro",
              "Jean Burst as needed",
              "Yae Burst then Raiden Burst in the opening."
            ],
            "replacements": "Yae → Fischl; Kazuha → Sucrose; Jean → another healer.",
            "equipment": "Build for Electro damage and burst uptime. Do not infer guaranteed clear time from the lineup.",
            "confidence": "Mechanic-based theorycraft starting point, not a verified clear ranking."
          },
          {
            "tier": "accessible",
            "name": "Accessible Electro application",
            "characters": [
              {
                "name": "Lisa",
                "role": "On-field Electro"
              },
              {
                "name": "Fischl",
                "role": "Off-field Electro application"
              },
              {
                "name": "Dendro Traveler",
                "role": "Aggravate support"
              },
              {
                "name": "Barbara",
                "role": "Healing"
              }
            ],
            "reaction": "Prioritize encounter mechanic uptime; reaction value depends on account builds.",
            "why": "An accessible Electro core can drain Courage; Barbara is sustain, not the primary damage source because Hydro is resisted.",
            "rotation": [
              "Fischl Skill",
              "Dendro Traveler Skill/Burst",
              "Barbara heal when needed",
              "Lisa Skill/Burst and attacks."
            ],
            "replacements": "Lisa can be another Electro driver; Collei can replace Dendro Traveler; Barbara can be any healer.",
            "equipment": "Favor ER on burst-dependent supports; keep Fischl active.",
            "confidence": "Mechanic-based theorycraft starting point, not a verified clear ranking."
          }
        ]
      }
    },
    {
      "id": "emperor",
      "name": "Emperor of Fire and Iron: Ordained Conquest",
      "hp": {
        "105": 8552749,
        "110": 14042886
      },
      "phases": [
        {
          "name": "Regular",
          "res": null,
          "resByElement": {
            "Pyro": 60,
            "Hydro": 10,
            "Electro": 10,
            "Cryo": 10,
            "Dendro": 10,
            "Anemo": 10,
            "Geo": 10
          },
          "description": "Regular RES"
        },
        {
          "name": "Molten Crown · Pyro horns active",
          "res": null,
          "resByElement": {},
          "description": "The source confirms a 150% all-RES increase while horns are active, but does not state final RES values; this window preserves manual RES."
        }
      ],
      "note": "Pyro is resisted at 60%. Hydro is useful against the Pyro horns and Sternshield Crabs. Exact horn-phase RES is not modeled because final values are unspecified.",
      "mechanics": [
        "• Has 64U Pyro horns that increase all RES by 150%. Will lose 10% HP when horns are destroyed.",
        "• Will summon Sternshield Crabs that have 12U Pyro. When their Pyro is depleted, will lose control and hit the Boss, making it lose 12U Pyro.",
        "• When the Boss is hit, it will also lose HP based on the DMG the Sternshield Crab took, equal to 60% Hydro DMG taken + 10% other DMG taken, not exceeding 15% Boss HP."
      ],
      "image": "https://bosses-cdn.stygianonslaught.com/pyro_crab.png",
      "source": "https://www.stygian.moe/boss/emperor-of-fire-and-iron",
      "traits": [
        {
          "name": "Molten Crown",
          "description": "The Pyro horns boost the boss’s resistances. Destroy them when low enough to reach; destroying them deals a large hit and interrupts Radiant Coronation."
        },
        {
          "name": "Shield Bearers",
          "description": "Sternshield Crabs channel Pyro into the horns. Depleting a crab’s Pyro makes it collide with the boss and damage the horns; damage to crabs also contributes capped boss backlash."
        },
        {
          "name": "Radiant Coronation",
          "description": "The boss charges a wide attack. Destroying its horns interrupts the charge."
        }
      ],
      "guide": {
        "elements": [
          "Hydro"
        ],
        "overview": "The Emperor has 60% Pyro RES outside its horn phase. Hydro application pressures Pyro gauges on horns and crabs; crab damage contributes to capped boss backlash.",
        "strategy": [
          "Avoid Pyro as your only damage element.",
          "Apply Hydro to horns and Sternshield Crabs; depleted crabs collide with the boss and weaken its horns.",
          "Use the horn break to interrupt Radiant Coronation.",
          "The active horn phase preserves manual RES because the source does not publish final numbers."
        ],
        "mistakes": [
          "Assuming an exact horn-phase RES value.",
          "Using only Pyro damage into 60% Pyro RES.",
          "Ignoring the Pyro gauges and scripted backlash."
        ],
        "higherDifficulty": "Dire HP is 14,042,886. Plan Hydro application around horns and crabs; the calculator excludes scripted horn/crab damage.",
        "teams": [
          {
            "tier": "recommended",
            "name": "Hydro damage with flexible reaction core",
            "characters": [
              {
                "name": "Neuvillette",
                "role": "On-field Hydro DPS"
              },
              {
                "name": "Fischl",
                "role": "Off-field damage and Electro"
              },
              {
                "name": "Kazuha",
                "role": "Hydro shred and grouping"
              },
              {
                "name": "Baizhu",
                "role": "Healing and interruption resistance"
              }
            ],
            "reaction": "Prioritize encounter mechanic uptime; reaction value depends on account builds.",
            "why": "Hydro avoids the 60% Pyro RES and pressures the Pyro gauges.",
            "rotation": [
              "Fischl Skill",
              "Kazuha Swirl Hydro",
              "Baizhu Skill/Burst",
              "Neuvillette charged attacks."
            ],
            "replacements": "Neuvillette → another Hydro driver; Kazuha → Sucrose; Baizhu → healer.",
            "equipment": "Hydro damage and support ER; horn gauge depletion is not modeled.",
            "confidence": "Mechanic-based theorycraft starting point, not a verified clear ranking."
          },
          {
            "tier": "premium",
            "name": "Double Hydro with non-Pyro carry",
            "characters": [
              {
                "name": "Furina",
                "role": "Off-field Hydro and team buff"
              },
              {
                "name": "Yelan",
                "role": "Off-field Hydro"
              },
              {
                "name": "Arlecchino",
                "role": "On-field non-Hydro damage"
              },
              {
                "name": "Xianyun",
                "role": "Teamwide healing"
              }
            ],
            "reaction": "Prioritize encounter mechanic uptime; reaction value depends on account builds.",
            "why": "Hydro application meets Pyro gauge requirements while the on-field carry avoids Pyro RES.",
            "rotation": [
              "Furina Skill/Burst",
              "Yelan Skill/Burst",
              "Xianyun Burst",
              "Arlecchino damage sequence."
            ],
            "replacements": "Yelan → Xingqiu; Arlecchino → non-Pyro carry; Xianyun → Jean.",
            "equipment": "Manage Furina HP drain. Horn interactions are not modeled.",
            "confidence": "Mechanic-based theorycraft starting point, not a verified clear ranking."
          },
          {
            "tier": "accessible",
            "name": "Free-to-play Hydro core",
            "characters": [
              {
                "name": "Xingqiu",
                "role": "Hydro application"
              },
              {
                "name": "Barbara",
                "role": "Hydro application and healing"
              },
              {
                "name": "Fischl",
                "role": "Off-field Electro"
              },
              {
                "name": "Sucrose",
                "role": "Swirl support"
              }
            ],
            "reaction": "Prioritize encounter mechanic uptime; reaction value depends on account builds.",
            "why": "Hydro pressure for Pyro gauges plus Electro-Charged where aura permits.",
            "rotation": [
              "Fischl Skill",
              "Xingqiu Burst/Skill",
              "Sucrose Skill/Burst",
              "Barbara heal and Hydro application."
            ],
            "replacements": "Fischl → Lisa; Sucrose → Anemo support; Xingqiu → Hydro applier.",
            "equipment": "ER for Xingqiu; do not assume this lineup is an optimal ranking.",
            "confidence": "Mechanic-based theorycraft starting point, not a verified clear ranking."
          }
        ]
      }
    },
    {
      "id": "moongecko",
      "name": "Radiant Moongecko: Entangled Fangs",
      "hp": {
        "105": 10253199,
        "110": 20950072
      },
      "phases": [
        {
          "name": "Regular",
          "res": null,
          "resByElement": {
            "Pyro": 10,
            "Hydro": 10,
            "Electro": 10,
            "Cryo": 10,
            "Dendro": 10,
            "Anemo": 10,
            "Geo": 70
          },
          "description": "Regular RES"
        },
        {
          "name": "Dull Carapace",
          "res": 10,
          "resByElement": {
            "Pyro": 10,
            "Hydro": 10,
            "Electro": 10,
            "Cryo": 10,
            "Dendro": 10,
            "Anemo": 10,
            "Geo": 10
          },
          "description": "Dull Carapace"
        }
      ],
      "note": "Geo is resisted at 70% normally. The 9-layer Geo Ward takes blunt, Geo, or Overloaded hits; healing affected characters fully removes Radiant Cocoon.",
      "mechanics": [
        "• Boss will summon a big Geo shield (9 layers, 4U each). Characters with front load geo application like Zhongli will only break it layer by layer. Blunt attack or overload can be used to take down the shield. 70% Geo dmg dealt to the shield and 10% of all other element will be transferred to the boss as self dmg (cap at 40% max HP). After its shield is broken, boss is stunned for a brief period while also lowering its Geo RES to 10%.",
        "• Boss will drain team wide HP and apply a -100% crit debuff while increasing its Geo RES to 70%. Heal to full to recover from this debuff and gain a 15% CR + 50% dmg bonus buff, while lowering its Geo RES to 10%"
      ],
      "image": "https://bosses-cdn.stygianonslaught.com/gecko.png",
      "source": "https://www.stygian.moe/boss/radiant-moongecko",
      "traits": [
        {
          "name": "Vagrant Reverberation",
          "description": "The boss leaves a Moonstone Anchor and prepares a large attack. Damage the anchor, especially with Geo, to interrupt the charge and deal damage back to the boss."
        },
        {
          "name": "Unshakable Rock",
          "description": "The ley-line disturbance strengthens the anchor’s multi-layer Geo Ward."
        },
        {
          "name": "Radiant Cocoon",
          "description": "The boss applies damage, healing-received, and CRIT penalties while raising Geo RES. Heal an affected character to full to break the cocoon; the boss then loses the added Geo RES."
        }
      ],
      "guide": {
        "elements": [
          "Geo",
          "Healing"
        ],
        "overview": "The normal state has 70% Geo RES, but shield-breaking damage becomes capped boss backlash. Blunt, Geo, or Overloaded hits help break the layers; heal the party to full after Cocoon.",
        "strategy": [
          "Use Geo, blunt, or Overloaded hits against nine 4U shield layers; excess gauge does not carry between layers.",
          "During shield break, 70% of Geo damage and 10% of other damage count toward capped backlash.",
          "After the stun, heal affected teammates fully to remove Cocoon and its damage/CRIT penalties.",
          "Use the 10% RES window only for Dull Carapace; normal Geo RES is 70%."
        ],
        "mistakes": [
          "Using Geo as the sole damage type during its 70% Geo RES state.",
          "Assuming shield gauge spills into the next layer.",
          "Leaving teammates below full HP after Cocoon."
        ],
        "higherDifficulty": "Dire HP is 20,950,072. Bring dependable healing and save damage for the shell-break window; layered gauge and backlash are not simulated.",
        "teams": [
          {
            "tier": "recommended",
            "name": "Blunt Geo with teamwide healing",
            "characters": [
              {
                "name": "Navia",
                "role": "On-field Geo DPS and blunt hits"
              },
              {
                "name": "Fischl",
                "role": "Off-field damage"
              },
              {
                "name": "Xiangling",
                "role": "Pyro and Overloaded pressure"
              },
              {
                "name": "Jean",
                "role": "Teamwide healing"
              }
            ],
            "reaction": "Prioritize encounter mechanic uptime; reaction value depends on account builds.",
            "why": "Geo/blunt/Overloaded shield pressure; full-party healing answers Cocoon.",
            "rotation": [
              "Fischl Skill",
              "Xiangling Skill/Burst",
              "Jean heal as needed",
              "Navia Skill and attacks; top off after Cocoon."
            ],
            "replacements": "Navia → Noelle; Jean → Barbara plus another healer; retain shield-pressure hits.",
            "equipment": "The normal state has 70% Geo RES; preserve damage for after shield break.",
            "confidence": "Mechanic-based theorycraft starting point, not a verified clear ranking."
          },
          {
            "tier": "premium",
            "name": "Geo carry and teamwide sustain",
            "characters": [
              {
                "name": "Navia",
                "role": "Geo DPS"
              },
              {
                "name": "Zhongli",
                "role": "Geo support"
              },
              {
                "name": "Furina",
                "role": "Off-field damage"
              },
              {
                "name": "Xianyun",
                "role": "Teamwide healing"
              }
            ],
            "reaction": "Prioritize encounter mechanic uptime; reaction value depends on account builds.",
            "why": "Geo/blunt contribution with healing after Cocoon.",
            "rotation": [
              "Zhongli hold Skill",
              "Furina Skill/Burst",
              "Xianyun Burst",
              "Navia damage sequence; restore party to full after Cocoon."
            ],
            "replacements": "Navia → Itto or Noelle; Furina → Fischl; Xianyun → Jean.",
            "equipment": "A shield does not replace healing for Cocoon. Layered shield is not simulated.",
            "confidence": "Mechanic-based theorycraft starting point, not a verified clear ranking."
          },
          {
            "tier": "accessible",
            "name": "Noelle shield-break and healing core",
            "characters": [
              {
                "name": "Noelle",
                "role": "Geo and blunt damage; healing"
              },
              {
                "name": "Fischl",
                "role": "Off-field Electro"
              },
              {
                "name": "Xiangling",
                "role": "Pyro and Overloaded"
              },
              {
                "name": "Barbara",
                "role": "Healing"
              }
            ],
            "reaction": "Prioritize encounter mechanic uptime; reaction value depends on account builds.",
            "why": "Noelle gives accessible blunt hits and healing; other elements supplement shield pressure.",
            "rotation": [
              "Fischl Skill",
              "Xiangling Skill/Burst",
              "Barbara heal when needed",
              "Noelle Skill and attacks; use Burst in damage windows."
            ],
            "replacements": "Barbara → healer of choice; Xiangling → fast elemental applier.",
            "equipment": "Keep Noelle on field enough to heal, then top off after Cocoon.",
            "confidence": "Mechanic-based theorycraft starting point, not a verified clear ranking."
          }
        ]
      }
    }
  ]
};
