'use client';

export default function ScrollToCTAButton() {
  return (
    <button
      onClick={() => {
        document.getElementById('start-project')?.scrollIntoView({
          behavior: 'smooth',
        });
      }}
      className="inline-block bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-taro/90 transition-colors duration-200 lowercase"
    >
      start your project
    </button>
  );
}
