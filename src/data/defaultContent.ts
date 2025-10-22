import { SiteContent, TextStyle, SEOSettings } from '../types/content';

const defaultTextStyle: TextStyle = {
  color: '#ffffff',
  fontSize: 'base',
  fontFamily: 'default',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  textAlign: 'left'
};

const defaultSEO: SEOSettings = {
  title: 'Підмотка спідометра - Професійні рішення',
  description: 'Три інноваційні рішення для точного коригування пробігу. CAN, аналоговий та OPS модулі для вашого автомобіля.',
  keywords: 'підмотка спідометра, can модуль, аналогова підмотка, ops емулятор, коригування пробігу, пробіг автомобіля, підмотка одометра',
  ogTitle: 'Підмотка спідометра - CAN, Аналоговий та OPS модулі',
  ogDescription: 'Професійні рішення для коригування пробігу автомобіля. Безпечні та надійні пристрої з гарантією.',
  ogImage: 'https://images.pexels.com/photos/3846511/pexels-photo-3846511.jpeg?auto=compress&cs=tinysrgb&w=1200',
  twitterCard: 'summary_large_image',
  canonicalUrl: 'https://yourdomain.com/'
};

export const defaultContent: SiteContent = {
  blocks: [
    {
      id: 'hero',
      type: 'hero',
      title: 'ПІДМОТКА СПІДОМЕТРА — У ВАШИХ РУКАХ',
      subtitle: 'Три рішення для точного коригування пробігу. Ніяких зайвих питань.',
      description: '',
      content: '',
      images: [],
      backgroundImage: 'https://images.pexels.com/photos/3846511/pexels-photo-3846511.jpeg?auto=compress&cs=tinysrgb&w=1920',
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: { ...defaultTextStyle, fontSize: 'xl', color: '#d1d5db', textAlign: 'center' },
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 1,
      showInNav: false
    },
    {
      id: 'features',
      type: 'features',
      title: 'Наші переваги',
      subtitle: '',
      description: '',
      content: '',
      images: [],
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '3xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: defaultTextStyle,
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 2,
      showInNav: false
    },
    {
      id: 'modules',
      type: 'modules',
      title: 'Наші модулі',
      subtitle: '',
      description: '',
      content: '',
      images: [],
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '3xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: defaultTextStyle,
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 3,
      navTitle: 'Модулі',
      showInNav: true
    },
    {
      id: 'can-module',
      type: 'detailed',
      title: 'CAN ПІДМОТКА',
      subtitle: 'CAN-модуль: точне налаштування без втручання',
      description: 'CAN-модуль призначений для корекції показань одометра через штатну CAN-шину автомобіля.',
      content: 'Для автомобілів з аналоговими датчиками швидкості або тахографами доступні альтернативні рішення.',
      images: [
        {
          id: 'can-1',
          url: 'https://i.ibb.co/fd1GsKM9/Image48.png',
          alt: 'CAN Module'
        }
      ],
      color: 'blue',
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold' },
        subtitle: { ...defaultTextStyle, fontSize: '2xl', fontWeight: 'bold', color: '#22d3ee' },
        description: { ...defaultTextStyle, color: '#d1d5db' },
        content: defaultTextStyle
      },
      cardDescription: 'CAN-модуль призначений для корекції показань одометра через штатну CAN-шину автомобіля.',
      price: '2500',
      ctaText: 'ЗАМОВИТИ CAN ПІДМОТКУ',
      isVisible: true,
      order: 4,
      navTitle: 'CAN',
      showInNav: true
    },
    {
      id: 'analog-module',
      type: 'detailed',
      title: 'АНАЛОГОВА ПІДМОТКА',
      subtitle: 'Аналогова підмотка: надійне рішення для класичних систем',
      description: 'Аналогова підмотка — це простий та ефективний пристрій для корекції пробігу.',
      content: 'Пристрій підключається до живлення через стандартний роз\'єм.',
      images: [
        {
          id: 'analog-1',
          url: 'https://i.ibb.co/RpsctJ1f/Chat-GPT-Image-10-2025-21-09-31.png',
          alt: 'Analog Module'
        }
      ],
      color: 'yellow',
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold' },
        subtitle: { ...defaultTextStyle, fontSize: '2xl', fontWeight: 'bold', color: '#fbbf24' },
        description: { ...defaultTextStyle, color: '#d1d5db' },
        content: defaultTextStyle
      },
      cardDescription: 'Аналогова підмотка для корекції пробігу в автомобілях з аналоговими спідометрами.',
      price: '1800',
      ctaText: 'ЗАМОВИТИ АНАЛОГОВУ ПІДМОТКУ',
      isVisible: true,
      order: 5,
      navTitle: 'Аналогова',
      showInNav: true
    },
    {
      id: 'ops-module',
      type: 'detailed',
      title: 'OPS ЕМУЛЯТОР',
      subtitle: 'Емулятор OPS: рішення для помилки B1150',
      description: 'У ряді автомобілів Toyota та Lexus може виникати невидалима помилка B1150.',
      content: 'Наш емулятор повністю замінює оригінальний блок OPS.',
      images: [
        {
          id: 'ops-1',
          url: 'https://i.ibb.co/PZSM6TYD/product-image-of-OPS.png',
          alt: 'OPS Module'
        }
      ],
      color: 'red',
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold' },
        subtitle: { ...defaultTextStyle, fontSize: '2xl', fontWeight: 'bold', color: '#ef4444' },
        description: { ...defaultTextStyle, color: '#d1d5db' },
        content: defaultTextStyle
      },
      cardDescription: 'Емулятор OPS для вирішення помилки B1150 в Toyota та Lexus.',
      price: '3200',
      ctaText: 'ЗАМОВИТИ OPS ЕМУЛЯТОР',
      isVisible: true,
      order: 6,
      navTitle: 'OPS',
      showInNav: true
    },
    {
      id: 'videos',
      type: 'videos',
      title: 'ВІДЕО ОГЛЯДИ',
      subtitle: '',
      description: '',
      content: '',
      images: [],
      videos: [],
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: defaultTextStyle,
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 50,
      navTitle: 'Відео',
      showInNav: true
    },
    {
      id: 'contacts',
      type: 'contact',
      title: 'Потрібна консультація? Ми на зв\'язку',
      subtitle: 'Підберемо рішення під вашу модель — швидко та без зайвих формальностей',
      description: '',
      content: '',
      images: [],
      textStyles: {
        title: { ...defaultTextStyle, fontSize: '4xl', fontWeight: 'bold', textAlign: 'center' },
        subtitle: { ...defaultTextStyle, fontSize: 'xl', color: '#d1d5db', textAlign: 'center' },
        description: defaultTextStyle,
        content: defaultTextStyle
      },
      isVisible: true,
      order: 51,
      navTitle: 'Контакти',
      showInNav: true
    }
  ],
  navigation: {
    title: 'Підмотка спідометра',
    items: [
      { id: 'nav-modules', title: 'Модулі', blockId: 'modules', isVisible: true },
      { id: 'nav-can', title: 'CAN', blockId: 'can-module', isVisible: true },
      { id: 'nav-analog', title: 'Аналогова', blockId: 'analog-module', isVisible: true },
      { id: 'nav-ops', title: 'OPS', blockId: 'ops-module', isVisible: true },
      { id: 'nav-videos', title: 'Відео', blockId: 'videos', isVisible: true },
      { id: 'nav-contacts', title: 'Контакти', blockId: 'contacts', isVisible: true }
    ]
  },
  seo: defaultSEO
};
