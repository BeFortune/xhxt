import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Legend
} from 'recharts';
import { generateQPSKConstellation, generateOFDMWaveform, calculateTheoreticalBER } from '../utils/math';

export const Visualization: React.FC = () => {
  const [snr, setSnr] = useState(15);
  const [cpEnabled, setCpEnabled] = useState(true);

  // Memoize data generation to avoid re-calc on every render unless params change
  const constellationData = useMemo(() => generateQPSKConstellation(snr, 300), [snr]);
  const timeDomainData = useMemo(() => generateOFDMWaveform(cpEnabled), [cpEnabled]);
  const berCurveData = useMemo(() => calculateTheoreticalBER(Array.from({ length: 21 }, (_, i) => i)), []);
  
  // Calculate a "current" point for the BER chart based on slider
  const currentBerPoint = [calculateTheoreticalBER([snr])[0]];

  return (
    <div className="space-y-8 pb-12">
       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <div>
             <h2 className="text-xl font-bold text-slate-800">4.3 关键可视化演示</h2>
             <p className="text-sm text-slate-500">调整参数以观察实时仿真结果</p>
           </div>
           
           <div className="flex items-center gap-6">
             <div className="flex flex-col w-48">
               <label className="text-xs font-semibold text-slate-500 mb-1">信噪比 (SNR): {snr} dB</label>
               <input
                 type="range"
                 min="0"
                 max="25"
                 value={snr}
                 onChange={(e) => setSnr(Number(e.target.value))}
                 className="h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
               />
             </div>
             <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">循环前缀 (CP)</label>
                <button
                  onClick={() => setCpEnabled(!cpEnabled)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${cpEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                >
                  {cpEnabled ? '已启用 (25%)' : '未启用'}
                </button>
             </div>
           </div>
         </div>
       </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Viz 2: Constellation */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">星座图 (Constellation)</h3>
          <p className="text-xs text-slate-500 mb-4">QPSK调制在多径信道与AWGN下的接收信号。观察SNR降低时星座点的发散情况。</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="I" domain={[-2.5, 2.5]} tickCount={5} stroke="#94a3b8" />
                <YAxis type="number" dataKey="y" name="Q" domain={[-2.5, 2.5]} tickCount={5} stroke="#94a3b8" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <ReferenceLine x={0} stroke="#cbd5e1" />
                <ReferenceLine y={0} stroke="#cbd5e1" />
                <Scatter name="Received" data={constellationData} fill="#3b82f6" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Viz 3: BER Performance */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-semibold text-slate-800 mb-2">误码率性能 (BER vs SNR)</h3>
           <p className="text-xs text-slate-500 mb-4">理论QPSK误码率曲线。红点代表当前SNR设置下的理论工作点。</p>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="snr" type="number" domain={[0, 20]} label={{ value: 'SNR (dB)', position: 'insideBottom', offset: -5 }} stroke="#94a3b8" />
                <YAxis dataKey="ber" type="number" scale="log" domain={['auto', 'auto']} allowDataOverflow stroke="#94a3b8" />
                <Tooltip formatter={(value: number) => value.toExponential(2)} />
                <Legend />
                <Line type="monotone" data={berCurveData} dataKey="ber" stroke="#64748b" dot={false} name="理论BER" strokeWidth={2} />
                <Scatter data={currentBerPoint} fill="#ef4444">
                    {/* Hack to mix scatter in line chart if needed, but Recharts handles Line dots manually nicely too. 
                        Here we simulate a single point "measurement" via a separate Line or customized dot */}
                </Scatter>
                <Line type="monotone" data={currentBerPoint} dataKey="ber" stroke="none" dot={{ fill: '#ef4444', r: 6 }} name="当前SNR" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Viz 1: Time Domain */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">时域OFDM符号 (Time Domain)</h3>
          <p className="text-xs text-slate-500 mb-4">
             展示单个OFDM符号的时域波形。{cpEnabled ? '灰色区域表示添加的循环前缀(CP)，它是符号尾部的复制。' : '未添加CP。'}
          </p>
          <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeDomainData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="x" hide />
                <YAxis domain={[-3, 3]} hide />
                <Tooltip />
                {cpEnabled && (
                    <ReferenceLine x={40} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "CP Boundary", position: 'insideTopRight', fill: '#64748b', fontSize: 12 }} />
                )}
                {cpEnabled && (
                    <ReferenceLine segment={[{ x: 0, y: -3 }, { x: 40, y: -3 }]} stroke="none" />
                )} 
                {/* Highlight CP Area manually roughly */}
                <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};