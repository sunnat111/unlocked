// DRAFT legal text for the MVP. Must be replaced with text reviewed by a lawyer for the operating entity.
import type { Locale } from '@/lib/i18n';

type Doc = { title: string; sections: { h: string; p: string }[] };
export const LEGAL_UPDATED = '2026-11-26';

export const terms: Record<Locale, Doc> = {
  en: {
    title: 'Terms of use',
    sections: [
      { h: '1. Who we are', p: 'Unlocked SAT (“we”) provides online preparation materials for the Digital SAT. By using this website and app you agree to these terms.' },
      { h: '2. The service', p: 'We provide practice questions, adaptive practice tests, score estimates and study planning tools. Score estimates are approximations and are not official SAT scores. We do not guarantee any particular result on the SAT.' },
      { h: '3. Your use', p: 'You may use the service for your own personal study. You may not copy, resell or publish our questions or materials, or try to disrupt the service.' },
      { h: '4. Paid plans', p: 'Paid plans, prices and refund conditions are shown before purchase. You can cancel a subscription at any time; access continues until the end of the paid period.' },
      { h: '5. Content and trademarks', p: 'All practice questions are original works of Unlocked SAT. SAT® is a registered trademark of the College Board, which is not affiliated with and does not endorse this service.' },
      { h: '6. Changes and contact', p: 'We may update these terms; the date above shows the latest version. Questions: contact us through the details in the website footer.' },
    ],
  },
  uz: {
    title: 'Foydalanish shartlari',
    sections: [
      { h: '1. Biz kimmiz', p: 'Unlocked SAT (“biz”) Digital SAT’ga tayyorgarlik uchun onlayn materiallar taqdim etadi. Ushbu sayt va ilovadan foydalanib, siz shu shartlarga rozilik bildirasiz.' },
      { h: '2. Xizmat', p: 'Biz mashq savollari, moslashuvchan amaliy testlar, ball taxminlari va o‘qishni rejalash vositalarini taqdim etamiz. Ball taxminlari taxminiy bo‘lib, rasmiy SAT natijasi emas. Biz SAT’da muayyan natijani kafolatlamaymiz.' },
      { h: '3. Foydalanish', p: 'Xizmatdan shaxsiy o‘qishingiz uchun foydalanishingiz mumkin. Savollar va materiallarimizni nusxalash, sotish yoki e’lon qilish, shuningdek xizmat ishini buzishga urinish taqiqlanadi.' },
      { h: '4. Pullik tariflar', p: 'Pullik tariflar, narxlar va pulni qaytarish shartlari xariddan oldin ko‘rsatiladi. Obunani istalgan vaqtda bekor qilishingiz mumkin; kirish to‘langan davr oxirigacha saqlanadi.' },
      { h: '5. Kontent va savdo belgilari', p: 'Barcha mashq savollari Unlocked SAT’ning original asarlaridir. SAT® — College Board’ning ro‘yxatdan o‘tgan savdo belgisi; College Board ushbu xizmat bilan bog‘liq emas va uni qo‘llab-quvvatlamaydi.' },
      { h: '6. O‘zgarishlar va aloqa', p: 'Biz ushbu shartlarni yangilashimiz mumkin; yuqoridagi sana so‘nggi versiyani ko‘rsatadi. Savollar bo‘lsa, sayt pastidagi aloqa ma’lumotlari orqali murojaat qiling.' },
    ],
  },
  ru: {
    title: 'Условия использования',
    sections: [
      { h: '1. Кто мы', p: 'Unlocked SAT («мы») предоставляет онлайн-материалы для подготовки к Digital SAT. Используя сайт и приложение, вы соглашаетесь с этими условиями.' },
      { h: '2. Сервис', p: 'Мы предоставляем тренировочные вопросы, адаптивные пробные тесты, оценки баллов и инструменты планирования. Оценки баллов приблизительны и не являются официальными результатами SAT. Мы не гарантируем определённый результат на экзамене.' },
      { h: '3. Использование', p: 'Вы можете использовать сервис для личной подготовки. Запрещено копировать, перепродавать или публиковать наши вопросы и материалы, а также пытаться нарушить работу сервиса.' },
      { h: '4. Платные тарифы', p: 'Платные тарифы, цены и условия возврата показываются до покупки. Подписку можно отменить в любой момент; доступ сохраняется до конца оплаченного периода.' },
      { h: '5. Контент и товарные знаки', p: 'Все тренировочные вопросы — оригинальные материалы Unlocked SAT. SAT® — зарегистрированный товарный знак College Board, который не связан с сервисом и не одобряет его.' },
      { h: '6. Изменения и контакты', p: 'Мы можем обновлять эти условия; дата выше указывает последнюю версию. По вопросам пишите нам по контактам в нижней части сайта.' },
    ],
  },
};

export const privacy: Record<Locale, Doc> = {
  en: {
    title: 'Privacy policy',
    sections: [
      { h: '1. What we store', p: 'In the current version, your name, target score, exam date, answers and results are stored only in your own browser (localStorage) on your device. They are not sent to our servers.' },
      { h: '2. Cookies and analytics', p: 'We do not use advertising or analytics trackers in this version. If we add analytics later, it will only load after you give consent.' },
      { h: '3. Your control', p: 'You can export or delete all of your data at any time from the Progress page in the app, or by clearing your browser’s site data.' },
      { h: '4. Accounts (coming soon)', p: 'When accounts are introduced, we will collect only what is needed to run the service (such as phone number or email), and this policy will be updated before that happens.' },
      { h: '5. Children', p: 'The service is intended for high-school students. Students under 16 should use it with the knowledge of a parent or guardian.' },
      { h: '6. Contact', p: 'For any privacy question, contact us through the details in the website footer.' },
    ],
  },
  uz: {
    title: 'Maxfiylik siyosati',
    sections: [
      { h: '1. Nimani saqlaymiz', p: 'Joriy versiyada ismingiz, maqsadli ballingiz, imtihon sanangiz, javoblaringiz va natijalaringiz faqat qurilmangizdagi brauzerda (localStorage) saqlanadi. Ular serverlarimizga yuborilmaydi.' },
      { h: '2. Cookie va analitika', p: 'Ushbu versiyada reklama yoki analitika trekerlaridan foydalanmaymiz. Keyinchalik analitika qo‘shilsa, u faqat roziligingizdan keyin yuklanadi.' },
      { h: '3. Nazorat sizda', p: 'Barcha ma’lumotlaringizni istalgan vaqtda ilovadagi “Natijalar” sahifasidan yuklab olishingiz yoki o‘chirishingiz, yoxud brauzerdagi sayt ma’lumotlarini tozalashingiz mumkin.' },
      { h: '4. Akkauntlar (tez orada)', p: 'Akkauntlar joriy etilganda, faqat xizmat ishlashi uchun zarur ma’lumotlarni (masalan, telefon raqami yoki email) yig‘amiz va bundan oldin ushbu siyosat yangilanadi.' },
      { h: '5. Bolalar', p: 'Xizmat o‘rta maktab o‘quvchilari uchun mo‘ljallangan. 16 yoshgacha bo‘lgan o‘quvchilar undan ota-ona yoki vasiy xabardorligida foydalanishi kerak.' },
      { h: '6. Aloqa', p: 'Maxfiylik bo‘yicha savollar uchun sayt pastidagi aloqa ma’lumotlari orqali murojaat qiling.' },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности',
    sections: [
      { h: '1. Что мы храним', p: 'В текущей версии ваше имя, целевой балл, дата экзамена, ответы и результаты хранятся только в вашем браузере (localStorage) на вашем устройстве. Они не отправляются на наши серверы.' },
      { h: '2. Cookie и аналитика', p: 'В этой версии мы не используем рекламные и аналитические трекеры. Если аналитика появится позже, она будет загружаться только после вашего согласия.' },
      { h: '3. Контроль за вами', p: 'Вы можете в любой момент скачать или удалить все свои данные на странице «Прогресс» в приложении или очистив данные сайта в браузере.' },
      { h: '4. Аккаунты (скоро)', p: 'Когда появятся аккаунты, мы будем собирать только необходимое для работы сервиса (например, номер телефона или email), и эта политика будет обновлена заранее.' },
      { h: '5. Дети', p: 'Сервис предназначен для старшеклассников. Ученикам младше 16 лет следует пользоваться им с ведома родителей или опекунов.' },
      { h: '6. Контакты', p: 'По вопросам конфиденциальности пишите нам по контактам в нижней части сайта.' },
    ],
  },
};
