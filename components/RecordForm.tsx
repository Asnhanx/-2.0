import React, { useState } from 'react';
import { Category, RecordItem, AspectRatio } from '../types';
import { Button } from './Button';
import { generateImage, editImage, analyzeImage } from '../services/geminiService';

interface RecordFormProps {
  initialData?: RecordItem;
  onSave: (record: Omit<RecordItem, 'id' | 'date'>) => void;
  onCancel: () => void;
}

export const RecordForm: React.FC<RecordFormProps> = ({ initialData, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<Category>(initialData?.category || Category.Daily);
  const [content, setContent] = useState(initialData?.content || '');
  const [image, setImage] = useState(initialData?.image || '');
  
  // AI Tools State
  const [isGenModalOpen, setIsGenModalOpen] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [genRatio, setGenRatio] = useState<AspectRatio>(AspectRatio.Square);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('请输入标题');
    onSave({ title, category, content, image });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!image) return;
    setAiLoading(true);
    try {
      const description = await analyzeImage(image);
      setContent(prev => (prev ? prev + '\n\n' : '') + description);
    } catch (e) {
      alert("分析失败，请重试");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!genPrompt) return;
    setAiLoading(true);
    try {
      const imgData = await generateImage(genPrompt, genRatio);
      setImage(imgData);
      setIsGenModalOpen(false);
    } catch (e) {
      alert("生成失败，请重试");
    } finally {
      setAiLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!editPrompt || !image) return;
    setAiLoading(true);
    try {
      const imgData = await editImage(image, editPrompt);
      setImage(imgData);
      setIsEditModalOpen(false);
    } catch (e) {
      alert("编辑失败，请重试");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-[#5D4037] mb-2">标题</label>
        <input 
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border-[#FFECB3] rounded-2xl px-4 py-3 bg-[#FFF8E1] focus:bg-white focus:ring-2 focus:ring-[#FFD54F] focus:outline-none transition-all placeholder-gray-400"
          placeholder="给这美好的时刻起个名字..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold text-[#5D4037] mb-2">分类</label>
        <div className="flex flex-wrap gap-2">
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                category === cat 
                  ? 'bg-[#FFD54F] border-[#FFD54F] text-[#5D4037]' 
                  : 'bg-white border-gray-200 text-gray-500 hover:border-[#FFD54F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Image Area */}
      <div>
        <label className="block text-sm font-bold text-[#5D4037] mb-2">图片</label>
        
        {/* Image Preview & Actions */}
        {image ? (
          <div className="relative rounded-2xl overflow-hidden mb-2 border border-[#FFE082] group bg-white shadow-sm">
            <img src={image} alt="Preview" className="w-full h-48 object-cover" />
            <button 
              onClick={() => setImage('')}
              className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-400 shadow-sm hover:text-red-600 transition-colors"
            >
              <i className="fas fa-trash"></i>
            </button>
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button onClick={() => setIsEditModalOpen(true)} className="bg-white/95 text-xs px-3 py-1.5 rounded-xl shadow-sm text-[#5D4037] font-bold hover:bg-[#FFECB3] transition-colors">
                <i className="fas fa-magic mr-1 text-purple-500"></i>修图
              </button>
              <button onClick={handleAnalyzeImage} className="bg-white/95 text-xs px-3 py-1.5 rounded-xl shadow-sm text-[#5D4037] font-bold hover:bg-[#FFECB3] transition-colors">
                <i className="fas fa-eye mr-1 text-blue-500"></i>分析
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 mb-2">
            <label className="flex-1 border-2 border-dashed border-[#FFECB3] rounded-2xl h-28 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-[#FFF8E1] hover:border-[#FFD54F] transition-colors bg-white">
              <i className="fas fa-camera mb-2 text-2xl text-[#FFD54F]"></i>
              <span className="text-xs font-medium">上传照片</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <button 
              type="button"
              onClick={() => setIsGenModalOpen(true)}
              className="flex-1 border-2 border-dashed border-[#E1BEE7] bg-[#F3E5F5] rounded-2xl h-28 flex flex-col items-center justify-center text-[#AB47BC] hover:bg-[#E1BEE7]/30 transition-colors"
            >
              <i className="fas fa-wand-magic-sparkles mb-2 text-2xl"></i>
              <span className="text-xs font-medium">AI 生成</span>
            </button>
          </div>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-bold text-[#5D4037] mb-2">备注</label>
        <textarea 
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          className="w-full border-[#FFECB3] rounded-2xl px-4 py-3 bg-[#FFF8E1] focus:bg-white focus:ring-2 focus:ring-[#FFD54F] focus:outline-none transition-all placeholder-gray-400"
          placeholder="记录下此刻的心情..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>取消</Button>
        <Button variant="primary" className="flex-1" onClick={handleSubmit}>保存</Button>
      </div>

      {/* Generate Image Modal */}
      {isGenModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#5D4037]/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h3 className="font-bold mb-4 text-[#5D4037] text-lg">AI 绘画</h3>
            <textarea 
              value={genPrompt}
              onChange={e => setGenPrompt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm mb-4 focus:ring-2 focus:ring-[#FFD54F] focus:outline-none"
              placeholder="描述你想生成的画面..."
              rows={3}
            />
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 mb-1 block">比例</label>
              <select 
                value={genRatio} 
                onChange={e => setGenRatio(e.target.value as AspectRatio)}
                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm bg-white focus:ring-2 focus:ring-[#FFD54F] focus:outline-none"
              >
                {Object.entries(AspectRatio).map(([key, val]) => (
                  <option key={val} value={val}>{key.replace(/_/g, ' ')} ({val})</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button size="sm" variant="ghost" onClick={() => setIsGenModalOpen(false)}>取消</Button>
              <Button size="sm" onClick={handleGenerateImage} isLoading={aiLoading}>生成</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#5D4037]/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h3 className="font-bold mb-4 text-[#5D4037] text-lg">AI 修图</h3>
            <textarea 
              value={editPrompt}
              onChange={e => setEditPrompt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm mb-4 focus:ring-2 focus:ring-[#FFD54F] focus:outline-none"
              placeholder="你想怎么修改这张图？例如：添加一个复古滤镜..."
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <Button size="sm" variant="ghost" onClick={() => setIsEditModalOpen(false)}>取消</Button>
              <Button size="sm" onClick={handleEditImage} isLoading={aiLoading}>修改</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};