import React, { useState, useEffect, useMemo } from 'react';
import { RecordItem, Category } from './types';
import { loadRecords, saveRecords, exportData, importData, exportToCSV } from './services/storageService';
import { Modal } from './components/Modal';
import { RecordForm } from './components/RecordForm';
import { Card } from './components/Card';
import { Sidebar } from './components/Sidebar';
import { WordCloud } from './components/WordCloud';
import { AIAssistant } from './components/AIAssistant';
import { InteractiveMascot } from './components/InteractiveMascot';
import { AnniversaryBanner } from './components/AnniversaryBanner';
import { NoteCard } from './components/NoteCard';
import { Button } from './components/Button';

type ViewMode = 'home' | 'notes' | 'relax';

const NOTE_COLORS = [
  '#FEF9C3', // Yellow
  '#D1FAE5', // Green
  '#DBEAFE', // Blue
  '#FCE7F3', // Pink
  '#F3E8FF', // Purple
  '#FFEDD5', // Orange
  '#E0F2F1', // Teal
  '#F5F5F5', // Grey
];

// Expanded to 50 stickers
const NOTE_STICKERS = [
  '🥰', '🤔', '🎉', '🌟', '💪', '🍦', '🌸', '🎵', '👀', '💤', 
  '🚀', '🎨', '📚', '🏃', '🌈', '🔥', '🏄', '🏖️', '🍂', '❄️',
  '💖', '🍰', '🐶', '🐱', '🐰', '🐸', '🐷', '🐣', '🦋', '🌻',
  '🍀', '🍄', '🍎', '🍓', '🍑', '🥑', '🍔', '🍕', '🍿', '🥤',
  '🎈', '🎁', '💡', '📷', '🎮', '🧩', '🧸', '🛁', '🛌', '💌'
];

// Define display categories order
const DISPLAY_CATEGORIES = [
  Category.Food,
  Category.Hobbies,
  Category.Wishlist,
  Category.Goals,
  Category.Daily,
  Category.Anniversary,
  Category.Other
];

const App: React.FC = () => {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  
  // Home View State
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'card' | 'table'>('card');
  
  // Anniversary State
  const [anniversaryDate, setAnniversaryDate] = useState('');
  const [anniversaryTitle, setAnniversaryTitle] = useState('我们相识');

  // Quick Note State
  const [noteInput, setNoteInput] = useState('');
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0]);
  const [noteSticker, setNoteSticker] = useState<string>('🥰');
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);

  // Relax State (Wooden Fish)
  const [meritCount, setMeritCount] = useState(0);
  const [clickEffect, setClickEffect] = useState<{id: number, x: number, y: number}[]>([]);

  // Common UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordItem | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWordCloudOpen, setIsWordCloudOpen] = useState(false);
  
  // Delete Confirmation State
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  useEffect(() => {
    setRecords(loadRecords());
    
    // Load or Set Default Anniversary Date
    const storedDate = localStorage.getItem('lulu_anniversary_date');
    if (storedDate) {
      setAnniversaryDate(storedDate);
    } else {
      const defaultDate = '2025-12-28';
      setAnniversaryDate(defaultDate);
      localStorage.setItem('lulu_anniversary_date', defaultDate);
    }

    // Load or Set Default Anniversary Title
    const storedTitle = localStorage.getItem('lulu_anniversary_title');
    if (storedTitle) {
      setAnniversaryTitle(storedTitle);
    } else {
      setAnniversaryTitle('我们相识');
      localStorage.setItem('lulu_anniversary_title', '我们相识');
    }

    const storedMerit = localStorage.getItem('lulu_merit_count');
    if (storedMerit) setMeritCount(Number(storedMerit));
  }, []);

  // --- Handlers ---

  const handleSaveAnniversary = (date: string, title: string) => {
    setAnniversaryDate(date);
    setAnniversaryTitle(title);
    localStorage.setItem('lulu_anniversary_date', date);
    localStorage.setItem('lulu_anniversary_title', title);
  };

  const handleSaveRecord = (data: Omit<RecordItem, 'id' | 'date'>) => {
    let newRecords;
    if (editingRecord) {
      newRecords = records.map(r => r.id === editingRecord.id ? { ...r, ...data } : r);
    } else {
      const newRecord: RecordItem = {
        id: Date.now().toString(),
        date: Date.now(),
        ...data
      };
      newRecords = [newRecord, ...records];
    }
    setRecords(newRecords);
    saveRecords(newRecords);
    setIsSidebarOpen(false);
    setEditingRecord(undefined);
  };

  const handleSaveNote = () => {
    if (!noteInput.trim()) return;
    const newRecord: RecordItem = {
      id: Date.now().toString(),
      date: Date.now(),
      title: '随手记',
      content: noteInput,
      category: Category.Memo,
      bgColor: noteColor,
      sticker: noteSticker
    };
    const newRecords = [newRecord, ...records];
    setRecords(newRecords);
    saveRecords(newRecords);
    setNoteInput('');
    setIsStickerPickerOpen(false);
  };

  const handleRequestDelete = (e: React.MouseEvent | null, id: string) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setRecordToDelete(id);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      const newRecords = records.filter(r => r.id !== recordToDelete);
      setRecords(newRecords);
      saveRecords(newRecords);
      setRecordToDelete(null);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importData(file);
      if (success) {
        setRecords(loadRecords());
        alert("导入成功！");
        setIsSettingsOpen(false);
      } else {
        alert("导入失败，文件格式可能不正确。");
      }
    }
  };

  const handleWoodenFishClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newCount = meritCount + 1;
    setMeritCount(newCount);
    localStorage.setItem('lulu_merit_count', newCount.toString());

    const effectId = Date.now();
    setClickEffect(prev => [...prev, { id: effectId, x, y }]);
    setTimeout(() => {
        setClickEffect(prev => prev.filter(p => p.id !== effectId));
    }, 1000);
  };

  // --- Derived State ---

  const homeRecords = useMemo(() => {
    return records.filter(item => {
      // Home displays everything EXCEPT Memos (Quick Notes)
      if (item.category === Category.Memo) return false;

      const matchCategory = filterCategory === 'All' || item.category === filterCategory;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [records, filterCategory, searchQuery]);

  const noteRecords = useMemo(() => {
    return records.filter(item => item.category === Category.Memo);
  }, [records]);

  // --- Render Sections ---

  const renderHome = () => (
    <>
      <AnniversaryBanner 
        dateString={anniversaryDate} 
        title={anniversaryTitle}
        onClick={() => setIsSettingsOpen(true)} 
      />

      {/* Filter & Search */}
      <div className="sticky top-0 z-20 bg-[#FFFBEB]/95 backdrop-blur-sm pt-2 pb-4 px-4 space-y-3 shadow-sm border-b border-[#FFFBEB]">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setFilterCategory('All')}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                  filterCategory === 'All' 
                  ? 'bg-[#5D4037] text-white' 
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              全部
            </button>
            {DISPLAY_CATEGORIES.map(cat => (
               <button 
               key={cat}
               onClick={() => setFilterCategory(cat)}
               className={`whitespace-nowrap px-4 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                   filterCategory === cat 
                   ? 'bg-[#FFD54F] text-[#5D4037]' 
                   : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
               }`}
             >
               {cat}
             </button>
            ))}
          </div>

          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
            <input 
              type="text"
              placeholder="搜索记忆碎片..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white text-sm rounded-2xl py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#FFD54F]/50 transition-shadow shadow-sm placeholder-gray-300 text-[#5D4037]"
            />
            <button 
               onClick={() => setIsWordCloudOpen(true)}
               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFB74D] p-2"
            >
               <i className="fas fa-cloud"></i>
            </button>
          </div>
      </div>

      {/* Grid */}
      <div className="px-4 pb-24 pt-4">
        {homeRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#8D6E63]/40">
              <div className="w-24 h-24 bg-[#FFF8E1] rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-feather-alt text-4xl text-[#FFD54F]"></i>
              </div>
              <p className="text-sm font-bold">记下美好，留住感动</p>
              <p className="text-xs mt-1">点击右下角开始记录</p>
          </div>
        ) : (
          layoutMode === 'card' ? (
            <div className="columns-2 gap-4 space-y-4">
                {homeRecords.map(item => (
                <Card 
                    key={item.id} 
                    item={item} 
                    onClick={(i) => { setEditingRecord(i); setIsSidebarOpen(true); }}
                    onDelete={handleRequestDelete}
                />
                ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-[#FEF3C7] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#FFF8E1] text-[#8D6E63] font-bold">
                            <tr>
                                <th className="px-4 py-3 whitespace-nowrap">日期</th>
                                <th className="px-4 py-3 whitespace-nowrap">分类</th>
                                <th className="px-4 py-3">标题</th>
                                <th className="px-4 py-3">内容</th>
                                <th className="px-4 py-3 whitespace-nowrap">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FEF3C7]">
                            {homeRecords.map(item => (
                                <tr key={item.id} className="hover:bg-[#FFFDE7] transition-colors">
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                                        {new Date(item.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="bg-blue-50 text-blue-500 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-[#5D4037]">{item.title}</td>
                                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{item.content}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => { setEditingRecord(item); setIsSidebarOpen(true); }}
                                                className="text-[#FFB74D] hover:text-[#F57C00]"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                onClick={(e) => handleRequestDelete(e, item.id)}
                                                className="text-gray-300 hover:text-red-400"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )
        )}
      </div>

      {/* Floating Add Button for Home */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-30">
         <button 
           onClick={() => { setEditingRecord(undefined); setIsSidebarOpen(true); }}
           className="pointer-events-auto bg-gradient-to-r from-[#FFD54F] to-[#F57F17] text-white w-16 h-16 rounded-full shadow-lg shadow-orange-200 flex items-center justify-center text-2xl hover:scale-110 transition-all duration-300 active:scale-95 border-4 border-white"
         >
           <i className="fas fa-plus"></i>
         </button>
      </div>
    </>
  );

  const renderNotes = () => (
    <div className="px-4 pt-4 pb-24 h-full flex flex-col">
       
       {/* Notes Header */}
       <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-[#FFF8E1] mb-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FFF8E1] rounded-2xl flex items-center justify-center">
             <i className="fas fa-pen-nib text-[#FFD54F] text-xl"></i>
          </div>
          <div>
             <h2 className="text-lg font-black text-[#5D4037]">随手记</h2>
             <p className="text-xs text-[#8D6E63]/70">捕捉每一个闪光的灵感瞬间</p>
          </div>
       </div>

       {/* Input Area */}
       <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-[#FFF8E1] mb-6 flex flex-col gap-3 relative transition-all">
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="今天发生了什么有趣的事？或者有什么新想法..."
            rows={3}
            className="w-full text-sm bg-transparent border-none focus:ring-0 resize-none placeholder-gray-300 text-[#5D4037] leading-relaxed"
          />
          
          <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
             <div className="flex items-center gap-3">
                {/* Sticker Trigger */}
                <div className="relative">
                   <button 
                      onClick={() => setIsStickerPickerOpen(!isStickerPickerOpen)}
                      className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xl hover:bg-gray-100 transition-colors"
                   >
                      {noteSticker}
                   </button>
                   {/* Sticker Popover */}
                   {isStickerPickerOpen && (
                      <div className="absolute bottom-12 left-0 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 w-64 max-h-60 overflow-y-auto z-20 flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 custom-scrollbar">
                         {NOTE_STICKERS.map(s => (
                            <button
                               key={s}
                               onClick={() => { setNoteSticker(s); setIsStickerPickerOpen(false); }}
                               className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg text-lg transition-colors"
                            >
                               {s}
                            </button>
                         ))}
                      </div>
                   )}
                </div>

                {/* Color Picker */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[160px] sm:max-w-none py-1">
                   {NOTE_COLORS.map(color => (
                      <button
                         key={color}
                         onClick={() => setNoteColor(color)}
                         className={`w-6 h-6 rounded-full border border-gray-200 transition-all ${noteColor === color ? 'ring-2 ring-offset-1 ring-[#5D4037] scale-110' : 'hover:scale-110'}`}
                         style={{ backgroundColor: color }}
                      />
                   ))}
                </div>
             </div>

             <button 
                onClick={handleSaveNote} 
                disabled={!noteInput.trim()}
                className="bg-[#FFD54F] text-[#5D4037] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#FFC107] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 flex items-center gap-2"
             >
                <i className="fas fa-paper-plane text-xs"></i> 发布
             </button>
          </div>
       </div>

       {/* Notes Masonry */}
       {noteRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-[#8D6E63]/40">
             <i className="fas fa-sticky-note text-4xl mb-3 opacity-50"></i>
             <p className="text-sm">随手记，把想法贴在这里~</p>
          </div>
       ) : (
          <div className="columns-2 gap-4 space-y-4 pb-8">
             {noteRecords.map(item => (
                <NoteCard key={item.id} item={item} onDelete={(id) => handleRequestDelete(null, id)} />
             ))}
          </div>
       )}
    </div>
  );

  const renderRelax = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center pb-20">
       <div className="mb-8">
          <h2 className="text-3xl font-black text-[#5D4037] mb-1">电子木鱼</h2>
          <p className="text-sm text-[#8D6E63] opacity-60">功德 +{meritCount}</p>
       </div>

       <button 
         onClick={handleWoodenFishClick}
         className="w-48 h-48 bg-[#5D4037] rounded-full shadow-[0_10px_30px_rgba(93,64,55,0.4)] flex items-center justify-center relative active:scale-95 transition-transform duration-75 group"
       >
         {/* Simple Wooden Fish Icon/Shape */}
         <div className="text-8xl text-[#FFD54F] opacity-90 group-hover:opacity-100">
            <i className="fas fa-fish"></i>
         </div>
         
         {/* Click Effects */}
         {clickEffect.map(effect => (
            <div 
              key={effect.id}
              className="absolute text-[#FFD54F] font-bold text-xl animate-bounce pointer-events-none"
              style={{ top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              功德+1
            </div>
         ))}
       </button>
       
       <p className="mt-12 text-xs text-gray-400 max-w-xs">
          “敲一敲，烦恼消。深呼吸，放轻松。”<br/>
          水豚陪你一起佛系~
       </p>
    </div>
  );

  return (
    <div className="min-h-screen max-w-2xl mx-auto bg-[#FFFBEB] sm:shadow-2xl sm:min-h-0 sm:h-screen sm:overflow-hidden flex flex-col relative sm:rounded-[2rem] border-x border-[#FEF3C7]">
      
      {/* Header & Nav */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <InteractiveMascot />
          <div className="flex flex-col">
            <h1 className="text-lg font-black text-[#5D4037] tracking-tight leading-none">
               噜噜小可爱
            </h1>
            <span className="text-[10px] text-[#FFB74D] font-bold mt-0.5">戳我有惊喜</span>
          </div>
        </div>

        {/* Top Navigation Pills */}
        <div className="flex bg-gray-100/50 p-1 rounded-full">
           <button 
             onClick={() => setCurrentView('home')}
             className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                currentView === 'home' 
                ? 'bg-white text-[#5D4037] shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
             }`}
           >
             首页
           </button>
           <button 
             onClick={() => setCurrentView('notes')}
             className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                currentView === 'notes' 
                ? 'bg-white text-[#F57F17] shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
             }`}
           >
             随手记
           </button>
           <button 
             onClick={() => setCurrentView('relax')}
             className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                currentView === 'relax' 
                ? 'bg-white text-[#009688] shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
             }`}
           >
             解压
           </button>
        </div>

        {/* Global Tools (Only for Home) */}
        {currentView === 'home' && (
             <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-8 h-8 text-gray-300 hover:text-gray-500 transition-colors ml-1"
            >
                <i className="fas fa-cog"></i>
            </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#FFFBEB] relative">
         {currentView === 'home' && renderHome()}
         {currentView === 'notes' && renderNotes()}
         {currentView === 'relax' && renderRelax()}
      </main>

      {/* AI Assistant (Always available) */}
      <AIAssistant />

      {/* Sidebar (Add/Edit) - Context Aware title */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        title={editingRecord ? "编辑回忆" : "记录美好"}
        anniversaryDate={anniversaryDate}
      >
        <RecordForm 
          initialData={editingRecord}
          onSave={handleSaveRecord}
          onCancel={() => setIsSidebarOpen(false)}
        />
      </Sidebar>

      {/* Word Cloud Modal */}
      <Modal
        isOpen={isWordCloudOpen}
        onClose={() => setIsWordCloudOpen(false)}
        title="记忆关键词"
      >
        <WordCloud records={records} />
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="设置与备份"
      >
        <div className="space-y-6">
          <div className="bg-[#FFF8E1] p-4 rounded-2xl border border-[#FFE0B2]">
            <h3 className="text-sm font-bold text-[#5D4037] mb-3 border-b border-[#FFE082] pb-2">纪念日设置</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#8D6E63] mb-1">
                  纪念日类型 (标题)
                </label>
                <input 
                  type="text" 
                  value={anniversaryTitle}
                  onChange={(e) => handleSaveAnniversary(anniversaryDate, e.target.value)}
                  className="w-full bg-white border border-[#FFECB3] rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#FFD54F] focus:outline-none text-[#5D4037] font-medium text-sm"
                  placeholder="例如：我们相识、结婚纪念日..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#8D6E63] mb-1">
                  日期
                </label>
                <input 
                  type="date" 
                  value={anniversaryDate}
                  onChange={(e) => handleSaveAnniversary(e.target.value, anniversaryTitle)}
                  className="w-full bg-white border border-[#FFECB3] rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#FFD54F] focus:outline-none text-[#5D4037] font-medium text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-bold text-[#5D4037] mb-3">数据管理</h3>
            <div className="grid grid-cols-2 gap-3">
                <button 
                onClick={exportData}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-[#E3F2FD] hover:border-blue-200 transition-all group"
                >
                <i className="fas fa-file-code text-2xl text-gray-300 group-hover:text-[#42A5F5] mb-2 transition-colors"></i>
                <span className="text-xs font-bold text-gray-600 group-hover:text-[#1565C0]">备份 (JSON)</span>
                </button>

                <button 
                onClick={exportToCSV}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-[#E8F5E9] hover:border-green-200 transition-all group"
                >
                <i className="fas fa-file-csv text-2xl text-gray-300 group-hover:text-[#66BB6A] mb-2 transition-colors"></i>
                <span className="text-xs font-bold text-gray-600 group-hover:text-[#2E7D32]">导出 (CSV)</span>
                </button>
                
                <label className="col-span-2 flex flex-col items-center justify-center p-5 bg-white rounded-2xl hover:bg-[#F3E5F5] transition-all cursor-pointer border-2 border-dashed border-gray-200 hover:border-[#CE93D8] group">
                <i className="fas fa-cloud-upload-alt text-2xl text-gray-300 group-hover:text-[#AB47BC] mb-2 transition-colors"></i>
                <span className="text-xs font-bold text-gray-600 group-hover:text-[#8E24AA]">恢复数据</span>
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Custom Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[2px] p-4 animate-in fade-in duration-200" onClick={() => setRecordToDelete(null)}>
            <div 
                className="bg-white w-full max-w-[300px] rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-white/50"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400 text-xl shadow-inner">
                        <i className="fas fa-trash-alt"></i>
                    </div>
                    <h3 className="text-lg font-black text-[#5D4037] mb-2">删除这条记录？</h3>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed px-2">
                        删除后无法找回哦，确定要和这段回忆说再见吗？
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setRecordToDelete(null)}
                            className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-600 text-sm font-bold hover:bg-gray-100 transition-colors"
                        >
                            取消
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 py-2.5 rounded-xl bg-[#FFCDD2] text-[#B71C1C] text-sm font-bold hover:bg-[#EF9A9A] transition-colors shadow-sm shadow-red-100"
                        >
                            删除
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;