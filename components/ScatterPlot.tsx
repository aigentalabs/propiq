import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Label } from 'recharts';
import { Comparable } from '../types';

interface ScatterPlotProps {
  data: Comparable[];
  subjectM2: number;
  subjectPricePerM2: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl text-xs">
        <p className={`font-black uppercase tracking-widest mb-2 ${data.isSubject ? 'text-amber-400' : 'text-emerald-400'}`}>
          {data.isSubject ? 'Target: Asset Principal' : `Comparable: ${data.address}`}
        </p>
        <div className="space-y-1 font-light text-slate-300">
          <p><span className="font-black text-slate-500 uppercase mr-2">Métrica m²:</span> ${data.pricePerM2.toLocaleString()} USD</p>
          <p><span className="font-black text-slate-500 uppercase mr-2">Superficie:</span> {data.weightedM2.toFixed(1)} m²</p>
          {!data.isSubject && <p><span className="font-black text-slate-500 uppercase mr-2">Status:</span> {data.status}</p>}
        </div>
      </div>
    );
  }
  return null;
};

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, subjectM2, subjectPricePerM2 }) => {

  // FIX: Create a homogenous array for plotData by making the subject property conform to the Comparable interface.
  // This resolves TypeScript errors when filtering and ensures data consistency for the chart.
  const plotData: Comparable[] = [
    ...data,
    // FIX: Add missing `sourcePortal`, `url`, `imageUrl` and `comparisonReason` properties to make the subject property object conform to the `Comparable` type.
    { 
        id: 'subject-property',
        address: "Tu Propiedad",
        priceUSD: subjectM2 * subjectPricePerM2,
        weightedM2: subjectM2, 
        pricePerM2: subjectPricePerM2,
        daysOnMarket: 0,
        status: 'For Sale',
        zone: 'primary',
        sourcePortal: 'Zonaprop',
        url: '#',
        isSubject: true,
        imageUrl: '',
        comparisonReason: ''
    }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 30,
          right: 30,
          bottom: 40,
          left: 40,
        }}
      >
        <CartesianGrid strokeDasharray="10 10" stroke="#ffffff05" vertical={false} />
        <XAxis 
          type="number" 
          dataKey="weightedM2" 
          name="m² Ponderados" 
          unit="m²" 
          domain={['dataMin - 10', 'dataMax + 10']}
          stroke="#ffffff20"
          tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
        >
            <Label value="SUPERFICIE PONDERADA (m²)" offset={-25} position="insideBottom" style={{ fill: '#475569', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em' }} />
        </XAxis>
        <YAxis 
          type="number" 
          dataKey="pricePerM2" 
          name="Precio por m²" 
          unit=" USD" 
          domain={['dataMin - 500', 'dataMax + 500']} 
          tickFormatter={(value) => `$${(value as number)/1000}k`}
          stroke="#ffffff20"
          tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
        >
            <Label value="VALOR UNITARIO (USD/m²)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#475569', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em' }} />
        </YAxis>
        <ZAxis type="category" dataKey="address" name="address" />
        <Tooltip cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }} content={<CustomTooltip />}/>
        <Scatter name="Comparables" data={plotData.filter(d => !d.isSubject)} fill="#10b981" stroke="#064e3b" strokeWidth={1} />
        <Scatter name="Tu Propiedad" data={plotData.filter(d => d.isSubject)} fill="#f59e0b" shape="star" stroke="#78350f" strokeWidth={2} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlot;