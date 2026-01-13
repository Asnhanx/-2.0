import React, { useState, useEffect } from 'react';
import { Mascot } from './Mascot';

const INTERACTIONS = [
  // Greeting/Daily
  "今天也要开心鸭！",
  "呼噜呼噜...Zzz",
  "那个...有草莓吃吗？🍓",
  "记得多喝水哦！💧",
  "你真棒！(摇尾巴)",
  "发呆是最高级的休息~",
  "星星在对你眨眼呢✨",
  
  // State
  "顶个橘子🍊稳如泰山",
  "泡澡水温刚刚好♨️",
  "我是水豚...莫得感情...",
  "情绪稳定中...",
  "嘿咻嘿咻...翻个身",
  "正在接收宇宙信号📶",
  "呼~",
  "草地软绵绵的...",
  "我是一只佛系豚...",
  "保持冷静，保持可爱",
  
  // Interactive Feedback
  "不要戳我的鼻子啦！>_<",
  "有点痒~ 嘻嘻",
  "再戳我就要...继续睡了",
  "啵唧一口！",
  "(盯着你看)OvO",
  "让我康康是谁在戳我？",
  "你好呀，两脚兽",
  "我在冥想...勿扰...",
  
  // Love/Record Assist
  "你把她的喜好都记下来了吗？",
  "哇，她一定会喜欢这个的！",
  "今天距离纪念日还有多久呀？⏰",
  "你真是个细心的人类~",
  "爱意都在细节里哦❤️",
  "偷偷告诉你，她喜欢惊喜",
  "这就是心动的感觉吗？",
  "记得记录下她的笑容哦📸",
  "只要你开心，她也会开心的",
  "这就是所谓的浪漫吗？",
  "别忘了给纪念日设个闹钟！",
  
  // Foodie
  "肚子饿了...咕噜噜",
  "想吃甜甜圈🍩",
  "今天吃什么好呢？🤔",
  "草莓是世界第一美味！",
  "我要去觅食了...",
  "有点想吃西瓜了🍉",
  "(嚼嚼嚼) 好吃...",
  
  // Healing
  "别卷了，休息一下吧",
  "所有的烦恼都会飘走的~🍃",
  "这种事情，睡一觉就好了",
  "今天的天空很蓝哦☁️",
  "慢一点，没关系的",
  "累了就来找我玩鸭",
  "世界破破烂烂，水豚缝缝补补",
  "爱要大声说出来📢"
];

export const InteractiveMascot: React.FC = () => {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [expressionId, setExpressionId] = useState(0);

  const handleClick = () => {
    // 1. Change Expression to a random new one (0-29)
    let newExpr;
    do {
      newExpr = Math.floor(Math.random() * 30);
    } while (newExpr === expressionId);
    setExpressionId(newExpr);

    // 2. Pick random text
    let randomText;
    do {
       randomText = INTERACTIONS[Math.floor(Math.random() * INTERACTIONS.length)];
    } while (randomText === text); 

    setText(randomText);
    setIsVisible(true);
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3500); 
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div className="relative z-50 group">
      {/* Speech Bubble */}
      <div 
        className={`absolute -bottom-2 left-16 w-52 bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-xl border-2 border-[#FFD54F] transition-all duration-300 transform origin-top-left pointer-events-none z-50 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-2'}`}
      >
        <p className="text-xs font-bold text-[#5D4037] leading-relaxed">
          {text}
        </p>
        {/* Triangle Arrow for bubble */}
        <div className="absolute -left-2 top-0 w-0 h-0 border-t-[10px] border-t-[#FFD54F] border-l-[10px] border-l-transparent transform rotate-90"></div>
      </div>

      {/* Avatar Button */}
      <button 
        onClick={handleClick}
        className="relative w-14 h-14 bg-[#FFECB3] rounded-full border-[3px] border-white shadow-md flex items-center justify-center overflow-hidden transition-transform duration-200 cursor-pointer hover:scale-105 active:scale-95"
        title="戳我有惊喜！"
      >
        <Mascot className="w-16 h-16 mt-2" expressionId={expressionId} />
      </button>
    </div>
  );
};