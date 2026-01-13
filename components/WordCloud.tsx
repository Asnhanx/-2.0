import React, { useMemo } from 'react';
import { RecordItem } from '../types';

interface WordCloudProps {
  records: RecordItem[];
}

export const WordCloud: React.FC<WordCloudProps> = ({ records }) => {
  const words = useMemo(() => {
    // Combine text from relevant fields
    const text = records.map(r => r.content + " " + r.title + " " + r.category).join(' ');
    
    // Naive segmentation for Chinese/English mixed text
    // Splits by non-word characters but attempts to keep Chinese characters
    const segments = text.split(/[\s,，.。!！?？"“'”\(\)（）\-\—、：:]+/);
    
    const stopWords = [
      '的', '了', '是', '在', '和', '有', '我', '去', '吃', '好', '都', '就', '今天', '这个', '那个', 
      'Data', 'Daily', 'Food', 'to', 'the', 'a', 'and', 'of', 'in', 'is', 'it', 'for'
    ];
    
    const freq: Record<string, number> = {};
    segments.forEach(w => {
        // Simple heuristic: Ignore very short generic words or numbers
        if (w.length >= 1 && !stopWords.includes(w) && isNaN(Number(w))) {
            freq[w] = (freq[w] || 0) + 1;
        }
    });

    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 40); // Top 40 words
  }, [records]);

  if (words.length === 0) return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-300">
        <i className="fas fa-wind text-4xl mb-2"></i>
        <p>还没有足够的数据生成词云哦~</p>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 p-6 bg-white rounded-2xl border border-gray-100 min-h-[300px] content-center">
      {words.map(([word, count], idx) => {
        // Calculate size: base 1rem + scaled by count
        const scale = Math.min(count, 10) / 2; 
        const size = 0.8 + scale; // rem
        
        const colors = [
            'text-pink-400', 'text-rose-500', 'text-purple-400', 'text-indigo-400', 
            'text-orange-400', 'text-teal-400', 'text-blue-400'
        ];
        // Random-ish color assignment based on index
        const color = colors[idx % colors.length];
        
        return (
            <span 
                key={word + idx} 
                className={`${color} font-bold transition-all hover:scale-125 hover:rotate-3 cursor-default select-none`}
                style={{ 
                    fontSize: `${size}rem`, 
                    opacity: 0.6 + (Math.random() * 0.4),
                    zIndex: Math.floor(size * 10)
                }}
                title={`${count} occurrences`}
            >
                {word}
            </span>
        );
      })}
    </div>
  );
};