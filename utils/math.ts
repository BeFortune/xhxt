import { DataPoint } from '../types';

// Generate QPSK Constellation points with Noise
export const generateQPSKConstellation = (snrDb: number, count: number): DataPoint[] => {
  const points: DataPoint[] = [];
  const targets = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
  ];

  // Convert SNR dB to linear scale for noise power calculation
  // Signal power is 2 (distance from origin to 1,1 is sqrt(2), squared is 2)
  // SNR = Ps / Pn => Pn = Ps / 10^(SNR/10)
  const signalPower = 2;
  const noisePower = signalPower / Math.pow(10, snrDb / 10);
  const noiseStdDev = Math.sqrt(noisePower / 2); // Split between I and Q

  for (let i = 0; i < count; i++) {
    const target = targets[Math.floor(Math.random() * targets.length)];
    
    // Box-Muller transform for Gaussian noise
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    points.push({
      x: target.x + z0 * noiseStdDev,
      y: target.y + z1 * noiseStdDev,
      type: 'Received',
    });
  }
  return points;
};

// Theoretical BER for QPSK in AWGN: 0.5 * erfc(sqrt(Eb/N0))
// Approx approximation for visualization
export const calculateTheoreticalBER = (snrRange: number[]): { snr: number; ber: number }[] => {
  return snrRange.map(snr => {
    const linearSnr = Math.pow(10, snr / 10);
    // Simplified approximation for QPSK
    const ber = 0.5 * Math.exp(-linearSnr / 2); // Very rough approx for viz curve
    return { snr, ber };
  });
};

// Generate Time Domain Signal (Sum of sinusoids)
export const generateOFDMWaveform = (addCP: boolean): DataPoint[] => {
  const points: DataPoint[] = [];
  const numSubcarriers = 8;
  const duration = addCP ? 1.25 : 1.0; // Extend for CP
  const samples = 200;

  for (let t = 0; t <= samples * duration; t++) {
    const time = (t / samples);
    let amplitude = 0;
    
    // Sum of sinusoids to mimic OFDM symbol
    for (let k = 1; k <= numSubcarriers; k++) {
        // Random phase for each subcarrier would be ideal, but fixed here for stability in viz
        amplitude += Math.sin(2 * Math.PI * k * time + (k * k)); 
    }
    
    // Normalize
    amplitude = amplitude / numSubcarriers;

    points.push({
      x: t,
      y: amplitude,
    });
  }
  return points;
};

// --- Advanced Simulation Utils ---

// 1. CP vs BER Simulation
// Simulate effect where if CP < Delay Spread, ISI occurs causing BER floor
export const calculateCPPerformance = (cpLength: number, delaySpread: number): DataPoint[] => {
    const data: DataPoint[] = [];
    const maxCp = 32;
    
    for(let cp = 0; cp <= maxCp; cp++) {
        // Simple model: ISI power is proportional to energy in the delay spread outside CP
        // If CP >= Delay Spread, ISI = 0.
        // If CP < Delay Spread, ISI increases.
        
        let isiFactor = 0;
        if (cp < delaySpread) {
            isiFactor = (delaySpread - cp) / delaySpread; // 0 to 1
        }
        
        // Base BER at decent SNR (e.g. 10^-4)
        const baseLogBer = -4; 
        // ISI adds an error floor. 
        // Effective BER approx = Base_BER + ISI_BER
        // We model ISI_BER roughly as 0.1 * isiFactor
        
        const effectiveBer = Math.pow(10, baseLogBer) + (0.2 * Math.pow(isiFactor, 2));
        
        data.push({
            x: cp,
            y: effectiveBer,
            type: cp === cpLength ? 'Current' : 'Simulated'
        });
    }
    return data;
};

// 2. CFO Constellation Simulation
// cfo: normalized frequency offset (0 to 0.5)
export const generateRotatedConstellation = (cfo: number, snrDb: number, count: number): DataPoint[] => {
  const points: DataPoint[] = [];
  const targets = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
  ];

  const signalPower = 2;
  const noisePower = signalPower / Math.pow(10, snrDb / 10);
  const noiseStdDev = Math.sqrt(noisePower / 2);

  for (let i = 0; i < count; i++) {
    const target = targets[Math.floor(Math.random() * targets.length)];
    
    // 1. Add AWGN Noise
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    let x = target.x + z0 * noiseStdDev;
    let y = target.y + z1 * noiseStdDev;

    // 2. Apply CFO Effects
    // Effect A: Common Phase Error (Rotation)
    // Rotation varies by symbol index in real OFDM, but here we visualize "snapshot" or average rotation
    // Let's create a random time index 'k' to simulate the progressive rotation across a packet
    const k = i % 10; // short range
    const rotationAngle = 2 * Math.PI * cfo * (Math.random() * 2); // Random rotation based on CFO magnitude
    
    // Effect B: ICI (Inter-carrier interference) - acts like extra noise
    // ICI power proportional to 1 - sinc(cfo) ~ cfo^2
    const iciPower = 0.5 * (cfo * cfo) * signalPower; // Rough heuristic
    const iciStd = Math.sqrt(iciPower);
    
    // ICI Noise
    const u3 = Math.random();
    const u4 = Math.random();
    const iciX = Math.sqrt(-2.0 * Math.log(u3)) * Math.cos(2.0 * Math.PI * u4) * iciStd;
    const iciY = Math.sqrt(-2.0 * Math.log(u3)) * Math.sin(2.0 * Math.PI * u4) * iciStd;

    // Apply rotation
    const x_rot = x * Math.cos(rotationAngle) - y * Math.sin(rotationAngle);
    const y_rot = x * Math.sin(rotationAngle) + y * Math.cos(rotationAngle);

    points.push({
      x: x_rot + iciX,
      y: y_rot + iciY,
    });
  }
  return points;
};

// 3. PAPR Simulation
export const generatePAPRWaveform = (slmEnabled: boolean): { data: DataPoint[], paprDb: number } => {
    const N = 64; // Subcarriers
    const generateSymbol = () => {
        const signal: number[] = new Array(N).fill(0);
        // Generate random phases
        const phases = Array.from({length: N}, () => Math.random() * 2 * Math.PI);
        
        // IFFT-ish sum (Real part only for viz)
        for(let t=0; t<N; t++) {
            let val = 0;
            for(let k=0; k<N; k++) {
                // Just use a subset of subcarriers active
                if(k > 10 && k < 54) {
                    val += Math.cos(2 * Math.PI * k * t / N + phases[k]);
                }
            }
            signal[t] = val;
        }
        return signal;
    };

    const calculatePAPR = (sig: number[]) => {
        const power = sig.map(v => v*v);
        const peak = Math.max(...power);
        const avg = power.reduce((a,b) => a+b, 0) / power.length;
        return 10 * Math.log10(peak / avg);
    };

    let bestSignal: number[] = [];
    let bestPAPR = Infinity;

    // If SLM, try multiple candidates
    const candidates = slmEnabled ? 8 : 1; 

    for(let i=0; i<candidates; i++) {
        const sig = generateSymbol();
        const papr = calculatePAPR(sig);
        if(papr < bestPAPR) {
            bestPAPR = papr;
            bestSignal = sig;
        }
    }

    return {
        data: bestSignal.map((y, x) => ({ x, y })),
        paprDb: bestPAPR
    };
};
