/* ============================================================
   POSLESLOVIE THEME — Complete JavaScript
   1:1 migration from Next.js
   ============================================================ */

(function () {
  'use strict';

  /* ========================================
     RUSSIAN CITIES LIST (1111 cities)
  ======================================== */
  var RUSSIAN_CITIES = ["Абаза","Абакан","Абдулино","Абинск","Агидель","Агрыз","Адыгейск","Азнакаево","Азов","Ак-Довурак","Аксай","Алагир","Алапаевск","Алатырь","Алдан","Алейск","Александров","Александровск","Александровск-Сахалинский","Алексеевка","Алексин","Алзамай","Алупка","Алушта","Альметьевск","Амурск","Анадырь","Анапа","Ангарск","Андреаполь","Анжеро-Судженск","Анива","Апатиты","Апрелевка","Апшеронск","Арамиль","Аргун","Ардатов","Ардон","Арзамас","Аркадак","Армавир","Армянск","Арсеньев","Арск","Артём","Артёмовск","Артёмовский","Архангельск","Асбест","Асино","Астрахань","Аткарск","Ахтубинск","Ачинск","Ачхой-Мартан","Аша","Бабаево","Бабушкин","Бавлы","Багратионовск","Байкальск","Баймак","Бакал","Баксан","Балабаново","Балаклава","Балаково","Балахна","Балашиха","Балашов","Балей","Балтийск","Барабинск","Барнаул","Барыш","Батайск","Бахчисарай","Бежецк","Белая Калитва","Белая Холуница","Белгород","Белебей","Белёв","Белинский","Белово","Белогорск","Белозерск","Белокуриха","Беломорск","Белоозёрский","Белорецк","Белореченск","Белоусово","Белоярский","Белый","Бердск","Березники","Берёзовский","Беслан","Бийск","Бикин","Билибино","Биробиджан","Бирск","Бирюсинск","Бирюч","Благовещенск","Благодарный","Бобров","Богданович","Богородицк","Богородск","Боготол","Богучар","Бодайбо","Бокситогорск","Болгар","Бологое","Болотное","Болохово","Болхов","Большой Камень","Бор","Борзя","Борисоглебск","Боровичи","Боровск","Бородино","Братск","Бронницы","Брянск","Бугульма","Бугуруслан","Будённовск","Бузулук","Буинск","Буй","Буйнакск","Бутурлиновка","Валдай","Валуйки","Велиж","Великие Луки","Великий Новгород","Великий Устюг","Вельск","Венёв","Верещагино","Верея","Верхнеуральск","Верхний Тагил","Верхний Уфалей","Верхняя Пышма","Верхняя Салда","Верхняя Тура","Верхотурье","Верхоянск","Весьегонск","Ветлуга","Видное","Вилюйск","Вилючинск","Вихоревка","Вичуга","Владивосток","Владикавказ","Владимир","Волгоград","Волгодонск","Волгореченск","Волжск","Волжский","Вологда","Володарск","Волоколамск","Волосово","Волхов","Волчанск","Вольск","Воркута","Воронеж","Ворсма","Воскресенск","Воткинск","Всеволожск","Вуктыл","Выборг","Выкса","Высоковск","Высоцк","Вытегра","Вышний Волочёк","Вяземский","Вязники","Вязьма","Вятские Поляны","Гаврилов Посад","Гаврилов-Ям","Гагарин","Гаджиево","Гай","Галич","Гатчина","Гвардейск","Гдов","Геленджик","Георгиевск","Глазов","Голицыно","Горбатов","Горно-Алтайск","Горнозаводск","Горняк","Городец","Городище","Городовиковск","Гороховец","Горячий Ключ","Грайворон","Гремячинск","Грозный","Грязи","Грязовец","Губаха","Губкин","Губкинский","Гудермес","Гуково","Гулькевичи","Гурьевск","Гусев","Гусиноозёрск","Гусь-Хрустальный","Давлеканово","Дагестанские Огни","Далматово","Дальнегорск","Дальнереченск","Данилов","Данков","Дегтярск","Дедовск","Демидов","Дербент","Десногорск","Джанкой","Дзержинск","Дзержинский","Дивногорск","Дигора","Димитровград","Дмитриев","Дмитров","Дмитровск","Дно","Добрянка","Долгопрудный","Долинск","Домодедово","Донецк","Донской","Дорогобуж","Дрезна","Дубна","Дубовка","Дудинка","Духовщина","Дюртюли","Дятьково","Евпатория","Егорьевск","Ейск","Екатеринбург","Елабуга","Елец","Елизово","Ельня","Еманжелинск","Емва","Енисейск","Ермолино","Ершов","Ессентуки","Ефремов","Железноводск","Железногорск","Железногорск-Илимский","Жердевка","Жигулёвск","Жиздра","Жирновск","Жуков","Жуковка","Жуковский","Завитинск","Заводоуковск","Заволжск","Заволжье","Задонск","Заинск","Закаменск","Заозёрный","Заозёрск","Западная Двина","Заполярный","Зарайск","Заречный","Заринск","Звенигово","Звенигород","Зверево","Зеленогорск","Зеленоград","Зеленоградск","Зеленодольск","Зеленокумск","Зерноград","Зея","Зима","Златоуст","Злынка","Змеиногорск","Знаменск","Зубцов","Зуевка","Ивангород","Иваново","Ивантеевка","Ивдель","Игарка","Ижевск","Избербаш","Изобильный","Иланский","Инза","Инкерман","Иннополис","Инсар","Инта","Ипатово","Ирбит","Иркутск","Исилькуль","Искитим","Истра","Ишим","Ишимбай","Йошкар-Ола","Кадников","Казань","Калач","Калач-на-Дону","Калачинск","Калининград","Калининск","Калтан","Калуга","Калязин","Камбарка","Каменка","Каменногорск","Каменск-Уральский","Каменск-Шахтинский","Камень-на-Оби","Камешково","Камызяк","Камышин","Камышлов","Канаш","Кандалакша","Канск","Карабаново","Карабаш","Карабулак","Карасук","Карачаевск","Карачев","Каргат","Каргополь","Карпинск","Карталы","Касимов","Касли","Каспийск","Катав-Ивановск","Катайск","Качканар","Кашин","Кашира","Кедровый","Кемерово","Кемь","Керчь","Кизел","Кизилюрт","Кизляр","Кимовск","Кимры","Кингисепп","Кинель","Кинешма","Киреевск","Киренск","Киржач","Кириллов","Кириши","Киров","Кировград","Кирово-Чепецк","Кировск","Кирс","Кирсанов","Киселёвск","Кисловодск","Клин","Клинцы","Княгинино","Ковдор","Ковров","Ковылкино","Когалым","Кодинск","Козельск","Козловка","Козьмодемьянск","Кола","Кологрив","Коломна","Колпашево","Колпино","Колтуши","Кольчугино","Коммунар","Комсомольск","Комсомольск-на-Амуре","Конаково","Кондопога","Кондрово","Константиновск","Копейск","Кораблино","Кореновск","Коркино","Королёв","Короча","Корсаков","Коряжма","Костерёво","Костомукша","Кострома","Котельники","Котельниково","Котельнич","Котлас","Котово","Котовск","Кохма","Красавино","Красноармейск","Красновишерск","Красногорск","Краснодар","Красное Село","Краснозаводск","Краснознаменск","Краснокаменск","Краснокамск","Красноперекопск","Краснослободск","Краснотурьинск","Красноуральск","Красноуфимск","Красноярск","Красный Кут","Красный Сулин","Красный Холм","Кремёнки","Кронштадт","Кропоткин","Крымск","Кстово","Кубинка","Кувандык","Кувшиново","Кудрово","Кудымкар","Кузнецк","Куйбышев","Кукмор","Кулебаки","Кумертау","Кунгур","Купино","Курган","Курганинск","Курильск","Курлово","Куровское","Курск","Куртамыш","Курчалой","Курчатов","Куса","Кушва","Кызыл","Кыштым","Кяхта","Лабинск","Лабытнанги","Лагань","Ладушкин","Лаишево","Лакинск","Лангепас","Лахденпохья","Лебедянь","Лениногорск","Ленинск","Ленинск-Кузнецкий","Ленск","Лермонтов","Лесной","Лесозаводск","Лесосибирск","Ливны","Ликино-Дулёво","Липецк","Липки","Лиски","Лихославль","Лобня","Лодейное Поле","Ломоносов","Лосино-Петровский","Луга","Луза","Лукоянов","Луховицы","Лысково","Лысьва","Лыткарино","Льгов","Любань","Люберцы","Любим","Людиново","Лянтор","Магадан","Магас","Магнитогорск","Майкоп","Майский","Макаров","Макарьев","Макушино","Малая Вишера","Малгобек","Малмыж","Малоархангельск","Малоярославец","Мамадыш","Мамоново","Мантурово","Мариинск","Мариинский Посад","Маркс","Махачкала","Мглин","Мегион","Медвежьегорск","Медногорск","Медынь","Межгорье","Междуреченск","Мезень","Меленки","Мелеуз","Менделеевск","Мензелинск","Мещовск","Миасс","Микунь","Миллерово","Минеральные Воды","Минусинск","Миньяр","Мирный","Михайлов","Михайловка","Михайловск","Мичуринск","Могоча","Можайск","Можга","Моздок","Мончегорск","Морозовск","Моршанск","Мосальск","Москва","Московский","Муравленко","Мураши","Мурино","Мурманск","Муром","Мценск","Мыски","Мытищи","Мышкин","Набережные Челны","Навашино","Наволоки","Надым","Назарово","Назрань","Называевск","Нальчик","Нариманов","Наро-Фоминск","Нарткала","Нарьян-Мар","Находка","Невель","Невельск","Невинномысск","Невьянск","Нелидово","Неман","Нерехта","Нерчинск","Нерюнгри","Нестеров","Нефтегорск","Нефтекамск","Нефтекумск","Нефтеюганск","Нея","Нижневартовск","Нижнекамск","Нижнеудинск","Нижние Серги","Нижний Ломов","Нижний Новгород","Нижний Тагил","Нижняя Салда","Нижняя Тура","Николаевск","Николаевск-на-Амуре","Никольск","Никольское","Новая Ладога","Новая Ляля","Новоалександровск","Новоалтайск","Новоаннинский","Нововоронеж","Новодвинск","Новозыбков","Новокубанск","Новокузнецк","Новокуйбышевск","Новомичуринск","Новомосковск","Новопавловск","Новоржев","Новороссийск","Новосибирск","Новосиль","Новосокольники","Новотроицк","Новоузенск","Новоульяновск","Новоуральск","Новохопёрск","Новочебоксарск","Новочеркасск","Новошахтинск","Новый Оскол","Новый Уренгой","Ногинск","Нолинск","Норильск","Ноябрьск","Нурлат","Нытва","Нюрба","Нягань","Нязепетровск","Няндома","Облучье","Обнинск","Обоянь","Обь","Одинцово","Озёрск","Озёры","Октябрьск","Октябрьский","Окуловка","Олёкминск","Оленегорск","Олонец","Омск","Омутнинск","Онега","Опочка","Орёл","Оренбург","Орехово-Зуево","Орлов","Орск","Оса","Осинники","Осташков","Остров","Островной","Острогожск","Отрадное","Отрадный","Оха","Оханск","Очёр","Павлово","Павловск","Павловский Посад","Палласовка","Партизанск","Певек","Пенза","Первомайск","Первоуральск","Перевоз","Пересвет","Переславль-Залесский","Пермь","Пестово","Петергоф","Петров Вал","Петровск","Петровск-Забайкальский","Петрозаводск","Петропавловск-Камчатский","Петухово","Петушки","Печора","Печоры","Пикалёво","Пионерский","Питкяранта","Плавск","Пласт","Плёс","Поворино","Подольск","Подпорожье","Покачи","Покров","Покровск","Полевской","Полесск","Полысаево","Полярные Зори","Полярный","Поронайск","Порхов","Похвистнево","Почеп","Починок","Пошехонье","Правдинск","Приволжск","Приморск","Приморско-Ахтарск","Приозерск","Прокопьевск","Пролетарск","Протвино","Прохладный","Псков","Пугачёв","Пудож","Пустошка","Пучеж","Пушкин","Пушкино","Пущино","Пыталово","Пыть-Ях","Пятигорск","Радужный","Райчихинск","Раменское","Рассказово","Ревда","Реж","Реутов","Ржев","Родники","Рославль","Россошь","Ростов","Ростов-на-Дону","Рошаль","Ртищево","Рубцовск","Рудня","Руза","Рузаевка","Рыбинск","Рыбное","Рыльск","Ряжск","Рязань","Саки","Салават","Салаир","Салехард","Сальск","Самара","Санкт-Петербург","Саранск","Сарапул","Саратов","Саров","Сасово","Сатка","Сафоново","Саяногорск","Саянск","Светлогорск","Светлоград","Светлый","Светогорск","Свирск","Свободный","Себеж","Севастополь","Северо-Курильск","Северобайкальск","Северодвинск","Североморск","Североуральск","Северск","Севск","Сегежа","Сельцо","Семёнов","Семикаракорск","Семилуки","Сенгилей","Серафимович","Сергач","Сергиев Посад","Сердобск","Серов","Серпухов","Сертолово","Сестрорецк","Сибай","Сим","Симферополь","Сковородино","Скопин","Славгород","Славск","Славянск-на-Кубани","Сланцы","Слободской","Слюдянка","Смоленск","Снежинск","Снежногорск","Собинка","Советск","Советская Гавань","Советский","Сокол","Солигалич","Соликамск","Солнечногорск","Соль-Илецк","Сольвычегодск","Сольцы","Сорочинск","Сорск","Сортавала","Сосенский","Сосновка","Сосновоборск","Сосновый Бор","Сосногорск","Сочи","Спас-Деменск","Спас-Клепики","Спасск","Спасск-Дальний","Спасск-Рязанский","Среднеколымск","Среднеуральск","Сретенск","Ставрополь","Старая Купавна","Старая Русса","Старица","Стародуб","Старый Крым","Старый Оскол","Стерлитамак","Стрежевой","Строитель","Струнино","Ступино","Суворов","Судак","Суджа","Судогда","Суздаль","Сунжа","Суоярви","Сураж","Сургут","Суровикино","Сурск","Сусуман","Сухиничи","Сухой Лог","Сызрань","Сыктывкар","Сысерть","Сычёвка","Сясьстрой","Тавда","Таганрог","Тайга","Тайшет","Талдом","Талица","Тамбов","Тара","Тарко-Сале","Таруса","Татарск","Таштагол","Тверь","Теберда","Тейково","Темников","Темрюк","Терек","Тетюши","Тимашёвск","Тихвин","Тихорецк","Тобольск","Тогучин","Тольятти","Томари","Томмот","Томск","Топки","Торжок","Торопец","Тосно","Тотьма","Трёхгорный","Троицк","Трубчевск","Туапсе","Туймазы","Тула","Тулун","Туран","Туринск","Тутаев","Тында","Тырныауз","Тюкалинск","Тюмень","Уварово","Углегорск","Углич","Удачный","Удомля","Ужур","Узловая","Улан-Удэ","Ульяновск","Унеча","Урай","Урень","Уржум","Урус-Мартан","Урюпинск","Усинск","Усмань","Усолье","Усолье-Сибирское","Уссурийск","Усть-Джегута","Усть-Илимск","Усть-Катав","Усть-Кут","Усть-Лабинск","Устюжна","Уфа","Ухта","Учалы","Уяр","Фатеж","Феодосия","Фокино","Фролово","Фрязино","Фурманов","Хабаровск","Хадыженск","Ханты-Мансийск","Харабали","Харовск","Хасавюрт","Хвалынск","Хилок","Химки","Холм","Холмск","Хотьково","Цивильск","Цимлянск","Циолковский","Чадан","Чайковский","Чапаевск","Чаплыгин","Чебаркуль","Чебоксары","Чегем","Чекалин","Челябинск","Чердынь","Черемхово","Черепаново","Череповец","Черкесск","Чёрмоз","Черноголовка","Черногорск","Чернушка","Черняховск","Чехов","Чистополь","Чита","Чкаловск","Чудово","Чулым","Чусовой","Чухлома","Шагонар","Шадринск","Шали","Шарыпово","Шарья","Шатура","Шахты","Шахунья","Шацк","Шебекино","Шелехов","Шенкурск","Шилка","Шимановск","Шиханы","Шлиссельбург","Шумерля","Шумиха","Шуя","Щёкино","Щёлкино","Щёлково","Щербинка","Щигры","Щучье","Электрогорск","Электросталь","Электроугли","Элиста","Энгельс","Эртиль","Югорск","Южа","Южно-Сахалинск","Южно-Сухокумск","Южноуральск","Юрга","Юрьев-Польский","Юрьевец","Юрюзань","Юхнов","Ядрин","Якутск","Ялта","Ялуторовск","Янаул","Яранск","Яровое","Ярославль","Ярцево","Ясногорск","Ясный","Яхрома"];

  /* ========================================
     HELPERS
  ======================================== */
  function normalizeCitySearch(str) {
    return str.toLowerCase().replace(/ё/g, 'е').trim();
  }

  function getRussianCityName(value) {
    var q = normalizeCitySearch(value);
    for (var i = 0; i < RUSSIAN_CITIES.length; i++) {
      if (normalizeCitySearch(RUSSIAN_CITIES[i]) === q) {
        return RUSSIAN_CITIES[i];
      }
    }
    return null;
  }

  function getCitySuggestions(value) {
    var q = normalizeCitySearch(value);
    if (!q) return [];
    var results = [];
    for (var i = 0; i < RUSSIAN_CITIES.length; i++) {
      if (normalizeCitySearch(RUSSIAN_CITIES[i]).indexOf(q) === 0) {
        results.push(RUSSIAN_CITIES[i]);
        if (results.length >= 8) break;
      }
    }
    return results;
  }

  function formatPhoneInput(value) {
    var digits = value.replace(/\D/g, '');
    var hasCC = value.trim().indexOf('+7') === 0;
    if (hasCC && digits.charAt(0) === '7') digits = digits.slice(1, 11);
    else if (digits.length > 10 && /^[78]/.test(digits)) digits = digits.slice(1, 11);
    else digits = digits.slice(0, 10);

    var parts = ['+7'];
    if (digits.length > 0) parts.push(' (' + digits.slice(0, 3));
    if (digits.length >= 3) parts[1] += ')';
    if (digits.length > 3) parts.push(' ' + digits.slice(3, 6));
    if (digits.length > 6) parts.push('-' + digits.slice(6, 8));
    if (digits.length > 8) parts.push('-' + digits.slice(8, 10));
    return digits.length > 0 ? parts.join('') : '+7 ';
  }

  function getPhoneDigits(value) {
    var digits = value.replace(/\D/g, '');
    var hasCC = value.trim().indexOf('+7') === 0;
    if (hasCC && digits.charAt(0) === '7') return digits.slice(1, 11);
    if (digits.length > 10 && /^[78]/.test(digits)) return digits.slice(1, 11);
    return digits.slice(0, 10);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
  }

  function isValidPhone(value) {
    return getPhoneDigits(value).length === 10;
  }

  function isValidTg(value) {
    return /^@[a-zA-Z0-9_]{5,32}$/.test(value.trim());
  }

  /* ========================================
     STORAGE KEY & CONSTANTS
  ======================================== */
  var STORAGE_KEY = 'posleslovie:checkout-state';
  var PRODUCT_PRICE = 999;
  var MAX_LOGO_SIZE = 3 * 1024 * 1024;
  var AMO_URL = 'https://posleslovie-amocrm.kailgurika.workers.dev/';

  /* ========================================
     CHECKOUT STATE
  ======================================== */
  var checkoutState = {
    quantity: 3,
    tab: 'personal',
    sealColor: 'red',
    formValues: {
      name: '', phone: '+7 ', email: '',
      company: '', inn: '', ogrn: '',
      contactMethod: 'tg', contactHandle: '',
      city: '', comment: '', artist: ''
    }
  };
  var checkoutStep = 1;
  var logoFile = null;

  function loadCheckoutState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed.quantity) checkoutState.quantity = Math.max(1, parseInt(parsed.quantity) || 3);
      if (parsed.tab) checkoutState.tab = parsed.tab === 'company' ? 'company' : 'personal';
      if (parsed.sealColor) checkoutState.sealColor = parsed.sealColor;
      if (parsed.formValues) {
        var fv = parsed.formValues;
        Object.keys(checkoutState.formValues).forEach(function(k) {
          if (typeof fv[k] === 'string') checkoutState.formValues[k] = fv[k];
        });
        checkoutState.formValues.phone = formatPhoneInput(checkoutState.formValues.phone || '+7 ');
      }
    } catch(e) {}
  }

  function saveCheckoutState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checkoutState)); } catch(e) {}
  }

  /* ========================================
     MODAL SYSTEM
  ======================================== */
  var currentModal = null;

  function openModal(id) {
    if (currentModal) closeModal();
    var overlay = document.getElementById('modal-' + id);
    if (!overlay) return;
    currentModal = id;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (id === 'checkout') {
      checkoutStep = 1;
      syncCheckoutUI();
    }
  }

  function closeModal() {
    if (!currentModal) return;
    var overlay = document.getElementById('modal-' + currentModal);
    if (overlay) overlay.classList.remove('is-open');
    currentModal = null;
    document.body.style.overflow = '';
    hideCityDropdown();
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentModal) closeModal();
  });

  /* ========================================
     HAMBURGER MENU
  ======================================== */
  function initHamburger() {
    var btn = document.getElementById('js-hamburger');
    var menu = document.getElementById('js-mobile-menu');
    if (!btn || !menu) return;

    function openMenu() {
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Закрыть меню');
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeMenuFn() {
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Открыть меню');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function isMenuOpen() { return menu.classList.contains('is-open'); }

    btn.addEventListener('click', function() {
      isMenuOpen() ? closeMenuFn() : openMenu();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isMenuOpen()) closeMenuFn();
    });
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 1024 && isMenuOpen()) closeMenuFn();
    });

    menu.querySelectorAll('[data-close-menu]').forEach(function(el) {
      el.addEventListener('click', function() { closeMenuFn(); });
    });
  }

  /* ========================================
     NAV ACTIONS
  ======================================== */
  function initNavActions() {
    document.querySelectorAll('[data-scroll]').forEach(function(el) {
      el.addEventListener('click', function() {
        var target = el.getAttribute('data-scroll');
        var section = document.getElementById(target);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    document.querySelectorAll('[data-modal]').forEach(function(el) {
      el.addEventListener('click', function() {
        var id = el.getAttribute('data-modal');
        openModal(id);
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(function(el) {
      el.addEventListener('click', function() { closeModal(); });
    });

    document.querySelectorAll('.ps-modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('mousedown', function(e) {
        if (e.target === overlay) closeModal();
      });
    });
  }

  /* ========================================
     SCROLL TO TOP
  ======================================== */
  function initScrollTop() {
    var btn = document.getElementById('js-scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 720) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    }, { passive: true });
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========================================
     INFINITE CAROUSEL
  ======================================== */
  var CAROUSEL_DURATION = 500;
  var CAROUSEL_FAST = 250;

  function InfiniteCarousel(tapeEl) {
    var slides = [];
    var orderedSlides = [];
    var offset = 0;
    var isTransitioning = false;
    var queue = [];
    var animating = false;
    var timeoutId = null;
    var frameId = null;

    function buildSlidePool() {
      slides = Array.prototype.slice.call(tapeEl.children);
      orderedSlides = slides.slice();
    }

    function renderOrder() {
      orderedSlides.forEach(function(slide) { tapeEl.appendChild(slide); });
    }

    function setTransform(pct) {
      tapeEl.style.transform = 'translateX(' + (pct * 100) + '%)';
    }

    function startNext() {
      if (animating || queue.length === 0) return;
      var dir = queue.shift();
      var duration = queue.length > 0 ? CAROUSEL_FAST : CAROUSEL_DURATION;
      animating = true;

      if (dir === 1) {
        tapeEl.classList.add('ps-tape--transitioning');
        tapeEl.style.transitionDuration = duration + 'ms';
        setTransform(-1);
        isTransitioning = true;
        timeoutId = setTimeout(function() {
          tapeEl.classList.remove('ps-tape--transitioning');
          tapeEl.style.transitionDuration = '';
          var first = orderedSlides.shift();
          orderedSlides.push(first);
          renderOrder();
          setTransform(0);
          isTransitioning = false;
          animating = false;
          frameId = requestAnimationFrame(function() { startNext(); });
        }, duration);
      } else {
        tapeEl.classList.remove('ps-tape--transitioning');
        tapeEl.style.transitionDuration = '';
        var last = orderedSlides.pop();
        orderedSlides.unshift(last);
        renderOrder();
        setTransform(-1);
        frameId = requestAnimationFrame(function() {
          frameId = requestAnimationFrame(function() {
            tapeEl.classList.add('ps-tape--transitioning');
            tapeEl.style.transitionDuration = duration + 'ms';
            setTransform(0);
            isTransitioning = true;
            timeoutId = setTimeout(function() {
              tapeEl.classList.remove('ps-tape--transitioning');
              tapeEl.style.transitionDuration = '';
              isTransitioning = false;
              animating = false;
              frameId = requestAnimationFrame(function() { startNext(); });
            }, duration);
          });
        });
      }
    }

    buildSlidePool();
    setTransform(0);

    return {
      move: function(direction) {
        queue.push(direction);
        startNext();
      }
    };
  }

  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function(wrapper) {
      var id = wrapper.getAttribute('data-carousel');
      var tape = document.getElementById(id + '-tape');
      if (!tape) return;
      var carousel = InfiniteCarousel(tape);

      var prevBtn = document.querySelector('[data-carousel-prev="' + id + '"]');
      var nextBtn = document.querySelector('[data-carousel-next="' + id + '"]');
      if (prevBtn) prevBtn.addEventListener('click', function() { carousel.move(-1); });
      if (nextBtn) nextBtn.addEventListener('click', function() { carousel.move(1); });
    });
  }

  function initReviewsCarousel() {
    var tape = document.getElementById('reviews-tape');
    var prevBtn = document.getElementById('reviews-prev');
    var nextBtn = document.getElementById('reviews-next');
    if (!tape) return;

    var carousel = InfiniteCarousel(tape);
    if (prevBtn) prevBtn.addEventListener('click', function() { carousel.move(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { carousel.move(1); });
  }

  /* ========================================
     CITY AUTOCOMPLETE
  ======================================== */
  var cityFocused = false;

  function showCityDropdown(suggestions) {
    var dropdown = document.getElementById('city-dropdown');
    var list = document.getElementById('city-list');
    if (!dropdown || !list) return;
    list.innerHTML = '';
    if (!suggestions.length || !cityFocused) {
      dropdown.classList.remove('is-open');
      return;
    }
    suggestions.forEach(function(city) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'city-dropdown__item';
      btn.textContent = city;
      btn.addEventListener('mousedown', function(e) {
        e.preventDefault();
        document.getElementById('field-city').value = city;
        cityFocused = false;
        dropdown.classList.remove('is-open');
        clearFieldError('city');
      });
      list.appendChild(btn);
    });
    dropdown.classList.add('is-open');
  }

  function hideCityDropdown() {
    var dropdown = document.getElementById('city-dropdown');
    if (dropdown) dropdown.classList.remove('is-open');
  }

  function initCityField() {
    var input = document.getElementById('field-city');
    if (!input) return;
    input.addEventListener('focus', function() {
      cityFocused = true;
      var suggestions = getCitySuggestions(input.value);
      showCityDropdown(suggestions);
    });
    input.addEventListener('input', function() {
      clearFieldError('city');
      var suggestions = getCitySuggestions(input.value);
      showCityDropdown(suggestions);
    });
    input.addEventListener('blur', function() {
      setTimeout(function() {
        cityFocused = false;
        hideCityDropdown();
      }, 120);
    });
  }

  /* ========================================
     FORM FIELD HELPERS
  ======================================== */
  function setFieldError(fieldId, message) {
    var wrap = document.getElementById('field-' + fieldId + '-wrap');
    var err = document.getElementById('err-' + fieldId);
    if (wrap) wrap.classList.add('form-field--error');
    if (err) { err.textContent = message; err.style.display = ''; }
  }

  function clearFieldError(fieldId) {
    var wrap = document.getElementById('field-' + fieldId + '-wrap');
    var err = document.getElementById('err-' + fieldId);
    if (wrap) wrap.classList.remove('form-field--error');
    if (err) { err.textContent = ''; err.style.display = 'none'; }
  }

  function showErrorSummary(id, message) {
    var el = document.getElementById(id);
    if (el) { el.textContent = message; el.style.display = ''; }
  }

  function hideErrorSummary(id) {
    var el = document.getElementById(id);
    if (el) { el.style.display = 'none'; }
  }

  function showMessage(id, msg) {
    var el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = ''; }
  }

  function hideMessage(id) {
    var el = document.getElementById(id);
    if (el) { el.style.display = 'none'; }
  }

  /* ========================================
     CHECKOUT UI SYNC
  ======================================== */
  function syncCheckoutUI() {
    var fv = checkoutState.formValues;

    // Tab
    document.getElementById('tab-personal').classList.toggle('checkout-tab--active', checkoutState.tab === 'personal');
    document.getElementById('tab-company').classList.toggle('checkout-tab--active', checkoutState.tab === 'company');

    // Company fields visibility
    var companyFields = document.getElementById('company-fields');
    var cityWrap = document.getElementById('city-field-wrap');
    var companyCommentWrap = document.getElementById('company-comment-wrap');
    if (companyFields) companyFields.style.display = checkoutState.tab === 'company' ? '' : 'none';
    if (cityWrap) cityWrap.style.display = checkoutState.tab === 'personal' ? '' : 'none';
    if (companyCommentWrap) companyCommentWrap.style.display = checkoutState.tab === 'company' ? '' : 'none';

    // Step visibility
    var step1 = document.getElementById('checkout-step1');
    var step2 = document.getElementById('checkout-step2');
    if (step1) step1.style.display = checkoutStep === 1 ? '' : 'none';
    if (step2) step2.style.display = checkoutStep === 2 ? '' : 'none';

    // Back button
    var backBtn = document.getElementById('checkout-back');
    if (backBtn) {
      if (checkoutStep === 2) {
        backBtn.classList.remove('checkout-back-btn--disabled');
        backBtn.classList.add('checkout-back-btn--active');
        backBtn.disabled = false;
      } else {
        backBtn.classList.add('checkout-back-btn--disabled');
        backBtn.classList.remove('checkout-back-btn--active');
        backBtn.disabled = true;
      }
    }

    // Form values
    var fields = ['name','phone','email','company','inn','ogrn','contactHandle','city'];
    fields.forEach(function(f) {
      var el = document.getElementById('field-' + f);
      if (el) el.value = fv[f] || '';
    });
    var contactMethodEl = document.getElementById('field-contact-method');
    if (contactMethodEl) contactMethodEl.value = fv.contactMethod || 'tg';
    var commentEl = document.getElementById('field-comment');
    if (commentEl) commentEl.value = fv.comment || '';
    var commentCompanyEl = document.getElementById('field-comment-company');
    if (commentCompanyEl) commentCompanyEl.value = fv.comment || '';
    var artistEl = document.getElementById('field-artist');
    if (artistEl) artistEl.value = fv.artist || '';

    // Quantity
    var qInput = document.getElementById('qty-input');
    if (qInput) qInput.value = checkoutState.quantity;
    var qMinus = document.getElementById('qty-minus');
    if (qMinus) qMinus.disabled = checkoutState.quantity <= 1;

    // Totals
    updateOrderSummary();

    // Seal colors
    document.querySelectorAll('.seal-swatch').forEach(function(sw) {
      sw.classList.toggle('is-active', sw.getAttribute('data-seal') === checkoutState.sealColor);
    });

    // Submit label
    var label = document.getElementById('checkout-submit-label');
    if (label) label.textContent = checkoutState.tab === 'personal' ? 'Оплатить' : 'Оставить заявку';
  }

  function updateOrderSummary() {
    var qty = checkoutState.quantity;
    var total = qty * PRODUCT_PRICE;
    var qtyEl = document.getElementById('summary-qty');
    var totalEl = document.getElementById('summary-total');
    if (qtyEl) qtyEl.textContent = qty;
    if (totalEl) totalEl.textContent = total;
  }

  /* ========================================
     CHECKOUT VALIDATION
  ======================================== */
  function validateStep1() {
    var fv = checkoutState.formValues;
    var tab = checkoutState.tab;
    var errors = {};

    if (!fv.name.trim()) errors.name = 'Укажите имя.';
    if (!fv.phone.trim()) errors.phone = 'Укажите телефон.';
    else if (!isValidPhone(fv.phone)) errors.phone = 'Введите российский номер в формате +7XXXXXXXXXX.';
    if (!fv.email.trim()) errors.email = 'Укажите email.';
    else if (!isValidEmail(fv.email)) errors.email = 'Введите корректный email, например name@example.ru.';

    if (tab === 'company' && !fv.company.trim()) errors.company = 'Укажите название компании.';

    if (fv.contactMethod === 'tg' && !fv.contactHandle.trim()) errors.contactHandle = 'Укажите ник в Telegram.';
    else if (fv.contactMethod === 'tg' && !isValidTg(fv.contactHandle)) errors.contactHandle = 'Введите @ и 5-32 символа: латиница, цифры или _.';

    if (tab === 'personal') {
      if (!fv.city.trim()) errors.city = 'Укажите город доставки.';
      else if (!getRussianCityName(fv.city)) errors.city = 'Выберите город из списка подсказок.';
    }

    if (!Number.isFinite(checkoutState.quantity) || checkoutState.quantity < 1) {
      errors.quantity = 'Укажите количество от 1 штуки.';
    }

    return errors;
  }

  function applyStep1Errors(errors) {
    var fields = ['name','phone','email','company','contactHandle','city'];
    fields.forEach(function(f) {
      if (errors[f]) setFieldError(f, errors[f]);
      else clearFieldError(f);
    });
    if (errors.quantity) {
      var qErr = document.getElementById('err-qty');
      var qInput = document.getElementById('qty-input');
      if (qErr) { qErr.textContent = errors.quantity; qErr.style.display = ''; }
      if (qInput) qInput.classList.add('order-panel__qty-input--error');
    } else {
      var qErr2 = document.getElementById('err-qty');
      var qInput2 = document.getElementById('qty-input');
      if (qErr2) { qErr2.style.display = 'none'; }
      if (qInput2) qInput2.classList.remove('order-panel__qty-input--error');
    }
  }

  function hasErrors(errors) { return Object.keys(errors).length > 0; }

  /* ========================================
     CHECKOUT INIT
  ======================================== */
  function initCheckout() {
    loadCheckoutState();

    // Tab switching
    var tabPersonal = document.getElementById('tab-personal');
    var tabCompany = document.getElementById('tab-company');
    if (tabPersonal) tabPersonal.addEventListener('click', function() {
      checkoutState.tab = 'personal';
      checkoutStep = 1;
      clearAllCheckoutErrors();
      saveCheckoutState();
      syncCheckoutUI();
    });
    if (tabCompany) tabCompany.addEventListener('click', function() {
      checkoutState.tab = 'company';
      checkoutStep = 1;
      clearAllCheckoutErrors();
      saveCheckoutState();
      syncCheckoutUI();
    });

    // Back button
    var backBtn = document.getElementById('checkout-back');
    if (backBtn) backBtn.addEventListener('click', function() {
      if (checkoutStep === 2) { checkoutStep = 1; syncCheckoutUI(); }
    });

    // Form fields
    bindTextField('name');
    bindPhoneField('phone');
    bindTextField('email');
    bindTextField('company');
    bindTextField('inn');
    bindTextField('ogrn');
    bindTextField('contactHandle');

    var cityInput = document.getElementById('field-city');
    if (cityInput) cityInput.addEventListener('input', function() {
      checkoutState.formValues.city = cityInput.value;
      saveCheckoutState();
    });

    var contactMethodEl = document.getElementById('field-contact-method');
    if (contactMethodEl) contactMethodEl.addEventListener('change', function() {
      checkoutState.formValues.contactMethod = contactMethodEl.value;
      var req = document.getElementById('handle-required');
      if (req) req.style.visibility = contactMethodEl.value === 'tg' ? 'visible' : 'hidden';
      saveCheckoutState();
    });

    var commentEl = document.getElementById('field-comment');
    if (commentEl) commentEl.addEventListener('input', function() {
      checkoutState.formValues.comment = commentEl.value;
      saveCheckoutState();
    });
    var commentCompanyEl = document.getElementById('field-comment-company');
    if (commentCompanyEl) commentCompanyEl.addEventListener('input', function() {
      checkoutState.formValues.comment = commentCompanyEl.value;
      saveCheckoutState();
    });

    var artistEl = document.getElementById('field-artist');
    if (artistEl) artistEl.addEventListener('change', function() {
      checkoutState.formValues.artist = artistEl.value;
      saveCheckoutState();
    });

    // Seal colors
    document.querySelectorAll('.seal-swatch').forEach(function(sw) {
      sw.addEventListener('click', function() {
        checkoutState.sealColor = sw.getAttribute('data-seal');
        document.querySelectorAll('.seal-swatch').forEach(function(s) {
          s.classList.toggle('is-active', s === sw);
        });
        saveCheckoutState();
      });
    });

    // Quantity
    var qMinus = document.getElementById('qty-minus');
    var qPlus = document.getElementById('qty-plus');
    var qInput = document.getElementById('qty-input');
    if (qMinus) qMinus.addEventListener('click', function() {
      checkoutState.quantity = Math.max(1, checkoutState.quantity - 1);
      if (qInput) qInput.value = checkoutState.quantity;
      qMinus.disabled = checkoutState.quantity <= 1;
      updateOrderSummary();
      saveCheckoutState();
    });
    if (qPlus) qPlus.addEventListener('click', function() {
      checkoutState.quantity++;
      if (qInput) qInput.value = checkoutState.quantity;
      var qm = document.getElementById('qty-minus');
      if (qm) qm.disabled = false;
      updateOrderSummary();
      saveCheckoutState();
    });
    if (qInput) qInput.addEventListener('input', function() {
      var val = parseInt(qInput.value) || 1;
      checkoutState.quantity = Math.max(1, val);
      var qm2 = document.getElementById('qty-minus');
      if (qm2) qm2.disabled = checkoutState.quantity <= 1;
      updateOrderSummary();
      saveCheckoutState();
    });

    // Logo upload
    var logoInput = document.getElementById('field-logo');
    if (logoInput) logoInput.addEventListener('change', function() {
      var file = logoInput.files[0];
      handleLogoFile(file || null);
    });

    // Continue button (step 1 → step 2)
    var continueBtn = document.getElementById('checkout-continue');
    if (continueBtn) continueBtn.addEventListener('click', function() {
      var errors = validateStep1();
      applyStep1Errors(errors);
      hideErrorSummary('checkout-error-summary');
      if (hasErrors(errors)) {
        showErrorSummary('checkout-error-summary', 'Проверьте контактные данные и детали заказа.');
      } else {
        clearAllCheckoutErrors();
        checkoutStep = 2;
        syncCheckoutUI();
      }
    });

    // Submit button
    var submitBtn = document.getElementById('checkout-submit');
    if (submitBtn) submitBtn.addEventListener('click', function() { submitCheckout(); });

    initCityField();
    syncCheckoutUI();
  }

  function bindTextField(fieldId) {
    var el = document.getElementById('field-' + fieldId);
    if (!el) return;
    el.addEventListener('input', function() {
      checkoutState.formValues[fieldId] = el.value;
      clearFieldError(fieldId);
      saveCheckoutState();
    });
  }

  function bindPhoneField(fieldId) {
    var el = document.getElementById('field-' + fieldId);
    if (!el) return;
    el.addEventListener('input', function() {
      var formatted = formatPhoneInput(el.value);
      el.value = formatted;
      checkoutState.formValues[fieldId] = formatted;
      clearFieldError(fieldId);
      saveCheckoutState();
    });
  }

  function clearAllCheckoutErrors() {
    ['name','phone','email','company','contactHandle','city'].forEach(function(f) { clearFieldError(f); });
    hideErrorSummary('checkout-error-summary');
    hideErrorSummary('checkout-error-summary2');
    var errConsent = document.getElementById('err-consent');
    if (errConsent) errConsent.style.display = 'none';
    var consentWrap = document.getElementById('consent-wrap');
    if (consentWrap) consentWrap.classList.remove('consent-label--error');
    hideMessage('checkout-message');
  }

  function handleLogoFile(file) {
    var errEl = document.getElementById('err-logo');
    var hintEl = document.getElementById('logo-hint');
    var fieldWrap = document.getElementById('logo-field-wrap');
    logoFile = null;
    if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
    if (fieldWrap) fieldWrap.classList.remove('logo-field--error');
    if (!file) {
      if (hintEl) hintEl.textContent = 'Файлы формата .jpg .png не больше 3мб';
      return;
    }
    if (!['image/jpeg','image/png'].includes(file.type)) {
      if (errEl) { errEl.textContent = 'Загрузите файл в формате JPG или PNG.'; errEl.style.display = ''; }
      if (fieldWrap) fieldWrap.classList.add('logo-field--error');
      if (hintEl) hintEl.textContent = 'Файлы формата .jpg .png не больше 3мб';
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      if (errEl) { errEl.textContent = 'Файл должен быть не больше 3 МБ.'; errEl.style.display = ''; }
      if (fieldWrap) fieldWrap.classList.add('logo-field--error');
      return;
    }
    var reader = new FileReader();
    reader.onload = function() {
      var result = typeof reader.result === 'string' ? reader.result : '';
      var base64 = result.indexOf(',') !== -1 ? result.split(',')[1] : result;
      logoFile = { name: file.name, type: file.type, size: file.size, base64: base64 };
      if (hintEl) hintEl.textContent = 'Выбран файл: ' + file.name;
    };
    reader.onerror = function() {
      if (errEl) { errEl.textContent = 'Не удалось прочитать файл. Попробуйте выбрать его ещё раз.'; errEl.style.display = ''; }
    };
    reader.readAsDataURL(file);
  }

  function submitCheckout() {
    var fv = checkoutState.formValues;
    var tab = checkoutState.tab;
    var qty = checkoutState.quantity;
    var total = qty * PRODUCT_PRICE;

    var errEl = document.getElementById('err-logo');
    var logoErr = errEl && errEl.style.display !== 'none' && errEl.textContent;

    // Re-validate all
    var errors = validateStep1();

    var consentChecked = document.getElementById('field-consent') && document.getElementById('field-consent').checked;
    if (!consentChecked) {
      errors.consent = 'Подтвердите согласие с условиями, чтобы оформить заказ.';
    }

    if (logoErr) {
      showMessage('checkout-message', logoErr);
      return;
    }

    if (hasErrors(errors)) {
      applyStep1Errors(errors);
      showErrorSummary('checkout-error-summary2', 'В заказе остались ошибки. Вернитесь к выделенным полям.');
      if (errors.consent) {
        var cErr = document.getElementById('err-consent');
        var cWrap = document.getElementById('consent-wrap');
        if (cErr) { cErr.textContent = errors.consent; cErr.style.display = ''; }
        if (cWrap) cWrap.classList.add('consent-label--error');
      }
      // If step1 errors exist, go back to step 1
      var step1Fields = ['name','phone','email','company','contactHandle','city','quantity'];
      var hasStep1Err = step1Fields.some(function(f) { return errors[f]; });
      if (hasStep1Err) {
        checkoutStep = 1;
        syncCheckoutUI();
        showErrorSummary('checkout-error-summary', 'Проверьте контактные данные и детали заказа.');
      }
      return;
    }

    var submitBtn = document.getElementById('checkout-submit');
    var label = document.getElementById('checkout-submit-label');
    if (submitBtn) submitBtn.disabled = true;
    if (label) label.textContent = 'Отправляем...';
    showMessage('checkout-message', 'Отправляем заявку в AmoCRM...');

    var trimValues = {};
    Object.keys(fv).forEach(function(k) { trimValues[k] = fv[k].trim(); });

    var payload = {
      tab: tab,
      quantity: qty,
      total: total,
      logoFile: logoFile || null,
      formValues: {
        name: trimValues.name,
        phone: trimValues.phone,
        email: trimValues.email,
        company: tab === 'company' ? trimValues.company : '',
        inn: tab === 'company' ? trimValues.inn : '',
        ogrn: tab === 'company' ? trimValues.ogrn : '',
        city: tab === 'personal' ? (getRussianCityName(trimValues.city) || trimValues.city) : '',
        contactMethod: trimValues.contactMethod,
        contactHandle: trimValues.contactMethod === 'tg' ? trimValues.contactHandle : '',
        comment: trimValues.comment,
        sealColor: checkoutState.sealColor,
        artist: trimValues.artist
      }
    };

    doFetchSubmit(payload, function() {
      showMessage('checkout-message', 'Ваша заявка отправлена в AmoCRM. Мы свяжемся с вами в ближайшее время.');
      if (submitBtn) submitBtn.disabled = false;
      var lbl = document.getElementById('checkout-submit-label');
      if (lbl) lbl.textContent = tab === 'personal' ? 'Оплатить' : 'Оставить заявку';
    }, function(errMsg) {
      showMessage('checkout-message', 'Не удалось отправить заявку в AmoCRM. Проверьте токен, CORS и доступы интеграции.');
      if (submitBtn) submitBtn.disabled = false;
      var lbl = document.getElementById('checkout-submit-label');
      if (lbl) lbl.textContent = tab === 'personal' ? 'Оплатить' : 'Оставить заявку';
    });
  }

  /* ========================================
     PARTNERS FORM
  ======================================== */
  function initPartnersForm() {
    var form = document.getElementById('partners-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var email = form.querySelector('[name="email"]');
      var msgEl = document.getElementById('partners-message');
      var msg = 'Нажали "Стать партнером". Имя: ' + (name ? name.value || 'не указано' : 'не указано') +
                ', телефон: ' + (phone ? phone.value || 'не указан' : 'не указан') +
                ', email: ' + (email ? email.value || 'не указан' : 'не указан') + '.';
      if (msgEl) { msgEl.textContent = msg; msgEl.style.display = ''; }
    });
  }

  /* ========================================
     FETCH SUBMIT FIX (re-implement properly)
  ======================================== */
  function doFetchSubmit(payload, onDone, onError) {
    fetch(AMO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function(res) {
      if (res.ok) onDone();
      else onError('HTTP ' + res.status);
    }, function(err) {
      onError(err.message || 'network error');
    });
  }

  /* ========================================
     INIT
  ======================================== */
  function init() {
    initHamburger();
    initNavActions();
    initScrollTop();
    initCarousels();
    initReviewsCarousel();
    initCheckout();
    initPartnersForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
