import { useState } from 'react';
import { DescriptionTab } from './DescriptionTab';
import { SettingsTab } from './SettingsTab';
import { ThemeTab } from './ThemeTab';
import styles from './TabPanel.module.css';

type TabId = 'description' | 'theme' | 'settings';

const TABS: { id: TabId; label: string }[] = [
  { id: 'description', label: 'Description' },
  { id: 'theme', label: 'Theme' },
  { id: 'settings', label: 'Settings' },
];

function TabBody({ id }: { id: TabId }) {
  if (id === 'description') return <DescriptionTab />;
  if (id === 'theme') return <ThemeTab />;
  return <SettingsTab />;
}

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
      <TabBody id={activeTab} />
    </div>
  );
}
