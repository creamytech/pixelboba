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
        className="bg-white/70 backdrop-blur-lg rounded-3xl border-2 border-brown-sugar/20 shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-taro/10 via-brown-sugar/10 to-matcha/10 p-4 border-b-2 border-brown-sugar/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-taro to-brown-sugar rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-ink">Live Website Preview</h3>
                <p className="text-xs text-ink/60">{projectName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Toggles */}
              <div className="flex gap-1 bg-white/50 rounded-xl p-1">
                {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((type) => {
                  const Icon = deviceSizes[type].icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setDevice(type)}
                      className={`p-2 rounded-lg transition-all ${
                        device === type
                          ? 'bg-taro text-white shadow-md'
                          : 'text-ink/40 hover:text-ink/70 hover:bg-white/50'
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
                className="p-2 rounded-lg bg-white/50 hover:bg-white text-ink/60 hover:text-ink transition-all"
                title="Refresh Preview"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2 rounded-lg bg-white/50 hover:bg-white text-ink/60 hover:text-ink transition-all"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenInNewTab}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-taro to-brown-sugar text-white font-medium text-sm hover:shadow-lg transition-all flex items-center gap-2"
                title="Open in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Site
              </button>
            </div>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="bg-gradient-to-br from-milk-tea/20 to-white p-6 flex items-center justify-center min-h-[400px]">
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
              <div className="bg-gray-200 rounded-t-xl p-2 flex items-center gap-2 border-b border-gray-300">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-ink/60 truncate">
                  {url}
                </div>
              </div>
            )}

            {/* Device Frame (Mobile/Tablet) */}
            {device !== 'desktop' && (
              <div className="absolute -inset-4 bg-gray-800 rounded-3xl shadow-2xl -z-10" />
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
        <div className="bg-gradient-to-r from-milk-tea/30 to-white p-4 border-t-2 border-brown-sugar/10">
          <div className="flex items-center justify-between text-xs text-ink/60">
            <div className="flex items-center gap-2">
              <DeviceIcon className="w-4 h-4" />
              <span>
                Viewing in{' '}
                <span className="font-semibold text-ink">
                  {device.charAt(0).toUpperCase() + device.slice(1)}
                </span>{' '}
                mode
              </span>
            </div>
            <span>
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
            className="fixed inset-0 bg-black/90 z-50 flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Fullscreen Header */}
            <div className="bg-gray-900 p-4 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-bold text-white">{projectName}</h3>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {url}
                </a>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
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
