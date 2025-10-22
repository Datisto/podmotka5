import { SiteContent } from '../types/content';
import { defaultContent } from '../data/defaultContent';
import { supabase } from './supabase';

const CONTENT_STORAGE_KEY = 'site_content';

export const loadContentSync = (): SiteContent => {
  try {
    const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultContent,
        ...parsed,
        seo: parsed.seo || defaultContent.seo
      };
    }
  } catch (error) {
    console.error('Error loading content from localStorage:', error);
  }
  return defaultContent;
};

export const loadContent = async (): Promise<SiteContent> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase not configured, using localStorage');
      return loadContentSync();
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error loading from Supabase:', error);
      return loadContentSync();
    }

    if (data && data.content) {
      const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
      return {
        ...defaultContent,
        ...content,
        seo: content.seo || defaultContent.seo
      };
    }

    return loadContentSync();
  } catch (error) {
    console.error('Error in loadContent:', error);
    return loadContentSync();
  }
};

export const saveContent = async (content: SiteContent): Promise<void> => {
  try {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      window.dispatchEvent(new CustomEvent('contentSaved', {
        detail: { success: true, message: 'Saved to localStorage only' }
      }));
      return;
    }

    const { error } = await supabase
      .from('site_content')
      .insert([{ content: content }]);

    if (error) {
      console.error('Error saving to Supabase:', error);
      window.dispatchEvent(new CustomEvent('contentSaved', {
        detail: { success: false, error: error.message }
      }));
    } else {
      window.dispatchEvent(new CustomEvent('contentSaved', {
        detail: { success: true }
      }));
    }
  } catch (error) {
    console.error('Error in saveContent:', error);
    window.dispatchEvent(new CustomEvent('contentSaved', {
      detail: { success: false, error: (error as Error).message }
    }));
  }
};

export const exportDatabaseBackup = async (): Promise<void> => {
  try {
    const content = loadContentSync();
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `site-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting backup:', error);
    throw error;
  }
};

export const importDatabaseBackup = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        await saveContent(content);
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
