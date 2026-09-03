import { useState } from 'react';
import styles from './TabPanel.module.css';

type TabId = 'description' | 'theme' | 'settings';

const TABS: { id: TabId; label: string; placeholder: string }[] = [
  { id: 'description', label: 'Description', placeholder: 'Description coming soon.' },
  { id: 'theme', label: 'Theme', placeholder: 'Theme options coming soon.' },
  { id: 'settings', label: 'Settings', placeholder: 'Settings coming soon.' },
];

export function TabPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [collapsed, setCollapsed] = useState(false);
  const active = TABS.find((tab) => tab.id === activeTab)!;

  if (collapsed) {
    return (
      <button type="button" className={styles.collapsedTab} onClick={() => setCollapsed(false)}>
        {active.label}
      </button>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.tabRow}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === activeTab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" className={styles.close} onClick={() => setCollapsed(true)} aria-label="Collapse panel">
          ×
        </button>
      </div>
      <p className={styles.prose}>{active.placeholder}</p>
    </div>
  );
}
