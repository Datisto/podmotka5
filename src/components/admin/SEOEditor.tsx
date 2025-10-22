import React, { useState } from 'react';
import { Globe, Tag, Image, Link, Save } from 'lucide-react';
import { SEOSettings } from '../../types/content';

interface SEOEditorProps {
  seo: SEOSettings;
  onSave: (seo: SEOSettings) => void;
}

const SEOEditor: React.FC<SEOEditorProps> = ({ seo, onSave }) => {
  const [editedSeo, setEditedSeo] = useState<SEOSettings>(seo);

  const handleInputChange = (field: keyof SEOSettings, value: string) => {
    setEditedSeo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(editedSeo);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          SEO Налаштування
        </h3>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Зберегти
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2 font-medium">
            Заголовок сторінки (Title)
          </label>
          <input
            type="text"
            value={editedSeo.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
            placeholder="Підмотка спідометра - Професійні рішення"
          />
          <p className="text-xs text-gray-400 mt-1">
            Рекомендовано: 50-60 символів. Поточно: {editedSeo.title.length}
          </p>
        </div>

        <div>
          <label className="block text-white mb-2 font-medium">
            Опис (Meta Description)
          </label>
          <textarea
            value={editedSeo.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none resize-none"
            placeholder="Три інноваційні рішення для точного коригування пробігу..."
          />
          <p className="text-xs text-gray-400 mt-1">
            Рекомендовано: 150-160 символів. Поточно: {editedSeo.description.length}
          </p>
        </div>

        <div>
          <label className="block text-white mb-2 font-medium flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            Ключові слова
          </label>
          <input
            type="text"
            value={editedSeo.keywords}
            onChange={(e) => handleInputChange('keywords', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
            placeholder="підмотка спідометра, can модуль, ops емулятор"
          />
          <p className="text-xs text-gray-400 mt-1">
            Розділяйте ключові слова комами
          </p>
        </div>

        <div className="border-t border-gray-700 pt-4 mt-6">
          <h4 className="text-lg font-bold text-white mb-4">Open Graph (Facebook, LinkedIn)</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2 font-medium">
                OG Заголовок
              </label>
              <input
                type="text"
                value={editedSeo.ogTitle || ''}
                onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                placeholder="Якщо порожньо, використовується основний заголовок"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">
                OG Опис
              </label>
              <textarea
                value={editedSeo.ogDescription || ''}
                onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none resize-none"
                placeholder="Якщо порожньо, використовується основний опис"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium flex items-center">
                <Image className="w-4 h-4 mr-1" />
                OG Зображення (URL)
              </label>
              <input
                type="text"
                value={editedSeo.ogImage || ''}
                onChange={(e) => handleInputChange('ogImage', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-400 mt-1">
                Рекомендований розмір: 1200x630 px
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 mt-6">
          <h4 className="text-lg font-bold text-white mb-4">Twitter Card</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2 font-medium">
                Тип картки
              </label>
              <select
                value={editedSeo.twitterCard || 'summary_large_image'}
                onChange={(e) => handleInputChange('twitterCard', e.target.value as 'summary' | 'summary_large_image')}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 mt-6">
          <h4 className="text-lg font-bold text-white mb-4">Додаткові налаштування</h4>

          <div>
            <label className="block text-white mb-2 font-medium flex items-center">
              <Link className="w-4 h-4 mr-1" />
              Canonical URL
            </label>
            <input
              type="text"
              value={editedSeo.canonicalUrl || ''}
              onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
              placeholder="https://yourdomain.com/"
            />
            <p className="text-xs text-gray-400 mt-1">
              Основна URL вашого сайту (замініть yourdomain.com на ваш домен)
            </p>
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-bold text-blue-300 mb-2">Важливо для Google</h4>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>• Після збереження метадані оновляться автоматично</li>
            <li>• Google може знадобитися 1-2 тижні для переіндексації</li>
            <li>• Використовуйте Google Search Console для запиту швидкої переіндексації</li>
            <li>• Оновіть canonical URL на вашу справжню адресу домену</li>
            <li>• Додайте якісне зображення для кращого відображення в соцмережах</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SEOEditor;
