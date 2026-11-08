import { useEffect } from 'react';
import { ActiveTab } from '../types';

interface KeyboardShortcutsOptions {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  toggleShortcutsModal: () => void;
  closeAllModals: () => void;
  showToast?: (message: string) => void;
}

export function useKeyboardShortcuts({
  setActiveTab,
  toggleShortcutsModal,
  closeAllModals,
  showToast,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable;

      // Handle Escape anytime to dismiss modals
      if (e.key === 'Escape') {
        closeAllModals();
        return;
      }

      // Handle '?' to toggle shortcuts cheat sheet when not typing inside an input
      if (e.key === '?' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleShortcutsModal();
        return;
      }

      // Check modifier keys (Cmd on Mac, Ctrl on Windows/Linux)
      const hasModifier = e.metaKey || e.ctrlKey;
      if (!hasModifier) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case '1': {
          e.preventDefault();
          setActiveTab('dashboard');
          showToast?.('Switched to Dashboard (⌘1)');
          break;
        }
        case '2': {
          e.preventDefault();
          setActiveTab('generator');
          showToast?.('Switched to AI Generator (⌘2)');
          break;
        }
        case '3': {
          e.preventDefault();
          setActiveTab('projects');
          showToast?.('Switched to My Projects (⌘3)');
          break;
        }
        case '4': {
          e.preventDefault();
          setActiveTab('roadmap');
          showToast?.('Switched to Roadmap Builder (⌘4)');
          break;
        }
        case '5': {
          e.preventDefault();
          setActiveTab('techstack');
          showToast?.('Switched to Tech Stack (⌘5)');
          break;
        }
        case '6': {
          e.preventDefault();
          setActiveTab('codestudio');
          showToast?.('Switched to Code Studio (⌘6)');
          break;
        }
        case '7': {
          e.preventDefault();
          setActiveTab('readmestudio');
          showToast?.('Switched to README Studio (⌘7)');
          break;
        }
        case '8': {
          e.preventDefault();
          setActiveTab('settings');
          showToast?.('Switched to Settings (⌘8)');
          break;
        }
        case '/': {
          e.preventDefault();
          toggleShortcutsModal();
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, toggleShortcutsModal, closeAllModals, showToast]);
}
