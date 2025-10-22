'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface LayoutSetting {
  id?: string;
  elementId: string;
  elementType: string;
  page: string;
  positionX: number;
  positionY: number;
  width?: number;
  height?: number;
  scale: number;
  rotation: number;
  opacity: number;
  zIndex: number;
}

// Predefined elements that can be edited
const EDITABLE_ELEMENTS = [
  {
    id: 'cta-cat-work',
    label: 'CTA Cat Image (Work Page)',
    type: 'image',
    page: 'work',
    defaultSettings: {
      positionX: 0,
      positionY: -80,
      width: 160,
      height: 160,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      zIndex: 10,
    },
  },
  {
    id: 'cta-cat-process',
    label: 'CTA Cat Image (Process Page)',
    type: 'image',
    page: 'process',
    defaultSettings: {
      positionX: 0,
      positionY: -80,
      width: 160,
      height: 160,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      zIndex: 10,
    },
  },
  {
    id: 'cta-cat-contact',
    label: 'CTA Cat Image (Contact Page)',
    type: 'image',
    page: 'contact',
    defaultSettings: {
      positionX: 0,
      positionY: -80,
      width: 160,
      height: 160,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      zIndex: 10,
    },
  },
  {
    id: 'cta-cat-about',
    label: 'CTA Cat Image (About Page)',
    type: 'image',
    page: 'about',
    defaultSettings: {
      positionX: 0,
      positionY: -80,
      width: 160,
      height: 160,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      zIndex: 10,
    },
  },
];

export default function LayoutEditorClient() {
  const [selectedElement, setSelectedElement] = useState<string>(EDITABLE_ELEMENTS[0].id);
  const [settings, setSettings] = useState<Record<string, LayoutSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load existing settings
  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/admin/layout-settings');
      if (response.ok) {
        const data = await response.json();
        const settingsMap: Record<string, LayoutSetting> = {};

        if (Array.isArray(data)) {
          data.forEach((setting: LayoutSetting) => {
            settingsMap[setting.elementId] = setting;
          });
        }

        setSettings(settingsMap);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const currentSetting = getCurrentSettings();

      const response = await fetch('/api/admin/layout-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSetting),
      });

      if (response.ok) {
        const savedSetting = await response.json();
        setSettings((prev) => ({
          ...prev,
          [savedSetting.elementId]: savedSetting,
        }));
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  }

  function getCurrentSettings(): LayoutSetting {
    const element = EDITABLE_ELEMENTS.find((el) => el.id === selectedElement)!;
    const existing = settings[selectedElement];

    return {
      elementId: selectedElement,
      elementType: element.type,
      page: element.page,
      positionX: existing?.positionX ?? element.defaultSettings.positionX,
      positionY: existing?.positionY ?? element.defaultSettings.positionY,
      width: existing?.width ?? element.defaultSettings.width,
      height: existing?.height ?? element.defaultSettings.height,
      scale: existing?.scale ?? element.defaultSettings.scale,
      rotation: existing?.rotation ?? element.defaultSettings.rotation,
      opacity: existing?.opacity ?? element.defaultSettings.opacity,
      zIndex: existing?.zIndex ?? element.defaultSettings.zIndex,
    };
  }

  function updateSetting(field: keyof LayoutSetting, value: number) {
    const element = EDITABLE_ELEMENTS.find((el) => el.id === selectedElement)!;

    setSettings((prev) => ({
      ...prev,
      [selectedElement]: {
        ...getCurrentSettings(),
        [field]: value,
      },
    }));
  }

  function resetToDefault() {
    const element = EDITABLE_ELEMENTS.find((el) => el.id === selectedElement)!;

    setSettings((prev) => {
      const newSettings = { ...prev };
      delete newSettings[selectedElement];
      return newSettings;
    });
  }

  const currentSettings = getCurrentSettings();
  const element = EDITABLE_ELEMENTS.find((el) => el.id === selectedElement)!;

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-ink mb-2">Visual Layout Editor</h1>
          <p className="text-lg text-ink/70 font-bold">
            Adjust positions and sizes of elements on your pages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Element Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-ink rounded-2xl shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] p-6">
              <h2 className="text-xl font-black text-ink mb-4">Select Element</h2>

              <div className="space-y-2">
                {EDITABLE_ELEMENTS.map((el) => (
                  <button
                    key={el.id}
                    onClick={() => setSelectedElement(el.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all border-2 ${
                      selectedElement === el.id
                        ? 'bg-[#7C3AED] text-white border-ink'
                        : 'bg-cream text-ink border-ink/20 hover:border-ink/40'
                    }`}
                  >
                    {el.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="lg:col-span-2">
            <div className="bg-white border-4 border-ink rounded-2xl shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-ink">{element.label}</h2>

                <div className="flex gap-2">
                  <Button onClick={() => setShowPreview(!showPreview)} variant="outline" size="sm">
                    {showPreview ? (
                      <EyeOff className="w-4 h-4 mr-2" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    {showPreview ? 'Hide' : 'Preview'}
                  </Button>

                  <Button onClick={resetToDefault} variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>

                  <Button onClick={saveSettings} disabled={saving} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Position X */}
                <div>
                  <label className="block text-sm font-black text-ink mb-2">
                    Position X: {currentSettings.positionX}px
                  </label>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    step="1"
                    value={currentSettings.positionX}
                    onChange={(e) => updateSetting('positionX', parseFloat(e.target.value))}
                    className="w-full h-3 bg-cream rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-ink/60 font-bold mt-1">
                    <span>-200px (Left)</span>
                    <span>0px (Center)</span>
                    <span>200px (Right)</span>
                  </div>
                </div>

                {/* Position Y */}
                <div>
                  <label className="block text-sm font-black text-ink mb-2">
                    Position Y: {currentSettings.positionY}px
                  </label>
                  <input
                    type="range"
                    min="-200"
                    max="200"
                    step="1"
                    value={currentSettings.positionY}
                    onChange={(e) => updateSetting('positionY', parseFloat(e.target.value))}
                    className="w-full h-3 bg-cream rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-ink/60 font-bold mt-1">
                    <span>-200px (Up)</span>
                    <span>0px (Default)</span>
                    <span>200px (Down)</span>
                  </div>
                </div>

                {/* Scale */}
                <div>
                  <label className="block text-sm font-black text-ink mb-2">
                    Scale: {currentSettings.scale.toFixed(2)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={currentSettings.scale}
                    onChange={(e) => updateSetting('scale', parseFloat(e.target.value))}
                    className="w-full h-3 bg-cream rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-ink/60 font-bold mt-1">
                    <span>0.5x (Smaller)</span>
                    <span>1.0x (Normal)</span>
                    <span>2.0x (Larger)</span>
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <label className="block text-sm font-black text-ink mb-2">
                    Rotation: {currentSettings.rotation}°
                  </label>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={currentSettings.rotation}
                    onChange={(e) => updateSetting('rotation', parseFloat(e.target.value))}
                    className="w-full h-3 bg-cream rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-ink/60 font-bold mt-1">
                    <span>-45° (Left)</span>
                    <span>0° (Straight)</span>
                    <span>45° (Right)</span>
                  </div>
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-sm font-black text-ink mb-2">
                    Opacity: {(currentSettings.opacity * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={currentSettings.opacity}
                    onChange={(e) => updateSetting('opacity', parseFloat(e.target.value))}
                    className="w-full h-3 bg-cream rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-ink/60 font-bold mt-1">
                    <span>0% (Invisible)</span>
                    <span>50%</span>
                    <span>100% (Solid)</span>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              {showPreview && (
                <div className="mt-8 p-8 bg-cream rounded-xl border-2 border-ink/20">
                  <p className="text-sm font-black text-ink/60 mb-4 text-center">PREVIEW</p>

                  <div className="relative w-full h-64 bg-white rounded-lg border-2 border-ink/10 flex items-center justify-center overflow-hidden">
                    {/* Simulated cat image */}
                    <div
                      style={{
                        transform: `translate(${currentSettings.positionX}px, ${currentSettings.positionY}px) scale(${currentSettings.scale}) rotate(${currentSettings.rotation}deg)`,
                        opacity: currentSettings.opacity,
                        zIndex: currentSettings.zIndex,
                        transition: 'all 0.2s ease',
                      }}
                      className="w-40 h-40 bg-[#7C3AED] rounded-full flex items-center justify-center text-white font-black"
                    >
                      🐱
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
