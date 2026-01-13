import React from 'react';
import { ArrowDown } from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';

const Arrow = () => (
  <div className="flex justify-center my-4">
    <ArrowDown className="text-slate-300" size={24} />
  </div>
);

export const Process: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-2 pb-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-8 pl-4 border-l-4 border-blue-500">4.2 仿真流程设计</h2>

      {/* Step 1 */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">步骤1：发射端处理 (Tx)</h3>
          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">第3、7章应用</span>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          发射端主要负责将二进制比特流映射为复数符号，通过串并转换和IFFT将频域数据搬移至时域，并添加循环前缀以消除符号间干扰。
        </p>
        <CodeBlock
          title="MATLAB - Tx Processing"
          code={`% 1.1 数据生成与QAM调制
bits = randi([0 1], N_bits, 1);
symbols = qammod(bits, M, 'InputType', 'bit');

% 1.2 串并转换（多载波核心）
parallel_symbols = reshape(symbols, N_sc, []);

% 1.3 IFFT变换：频域→时域（傅里叶逆变换实现）
time_signal = ifft(parallel_symbols, N_fft);

% 1.4 添加循环前缀（抗多径关键）
cp_length = N_fft/4;  % 25% CP
signal_with_cp = [time_signal(end-cp_length+1:end, :); time_signal];`}
        />
      </section>

      <Arrow />

      {/* Step 2 */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">步骤2：信道模拟 (Channel)</h3>
          <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded">第2、5章应用</span>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          模拟无线环境，包括多径效应（导致频率选择性衰落）和加性高斯白噪声（AWGN）。
        </p>
        <CodeBlock
          title="MATLAB - Channel Simulation"
          code={`% 2.1 多径信道建模（线性时不变系统）
channel_taps = [1, 0.3*exp(-1j*pi/4), 0.1*exp(1j*pi/3)];  % 3径模型
received_signal = conv(reshape(signal_with_cp, [], 1), channel_taps);

% 2.2 添加噪声（AWGN信道）
SNR_dB = 20;
noisy_signal = awgn(received_signal, SNR_dB, 'measured');`}
        />
      </section>

      <Arrow />

      {/* Step 3 */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">步骤3：接收端处理 (Rx)</h3>
          <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">第4、8章应用</span>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          接收端执行逆操作：去除CP，FFT变换回频域，利用导频进行信道估计与均衡，最后解调恢复比特。
        </p>
        <CodeBlock
          title="MATLAB - Rx Processing"
          code={`% 3.1 去除循环前缀
rx_no_cp = reshape(noisy_signal(1:end-length(channel_taps)+1), ...
                   N_fft+cp_length, []);
rx_no_cp = rx_no_cp(cp_length+1:end, :);

% 3.2 FFT变换：时域→频域
freq_signal = fft(rx_no_cp, N_fft);

% 3.3 信道估计与均衡（系统函数H(f)估计）
pilot_symbols = freq_signal(pilot_indices, :);
H_est = least_squares_estimator(pilot_symbols, known_pilots);
equalized_signal = freq_signal ./ H_est;

% 3.4 QAM解调并计算误码率
rx_bits = qamdemod(equalized_signal(1:N_sc, :), M, 'OutputType', 'bit');
BER = sum(rx_bits(:) ~= bits(:)) / numel(bits);`}
        />
      </section>
    </div>
  );
};