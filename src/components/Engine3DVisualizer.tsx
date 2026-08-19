import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  RotateCw,
  Eye,
  Sparkles,
  Maximize2,
  RefreshCw,
  Flame,
  Droplet,
  Zap
} from 'lucide-react';

interface EngineLayer {
  id: string;
  name: string;
  oemPartNo: string;
  material: string;
  torqueSpec: string;
  yOffsetFactor: number;
  color: string;
  accentColor: string;
  description: string;
}

const ENGINE_LAYERS: EngineLayer[] = [
  {
    id: 'valve-cover',
    name: 'Cast Aluminum Valve Cover & PCV Baffle',
    oemPartNo: '11201-54070',
    material: 'Die-cast Aluminum with Ribbed Baffle',
    torqueSpec: '8.0 Nm (71 in-lb)',
    yOffsetFactor: -130,
    color: '#475569',
    accentColor: '#94a3b8',
    description: 'Ribbed aluminum cover sealing overhead valvetrain with integrated oil baffle and breather nozzle.'
  },
  {
    id: 'camshaft',
    name: 'SOHC Camshaft & 8 Induction-Hardened Lobes',
    oemPartNo: '13501-54070',
    material: 'Chilled Cast Iron / Hardened Steel Lobes',
    torqueSpec: 'Bearing Caps: 18 Nm | Cam Bolt: 98 Nm',
    yOffsetFactor: -90,
    color: '#64748b',
    accentColor: '#38bdf8',
    description: 'Direct-actuation camshaft with 8 eccentric lobes and 5 precision-ground bearing journals.'
  },
  {
    id: 'lifters-shims',
    name: '8x Bucket Lifters & Precision Ground Shims',
    oemPartNo: '13751-54010',
    material: 'Hardened Alloy Steel (2.50 - 3.30mm)',
    torqueSpec: 'Cold Lash: In 0.25mm / Ex 0.45mm',
    yOffsetFactor: -55,
    color: '#94a3b8',
    accentColor: '#c084fc',
    description: 'Cylindrical bucket followers with stamped top adjusting shims directly above valve stems.'
  },
  {
    id: 'cylinder-head',
    name: 'Cast Iron Cylinder Head & Swirl Pre-Chambers',
    oemPartNo: '11101-54121',
    material: 'High-Nickel Grey Cast Iron + Ceramic Pre-Cups',
    torqueSpec: '18 Bolts: 78 Nm + 90° + 90° (Criss-Cross)',
    yOffsetFactor: -15,
    color: '#334155',
    accentColor: '#f87171',
    description: 'Cross-flow head featuring Ricardo Comet V swirl pre-combustion chambers and glow plug wells.'
  },
  {
    id: 'head-gasket',
    name: 'Multi-Layer Steel (MLS) Head Gasket (Grade B/D/F)',
    oemPartNo: '11115-54084-B/D/F',
    material: 'Triple Stainless Steel with Viton Fire Rings',
    torqueSpec: 'Matched to Piston Protrusion: 0.68-0.97mm',
    yOffsetFactor: 25,
    color: '#b45309',
    accentColor: '#fbbf24',
    description: 'Laser-cut steel gasket with 4 combustion fire rings and oil restrictor transfer orifice.'
  },
  {
    id: 'engine-block',
    name: '2L-T Deep-Skirt Block, Pistons & Oil Squirters',
    oemPartNo: '11401-59195',
    material: 'Cast Iron Deep-Skirt / Forged Crankshaft',
    torqueSpec: 'Main Caps: 103 Nm | Rods: 54 Nm + 90°',
    yOffsetFactor: 75,
    color: '#1e293b',
    accentColor: '#34d399',
    description: '92mm square bore/stroke block with 4 cylinders, aluminum pistons, and under-crown cooling jets.'
  }
];

export const Engine3DVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [explosionAmount, setExplosionAmount] = useState<number>(35); // 0% to 100%
  const [rotationAngle, setRotationAngle] = useState<number>(35); // Isometric yaw
  const [pitchAngle, setPitchAngle] = useState<number>(20); // Isometric pitch
  const [selectedLayer, setSelectedLayer] = useState<EngineLayer>(ENGINE_LAYERS[3]);
  const [fluidFlowMode, setFluidFlowMode] = useState<'none' | 'coolant' | 'oil' | 'fuel'>('none');
  const [xRayMode, setXRayMode] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [activeBoltStage, setActiveBoltStage] = useState<number>(1);

  // 3D Projection Math Helper
  const project3D = (
    x: number,
    y: number,
    z: number,
    yawDeg: number,
    pitchDeg: number,
    cx: number,
    cy: number
  ) => {
    const yaw = (yawDeg * Math.PI) / 180;
    const pitch = (pitchDeg * Math.PI) / 180;

    // Yaw Rotation (Y-axis)
    const x1 = x * Math.cos(yaw) - z * Math.sin(yaw);
    const z1 = x * Math.sin(yaw) + z * Math.cos(yaw);

    // Pitch Rotation (X-axis)
    const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);

    // Perspective foreshortening
    const scale = 400 / (400 + z2 * 0.35);

    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale,
      depth: z2
    };
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      if (isAutoRotating) {
        setRotationAngle((prev) => (prev + 0.35) % 360);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2 - 10;

      // Dark Industrial Background with Vignette
      ctx.fillStyle = '#0a0d12';
      ctx.fillRect(0, 0, width, height);

      // Draw Floor Radial Shadow & Perspective Grid
      drawFloorGrid(ctx, cx, cy, rotationAngle, pitchAngle);

      // Render Each Component with Realistic Automotive Geometry
      const scaleExplosion = explosionAmount / 35;

      // 1. Engine Block (Bottom)
      drawRealisticEngineBlock(
        ctx,
        cx,
        cy,
        ENGINE_LAYERS[5].yOffsetFactor * scaleExplosion,
        rotationAngle,
        pitchAngle,
        selectedLayer.id === 'engine-block',
        xRayMode,
        tick
      );

      // 2. Head Gasket
      drawRealisticHeadGasket(
        ctx,
        cx,
        cy,
        ENGINE_LAYERS[4].yOffsetFactor * scaleExplosion,
        rotationAngle,
        pitchAngle,
        selectedLayer.id === 'head-gasket',
        xRayMode
      );

      // 3. Cylinder Head & Pre-Chambers
      drawRealisticCylinderHead(
        ctx,
        cx,
        cy,
        ENGINE_LAYERS[3].yOffsetFactor * scaleExplosion,
        rotationAngle,
        pitchAngle,
        selectedLayer.id === 'cylinder-head',
        xRayMode,
        fluidFlowMode,
        tick
      );

      // 4. Lifters & Shims
      drawRealisticLiftersShims(
        ctx,
        cx,
        cy,
        ENGINE_LAYERS[2].yOffsetFactor * scaleExplosion,
        rotationAngle,
        pitchAngle,
        selectedLayer.id === 'lifters-shims',
        xRayMode
      );

      // 5. Camshaft & Sprocket
      drawRealisticCamshaft(
        ctx,
        cx,
        cy,
        ENGINE_LAYERS[1].yOffsetFactor * scaleExplosion,
        rotationAngle,
        pitchAngle,
        selectedLayer.id === 'camshaft',
        xRayMode,
        tick
      );

      // 6. Valve Cover (Top)
      drawRealisticValveCover(
        ctx,
        cx,
        cy,
        ENGINE_LAYERS[0].yOffsetFactor * scaleExplosion,
        rotationAngle,
        pitchAngle,
        selectedLayer.id === 'valve-cover',
        xRayMode
      );

      // 7. 18 Cylinder Head Bolts
      if (selectedLayer.id === 'cylinder-head' || selectedLayer.id === 'head-gasket' || explosionAmount > 10) {
        drawRealisticHeadBolts(
          ctx,
          cx,
          cy,
          ENGINE_LAYERS[3].yOffsetFactor * scaleExplosion,
          explosionAmount,
          activeBoltStage,
          rotationAngle,
          pitchAngle
        );
      }

      // 8. Streamlined High-Tech Fluid Flow Pipes & Ribbons
      if (fluidFlowMode !== 'none') {
        drawFluidFlowStream(
          ctx,
          cx,
          cy,
          fluidFlowMode,
          scaleExplosion,
          rotationAngle,
          pitchAngle,
          tick
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [explosionAmount, rotationAngle, pitchAngle, selectedLayer, fluidFlowMode, xRayMode, isAutoRotating, activeBoltStage]);

  // Draw Perspective Floor Grid
  const drawFloorGrid = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    yaw: number,
    pitch: number
  ) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;
    const gridSpan = 240;
    const step = 40;

    for (let x = -gridSpan; x <= gridSpan; x += step) {
      const p1 = project3D(x, 150, -gridSpan, yaw, pitch, cx, cy);
      const p2 = project3D(x, 150, gridSpan, yaw, pitch, cx, cy);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let z = -gridSpan; z <= gridSpan; z += step) {
      const p1 = project3D(-gridSpan, 150, z, yaw, pitch, cx, cy);
      const p2 = project3D(gridSpan, 150, z, yaw, pitch, cx, cy);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Helper to draw beveled isometric 3D component body with highlights
  const renderBeveledBlock = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    y: number,
    w: number,
    h: number,
    d: number,
    topColor: string,
    frontColor: string,
    sideColor: string,
    isSelected: boolean,
    isXRay: boolean,
    yaw: number,
    pitch: number
  ) => {
    const hw = w / 2;
    const hh = h / 2;
    const hd = d / 2;

    const v = [
      project3D(-hw, y - hh, -hd, yaw, pitch, cx, cy), // 0: Top Front Left
      project3D(hw, y - hh, -hd, yaw, pitch, cx, cy),  // 1: Top Front Right
      project3D(hw, y - hh, hd, yaw, pitch, cx, cy),   // 2: Top Back Right
      project3D(-hw, y - hh, hd, yaw, pitch, cx, cy),  // 3: Top Back Left
      project3D(-hw, y + hh, -hd, yaw, pitch, cx, cy), // 4: Bottom Front Left
      project3D(hw, y + hh, -hd, yaw, pitch, cx, cy),  // 5: Bottom Front Right
      project3D(hw, y + hh, hd, yaw, pitch, cx, cy),   // 6: Bottom Back Right
      project3D(-hw, y + hh, hd, yaw, pitch, cx, cy)   // 7: Bottom Back Left
    ];

    ctx.save();
    if (isSelected) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
    }

    const drawPoly = (indices: number[], fill: string, stroke: string) => {
      ctx.beginPath();
      ctx.moveTo(v[indices[0]].x, v[indices[0]].y);
      for (let i = 1; i < indices.length; i++) ctx.lineTo(v[indices[i]].x, v[indices[i]].y);
      ctx.closePath();
      ctx.fillStyle = isXRay ? 'rgba(56, 189, 248, 0.15)' : fill;
      ctx.strokeStyle = isSelected ? '#38bdf8' : stroke;
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.fill();
      ctx.stroke();
    };

    // Draw Top Face
    drawPoly([0, 1, 2, 3], topColor, '#475569');
    // Draw Front Face
    drawPoly([0, 1, 5, 4], frontColor, '#334155');
    // Draw Right Face
    drawPoly([1, 2, 6, 5], sideColor, '#1e293b');

    ctx.restore();
  };

  // 1. Realistic Engine Block with 4 Cylinder Bores & Pistons
  const drawRealisticEngineBlock = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    y: number,
    yaw: number,
    pitch: number,
    isSelected: boolean,
    isXRay: boolean,
    tick: number
  ) => {
    // Main Crankcase Block
    renderBeveledBlock(ctx, cx, cy, y, 190, 48, 120, '#1e293b', '#0f172a', '#0a0f1d', isSelected, isXRay, yaw, pitch);

    // 4 Cylinder Bores (92mm Diameter)
    ctx.save();
    for (let cyl = 0; cyl < 4; cyl++) {
      const bx = -60 + cyl * 40;
      const boreCenter = project3D(bx, y - 24, 0, yaw, pitch, cx, cy);

      // Bore Top Rim
      ctx.beginPath();
      ctx.arc(boreCenter.x, boreCenter.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#020617';
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#38bdf8' : '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Piston Crown inside bore (Piston moves rhythmically)
      const pistonOffset = Math.sin(tick * 0.08 + (cyl % 2 === 0 ? 0 : Math.PI)) * 4;
      const pistonP = project3D(bx, y - 24 + pistonOffset, 0, yaw, pitch, cx, cy);
      ctx.beginPath();
      ctx.arc(pistonP.x, pistonP.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#64748b';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();
    }
    ctx.restore();
  };

  // 2. Realistic MLS Head Gasket with Fire Rings
  const drawRealisticHeadGasket = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    y: number,
    yaw: number,
    pitch: number,
    isSelected: boolean,
    isXRay: boolean
  ) => {
    renderBeveledBlock(ctx, cx, cy, y, 186, 4, 116, '#b45309', '#78350f', '#451a03', isSelected, isXRay, yaw, pitch);

    // 4 Metallic Fire Rings
    ctx.save();
    for (let i = 0; i < 4; i++) {
      const ringP = project3D(-60 + i * 40, y - 2, 0, yaw, pitch, cx, cy);
      ctx.beginPath();
      ctx.arc(ringP.x, ringP.y, 12, 0, Math.PI * 2);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // Gasket Notch Grade Identifier (Grade D: 2 Notches)
    const notchP = project3D(85, y - 2, 50, yaw, pitch, cx, cy);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(notchP.x, notchP.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // 3. Realistic Cylinder Head & Pre-Combustion Swirl Cups
  const drawRealisticCylinderHead = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    y: number,
    yaw: number,
    pitch: number,
    isSelected: boolean,
    isXRay: boolean,
    _flowMode: string,
    tick: number
  ) => {
    renderBeveledBlock(ctx, cx, cy, y, 188, 38, 118, '#334155', '#1e293b', '#0f172a', isSelected, isXRay, yaw, pitch);

    // 4 Ceramic Swirl Pre-Chamber Cups with Glow Plugs
    ctx.save();
    for (let i = 0; i < 4; i++) {
      const cupP = project3D(-60 + i * 40, y + 10, -25, yaw, pitch, cx, cy);
      ctx.beginPath();
      ctx.arc(cupP.x, cupP.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing Glow Plug Tip inside Pre-Chamber
      const glowP = project3D(-60 + i * 40, y + 10, -22, yaw, pitch, cx, cy);
      ctx.beginPath();
      ctx.arc(glowP.x, glowP.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248, 113, 113, ${0.7 + Math.sin(tick * 0.1 + i) * 0.3})`;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.restore();
  };

  // 4. Realistic 8x Bucket Followers & Shims
  const drawRealisticLiftersShims = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    y: number,
    yaw: number,
    pitch: number,
    isSelected: boolean,
    _isXRay: boolean
  ) => {
    ctx.save();
    // 8 Valves (Intake and Exhaust per cylinder)
    for (let cyl = 0; cyl < 4; cyl++) {
      for (let v = 0; v < 2; v++) {
        const lx = -68 + cyl * 40 + v * 16;
        const lz = v === 0 ? -18 : 18;
        const lifterTop = project3D(lx, y - 8, lz, yaw, pitch, cx, cy);
        const lifterBottom = project3D(lx, y + 8, lz, yaw, pitch, cx, cy);

        // Lifter Cylinder Body
        ctx.beginPath();
        ctx.moveTo(lifterTop.x - 5, lifterTop.y);
        ctx.lineTo(lifterTop.x + 5, lifterTop.y);
        ctx.lineTo(lifterBottom.x + 5, lifterBottom.y);
        ctx.lineTo(lifterBottom.x - 5, lifterBottom.y);
        ctx.closePath();
        ctx.fillStyle = isSelected ? '#a855f7' : '#64748b';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#c084fc' : '#94a3b8';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Stamped Ground Shim on Top
        ctx.beginPath();
        ctx.arc(lifterTop.x, lifterTop.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#e2e8f0';
        ctx.fill();
        ctx.strokeStyle = '#c084fc';
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  // 5. Realistic SOHC Camshaft with 8 Egg-Shaped Lobes & Front Pulley
  const drawRealisticCamshaft = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    y: number,
    yaw: number,
    pitch: number,
    isSelected: boolean,
    _isXRay: boolean,
    tick: number
  ) => {
    ctx.save();
    // Camshaft Center Bar
    const camLeft = project3D(-95, y, 0, yaw, pitch, cx, cy);
    const camRight = project3D(85, y, 0, yaw, pitch, cx, cy);

    ctx.beginPath();
    ctx.moveTo(camLeft.x, camLeft.y);
    ctx.lineTo(camRight.x, camRight.y);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 8 Eccentric Cam Lobes
    for (let cyl = 0; cyl < 4; cyl++) {
      for (let v = 0; v < 2; v++) {
        const lx = -68 + cyl * 40 + v * 16;
        const lobeCenter = project3D(lx, y, 0, yaw, pitch, cx, cy);

        // Angled Egg-Shaped Cam Lobe
        const lobeAngle = (cyl * 90 + v * 45 + tick * 2) * (Math.PI / 180);
        const lobeTip = project3D(lx, y + Math.sin(lobeAngle) * 9, Math.cos(lobeAngle) * 9, yaw, pitch, cx, cy);

        ctx.beginPath();
        ctx.moveTo(lobeCenter.x, lobeCenter.y);
        ctx.lineTo(lobeTip.x, lobeTip.y);
        ctx.strokeStyle = isSelected ? '#38bdf8' : '#cbd5e1';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    // Front Timing Sprocket Wheel (Left side)
    const sprocketP = project3D(-98, y, 0, yaw, pitch, cx, cy);
    ctx.beginPath();
    ctx.arc(sprocketP.x, sprocketP.y, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#38bdf8' : '#64748b';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 3:00 Alignment Timing Notch
    const notchP = project3D(-98, y, 22, yaw, pitch, cx, cy);
    ctx.beginPath();
    ctx.arc(notchP.x, notchP.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    ctx.restore();
  };

  // 6. Realistic Valve Cover with Contours & PCV Port
  const drawRealisticValveCover = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    y: number,
    yaw: number,
    pitch: number,
    isSelected: boolean,
    isXRay: boolean
  ) => {
    // Ribbed Aluminum Cover
    renderBeveledBlock(ctx, cx, cy, y, 184, 26, 114, '#475569', '#334155', '#1e293b', isSelected, isXRay, yaw, pitch);

    // Top Cast Longitudinal Ribs
    ctx.save();
    ctx.strokeStyle = isSelected ? '#38bdf8' : '#64748b';
    ctx.lineWidth = 2;
    for (let r = -25; r <= 25; r += 12) {
      const p1 = project3D(-70, y - 14, r, yaw, pitch, cx, cy);
      const p2 = project3D(70, y - 14, r, yaw, pitch, cx, cy);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Oil Filler Cap on Front
    const capP = project3D(-50, y - 15, -30, yaw, pitch, cx, cy);
    ctx.beginPath();
    ctx.arc(capP.x, capP.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };

  // 7. 18 Cylinder Head Bolts (Hex heads and threaded shanks)
  const drawRealisticHeadBolts = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    headY: number,
    explosion: number,
    stage: number,
    yaw: number,
    pitch: number
  ) => {
    const boltTopY = headY - 45 - explosion * 0.45;
    const boltColor = stage === 3 ? '#ef4444' : stage === 2 ? '#f59e0b' : '#38bdf8';

    ctx.save();
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 9; c++) {
        const bx = -72 + c * 18;
        const bz = -42 + r * 84;

        const pTop = project3D(bx, boltTopY, bz, yaw, pitch, cx, cy);
        const pBottom = project3D(bx, headY + 12, bz, yaw, pitch, cx, cy);

        // Bolt Shank with High-Tensile Metallic Gradient
        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y);
        ctx.lineTo(pBottom.x, pBottom.y);
        ctx.strokeStyle = boltColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 12-Point 14mm Flanged Bolt Head
        ctx.beginPath();
        ctx.arc(pTop.x, pTop.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = boltColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  // 8. Streamlined Fluid Flow Ribbons & Vectors
  const drawFluidFlowStream = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    mode: 'coolant' | 'oil' | 'fuel',
    explosion: number,
    yaw: number,
    pitch: number,
    tick: number
  ) => {
    ctx.save();
    const color = mode === 'coolant' ? '#38bdf8' : mode === 'oil' ? '#fbbf24' : '#34d399';
    const baseY = (mode === 'coolant' ? -15 : mode === 'oil' ? 75 : -15) * explosion;

    // Draw Continuous Fluid Pipeline
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    for (let i = -80; i <= 80; i += 10) {
      const py = baseY + Math.sin(tick * 0.06 + i * 0.05) * 6;
      const pz = Math.cos(tick * 0.06 + i * 0.05) * 35;
      const p = project3D(i, py, pz, yaw, pitch, cx, cy);
      if (i === -80) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // Pulse Waveform Head
    const pulseHeadX = ((tick * 2) % 160) - 80;
    const pulseHeadY = baseY + Math.sin(tick * 0.06 + pulseHeadX * 0.05) * 6;
    const pulseHeadZ = Math.cos(tick * 0.06 + pulseHeadX * 0.05) * 35;
    const pulseP = project3D(pulseHeadX, pulseHeadY, pulseHeadZ, yaw, pitch, cx, cy);

    ctx.beginPath();
    ctx.arc(pulseP.x, pulseP.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="tech-panel p-6 bg-gradient-to-r from-[#171c24] via-[#141a22] to-[#12161d] border-[#263243]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-toyota">Automotive CAD 3D Digital Twin</span>
              <span className="badge-spec flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Real-Time Engine Assembly & Fluid Dynamics
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-cyan-400" />
              2L-T Interactive 3D Digital Twin & Exploded Assembly
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Precision 3D rendering of the 2L-T valvetrain, camshaft, swirl pre-chambers, MLS gasket, and deep-skirt block with interactive fluid dynamics and 18-bolt torque sequence visualization.
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setXRayMode(!xRayMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                xRayMode
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-[#1b222c] border border-[#2b3746] text-gray-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> {xRayMode ? 'Solid Mode' : 'X-Ray Ghost'}
            </button>
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                isAutoRotating
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-[#1b222c] border border-[#2b3746] text-gray-300 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" /> {isAutoRotating ? 'Stop Rotation' : 'Auto Orbit'}
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas & Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Viewport Canvas (2 Columns) */}
        <div className="lg:col-span-2 tech-panel bg-[#0a0d11] border-[#222b37] overflow-hidden flex flex-col relative min-h-[480px]">
          {/* Canvas Viewport */}
          <canvas
            ref={canvasRef}
            width={720}
            height={480}
            className="w-full h-[480px] cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startY = e.clientY;
              const startYaw = rotationAngle;
              const startPitch = pitchAngle;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const deltaY = moveEvent.clientY - startY;
                setRotationAngle((startYaw + deltaX * 0.5 + 360) % 360);
                setPitchAngle(Math.max(-45, Math.min(60, startPitch + deltaY * 0.3)));
              };

              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
          />

          {/* Floating Canvas HUD Overlay */}
          <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-[#12161cf0] backdrop-blur-md border border-[#242e3c] text-xs font-mono space-y-1">
            <div className="text-gray-400 text-[10px] uppercase font-bold">Selected Assembly:</div>
            <div className="text-cyan-400 font-bold">{selectedLayer.name}</div>
            <div className="text-gray-500 text-[10px]">OEM: {selectedLayer.oemPartNo}</div>
          </div>

          {/* Fluid Flow Selector Toolbar */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#12161cf0] backdrop-blur-md p-1.5 rounded-xl border border-[#242e3c]">
            <span className="text-[10px] font-mono text-gray-400 px-1">Fluid Flow:</span>
            <button
              onClick={() => setFluidFlowMode(fluidFlowMode === 'coolant' ? 'none' : 'coolant')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                fluidFlowMode === 'coolant'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white bg-[#19202a]'
              }`}
            >
              <Droplet className="w-3 h-3 text-sky-300" /> Coolant Loop
            </button>
            <button
              onClick={() => setFluidFlowMode(fluidFlowMode === 'oil' ? 'none' : 'oil')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                fluidFlowMode === 'oil'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white bg-[#19202a]'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-300" /> Oil Galleys
            </button>
            <button
              onClick={() => setFluidFlowMode(fluidFlowMode === 'fuel' ? 'none' : 'fuel')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                fluidFlowMode === 'fuel'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white bg-[#19202a]'
              }`}
            >
              <Zap className="w-3 h-3 text-emerald-300" /> Fuel Circuit
            </button>
          </div>

          {/* Bottom Slider Bar for Explosion */}
          <div className="p-4 bg-[#10141a] border-t border-[#1f2733] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400 font-bold uppercase flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Exploded Assembly Distance:
                </span>
                <span className="text-cyan-400 font-bold">{explosionAmount}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={explosionAmount}
                onChange={(e) => setExplosionAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1b222d] rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setExplosionAmount(0);
                  setRotationAngle(35);
                  setPitchAngle(20);
                }}
                className="px-3 py-1.5 bg-[#1b222d] hover:bg-[#252f3e] border border-[#293544] rounded-lg text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1"
                title="Reset View"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset View
              </button>
            </div>
          </div>
        </div>

        {/* Right Details & Component Inspector (1 Column) */}
        <div className="space-y-4">
          {/* Layer Selector Stack */}
          <div className="tech-panel p-4 bg-[#12161c] border-[#242e3c] space-y-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider block mb-1">
              Select 3D Component Layer:
            </span>

            {ENGINE_LAYERS.map((layer) => {
              const isSelected = selectedLayer.id === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs font-mono flex items-center justify-between ${
                    isSelected
                      ? 'border-cyan-500 bg-[#142330] text-white ring-1 ring-cyan-500/50 shadow-md'
                      : 'border-[#222b37] bg-[#14181f] text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: layer.accentColor }}
                    />
                    <span className="font-bold text-gray-200 line-clamp-1">{layer.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{layer.oemPartNo.split('-')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Layer Blueprint Card */}
          <div className="tech-panel p-5 bg-[#13171f] border-cyan-900/40 space-y-3">
            <div className="pb-2 border-b border-[#242f3d]">
              <span className="badge-toyota font-mono text-[10px]">OEM: {selectedLayer.oemPartNo}</span>
              <h3 className="text-base font-bold text-white mt-1">{selectedLayer.name}</h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-[#0d1014] rounded-lg border border-[#212a36]">
                <span className="text-gray-400 uppercase text-[10px] block font-bold">Material & Metallurgy:</span>
                <span className="text-cyan-300 font-bold">{selectedLayer.material}</span>
              </div>

              <div className="p-2.5 bg-[#0d1014] rounded-lg border border-[#212a36]">
                <span className="text-gray-400 uppercase text-[10px] block font-bold">Fastener & Torque Spec:</span>
                <span className="text-emerald-400 font-bold">{selectedLayer.torqueSpec}</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed pt-1">
              {selectedLayer.description}
            </p>

            {/* 18-Bolt Tightening Stage Switcher if Head Selected */}
            {(selectedLayer.id === 'cylinder-head' || selectedLayer.id === 'head-gasket') && (
              <div className="p-3 bg-[#191e27] rounded-xl border border-[#293544] space-y-2 text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase text-[10px] block">
                  18-Bolt Torque Stage Preview:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setActiveBoltStage(1)}
                    className={`py-1 rounded text-[10px] font-bold ${
                      activeBoltStage === 1 ? 'bg-cyan-600 text-white' : 'bg-[#12161c] text-gray-400'
                    }`}
                  >
                    Stage 1 (78 Nm)
                  </button>
                  <button
                    onClick={() => setActiveBoltStage(2)}
                    className={`py-1 rounded text-[10px] font-bold ${
                      activeBoltStage === 2 ? 'bg-amber-600 text-white' : 'bg-[#12161c] text-gray-400'
                    }`}
                  >
                    Stage 2 (+90°)
                  </button>
                  <button
                    onClick={() => setActiveBoltStage(3)}
                    className={`py-1 rounded text-[10px] font-bold ${
                      activeBoltStage === 3 ? 'bg-red-600 text-white' : 'bg-[#12161c] text-gray-400'
                    }`}
                  >
                    Stage 3 (+90°)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
