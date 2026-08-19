export interface DiagnosticNode {
  id: string;
  question: string;
  category: string;
  testAction?: string;
  expectedSpec?: string;
  options: {
    label: string;
    nextNodeId?: string;
    conclusion?: {
      title: string;
      severity: "critical" | "warning" | "info";
      cause: string;
      fix: string;
      procedureRef?: string;
    };
  }[];
}

export const DIAGNOSTIC_TREES: Record<string, DiagnosticNode> = {
  // Tree 1: Engine Cranks But Will Not Start
  "start-node-no-start": {
    id: "start-node-no-start",
    category: "Starting System",
    question: "Does the symptom occur only on a COLD engine, or even when the engine is warm?",
    options: [
      { label: "Only on Cold Start (Colder than 20°C / 68°F)", nextNodeId: "no-start-cold-glow" },
      { label: "Both Cold and Warm / Sudden Shutdown", nextNodeId: "no-start-fuel-solenoid" }
    ]
  },
  "no-start-cold-glow": {
    id: "no-start-cold-glow",
    category: "Starting System",
    question: "When you turn the ignition key to ON, does the glow plug indicator light illuminate and can you hear the heavy 'thunk' click of Glow Relay No. 1 within 2-6 seconds?",
    testAction: "Turn key to ON with driver door open. Listen under hood near driver side fender for relay click.",
    options: [
      { label: "Yes, relay clicks and glow light turns on for ~4 seconds", nextNodeId: "no-start-cold-plugs-test" },
      {
        label: "No relay click or glow light flashes rapidly / stays off",
        conclusion: {
          title: "Super Glow Pre-Heating Circuit Failure",
          severity: "warning",
          cause: "Blown GLOW fusible link (80A) in engine bay fuse box, failed Glow Plug Timer ECU behind driver kick panel, or dead Glow Relay No. 1.",
          fix: "Check 80A GLOW fusible link with multimeter. Verify 12V trigger on small terminals of Glow Relay No. 1 with key in ON position. Replace relay or timer module.",
          procedureRef: "super-glow-diagnosis"
        }
      }
    ]
  },
  "no-start-cold-plugs-test": {
    id: "no-start-cold-plugs-test",
    category: "Starting System",
    question: "Disconnect the glow plug bus bar. Test resistance of each of the 4 glow plugs with a multimeter from terminal to ground. What are your readings?",
    expectedSpec: "0.65 – 0.85 Ω per plug at 20°C",
    options: [
      {
        label: "One or more plugs show Infinite (OL) / high resistance (>2.0 Ω)",
        conclusion: {
          title: "Burned Out Glow Plugs",
          severity: "warning",
          cause: "One or more ceramic/metallic glow plugs have burned open, preventing pre-chamber temperature from reaching diesel auto-ignition threshold.",
          fix: "Replace all 4 glow plugs with OEM spec 6V plugs (Toyota 19850-54090). Torque to 13 Nm. Do not overtighten.",
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
          fix: "Check IGN 15A fuse and ignition switch harness. If 12V is present at the wire but the solenoid does not click, unscrew the 24mm solenoid from pump, replace internal O-ring and plunger assembly, or replace solenoid unit."
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
        label: "Button gets rock hard quickly, but cracked injector flare nuts show no fuel squirt while cranking",
        conclusion: {
          title: "VE Injection Pump Internal Screen Clogged or Shear Pin Failure",
          severity: "critical",
          cause: "The micro-mesh banjo filter screen located under the pump fuel inlet union bolt is choked with algae/debris, or the pump drive gear woodruff key has sheared.",
          fix: "Remove fuel inlet union banjo bolt on the VE pump. Use a pick to extract the internal 10mm micro-filter screen and clean with carb cleaner. Check pump drive shaft rotation."
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

  // Tree 2: Engine Overheating Under Load
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

  // Tree 3: Smoke Diagnostics
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
          fix: "Inspect all 3 turbo intercooler/crossover hoses for splits. Pressure test wastegate actuator (should begin moving at 0.78 bar)."
        }
      },
      {
        label: "Boost pressure is normal (> 8 psi) and air filter is clean",
        conclusion: {
          title: "Dripping Injection Nozzles (Low Pop Pressure) or Over-Adjusted VE Max Fuel Screw",
          severity: "warning",
          cause: "Injection nozzles have worn needles that drip large droplets rather than atomizing. Alternatively, previous owner has over-tightened the VE pump smoke screw.",
          fix: "Re-shim injection nozzles to 145-155 kg/cm² opening pressure. Back off VE pump max fuel screw 1/4 turn counter-clockwise."
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
          fix: "Check turbo shaft radial play (limit: 0.18mm) and axial play (limit: 0.08mm). Rebuild CT20 turbo with 360° thrust bearing kit or replace cartridge (CHRA)."
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
  }
};
