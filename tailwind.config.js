const px0_10 = { ...Array.from(Array(11)).map((_, i) => `${i}px`) };
const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}px`) };
const px0_200 = { ...Array.from(Array(201)).map((_, i) => `${i}px`) };
const px0_1000 = { ...Array.from(Array(1001)).map((_, i) => `${i}px`) };
const rem0_5 = { ...Array.from(Array(60)).map((_, i) => `${i / 10}rem`) };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderWidth: px0_10,
      // fontSize: px0_100, // fontsize를 rem 대신 px로 할거면 주석 해제
      fontSize: rem0_5,
      lineHeight: px0_100,
      width: px0_1000,
      height: px0_1000,
      spacing: px0_200,
      borderRadius: px0_100,
      colors: {
        main: '#6042F8',
        bg_1: '#F0F0F5',
        disable: '#C1C1C1',
        bronze: '#AD5600',
        silver: '#435F7A',
        gold: '#EB9A01',
        platinum: '#27E2A3',
        diamond: '#00B4FC',
        ruby: '#FF0061',
        master: '#000000',
        backdrop: 'rgba(0,0,0,0.7)',
      },
      zIndex: {
        dropdown: 90,
        backdrop_1: 100,
        backdrop_2: 101,
        modal_component: 102,
      },
    },
  },
  plugins: [],
};
