export interface DiagnosticConclusion {
  title: string;
  severity: "critical" | "warning" | "info";
  cause: string;
  fix: string;
  procedureRef?: string;
}

export interface DiagnosticNode {
  id: string;
  category: string;
  question: string;
  testAction?: string;
  expectedSpec?: string;
  options: {
    label: string;
    nextNodeId?: string;
    conclusion?: DiagnosticConclusion;
  }[];
}

export const DIAGNOSTIC_TREES: Record<string, DiagnosticNode> = {
  // ==========================================
  // TREE 1: STARTING SYSTEM & NO-START
  // ==========================================
  "start-node-no-start": {
    id: "start-node-no-start",
    category: "Starting System",
    question: "Does the no-start / hard-start symptom occur only on a COLD engine, or even when the engine is warm?",
    options: [
      { label: "Only on Cold Start (Engine cold / ambient < 20°C)", nextNodeId: "no-start-cold-glow" },
      { label: "Both Cold and Warm / Sudden Engine Shutdown", nextNodeId: "no-start-fuel-solenoid" }
    ]
  },
  "no-start-cold-glow": {
    id: "no-start-cold-glow",
    category: "Starting System",
    question: "When turning ignition key to ON, does the amber GLOW light illuminate and can you hear the heavy 'thunk' of Glow Relay No. 1 within 2-6 seconds?",
    testAction: "Turn key to ON with driver door open. Listen near driver-side inner fender for relay click.",
    options: [
      { label: "Yes, relay clicks and glow light illuminates for ~4 seconds", nextNodeId: "no-start-cold-plugs-test" },
      {
        label: "No relay click or glow light flashes rapidly / stays completely dark",
        conclusion: {
          title: "Super Glow Pre-Heating Circuit Failure",
          severity: "warning",
          cause: "Blown 80A GLOW fusible link in engine bay fuse box, failed Glow Plug Timer ECU (driver kick panel), or open circuit in Glow Relay No. 1 coil.",
          fix: "Test 80A GLOW fusible link with multimeter. Verify 12V trigger on small terminals of Glow Relay No. 1 with key ON. Replace relay or timer module.",
          procedureRef: "super-glow-diagnosis"
        }
      }
    ]
  },
  "no-start-cold-plugs-test": {
    id: "no-start-cold-plugs-test",
    category: "Starting System",
    question: "Disconnect the metal glow plug bus bar. Test resistance of each of the 4 glow plugs with a multimeter from terminal post to cylinder head ground. What are the readings?",
    expectedSpec: "0.65 – 0.85 Ω per plug @ 20°C",
    options: [
      {
        label: "One or more glow plugs show Infinite (OL) / high resistance (>2.0 Ω)",
        conclusion: {
          title: "Burned Out Glow Plugs",
          severity: "warning",
          cause: "One or more ceramic/metallic glow plugs have burned open, preventing pre-combustion chamber temperature from reaching diesel auto-ignition threshold.",
          fix: "Replace all 4 glow plugs with OEM spec 6V fast-heating plugs (Toyota 19850-54090). Torque to 13 Nm. Do not overtighten.",
          procedureRef: "super-glow-diagnosis"
        }
      },
      { label: "All 4 plugs read 0.65 – 0.85 Ω (Healthy)", nextNodeId: "no-start-air-fuel" }
    ]
  },
  "no-start-fuel-solenoid": {
    id: "no-start-fuel-solenoid",
    category: "Starting System",
    question: "Disconnect the single black/white wire at the top rear of the injection pump (Fuel Cut Solenoid). Turn ignition key to ON. Is 12V battery voltage present at this wire, and does the solenoid audibly click when connected to 12V?",
    testAction: "Probe the wire with a 12V test light. Tap the wire against the solenoid terminal to hear internal magnetic plunger click.",
    options: [
      { label: "Yes, 12V present and solenoid clicks distinctly", nextNodeId: "no-start-air-fuel" },
      {
        label: "No 12V present or solenoid does NOT click",
        conclusion: {
          title: "Fuel Cut Solenoid Dead / Ignition Feed Open",
          severity: "critical",
          cause: "The Bosch VE fuel cut solenoid is closed, completely blocking diesel supply into the high-pressure distributor head.",
          fix: "Check IGN 15A fuse and ignition switch harness. If 12V is present at the wire but the solenoid does not click, unscrew the 24mm solenoid from pump, replace internal O-ring and plunger assembly, or replace solenoid unit.",
          procedureRef: "procedures"
        }
      }
    ]
  },
  "no-start-air-fuel": {
    id: "no-start-air-fuel",
    category: "Fuel System",
    question: "Press the manual primer button on top of the diesel fuel filter. How does the button feel after 10-15 pumps?",
    testAction: "Pump the rubber/aluminum primer diaphragm on the fuel filter bracket repeatedly until resistance increases.",
    options: [
      {
        label: "Button stays soft / spongy and never gets hard to push",
        conclusion: {
          title: "Air Ingress in Fuel Suction Line or Primer Diaphragm Leak",
          severity: "warning",
          cause: "Micro-cracks in the rubber suction hose between the tank and filter, or a ruptured internal check valve in the manual primer pump head allowing diesel to drain back to tank.",
          fix: "Replace rubber fuel supply lines with 5/16\" (8mm) diesel-rated hose. Replace the fuel filter primer assembly. Bleed system until diesel squirts without air from the bleed screw."
        }
      },
      {
        label: "Button gets rock hard quickly, but loosened injector flare nuts show no fuel squirt while cranking",
        conclusion: {
          title: "VE Injection Pump Internal Micro-Screen Clogged",
          severity: "critical",
          cause: "The micro-mesh banjo filter screen located under the pump fuel inlet union bolt is choked with algae/debris, or the pump drive gear woodruff key has sheared.",
          fix: "Remove fuel inlet union banjo bolt on the VE pump. Use a pick to extract the internal 10mm micro-filter screen and clean with carb cleaner. Check pump drive shaft rotation.",
          procedureRef: "procedures"
        }
      },
      {
        label: "Button gets hard and fuel squirts strongly from loosened injector flare nuts during cranking",
        nextNodeId: "no-start-compression"
      }
    ]
  },
  "no-start-compression": {
    id: "no-start-compression",
    category: "Engine Mechanical",
    question: "Perform a cylinder compression test via glow plug holes. What are the cranking pressure readings across all 4 cylinders?",
    expectedSpec: "Standard: 30.0 kg/cm² (427 psi) | Minimum: 20.0 kg/cm² (284 psi)",
    options: [
      {
        label: "Low compression (< 20 kg/cm² / 284 psi) on two adjacent cylinders",
        conclusion: {
          title: "Blown Cylinder Head Gasket Fire Ring Between Cylinders",
          severity: "critical",
          cause: "Loss of compression across the cylinder divider bridge. Pre-combustion chamber heat cycles have blown the MLS gasket.",
          fix: "Remove cylinder head, measure deck warpage (must be <0.15mm), inspect for cracks between valve seats, and install new Grade B/D/F head gasket with new 12-point bolts.",
          procedureRef: "head-gasket-replacement"
        }
      },
      {
        label: "All cylinders read above 26 kg/cm² (370 psi)",
        conclusion: {
          title: "Injection Nozzle Sticking or Severely Retarded Static Timing",
          severity: "warning",
          cause: "Nozzle opening pressure too low (dripping instead of atomizing) or VE pump static plunger stroke is out of specification.",
          fix: "Pop-test injection nozzles (target: 145-155 kg/cm²). Perform VE pump dial gauge static timing adjustment (0.58-0.64mm TDC).",
          procedureRef: "injection-pump-timing"
        }
      }
    ]
  },

  // ==========================================
  // TREE 2: COOLING & OVERHEATING
  // ==========================================
  "start-node-overheating": {
    id: "start-node-overheating",
    category: "Cooling System",
    question: "When does the temperature gauge climb into the upper hot zone?",
    options: [
      { label: "Only under heavy boost, highway hill climbs, or towing", nextNodeId: "overheat-load-radiator" },
      { label: "At idle and slow city stop-and-go traffic", nextNodeId: "overheat-idle-fan" },
      { label: "Instantly within 3-5 minutes of starting even with engine cold", nextNodeId: "overheat-instant-airlock" }
    ]
  },
  "overheat-load-radiator": {
    id: "overheat-load-radiator",
    category: "Cooling System",
    question: "Remove the radiator cap on a completely cold engine. Install a spill-free funnel or block tester kit. Start engine and blip throttle under boost. What happens to the coolant in the neck?",
    options: [
      {
        label: "Violent continuous stream of air bubbles and coolant overflows like a geyser",
        conclusion: {
          title: "Cracked Cylinder Head (Pre-Chamber to Water Jacket) or Blown Head Gasket",
          severity: "critical",
          cause: "The notorious 2L-T failure mode: Combustion chamber pressure (up to 1,500 psi under boost) is forcing hot combustion gases directly into the cooling jacket, pushing coolant out the expansion bottle and creating massive steam pockets.",
          fix: "Perform cylinder head replacement. Upgrade to an aftermarket reinforced cylinder head casting with thicker pre-cup deck bridges, install new MLS gasket, and inspect block deck.",
          procedureRef: "head-gasket-replacement"
        }
      },
      { label: "No continuous bubbles; coolant level stays calm with normal thermal expansion", nextNodeId: "overheat-fan-clutch-test" }
    ]
  },
  "overheat-fan-clutch-test": {
    id: "overheat-fan-clutch-test",
    category: "Cooling System",
    question: "With the engine fully hot (at operating temperature after driving), shut off the engine. Try to spin the radiator fan blades by hand. How much resistance is felt?",
    testAction: "Engine OFF, reach in and spin fan blade with fingers.",
    options: [
      {
        label: "Fan spins freely with virtually zero resistance (freewheels > 1-2 turns)",
        conclusion: {
          title: "Viscous Fan Clutch Silicone Fluid Depleted / Leaked",
          severity: "warning",
          cause: "The internal bimetallic valve silicone fluid has leaked out or sheared down. At highway speeds or steep climbs, the fan is slipping and moving less than 30% of required CFM airflow.",
          fix: "Disassemble fan clutch and refill with 40-50ml of 10,000 cSt genuine Toyota silicone fluid (08816-03001) or replace with heavy-duty Aisin fan clutch (FCT-013)."
        }
      },
      {
        label: "Fan has heavy hydraulic viscous drag and stops immediately when released",
        conclusion: {
          title: "Radiator Internal Scale Calcification / High EGT Over-Fueling",
          severity: "warning",
          cause: "Old brass/copper radiator cores accumulate hard water calcium scale inside flat tubes, cutting thermal heat dissipation by 50%. Alternatively, excessive fuel delivery is driving pre-turbo EGTs beyond 680°C.",
          fix: "Replace radiator with high-capacity 3-row aluminum core. Install an EGT pyrometer gauge to monitor exhaust temperatures. Ensure boost compensator diaphragm on VE pump is tuned appropriately."
        }
      }
    ]
  },
  "overheat-idle-fan": {
    id: "overheat-idle-fan",
    category: "Cooling System",
    question: "Is the plastic fan shroud intact and enclosing the fan blades properly?",
    options: [
      {
        label: "Fan shroud is missing or broken",
        conclusion: {
          title: "Missing Fan Shroud Air Bypass",
          severity: "warning",
          cause: "Without a shroud, the fan recirculates hot air from the engine bay around the radiator edges rather than pulling fresh ambient air through the core.",
          fix: "Reinstall OEM lower and upper fan shroud."
        }
      },
      { label: "Shroud is complete and undamaged", nextNodeId: "overheat-fan-clutch-test" }
    ]
  },
  "overheat-instant-airlock": {
    id: "overheat-instant-airlock",
    category: "Cooling System",
    question: "Is the lower radiator hose cold while the upper hose is boiling hot?",
    options: [
      {
        label: "Yes, lower hose is completely cold, heater blows ice cold air",
        conclusion: {
          title: "Air Lock in Cylinder Head / Thermostat Stuck Closed",
          severity: "critical",
          cause: "Trapped air bubble is insulating the thermostat pellet from hot coolant, preventing it from opening and starving the cylinder head of flow.",
          fix: "Perform the Anti-Air-Lock Burping Protocol with front end elevated. Replace thermostat with OEM 82°C unit (verify jiggle valve oriented at 12 o'clock).",
          procedureRef: "cooling-purge-anti-crack"
        }
      }
    ]
  },

  // ==========================================
  // TREE 3: SMOKE & EMISSIONS
  // ==========================================
  "start-node-smoke": {
    id: "start-node-smoke",
    category: "Exhaust Emissions",
    question: "What is the primary color and smell of the exhaust smoke?",
    options: [
      { label: "Thick White / Gray Smoke (Smells like raw diesel fuel or sweet coolant)", nextNodeId: "smoke-white-test" },
      { label: "Heavy Pitch Black Smoke under acceleration or boost", nextNodeId: "smoke-black-test" },
      { label: "Blue / Light Gray Smoke (Acrid burning oil smell)", nextNodeId: "smoke-blue-test" }
    ]
  },
  "smoke-white-test": {
    id: "smoke-white-test",
    category: "Exhaust Emissions",
    question: "Does the white smoke clear up after the engine reaches full operating temperature (after 5 minutes of driving)?",
    options: [
      {
        label: "Yes, clears up completely once warm; accompanied by rough idle during cold start",
        conclusion: {
          title: "Cold Pre-Heating Failure / Retarded Injection Timing",
          severity: "warning",
          cause: "One or more dead glow plugs or ACSD cold start advance mechanism not functioning, causing unburnt diesel droplets to vaporize as white smoke in cold cylinders.",
          fix: "Test glow plugs and dropping resistor. Verify static pump plunger stroke.",
          procedureRef: "super-glow-diagnosis"
        }
      },
      {
        label: "No, continuous thick white smoke with sweet smell and cooling system pressure buildup",
        conclusion: {
          title: "Coolant Ingress into Combustion Chamber (Head Gasket / Head Crack)",
          severity: "critical",
          cause: "Cylinder head crack between intake/exhaust valve seat or blown fire ring allowing pressurized coolant to vaporize as steam.",
          fix: "Perform block test / compression test and replace cylinder head assembly.",
          procedureRef: "head-gasket-replacement"
        }
      }
    ]
  },
  "smoke-black-test": {
    id: "smoke-black-test",
    category: "Exhaust Emissions",
    question: "Inspect the air filter element and turbo compressor intake pipe. What is their condition?",
    options: [
      {
        label: "Air filter is clogged or intake hose is collapsing under suction",
        conclusion: {
          title: "Air Starvation / Restricted Intake Airflow",
          severity: "info",
          cause: "Engine is running excessively rich due to lack of oxygen.",
          fix: "Replace engine air filter element with genuine Toyota dry paper filter (17801-54080)."
        }
      },
      {
        label: "Air filter is clean; boost gauge reads low (< 5 psi / 0.35 bar)",
        conclusion: {
          title: "Turbo Boost Leak or Wastegate Actuator Stuck Open",
          severity: "warning",
          cause: "The Bosch VE boost compensator is injecting full fueling based on throttle, but actual boost pressure is lost through a split silicone crossover coupler or stuck wastegate flapper.",
          fix: "Inspect all 3 turbo intercooler/crossover hoses for splits. Pressure test wastegate actuator (should begin moving at 0.78 bar).",
          procedureRef: "ct20-turbo-service"
        }
      },
      {
        label: "Boost pressure is normal (> 8 psi) and air filter is clean",
        conclusion: {
          title: "Dripping Injection Nozzles (Low Pop Pressure) or Over-Adjusted VE Max Fuel Screw",
          severity: "warning",
          cause: "Injection nozzles have worn needles that drip large droplets rather than atomizing. Alternatively, previous owner has over-tightened the VE pump smoke screw.",
          fix: "Pop-test injection nozzles to 145-155 kg/cm² opening pressure. Back off VE pump max fuel screw 1/4 turn counter-clockwise.",
          procedureRef: "injector-nozzle-service"
        }
      }
    ]
  },
  "smoke-blue-test": {
    id: "smoke-blue-test",
    category: "Exhaust Emissions",
    question: "Remove the turbo aluminum compressor crossover pipe. Is there liquid engine oil pooling in the turbine housing or crossover?",
    options: [
      {
        label: "Heavy pool of engine oil inside turbo housing and compressor inlet",
        conclusion: {
          title: "CT20 Turbocharger Journal Bearing / Dynamic Oil Seal Failure",
          severity: "warning",
          cause: "Exhaust side turbine or intake compressor dynamic piston ring seals worn from high mileage or restricted oil drain tube.",
          fix: "Check turbo shaft radial play (limit: 0.18mm) and axial play (limit: 0.08mm). Rebuild CT20 turbo with 360° thrust bearing kit or replace cartridge (CHRA).",
          procedureRef: "ct20-turbo-service"
        }
      },
      {
        label: "Turbo is dry; smoke occurs primarily during deceleration / high vacuum engine braking",
        conclusion: {
          title: "Hardened Valve Stem Oil Seals or Worn Valve Guides",
          severity: "warning",
          cause: "High mileage 2L-T valve stem Viton seals have hardened, allowing oil from the valvetrain to seep down valve guides into intake ports.",
          fix: "Replace valve stem seals using on-engine air pressure adapter or during cylinder head refresh."
        }
      }
    ]
  },

  // ==========================================
  // TREE 4: TURBO BOOST & POWER LOSS
  // ==========================================
  "start-node-power-loss": {
    id: "start-node-power-loss",
    category: "Turbo & Power",
    question: "How does the engine behave when you step on the accelerator pedal?",
    options: [
      { label: "Engine feels completely flat like a non-turbo 2L, zero boost response", nextNodeId: "power-loss-boost-check" },
      { label: "Engine accelerates fine initially but stutters / starves at > 2,800 RPM", nextNodeId: "power-loss-high-rpm-starve" },
      { label: "Engine boosts normally but has severe lag and black smoke off idle", nextNodeId: "power-loss-low-end-lag" }
    ]
  },
  "power-loss-boost-check": {
    id: "power-loss-boost-check",
    category: "Turbo & Power",
    question: "Check the boost pressure line running from the aluminum crossover pipe to the top of the Bosch VE injection pump (LDA boost compensator). Is the hose intact and is the wastegate flapper arm connected?",
    testAction: "Wiggle the wastegate actuator pushrod. Ensure circlip is intact and rod has strong spring tension.",
    options: [
      {
        label: "Boost reference hose is split / disconnected, or wastegate arm is disconnected and flapper swings loose",
        conclusion: {
          title: "Disconnected Boost Reference or Stuck-Open Wastegate",
          severity: "warning",
          cause: "Without boost pressure reaching the VE pump top diaphragm, the fuel metering rod stays in zero-boost position. If wastegate flapper is loose, exhaust bypasses the turbine completely.",
          fix: "Re-attach 4mm silicone boost hose with spring clamp. Reconnect wastegate actuator arm and install new stainless E-clip.",
          procedureRef: "ct20-turbo-service"
        }
      },
      {
        label: "Hose and linkage are intact; pressure test shows wastegate diaphragm leaks air",
        conclusion: {
          title: "Ruptured Boost Compensator Diaphragm or Actuator Leak",
          severity: "warning",
          cause: "The rubber aneroid diaphragm inside the VE pump top capsule has torn from heat and age.",
          fix: "Unscrew 4x top screws on VE pump boost compensator cap. Inspect rubber diaphragm for tears. Replace diaphragm and re-index eccentric fuel cone.",
          procedureRef: "ve-pump-reseal"
        }
      },
      { label: "Hose, linkage and diaphragm are good; boost gauge reads 0 psi", nextNodeId: "power-loss-turbine-seized" }
    ]
  },
  "power-loss-turbine-seized": {
    id: "power-loss-turbine-seized",
    category: "Turbo & Power",
    question: "Remove intake rubber hose from turbo compressor inlet. Try to spin the compressor wheel with your fingers. Does it spin smoothly?",
    options: [
      {
        label: "Wheel is stiff / completely seized or scrapes against aluminum housing",
        conclusion: {
          title: "Seized CT20 Turbocharger Bearings",
          severity: "critical",
          cause: "Oil starvation or severe carbon coking in the turbo oil feed banjo line has destroyed the floating brass journal bearings.",
          fix: "Replace CT20 turbocharger CHRA cartridge. Clean and blow out the steel turbo oil feed tube. Always use high-detergent CI-4 diesel oil.",
          procedureRef: "ct20-turbo-service"
        }
      },
      {
        label: "Wheel spins freely with zero binding",
        conclusion: {
          title: "Exhaust System Restriction / Crushed Downpipe",
          severity: "warning",
          cause: "Crushed exhaust pipe or collapsed internal muffler baffle causing excessive backpressure.",
          fix: "Inspect exhaust system from downpipe to tailpipe. Upgrade to 2.5\" free-flowing mandrel system."
        }
      }
    ]
  },
  "power-loss-high-rpm-starve": {
    id: "power-loss-high-rpm-starve",
    category: "Fuel System",
    question: "When the engine starves at high RPM, does pumping the manual fuel primer button on the filter temporarily restore power?",
    options: [
      {
        label: "Yes, pumping the filter restores power for a few seconds",
        conclusion: {
          title: "Clogged Fuel Filter or Tank Pickup Strainer",
          severity: "warning",
          cause: "High fuel flow demand creates high vacuum in the suction line, collapsing fuel delivery due to dirt or diesel wax crystals in the filter media.",
          fix: "Replace fuel filter cartridge (Toyota 23303-64010). If problem recurs, drop fuel tank and clean the brass sock strainer on the pickup sender tube."
        }
      },
      {
        label: "No, fuel filter is brand new; problem happens regardless",
        conclusion: {
          title: "VE Pump Internal Vane Transfer Pump Pressure Low",
          severity: "warning",
          cause: "Internal housing transfer pressure regulating valve is loose or stuck open, failing to advance injection timing dynamically at high RPM.",
          fix: "Inspect the 10mm hex regulating valve on the side of the VE pump. Tap regulating pin lightly to restore 6–8 bar internal pressure or service pump.",
          procedureRef: "ve-pump-reseal"
        }
      }
    ]
  },
  "power-loss-low-end-lag": {
    id: "power-loss-low-end-lag",
    category: "Turbo & Power",
    question: "Is the EGR (Exhaust Gas Recirculation) valve stuck open or leaking exhaust into the intake plenum off idle?",
    options: [
      {
        label: "EGR pipe is scorching hot at idle / soot leaking around EGR valve shaft",
        conclusion: {
          title: "EGR Valve Stuck Open / Soot Contamination",
          severity: "warning",
          cause: "Carbon buildup is holding the EGR poppet valve open, contaminating fresh intake air with hot exhaust gas and destroying low-RPM spool.",
          fix: "Remove EGR valve and clean with carb solvent, or install a 4mm stainless blanking plate on the exhaust manifold port."
        }
      }
    ]
  },

  // ==========================================
  // TREE 5: 4WD & DRIVELINE FAULTS
  // ==========================================
  "start-node-4wd": {
    id: "start-node-4wd",
    category: "4WD & Drivetrain",
    question: "What is the exact 4WD malfunction on your LN130 4Runner?",
    options: [
      { label: "Shifted into 4H/4L, but green 4WD dash light flashes and front wheels have NO pull", nextNodeId: "4wd-flashing-light" },
      { label: "Severe clunking / binding noise when turning tightly in 4WD on pavement", nextNodeId: "4wd-binding-turn" },
      { label: "Front manual Aisin hub dial is extremely stiff / seized and will not turn to LOCK", nextNodeId: "4wd-hub-stiff" }
    ]
  },
  "4wd-flashing-light": {
    id: "4wd-flashing-light",
    category: "4WD & Drivetrain",
    question: "Look under the right front inner fender near the battery. Are the Blue (4WD) and Brown (2WD) vacuum switching valves (VSVs) receiving vacuum and 12V when transfer lever is moved?",
    testAction: "Use a vacuum gauge on the blue VSV hose. Probe 2-pin connector with 12V test light with 4WD lever engaged.",
    options: [
      {
        label: "Vacuum hose is split / cracked near front axle differential actuator",
        conclusion: {
          title: "ADD Differential Actuator Vacuum Leak",
          severity: "warning",
          cause: "The front axle Automatic Disconnecting Differential (ADD) relies on 500 mmHg vacuum to slide the clutch collar. Split vacuum hoses prevent mechanical lockup.",
          fix: "Replace the 3.5mm rubber vacuum lines running down to the front differential actuator. Test diaphragm with hand vacuum pump.",
          procedureRef: "add-vsv-service"
        }
      },
      {
        label: "VSV has vacuum but does NOT click or pass vacuum when 12V applied",
        conclusion: {
          title: "Dead ADD Vacuum Switching Valve (VSV)",
          severity: "warning",
          cause: "Electromagnetic coil inside the Blue 4WD engagement VSV has burned open (infinite resistance).",
          fix: "Replace Blue VSV (Toyota 85420-24010). Normal coil resistance is 38–45 Ω.",
          procedureRef: "add-vsv-service"
        }
      },
      {
        label: "Vacuum and VSVs work; front driveshaft spins, but indicator switch does not close",
        conclusion: {
          title: "Front Differential ADD Indicator Switch Open",
          severity: "info",
          cause: "The brass ball plunger indicator switch threaded into the front diff housing has dirty contacts.",
          fix: "Unscrew 22mm switch on front axle tube, clean with contact spray, and verify continuity when ball is depressed."
        }
      }
    ]
  },
  "4wd-binding-turn": {
    id: "4wd-binding-turn",
    category: "4WD & Drivetrain",
    question: "Are you driving in 4WD mode on dry, high-traction asphalt or concrete pavement?",
    options: [
      {
        label: "Yes, driving on dry pavement",
        conclusion: {
          title: "Normal Part-Time 4WD Driveline Wind-Up (Operator Warning)",
          severity: "warning",
          cause: "The 1991 4Runner LN130 has a Part-Time 4WD transfer case without a center differential. When turning, front and rear axles rotate at different speeds. On dry pavement, this creates extreme torque wind-up in the transfer case and axles.",
          fix: "CRITICAL: Never engage 4WD on dry pavement! Only use 4H/4L on loose dirt, gravel, mud, snow, or sand."
        }
      },
      {
        label: "No, occurs off-road on dirt / clicking sound increases with wheel speed",
        conclusion: {
          title: "Worn Front CV Half-Shaft Outer Birfield Joint",
          severity: "warning",
          cause: "Torn rubber CV boot has allowed grease to wash out and dirt to enter the outer constant velocity joint balls.",
          fix: "Replace the front CV half-shaft assembly or rebuild outer joint with new molybdenum grease and heavy-duty silicone boot."
        }
      }
    ]
  },
  "4wd-hub-stiff": {
    id: "4wd-hub-stiff",
    category: "4WD & Drivetrain",
    question: "Have the Aisin manual locking hubs been packed full of heavy wheel bearing grease recently?",
    options: [
      {
        label: "Yes, packed full of thick chassis grease",
        conclusion: {
          title: "Over-Greased Aisin Manual Hub Clutch Binding",
          severity: "warning",
          cause: "Heavy wheel bearing grease creates hydraulic suction that prevents the sliding splined clutch ring and detent pawl from moving freely.",
          fix: "Disassemble hub cover, wash out all heavy grease in solvent, and apply only a very light wipe of NLGI 2 grease or light oil.",
          procedureRef: "aisin-manual-hub-rebuild"
        }
      }
    ]
  },

  // ==========================================
  // TREE 6: ENGINE NOISE & ROUGH IDLE
  // ==========================================
  "start-node-noise": {
    id: "start-node-noise",
    category: "Engine Noise",
    question: "What type of abnormal sound or idle behavior is the 2L-T experiencing?",
    options: [
      { label: "Loud sharp metallic 'nailing' / hammer knocking that changes with RPM", nextNodeId: "noise-diesel-knock" },
      { label: "Engine idle speed 'hunts' up and down rhythmically (600 - 900 RPM)", nextNodeId: "noise-hunting-idle" },
      { label: "High-pitched rhythmic valvetrain ticking from top of valve cover", nextNodeId: "noise-valve-tick" },
      { label: "Deep heavy thumping knock from bottom of oil pan under load", nextNodeId: "noise-bottom-end-knock" }
    ]
  },
  "noise-diesel-knock": {
    id: "noise-diesel-knock",
    category: "Engine Noise",
    question: "Crack open the 17mm fuel injection line flare nuts one by one with the engine running. Does the knock disappear when a specific cylinder is cut?",
    testAction: "Use 17mm wrench with thick gloves; loosen line 1/2 turn to depressurize cylinder.",
    options: [
      {
        label: "Yes, knock disappears completely when one specific injector is cracked open",
        conclusion: {
          title: "Dripping / Seized Fuel Injection Nozzle (Hydraulic Diesel Knock)",
          severity: "warning",
          cause: "Nozzle needle is sticking open or nozzle tip has carbon buildup, dumping un-atomized liquid diesel stream into pre-cup, causing explosive detonation.",
          fix: "Remove injector holder for that cylinder. Pop-test opening pressure (145-155 kg/cm²) and replace nozzle tip (DN4PD57).",
          procedureRef: "injector-nozzle-service"
        }
      },
      {
        label: "No, loud knocking is heard across all cylinders and engine is louder at cold start",
        conclusion: {
          title: "Excessively Advanced Static Injection Timing or Stuck ACSD",
          severity: "warning",
          cause: "VE pump static plunger stroke is advanced beyond 0.64 mm TDC, or Automatic Cold Start Device (ACSD) wax thermostat is stuck in advance mode.",
          fix: "Perform dial gauge static timing adjustment (0.58-0.64 mm TDC). Check ACSD release pin.",
          procedureRef: "injection-pump-timing"
        }
      }
    ]
  },
  "noise-hunting-idle": {
    id: "noise-hunting-idle",
    category: "Engine Noise",
    question: "Inspect clear fuel line or check primer pump for micro air bubbles. Is there air in the diesel supply?",
    options: [
      {
        label: "Yes, tiny champagne bubbles visible in fuel line before injection pump",
        conclusion: {
          title: "Air Ingress Causing Governor Hunting",
          severity: "info",
          cause: "Air entering the suction line causes the mechanical flyweight governor inside the VE pump to oscillate back and forth trying to maintain idle RPM.",
          fix: "Replace rubber fuel filter inlet hoses, install new copper washers on banjo bolts, and bleed fuel system."
        }
      },
      {
        label: "No air in fuel; occurs when headlights or A/C are switched on",
        conclusion: {
          title: "A/C Idle-Up VSV Diaphragm Out of Adjustment",
          severity: "info",
          cause: "The vacuum actuator on the side of the VE pump throttle arm is incorrectly adjusted.",
          fix: "Adjust idle-up screw on throttle lever so engine holds 850 RPM with A/C compressor active."
        }
      }
    ]
  },
  "noise-valve-tick": {
    id: "noise-valve-tick",
    category: "Engine Noise",
    question: "Measure cold valve clearances with a feeler gauge. What are the lash measurements?",
    expectedSpec: "Intake: 0.20 – 0.30 mm | Exhaust: 0.40 – 0.50 mm",
    options: [
      {
        label: "One or more valves have excessive clearance (> 0.35mm Intake or > 0.55mm Exhaust)",
        conclusion: {
          title: "Excessive Valve Lash / Worn Adjusting Shim",
          severity: "info",
          cause: "Cam lobe impact against loose shim creates audible metallic ticking sound and reduces valve lift.",
          fix: "Calculate required replacement shim using formula N = T + (A - Target) and install new Toyota shim using SST 09248-64011.",
          procedureRef: "valve-clearance-adjustment"
        }
      }
    ]
  },
  "noise-bottom-end-knock": {
    id: "noise-bottom-end-knock",
    category: "Engine Noise",
    question: "Does the deep thudding knock increase dramatically in volume when engine is revved to 2,000 RPM under load?",
    options: [
      {
        label: "Yes, heavy dull knock that vibrates the oil pan",
        conclusion: {
          title: "Worn Connecting Rod Big-End Bearing / Crankshaft Journal Damage",
          severity: "critical",
          cause: "Spun rod bearing or excessive oil clearance (>0.10mm) resulting from past oil starvation or low oil pressure.",
          fix: "CRITICAL: Shut engine down immediately! Drop oil pan, measure crank journals, and install new tri-metal bearing shells."
        }
      }
    ]
  },

  // ==========================================
  // TREE 7: BRAKES & LSPV INBALANCE
  // ==========================================
  "start-node-brakes": {
    id: "start-node-brakes",
    category: "Brake System",
    question: "What brake symptom is occurring on your 4Runner?",
    options: [
      { label: "Rear wheels lock up violently under moderate braking with empty cargo area", nextNodeId: "brakes-rear-lockup" },
      { label: "Brake pedal is rock hard to push and stopping distance is huge", nextNodeId: "brakes-hard-pedal" },
      { label: "Brake pedal feels spongy and sinks slowly to the floorboard", nextNodeId: "brakes-spongy-pedal" }
    ]
  },
  "brakes-rear-lockup": {
    id: "brakes-rear-lockup",
    category: "Brake System",
    question: "Has the vehicle received a suspension lift kit (e.g. 2-inch rear coil spring spacer or lifted springs)?",
    options: [
      {
        label: "Yes, vehicle has a suspension lift installed",
        conclusion: {
          title: "Load Sensing Proportioning Valve (LSPV) Height Out of Calibration",
          severity: "warning",
          cause: "Lifting the rear chassis pulls the LSPV sensing spring UP, tricking the hydraulic valve into thinking the vehicle is fully loaded with 1,000 lbs of cargo, sending 100% full hydraulic pressure to the rear drum brakes!",
          fix: "Install a raised drop bracket for the LSPV sensing rod on the rear axle housing or adjust the shackle spring bolt until rear line pressure is reduced to factory unladen curve.",
          procedureRef: "lspv-brake-service"
        }
      },
      {
        label: "No, stock factory ride height; rear brake shoe self-adjuster is over-tightened",
        conclusion: {
          title: "Rear Drum Brake Shoe Drag / Contaminated Linings",
          severity: "warning",
          cause: "Rear wheel cylinder leaking brake fluid or axle seal leaking gear oil onto brake shoes.",
          fix: "Replace rear wheel cylinders and install new brake shoes. Clean drum friction surface."
        }
      }
    ]
  },
  "brakes-hard-pedal": {
    id: "brakes-hard-pedal",
    category: "Brake System",
    question: "Is the alternator rear-mounted vacuum pump pulling at least 500 mmHg vacuum?",
    testAction: "Connect vacuum gauge to the brake booster check valve line.",
    options: [
      {
        label: "Vacuum gauge reads < 300 mmHg or 0 vacuum",
        conclusion: {
          title: "Alternator Rear Vane Vacuum Pump Failure",
          severity: "critical",
          cause: "Worn carbon vanes or oil starvation in the vacuum pump mounted to the back of the alternator.",
          fix: "Rebuild alternator vacuum pump or replace alternator/pump assembly. Inspect oil supply and drain lines.",
          procedureRef: "vacuum-wiring"
        }
      }
    ]
  },
  "brakes-spongy-pedal": {
    id: "brakes-spongy-pedal",
    category: "Brake System",
    question: "Was the Load Sensing Proportioning Valve (LSPV) bleeder valve opened during brake bleeding?",
    options: [
      {
        label: "No, only the 4 wheel calipers and drums were bled",
        conclusion: {
          title: "Air Trapped Inside LSPV Hydraulic Chamber",
          severity: "warning",
          cause: "The LN130 has a 5th bleeder valve located directly on the LSPV body near the rear axle. Trapped air here creates a squishy pedal.",
          fix: "Bleed system in official Toyota 5-point sequence: 1) LSPV Body &rarr; 2) Rear Left &rarr; 3) Rear Right &rarr; 4) Front Left &rarr; 5) Front Right.",
          procedureRef: "lspv-brake-service"
        }
      }
    ]
  }
};
