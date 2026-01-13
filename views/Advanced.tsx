import React, { useState, useMemo } from 'react';
import { Settings, Radio, TrendingDown, RefreshCw } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    ScatterChart, Scatter, ReferenceLine, LineChart, Line, Cell
} from 'recharts';
import { calculateCPPerformance, generateRotatedConstellation, generatePAPRWaveform } from '../utils/math';

export const Advanced: React.FC = () => {
  // State for Problem 1: CP
  const [cpLength, setCpLength] = useState(8);
  const delaySpread = 12; // Fixed scenario
  const cpData = useMemo(() => calculateCPPerformance(cpLength, delaySpread), [cpLength, delaySpread]);

  // State for Problem 2: CFO
  const [cfo, setCfo] = useState(0.0);
  const cfoData = useMemo(() => generateRotatedConstellation(cfo, 20, 400), [cfo]);

  // State for Problem 3: PAPR
  const [slmEnabled, setSlmEnabled] = useState(false);
  const [paprRefreshTrigger, setPaprRefreshTrigger] = useState(0);
  const { data: paprWaveform, paprDb } = useMemo(() => generatePAPRWaveform(slmEnabled), [slmEnabled, paprRefreshTrigger]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="border-l-4 border-purple-500 pl-4 mb-8">
        <h2 className="text-2xl font-bold text-slate-900">4.4 进阶仿真：研究问题拓展</h2>
        <p className="text-slate-500">深入探讨OFDM系统的性能瓶颈与优化技术。</p>
      </div>

      <div className="space-y-12">
        
        {/* --- Topic 1: CP Length --- */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mt-1">
                    <Settings size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">问题1：循环前缀(CP)长度优化</h3>
                    <p className="text-sm text-slate-500">
                        当前信道时延扩展 {'$\\tau_{max} = ' + delaySpread + '$'} 采样点。
                        调节CP长度，观察误码率(BER)变化。
                    </p>
                </div>
             </div>
             <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-slate-600">CP长度: {cpLength}</span>
                <input 
                    type="range" 
                    min="0" max="32" 
                    value={cpLength} 
                    onChange={(e) => setCpLength(Number(e.target.value))}
                    className="w-32 accent-purple-600"
                />
             </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="h-64">
                <p className="text-xs text-center text-slate-400 mb-2">CP长度 vs 误码率 (模拟)</p>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cpData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="x" label={{ value: 'CP Length', position: 'insideBottom', offset: -5, fontSize: 12 }} />
                        <YAxis scale="log" domain={[0.00001, 1]} tickFormatter={(v) => v < 0.001 ? v.toExponential(0) : v} width={50} />
                        <Tooltip 
                            formatter={(val: number) => val.toExponential(2)} 
                            labelFormatter={(label) => `CP Length: ${label}`}
                        />
                        <ReferenceLine x={delaySpread} stroke="red" strokeDasharray="3 3" label={{ value: "Delay Spread", position: 'insideTopLeft', fill: 'red', fontSize: 10 }} />
                        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} />
                        <ReferenceLine x={cpLength} stroke="#3b82f6" label={{ value: "Current", position: 'top', fill: '#3b82f6', fontSize: 10 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 flex flex-col justify-center">
                <h4 className="font-bold text-slate-800 mb-2">仿真分析</h4>
                <ul className="space-y-2 list-disc list-inside">
                    <li>
                        <span className="font-medium">抗多径能力：</span> 
                        当 {'$T_{cp} < \\tau_{max}$'} ({cpLength} &lt; {delaySpread}) 时，发生符号间干扰(ISI)，BER急剧上升。
                    </li>
                    <li>
                        <span className="font-medium">频谱效率：</span> 
                        CP越长，系统冗余越多，有效传输速率越低。最佳设计点通常略大于信道最大时延。
                    </li>
                    <li className={cpLength >= delaySpread ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                        当前状态: {cpLength >= delaySpread ? "ISI已消除 (Good)" : "存在严重ISI (Bad)"}
                    </li>
                </ul>
            </div>
          </div>
        </section>

        {/* --- Topic 2: CFO --- */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg mt-1">
                    <Radio size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">问题2：频偏(CFO)影响</h3>
                    <p className="text-sm text-slate-500">
                        调整归一化载波频偏 {'$\\Delta f$'}，观察星座图旋转与扩散(ICI)。
                    </p>
                </div>
             </div>
             <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-slate-600">频偏: {cfo.toFixed(2)}</span>
                <input 
                    type="range" 
                    min="0" max="0.25" step="0.01"
                    value={cfo} 
                    onChange={(e) => setCfo(Number(e.target.value))}
                    className="w-32 accent-red-600"
                />
             </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="h-64 border border-slate-100 rounded-lg bg-slate-50/50">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" domain={[-2.5, 2.5]} hide />
                    <YAxis type="number" dataKey="y" domain={[-2.5, 2.5]} hide />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <ReferenceLine x={0} stroke="#cbd5e1" />
                    <ReferenceLine y={0} stroke="#cbd5e1" />
                    <Scatter name="Received" data={cfoData} fill="#ef4444" fillOpacity={0.5} isAnimationActive={false} />
                  </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 flex flex-col justify-center">
                <h4 className="font-bold text-slate-800 mb-2">仿真分析</h4>
                <p className="mb-3">
                    CFO (Carrier Frequency Offset) 破坏了子载波的正交性，导致两个主要后果：
                </p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>
                        <strong className="text-slate-800">相位旋转 (CPE):</strong> 星座点整体发生旋转（如左图所示）。
                    </li>
                    <li>
                        <strong className="text-slate-800">载波间干扰 (ICI):</strong> 能量泄漏导致星座点像云一样扩散，表现为额外的噪声，无法通过简单的均衡消除。
                    </li>
                </ol>
                <div className="mt-4 p-2 bg-red-50 border border-red-100 rounded text-red-700 text-xs">
                    注意观察：随着频偏增大，星座点不仅旋转，而且变得模糊（ICI效应）。
                </div>
            </div>
          </div>
        </section>

        {/* --- Topic 3: PAPR --- */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mt-1">
                    <TrendingDown size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">问题3：峰均比(PAPR)降低技术</h3>
                    <p className="text-sm text-slate-500">
                        OFDM信号由大量子载波叠加，容易产生高峰值功率。使用SLM算法降低PAPR。
                    </p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSlmEnabled(!slmEnabled)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${slmEnabled ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    {slmEnabled ? 'SLM算法: 开启' : 'SLM算法: 关闭'}
                </button>
                <button 
                    onClick={() => setPaprRefreshTrigger(p => p + 1)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                    title="生成新符号"
                >
                    <RefreshCw size={20} />
                </button>
             </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="h-64 relative">
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded shadow text-xs font-mono font-bold z-10 border border-slate-200">
                    PAPR: {paprDb.toFixed(2)} dB
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={paprWaveform} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <YAxis hide domain={['auto', 'auto']} />
                        <XAxis hide />
                        <Tooltip labelFormatter={() => ''} formatter={(val: number) => [val.toFixed(3), 'Amplitude']} />
                        <ReferenceLine y={0} stroke="#cbd5e1" />
                        <Line type="monotone" dataKey="y" stroke={slmEnabled ? "#f97316" : "#64748b"} strokeWidth={2} dot={false} isAnimationActive={true} animationDuration={300} />
                    </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-center text-slate-400 mt-2">时域波形幅度 (Time Domain Amplitude)</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 flex flex-col justify-center">
                <h4 className="font-bold text-slate-800 mb-2">选择性映射 (SLM) 原理</h4>
                <p className="mb-2">
                    SLM (Selected Mapping) 是一种概率性降低PAPR的方法：
                </p>
                <ul className="list-disc list-inside space-y-1 mb-4 text-xs">
                    <li>生成同一数据块的 <strong className="text-orange-700">U</strong> 个不同相位表示。</li>
                    <li>分别进行IFFT变换。</li>
                    <li>选择PAPR最小的那个信号进行发射。</li>
                </ul>
                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                   <span className="text-xs font-medium text-slate-500">当前PAPR性能</span>
                   <span className={`text-lg font-bold font-mono ${paprDb > 8 ? 'text-red-500' : 'text-green-500'}`}>
                       {paprDb.toFixed(2)} dB
                   </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                    注：PAPR > 8dB 通常会对功率放大器(PA)造成非线性失真。
                </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
