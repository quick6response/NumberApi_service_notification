const vk_platforms = {
  desktop_web: 'браузерная (десктопная) версия',
  mobile_android: 'официальное приложение для Android',
  mobile_android_messenger: 'мобильный мессенджер для Android',
  mobile_ipad: 'официальное приложение для iPad',
  mobile_iphone: 'официальное приложение для iPhone',
  mobile_iphone_messenger: 'мобильный мессенджер для iPhone',
  mobile_web: 'браузерная (мобильная) версия',
} as const;

const vk_refs = {
  ' ': 'Пусто :(',

  // Категории в каталоге
  catalog_recent: 'категория недавних',
  catalog_new: 'категория новое',
  catalog_favourites: 'категория избранных',
  catalog_recommendation: 'категория рекомендуемых;',
  catalog_top_dau: 'категория популярных',
  catalog_entertainment: 'категория развлечений',
  catalog_communication: 'категория общение',
  catalog_tools: 'категория инструментов',
  catalog_shopping: 'категория покупок',
  catalog_events: 'категория мероприятий',
  catalog_education: 'категория образование',
  catalog_payments: 'категория оплаты услуг',
  catalog_finance: 'категория финансов;',
  catalog_food: 'категория еды и напитков',
  catalog_health: 'категория красоты и здоровья',
  catalog_travel: 'категория путешествий',
  catalog_taxi: 'категория такси',
  catalog_jobs: 'категория работы в каталоге;',
  catalog_realty: 'категория недвижимости',
  catalog_business: 'категория бизнеса',
  catalog_lifestyle: 'категория образа жизни',
  catalog_admin: 'категория созданных',

  // Обсуждения
  board_topic_all: 'превью обсуждения',
  board_topic_view: 'внутренний экран',

  // Лента
  feed: 'первый таб с лентой',
  feed_post: 'по ссылке без сниппета внутри поста',
  feed_comments: 'из комментариев',

  // Фичеринг
  featuring_discover: 'дискавери выдача',
  featuring_menu: 'дискавери меню',
  featuring_new: 'фичеринг во втором табе',

  // Закладки
  fave: 'общий список',
  fave_links: 'список ссылок',
  fave_posts: 'список постов',

  // Сообщества
  group: 'со стены сообщества',
  group_menu: 'из меню сообщества [Android]',
  group_messages: 'из сообщений',
  group_addresses: 'адрес сообщества',

  // Сниппеты
  snippet_post: 'переход из сниппета поста',
  snippet_im: 'переход из сниппета в личных сообщениях',

  // Клипы
  test: 'из экрана клипов [iOS]',

  // Чаты
  im: 'превью чата',
  im_chat: 'внутри чата',

  // Уведомления
  notifications: 'внешний экран уведомлений;',
  notifications_grouped: 'экран сгруппированных уведомлений',

  profile: 'из профиля',
  article_read: 'из статьи',
  music_playlist: 'из музыкального плейлиста',
  video_carousel: 'из видео [iOS]',
  photo_browser: 'из поста после нативного просмотра [iOS]',
  shopping_center: 'из ленты товаров [iOS]',
  market_item: 'из экрана товара',

  story: 'переход из стикера истории', // story${user_id}_${params}

  widget: 'переход из второй вкладки приложения;',
  home_screen: 'запуск с главного экрана устройства (Android);',
  left_nav: 'переход из левого меню на вебе;',
  quick_search: 'результаты быстрого поиска;',
  menu: 'переход из недавних через пятый таб в мобильном вебе.',
  other: 'прочие переходы',
} as const;

export const VkUtils = {
  getPlatform: (key: string) => {
    return vk_platforms[key] ?? 'Пусто :(';
  },

  getRef: (key: string) => {
    return vk_refs[key] ?? 'Пусто :(';
  },
};
