'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Monitor, Smartphone, Tablet, RefreshCw, Maximize2, X } from 'lucide-react';

interface WebsitePreviewProps {
  url: string;
  projectName: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export default function WebsitePreview({ url, projectName }: WebsitePreviewProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const deviceSizes = {
    desktop: { width: '100%', height: '600px', icon: Monitor },
    tablet: { width: '768px', height: '1024px', icon: Tablet },
    mobile: { width: '375px', height: '667px', icon: Smartphone },
  };

  const currentDevice = deviceSizes[device];
  const DeviceIcon = currentDevice.icon;

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleOpenInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-milk-tea to-cream p-4 border-b-4 border-ink">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-taro to-deep-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-black text-ink uppercase">Live Website Preview</h3>
                <p className="text-xs text-ink/60 font-bold">{projectName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Toggles */}
              <div className="flex gap-1 bg-white rounded-lg p-1 border-2 border-ink">
                {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((type) => {
                  const Icon = deviceSizes[type].icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setDevice(type)}
                      className={`p-2 rounded-lg transition-all ${
                        device === type
                          ? 'bg-taro text-white border-2 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]'
                          : 'text-ink/40 hover:text-ink hover:bg-cream'
                      }`}
                      title={type.charAt(0).toUpperCase() + type.slice(1)}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg bg-white border-2 border-ink text-ink hover:bg-cream transition-all shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                title="Refresh Preview"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2 rounded-lg bg-white border-2 border-ink text-ink hover:bg-cream transition-all shadow-[2px_2px_0px_0px_rgba(58,0,29,1)]"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenInNewTab}
                className="px-4 py-2 rounded-full bg-matcha text-ink font-black border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] text-sm transition-all flex items-center gap-2 uppercase"
                title="Open in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Site
              </button>
            </div>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="bg-cream p-6 flex items-center justify-center min-h-[400px]">
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
            style={{
              width: device === 'desktop' ? '100%' : currentDevice.width,
              maxWidth: '100%',
            }}
          >
            {/* Browser Chrome (Desktop Only) */}
            {device === 'desktop' && (
              <div className="bg-milk-tea rounded-t-xl p-2 flex items-center gap-2 border-b-3 border-ink">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-strawberry border-2 border-ink" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-ink" />
                  <div className="w-3 h-3 rounded-full bg-matcha border-2 border-ink" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-ink/60 font-bold truncate border-2 border-ink">
                  {url}
                </div>
              </div>
            )}

            {/* Device Frame (Mobile/Tablet) */}
            {device !== 'desktop' && (
              <div className="absolute -inset-4 bg-ink rounded-3xl shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] border-4 border-ink -z-10" />
            )}

            {/* IFrame */}
            <div
              className={`bg-white shadow-2xl overflow-hidden ${
                device === 'desktop' ? 'rounded-b-xl' : 'rounded-2xl'
              }`}
              style={{ height: currentDevice.height }}
            >
              <iframe
                key={refreshKey}
                src={url}
                className="w-full h-full border-0"
                title={`${projectName} Preview`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        {/* Info Footer */}
        <div className="bg-gradient-to-r from-milk-tea to-cream p-4 border-t-4 border-ink">
          <div className="flex items-center justify-between text-xs text-ink font-bold">
            <div className="flex items-center gap-2">
              <DeviceIcon className="w-4 h-4" />
              <span className="uppercase">
                Viewing in{' '}
                <span className="font-black text-ink">
                  {device.charAt(0).toUpperCase() + device.slice(1)}
                </span>{' '}
                mode
              </span>
            </div>
            <span className="uppercase">
              {device === 'desktop'
                ? 'Responsive'
                : `${currentDevice.width} × ${currentDevice.height}`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink z-50 flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Fullscreen Header */}
            <div className="bg-ink p-4 flex items-center justify-between border-b-4 border-white">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-black text-white uppercase">{projectName}</h3>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cream hover:text-white font-bold transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {url}
                </a>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg bg-white border-3 border-white hover:bg-cream text-ink transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fullscreen IFrame */}
            <div className="flex-1 bg-white" onClick={(e) => e.stopPropagation()}>
              <iframe
                src={url}
                className="w-full h-full border-0"
                title={`${projectName} Fullscreen Preview`}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
