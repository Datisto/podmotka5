import { SiteContent } from '../types/content';
import { defaultContent } from '../data/defaultContent';
import { supabase } from './supabase';

const CONTENT_STORAGE_KEY = 'site_content';
const USER_DATA_FLAG_KEY = 'has_user_data';
const HISTORY_KEY = 'content_history';
const MAX_HISTORY_SIZE = 3;
const MAIN_CONTENT_ID = 'main-content';

interface ContentMetadata {
  hasUserData: boolean;
  lastModified: string;
  source: 'supabase' | 'localStorage' | 'default';
}

interface HistoryEntry {
  content: SiteContent;
  timestamp: string;
  source: string;
}

const hasUserData = (): boolean => {
  try {
    const flag = localStorage.getItem(USER_DATA_FLAG_KEY);
    return flag === 'true';
  } catch {
    return false;
  }
};

const setUserDataFlag = (value: boolean): void => {
  try {
    localStorage.setItem(USER_DATA_FLAG_KEY, value.toString());
  } catch (error) {
    console.error('Failed to set user data flag:', error);
  }
};

const saveToHistory = (content: SiteContent, source: string): void => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    const history: HistoryEntry[] = historyJson ? JSON.parse(historyJson) : [];

    history.unshift({
      content,
      timestamp: new Date().toISOString(),
      source
    });

    if (history.length > MAX_HISTORY_SIZE) {
      history.splice(MAX_HISTORY_SIZE);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
};

export const getContentHistory = (): HistoryEntry[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const restoreFromHistory = (index: number): SiteContent | null => {
  try {
    const history = getContentHistory();
    if (index >= 0 && index < history.length) {
      return history[index].content;
    }
  } catch (error) {
    console.error('Failed to restore from history:', error);
  }
  return null;
};

export const loadContentSync = (): SiteContent => {
  try {
    const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📦 Loading from localStorage:', {
        blocksCount: parsed.blocks?.length,
        heroTitle: parsed.blocks?.[0]?.title,
        hasUserData: hasUserData()
      });
      return parsed;
    }
  } catch (error) {
    console.error('Error loading content from localStorage:', error);
  }

  if (!hasUserData()) {
    console.log('⚠️ No user data exists, using defaults for first initialization');
    return defaultContent;
  }

  console.log('⚠️ localStorage empty but user data flag set, trying history...');
  const history = getContentHistory();
  if (history.length > 0) {
    console.log('✅ Restored from history');
    return history[0].content;
  }

  console.log('⚠️ No recovery options, using defaults');
  return defaultContent;
};

export const loadContent = async (): Promise<SiteContent> => {
  console.log('🔄 Starting content load...');

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️ Supabase not configured, using localStorage');
      return loadContentSync();
    }

    console.log('🔍 Checking Supabase for user data...');
    const { data, error } = await supabase
      .from('user_content')
      .select('content, updated_at')
      .eq('id', MAIN_CONTENT_ID)
      .maybeSingle();

    if (error) {
      console.error('❌ Error loading from Supabase:', error);
      console.log('🔄 Falling back to localStorage...');
      return loadContentSync();
    }

    if (data && data.content) {
      const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;

      const isEmptyContent = !content.blocks || content.blocks.length === 0 ||
                           JSON.stringify(content) === JSON.stringify(defaultContent);

      if (isEmptyContent && hasUserData()) {
        console.log('⚠️ Supabase has empty/default content but user data flag is set');
        console.log('🔄 Checking localStorage for user data...');
        const localContent = loadContentSync();

        const isLocalEmpty = !localContent.blocks || localContent.blocks.length === 0 ||
                           JSON.stringify(localContent) === JSON.stringify(defaultContent);

        if (!isLocalEmpty) {
          console.log('✅ Found user data in localStorage, using it instead');
          await saveContent(localContent);
          return localContent;
        }
      }

      if (!isEmptyContent) {
        setUserDataFlag(true);
        saveToHistory(content, 'supabase');
      }

      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
      console.log('✅ Loaded content from Supabase:', {
        blocksCount: content.blocks?.length,
        heroTitle: content.blocks?.[0]?.title,
        hasUserData: !isEmptyContent,
        timestamp: data.updated_at
      });
      return content;
    }

    console.log('⚠️ No data in Supabase, checking localStorage...');
    const localContent = loadContentSync();

    if (hasUserData()) {
      console.log('✅ User data flag set, uploading localStorage to Supabase...');
      await saveContent(localContent);
    }

    return localContent;
  } catch (error) {
    console.error('❌ Error in loadContent:', error);
    console.log('🔄 Falling back to localStorage...');
    return loadContentSync();
  }
};

export const getDataSource = (): 'supabase' | 'localStorage' | 'default' | 'unknown' => {
  try {
    if (hasUserData()) {
      return 'supabase';
    }
    const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (stored) {
      return 'localStorage';
    }
    return 'default';
  } catch {
    return 'unknown';
  }
};

let saveContentTimer: number | null = null;

export const saveContent = async (content: SiteContent): Promise<void> => {
  console.log('💾 Starting content save...');

  try {
    const isDefaultContent = JSON.stringify(content) === JSON.stringify(defaultContent);

    if (!isDefaultContent) {
      setUserDataFlag(true);
      saveToHistory(content, 'manual-save');
    }

    try {
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
      console.log('✅ Saved to localStorage');
    } catch (storageError) {
      console.error('❌ LocalStorage quota exceeded:', storageError);
      window.dispatchEvent(new CustomEvent('contentSaved', {
        detail: {
          success: false,
          error: 'Storage quota exceeded. Try removing large images.'
        }
      }));
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️ Supabase not configured');
      window.dispatchEvent(new CustomEvent('contentSaved', {
        detail: { success: true, message: 'Saved to localStorage only' }
      }));
      return;
    }

    console.log('☁️ Saving to Supabase...');
    const { error } = await supabase
      .from('user_content')
      .upsert(
        {
          id: MAIN_CONTENT_ID,
          content: content,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('❌ Error saving to Supabase:', error);
      window.dispatchEvent(new CustomEvent('contentSaved', {
        detail: { success: false, error: error.message }
      }));
    } else {
      console.log('✅ Saved to Supabase successfully');
      window.dispatchEvent(new CustomEvent('contentSaved', {
        detail: { success: true }
      }));
    }
  } catch (error) {
    console.error('❌ Error in saveContent:', error);
    window.dispatchEvent(new CustomEvent('contentSaved', {
      detail: { success: false, error: (error as Error).message }
    }));
  }
};

export const saveContentDebounced = (content: SiteContent): void => {
  if (saveContentTimer) {
    clearTimeout(saveContentTimer);
  }

  saveContentTimer = setTimeout(() => {
    saveContent(content).catch(console.error);
  }, 1000);
};

export const exportDatabaseBackup = async (): Promise<void> => {
  try {
    const content = await loadContent();
    const metadata: ContentMetadata = {
      hasUserData: hasUserData(),
      lastModified: new Date().toISOString(),
      source: getDataSource()
    };

    const exportData = {
      metadata,
      content,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `site-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('✅ Backup exported successfully');
  } catch (error) {
    console.error('❌ Error exporting backup:', error);
    throw error;
  }
};

export const importDatabaseBackup = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);

        let content: SiteContent;
        if (imported.content && imported.metadata) {
          console.log('📦 Importing backup with metadata:', imported.metadata);
          content = imported.content;
        } else {
          console.log('📦 Importing legacy backup format');
          content = imported;
        }

        saveToHistory(await loadContent(), 'pre-import-backup');

        setUserDataFlag(true);
        await saveContent(content);

        saveToHistory(content, 'import');

        console.log('✅ Import completed successfully');
        resolve();
      } catch (error) {
        console.error('❌ Error importing backup:', error);
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
