export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-taro/30 border-t-taro rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-ink/70">loading portal...</p>
      </div>
    </div>
  );
}
