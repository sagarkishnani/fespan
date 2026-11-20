/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Outfit', 'system-ui', 'sans-serif'],
      heading: ['Outfit', 'system-ui', 'sans-serif'],
      mono: ['Space Mono', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      'display-xl': ['clamp(2.75rem, 5vw + 1.25rem, 5.25rem)',      { lineHeight: '1',    letterSpacing: '-0.035em', fontWeight: '500' }],
      'display-lg': ['clamp(2.5rem, 4.5vw + 1rem, 4.5rem)',     { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '500' }],
      'display-md': ['clamp(2.375rem, 4vw + 1rem, 4rem)',          { lineHeight: '1.06', letterSpacing: '-0.03em',  fontWeight: '500' }],
      'heading-xl': ['clamp(2.125rem, 3.5vw + 1rem, 3.75rem)',    { lineHeight: '1.05', letterSpacing: '-0.03em',  fontWeight: '500' }],
      'heading-lg': ['clamp(1.875rem, 3vw + 1rem, 3.5rem)',          { lineHeight: '1.08', letterSpacing: '-0.03em',  fontWeight: '500' }],
      'heading-md': ['clamp(1.75rem, 2vw + 1rem, 2.5rem)',       { lineHeight: '1.12', letterSpacing: '-0.02em',  fontWeight: '500' }],
      'heading-sm': ['clamp(1.625rem, 1.25vw + 1rem, 2.25rem)',  { lineHeight: '1.15', letterSpacing: '-0.02em',  fontWeight: '500' }],

      'subtitle-lg': ['clamp(1.5rem, 1vw + 1rem, 1.75rem)',      { lineHeight: '1.15', letterSpacing: '-0.02em',  fontWeight: '500' }],
      'subtitle-md': ['clamp(1.25rem, 0.75vw + 1rem, 1.5rem)',   { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' }],
      'subtitle-sm': ['clamp(1.125rem, 0.5vw + 1rem, 1.375rem)', { lineHeight: '1.3',  fontWeight: '500' }],

      'body-xl': ['clamp(1.125rem, 0.5vw + 1rem, 1.3125rem)', { lineHeight: '1.5', fontWeight: '300' }],
      'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
      'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      'body-sm': ['15px', { lineHeight: '1.45', fontWeight: '400' }],

      'body-base': '17px',
      'subtitle-xs': '19px',
      'caption-md': '14px',
      'caption-sm': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
      'eyebrow': ['14px', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '500' }],
      'overline': ['13px', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '500' }],
    },
    extend: {
      colors: {
        brand: {
          primary: {
            darkest:  '#0E2327',
            dark:     '#0F5C37',
            DEFAULT:  '#0F7440',
            light:    '#2DBE6C',
            'light-hover': '#25A85E',
            pale:     '#9FD9B8',
            lightest: '#E6F5EC',
          },
        },
        semantics: {
          success: { dark: '#267C35', DEFAULT: '#37B24D', lightest: '#EBF7ED' },
          alert:   { dark: '#CA7900', DEFAULT: '#FC9700', lightest: '#FFF4D8' },
          error:   { dark: '#8C1D1D', DEFAULT: '#EB0E0E', lightest: '#F9EBEA' },
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised:  '#F5F8F7',
          sunken:  '#F1F4F3',
          mint:    '#E6F5EC',
          'mint-strong': '#D5F0E0',
          warm:    '#F6F6F4',
          media:   '#DFE5E3',
        },
        content: {
          DEFAULT: '#0E2327',
          soft:    '#2F4A4E',
          muted:   '#5C7377',
          faint:   '#7E8F92',
        },
        line: {
          DEFAULT: '#E3E9E8',
          strong:  '#D6DFDD',
        },
        accent: '#0F5C37',
      },
      spacing: {
        'control-sm': '46px',
        'control-lg': '60px',
      },
      backgroundImage: {
        'select-chevron': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M2.5 4.5L6 8l3.5-3.5'/%3E%3C/svg%3E\")",
        'hero-soft': 'linear-gradient(100deg, #E6F2EE 0%, #EEF5F2 60%, #F5F8F7 100%)',
        'hero-about': 'linear-gradient(100deg, #D5EAE1 0%, #EEF6F2 55%, #F7FAF8 100%)',
        'hero-about-scrim': 'linear-gradient(90deg, #E2F0EA 40%, rgba(226, 240, 234, .6) 52%, rgba(226, 240, 234, 0) 72%)',
        'hero-activity': 'linear-gradient(120deg, #E6F5EC 0%, #F5F8F7 60%, #EEF7F2 100%)',
        'hero-contact-scrim': 'linear-gradient(90deg, #F6F6F4 38%, rgba(246, 246, 244, .7) 50%, rgba(246, 246, 244, 0) 66%)',
      },
      maxWidth: {
        site: '1268px',
      },
      borderRadius: {
        sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px', '3xl': '28px', '4xl': '32px', '5xl': '36px',
      },
      boxShadow: {
        lift: '0 24px 50px rgba(14, 35, 39, 0.10)',
        float: '0 24px 60px rgba(14, 35, 39, 0.16)',
        media: '0 30px 60px rgba(14, 35, 39, 0.14)',
        header: '0 6px 24px rgba(14, 35, 39, 0.08)',
        drawer: '-20px 0 60px rgba(14, 35, 39, 0.12)',
        segment: '0 1px 4px rgba(14, 35, 39, 0.12)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulse_ring: {
          '0%':   { transform: 'scale(.6)', opacity: '.9' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        drop: {
          '0%':   { transform: 'translateY(-14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 250ms ease both',
        marquee: 'marquee 32s linear infinite',
        'pulse-ring': 'pulse_ring 1.6s ease-out infinite',
        drop: 'drop .45s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
