import React from 'react';
import { Layers, Activity, Monitor } from 'lucide-react';

export const Overview: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">简易OFDM系统仿真</h2>
        <p className="text-slate-500 text-lg">
          构建一个完整的正交频分复用（OFDM）通信系统仿真展示，涵盖从发射端信号生成到接收端解调的全过程。
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Monitor size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">仿真平台</h3>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>MATLAB / Python (NumPy)</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>可视化: Matplotlib / Plotly</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>目标: 全流程信号处理展示</li>
          </ul>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <Layers size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">核心流程</h3>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>发射: QAM调制, IFFT, 加CP</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>信道: 多径衰落, AWGN噪声</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>接收: 去CP, FFT, 均衡, 解调</li>
          </ul>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <Activity size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">可视化目标</h3>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>时频域信号对比</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>信道估计与星座图</li>
            <li className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>BER/SNR 性能分析</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">课程联系</h3>
        <div className="grid md:grid-cols-2 gap-8 text-slate-600">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">信号处理基础</h4>
            <p className="text-sm">
              第1-3章：傅里叶变换原理（FFT/IFFT）是OFDM实现多载波正交的关键。利用卷积定理理解信道对信号的影响。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">通信系统设计</h4>
            <p className="text-sm">
              第4-8章：QAM调制提升频谱效率，循环前缀（CP）对抗多径干扰（ISI），信道均衡恢复原始信号。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};