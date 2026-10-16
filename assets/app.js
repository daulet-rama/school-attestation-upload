/* Документы аттестации — общий скрипт для двух сайтов.
 *
 *  mode: "docs"   — сайт с документами (данные в assets/data.js);
 *  mode: "upload" — сайт загрузки: тот же каталог, но каждый документ из списка
 *                   нужно загрузить. Файлы сохраняются в ветку uploads репозитория
 *                   GitHub (после входа с ключом) или в этом браузере (черновик).
 */
(() => {
    'use strict';

    const SITE = window.SITE || {settings: {}, catalogs: []};
    const CONFIG = window.SITE_CONFIG || {};
    const UPLOAD = CONFIG.mode === 'upload';
    const GH = CONFIG.github || {};
    const MAX_MB = Number(CONFIG.maxUploadMB) || 30;
    const MAX_BYTES = MAX_MB * 1024 * 1024;
    const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
    const SETTINGS_ID = '__settings__';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    /* ───────────── Тексты ───────────── */

    const WORDS = {
        ru: {
            pageTitle: 'Документы аттестации',
            mainTitle: 'Документы аттестации',
            mainLead: 'Выберите категорию или найдите документ по названию.',
            mainLeadUpload: 'Загрузите документы по списку — в каждом разделе указано, какой файл нужен.',
            home: 'Главная',
            languageSwitch: 'Выбор языка',
            sidebarLabel: 'Информация об организации',
            searchLabel: 'Поиск документов',
            updated: 'Данные обновлены',
            filling: 'Заполняется',
            director: 'Директор',
            students: 'Ученики',
            teachers: 'Педагоги',
            languages: 'Язык обучения',
            hours: 'Режим работы',
            phSiteName: 'Название организации образования',
            phSlogan: 'Слоган или короткое описание',
            phDirector: 'ФИО директора',
            phAddress: 'Адрес организации',
            phPhone: 'Телефон',
            phEmail: 'Электронная почта',
            categoryLabel: 'Категорий',
            categoryNote: 'Все разделы открыты',
            documentLabel: 'Документов',
            documentNote: 'PDF, Word, Excel и изображения',
            documentNoteEmpty: 'Пока не добавлены',
            lastUpdate: 'Последнее обновление',
            actual: 'Актуальная версия',
            allCategories: 'Все категории',
            categories: 'Категории',
            homeTitle: 'Категории документов',
            homeLead: 'Откройте папку, чтобы увидеть документы и подразделы',
            homeLeadUpload: 'Откройте папку, чтобы загрузить нужные документы',
            showAll: 'Показать все',
            open: 'открыть',
            inSection: 'в разделе',
            back: 'Назад',
            search: 'Поиск',
            searchTitle: 'Результаты поиска',
            found: 'Найдено документов',
            emptyTitle: 'Документов пока нет',
            emptyLead: 'Материалы появятся после добавления.',
            noResults: 'Ничего не найдено',
            noResultsLead: 'Попробуйте другой запрос или выберите «Все категории».',
            notFound: 'Страница не найдена',
            notFoundLead: 'Возможно, ссылка устарела. Вернитесь к списку категорий.',
            document: 'Документ',
            download: 'Скачать документ',
            openLink: 'Открыть ссылку',
            unavailable: 'Предварительный просмотр недоступен',
            unavailableLead: 'Скачайте документ, чтобы открыть его на компьютере.',
            overview: 'Обзор документа',
            pages: 'Страницы / листы',
            pagesHint: 'Количество показано в панели просмотрщика',
            imageHint: 'Изображение показано целиком',
            linkHint: 'Документ открыт по ссылке',
            placeholder: 'Поиск по названию документа…',
            developer: 'Разработка сайта',
            // сайт загрузки
            uploadedLabel: 'Загружено',
            uploadedNote: 'на сайте: {site} · в браузере: {local}',
            uploadedNoteSite: 'документов по списку',
            leftLabel: 'Осталось загрузить',
            leftNoteDone: 'Все документы загружены',
            updatedOn: 'Обновлено: {date}',
            notUpdated: 'Ещё ничего не загружено',
            uploadedShort: 'загружено',
            statusMissing: 'Нужно загрузить',
            statusPublished: 'Загружен',
            statusLocal: 'В браузере',
            statusChecking: 'Проверка…',
            statusQueued: 'В очереди…',
            expected: 'нужен файл',
            inBrowser: 'сохранён только в этом браузере',
            uploadAction: 'Загрузить',
            uploadTitle: 'Загрузите документ',
            uploadNeed: 'Для этого раздела нужен документ:',
            dropHere: 'Перетащите файл сюда',
            or: 'или',
            chooseFile: 'Выбрать файл',
            formats: 'PDF, Word, Excel, PowerPoint или изображение',
            maxSize: 'до {mb} МБ',
            anySize: 'черновик в браузере — без ограничения размера',
            linkLabel: 'Файл больше {mb} МБ? Загрузите его на Google Диск (доступ «Все, у кого есть ссылка») и вставьте ссылку:',
            linkPlaceholder: 'https://drive.google.com/file/d/…',
            saveLink: 'Сохранить ссылку',
            badLink: 'Вставьте полную ссылку, которая начинается с https://',
            replace: 'Заменить',
            remove: 'Удалить',
            removeDraft: 'Удалить черновик',
            publishOne: 'Опубликовать',
            confirmRemove: 'Удалить документ «{title}»?',
            confirmRemoveDraft: 'Удалить черновик «{title}» из этого браузера?',
            tooLarge: 'Файл весит {size} — это больше {mb} МБ. Сожмите PDF или загрузите файл на Google Диск и вставьте ссылку ниже.',
            badType: 'Этот формат не подходит. Нужен PDF, Word, Excel, PowerPoint или изображение.',
            badImage: 'Нужна картинка JPG, PNG или WEBP до 5 МБ.',
            preparing: 'Подготовка файла…',
            uploading: 'Загрузка «{title}»… {pct}%',
            saving: 'Сохранение на сайте…',
            uploadedToast: 'Документ «{title}» загружен на сайт',
            linkSaved: 'Ссылка для «{title}» сохранена',
            savedLocal: '«{title}» сохранён в этом браузере. Войдите, чтобы опубликовать его на сайте.',
            removedToast: 'Документ удалён',
            uploadFail: 'Не удалось сохранить: {err}',
            whereSite: 'Вы вошли как {user}: файл сразу появится на сайте для всех посетителей.',
            whereLocal: 'Вы не вошли: файл сохранится только в этом браузере.',
            whereLocalAction: 'Войти для публикации',
            login: 'Войти',
            logout: 'Выйти',
            loginTitle: 'Вход для загрузки документов',
            loginLead: 'Нужен ключ доступа GitHub к репозиторию сайта. Ключ хранится только в вашем браузере.',
            tokenLabel: 'Ключ доступа (token)',
            tokenPlaceholder: 'github_pat_…',
            remember: 'Запомнить на этом устройстве',
            howToken: 'Как получить ключ доступа',
            tokenStep1: 'Откройте <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com → Settings → Developer settings → Fine-grained tokens</a> и нажмите <code>Generate new token</code>.',
            tokenStep2: 'Repository access: <code>Only select repositories</code> → выберите <code>{repo}</code>.',
            tokenStep3: 'Permissions → Repository permissions → <code>Contents</code>: <code>Read and write</code>.',
            tokenStep4: 'Нажмите <code>Generate token</code>, скопируйте ключ и вставьте сюда.',
            checking: 'Проверяем ключ…',
            loginFail: 'Ключ не подошёл: нет доступа на запись в репозиторий {repo}.',
            loginOk: 'Вы вошли как {user}',
            account: 'Публикация на сайте',
            accountLead: 'Загрузки сохраняются в репозиторий {repo}.',
            badgeOnline: 'Загрузка на сайт: {user}',
            badgeOffline: 'Вход не выполнен',
            loginNotice: 'Документы увидят все посетители после входа с ключом доступа. Без входа файлы сохраняются только в этом браузере.',
            draftsNotice: '{n} — сохранено только в этом браузере.',
            publishDrafts: 'Опубликовать на сайте',
            downloadZip: 'Скачать архив ZIP',
            zipBuilding: 'Собираем архив…',
            zipReady: 'Архив скачан',
            publishProgress: 'Публикация {i} из {n}…',
            publishDone: 'Опубликовано: {n}',
            publishSkipped: 'Не опубликовано (больше {mb} МБ): {n}. Замените их ссылкой на Google Диск.',
            manifestFail: 'Не удалось получить список загруженных документов. Проверьте интернет и обновите страницу.',
            reload: 'Обновить',
            schoolInfo: 'Данные организации',
            schoolInfoLead: 'Эти данные показываются в боковой панели сайта.',
            editSchool: 'Заполнить данные организации',
            save: 'Сохранить',
            cancel: 'Отмена',
            close: 'Закрыть',
            fSiteName: 'Название организации',
            fSlogan: 'Слоган',
            fDirectorRole: 'Должность руководителя',
            fDirectorName: 'ФИО руководителя',
            fAddress: 'Адрес',
            fPhone: 'Телефон',
            fEmail: 'Электронная почта',
            fLogo: 'Логотип',
            fPhoto: 'Фото руководителя',
            chooseImage: 'Выбрать изображение',
            settingsSaved: 'Данные организации сохранены',
            settingsSavedLocal: 'Данные организации сохранены в этом браузере',
            errNetwork: 'нет соединения с GitHub',
            errAuth: 'ключ доступа недействителен — войдите заново',
            errForbidden: 'у ключа нет права записи (Contents: Read and write)',
            errTooLarge: 'файл слишком большой для GitHub — используйте ссылку на Google Диск',
            errBusy: 'сайт занят другой загрузкой, попробуйте ещё раз',
            errStorage: 'браузер не разрешает сохранять файлы (приватный режим?)',
            kk: 'Қазақша',
            ru: 'Русский'
        },
        kk: {
            pageTitle: 'Аттестаттау құжаттары',
            mainTitle: 'Аттестаттау құжаттары',
            mainLead: 'Санатты таңдаңыз немесе құжатты атауы бойынша табыңыз.',
            mainLeadUpload: 'Құжаттарды тізім бойынша жүктеңіз — әр бөлімде қандай файл керек екені көрсетілген.',
            home: 'Басты бет',
            languageSwitch: 'Тілді таңдау',
            sidebarLabel: 'Ұйым туралы ақпарат',
            searchLabel: 'Құжаттарды іздеу',
            updated: 'Деректер жаңартылды',
            filling: 'Толтырылуда',
            director: 'Директор',
            students: 'Оқушылар',
            teachers: 'Педагогтер',
            languages: 'Оқыту тілі',
            hours: 'Жұмыс тәртібі',
            phSiteName: 'Білім беру ұйымының атауы',
            phSlogan: 'Ұран немесе қысқаша сипаттама',
            phDirector: 'Директордың аты-жөні',
            phAddress: 'Ұйымның мекенжайы',
            phPhone: 'Телефон',
            phEmail: 'Электрондық пошта',
            categoryLabel: 'Санаттар',
            categoryNote: 'Барлық бөлім ашық',
            documentLabel: 'Құжаттар',
            documentNote: 'PDF, Word, Excel және суреттер',
            documentNoteEmpty: 'Әзірге қосылмаған',
            lastUpdate: 'Соңғы жаңарту',
            actual: 'Өзекті нұсқа',
            allCategories: 'Барлық санаттар',
            categories: 'Санаттар',
            homeTitle: 'Құжат санаттары',
            homeLead: 'Құжаттар мен ішкі бөлімдерді көру үшін қалтаны ашыңыз',
            homeLeadUpload: 'Қажетті құжаттарды жүктеу үшін қалтаны ашыңыз',
            showAll: 'Барлығын көрсету',
            open: 'ашу',
            inSection: 'бөлімде',
            back: 'Артқа',
            search: 'Іздеу',
            searchTitle: 'Іздеу нәтижелері',
            found: 'Табылған құжаттар',
            emptyTitle: 'Құжаттар әзірге жоқ',
            emptyLead: 'Материалдар қосылғаннан кейін пайда болады.',
            noResults: 'Ештеңе табылмады',
            noResultsLead: 'Басқа сұрау жазып көріңіз немесе «Барлық санаттарды» таңдаңыз.',
            notFound: 'Бет табылмады',
            notFoundLead: 'Сілтеме ескірген болуы мүмкін. Санаттар тізіміне оралыңыз.',
            document: 'Құжат',
            download: 'Құжатты жүктеп алу',
            openLink: 'Сілтемені ашу',
            unavailable: 'Алдын ала қарау қолжетімсіз',
            unavailableLead: 'Құжатты компьютерде ашу үшін жүктеп алыңыз.',
            overview: 'Құжатқа шолу',
            pages: 'Беттер / парақтар',
            pagesHint: 'Саны қарау құралының панелінде көрсетілген',
            imageHint: 'Сурет толық көрсетілген',
            linkHint: 'Құжат сілтеме арқылы ашылды',
            placeholder: 'Құжат атауы бойынша іздеу…',
            developer: 'Сайтты әзірлеу',
            uploadedLabel: 'Жүктелді',
            uploadedNote: 'сайтта: {site} · браузерде: {local}',
            uploadedNoteSite: 'тізімдегі құжат',
            leftLabel: 'Жүктеу қалды',
            leftNoteDone: 'Барлық құжат жүктелді',
            updatedOn: 'Жаңартылды: {date}',
            notUpdated: 'Әзірге ештеңе жүктелмеген',
            uploadedShort: 'жүктелді',
            statusMissing: 'Жүктеу керек',
            statusPublished: 'Жүктелді',
            statusLocal: 'Браузерде',
            statusChecking: 'Тексерілуде…',
            statusQueued: 'Кезекте…',
            expected: 'қажет файл',
            inBrowser: 'тек осы браузерде сақталған',
            uploadAction: 'Жүктеу',
            uploadTitle: 'Құжатты жүктеңіз',
            uploadNeed: 'Бұл бөлімге қажет құжат:',
            dropHere: 'Файлды осында сүйреп әкеліңіз',
            or: 'немесе',
            chooseFile: 'Файлды таңдау',
            formats: 'PDF, Word, Excel, PowerPoint немесе сурет',
            maxSize: '{mb} МБ дейін',
            anySize: 'браузердегі жоба — көлемі шектелмейді',
            linkLabel: 'Файл {mb} МБ-тан үлкен бе? Оны Google Дискіге жүктеп («Сілтемесі бар барлық адам» қолжетімділігі), сілтемені осында қойыңыз:',
            linkPlaceholder: 'https://drive.google.com/file/d/…',
            saveLink: 'Сілтемені сақтау',
            badLink: 'https:// деп басталатын толық сілтемені қойыңыз',
            replace: 'Ауыстыру',
            remove: 'Жою',
            removeDraft: 'Жобаны жою',
            publishOne: 'Жариялау',
            confirmRemove: '«{title}» құжатын жою керек пе?',
            confirmRemoveDraft: '«{title}» жобасын осы браузерден жою керек пе?',
            tooLarge: 'Файл көлемі {size} — бұл {mb} МБ-тан көп. PDF-ті қысыңыз немесе файлды Google Дискіге жүктеп, төменге сілтеме қойыңыз.',
            badType: 'Бұл формат сәйкес келмейді. PDF, Word, Excel, PowerPoint немесе сурет қажет.',
            badImage: '5 МБ-қа дейінгі JPG, PNG немесе WEBP суреті қажет.',
            preparing: 'Файл дайындалуда…',
            uploading: '«{title}» жүктелуде… {pct}%',
            saving: 'Сайтқа сақталуда…',
            uploadedToast: '«{title}» құжаты сайтқа жүктелді',
            linkSaved: '«{title}» үшін сілтеме сақталды',
            savedLocal: '«{title}» осы браузерде сақталды. Сайтта жариялау үшін кіріңіз.',
            removedToast: 'Құжат жойылды',
            uploadFail: 'Сақтау мүмкін болмады: {err}',
            whereSite: 'Сіз {user} ретінде кірдіңіз: файл бірден сайттың барлық келушілеріне көрінеді.',
            whereLocal: 'Сіз кірмедіңіз: файл тек осы браузерде сақталады.',
            whereLocalAction: 'Жариялау үшін кіру',
            login: 'Кіру',
            logout: 'Шығу',
            loginTitle: 'Құжаттарды жүктеу үшін кіру',
            loginLead: 'Сайт репозиторийіне арналған GitHub қолжетімділік кілті қажет. Кілт тек сіздің браузеріңізде сақталады.',
            tokenLabel: 'Қолжетімділік кілті (token)',
            tokenPlaceholder: 'github_pat_…',
            remember: 'Осы құрылғыда есте сақтау',
            howToken: 'Қолжетімділік кілтін қалай алуға болады',
            tokenStep1: '<a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com → Settings → Developer settings → Fine-grained tokens</a> ашып, <code>Generate new token</code> басыңыз.',
            tokenStep2: 'Repository access: <code>Only select repositories</code> → <code>{repo}</code> таңдаңыз.',
            tokenStep3: 'Permissions → Repository permissions → <code>Contents</code>: <code>Read and write</code>.',
            tokenStep4: '<code>Generate token</code> басып, кілтті көшіріп, осында қойыңыз.',
            checking: 'Кілт тексерілуде…',
            loginFail: 'Кілт жарамсыз: {repo} репозиторийіне жазу құқығы жоқ.',
            loginOk: 'Сіз {user} ретінде кірдіңіз',
            account: 'Сайтта жариялау',
            accountLead: 'Жүктелген файлдар {repo} репозиторийіне сақталады.',
            badgeOnline: 'Сайтқа жүктеу: {user}',
            badgeOffline: 'Кіру орындалмаған',
            loginNotice: 'Қолжетімділік кілтімен кіргеннен кейін құжаттарды барлық келушілер көреді. Кірмесеңіз, файлдар тек осы браузерде сақталады.',
            draftsNotice: '{n} — тек осы браузерде сақталған.',
            publishDrafts: 'Сайтта жариялау',
            downloadZip: 'ZIP мұрағатын жүктеп алу',
            zipBuilding: 'Мұрағат жиналуда…',
            zipReady: 'Мұрағат жүктелді',
            publishProgress: 'Жариялау: {i} / {n}…',
            publishDone: 'Жарияланды: {n}',
            publishSkipped: 'Жарияланбады ({mb} МБ-тан үлкен): {n}. Оларды Google Диск сілтемесімен ауыстырыңыз.',
            manifestFail: 'Жүктелген құжаттар тізімін алу мүмкін болмады. Интернетті тексеріп, бетті жаңартыңыз.',
            reload: 'Жаңарту',
            schoolInfo: 'Ұйым деректері',
            schoolInfoLead: 'Бұл деректер сайттың бүйір панелінде көрсетіледі.',
            editSchool: 'Ұйым деректерін толтыру',
            save: 'Сақтау',
            cancel: 'Болдырмау',
            close: 'Жабу',
            fSiteName: 'Ұйымның атауы',
            fSlogan: 'Ұран',
            fDirectorRole: 'Басшының лауазымы',
            fDirectorName: 'Басшының аты-жөні',
            fAddress: 'Мекенжай',
            fPhone: 'Телефон',
            fEmail: 'Электрондық пошта',
            fLogo: 'Логотип',
            fPhoto: 'Басшының фотосы',
            chooseImage: 'Суретті таңдау',
            settingsSaved: 'Ұйым деректері сақталды',
            settingsSavedLocal: 'Ұйым деректері осы браузерде сақталды',
            errNetwork: 'GitHub-пен байланыс жоқ',
            errAuth: 'қолжетімділік кілті жарамсыз — қайта кіріңіз',
            errForbidden: 'кілтте жазу құқығы жоқ (Contents: Read and write)',
            errTooLarge: 'файл GitHub үшін тым үлкен — Google Диск сілтемесін пайдаланыңыз',
            errBusy: 'сайт басқа жүктеумен бос емес, қайталап көріңіз',
            errStorage: 'браузер файлдарды сақтауға рұқсат бермейді (жеке режим?)',
            kk: 'Қазақша',
            ru: 'Русский'
        }
    };

    let lang = initialLanguage();

    function initialLanguage() {
        const fromUrl = new URLSearchParams(location.search).get('lang');
        if (fromUrl === 'kk' || fromUrl === 'ru') return fromUrl;
        try {
            const saved = localStorage.getItem('attestation-lang');
            if (saved === 'kk' || saved === 'ru') return saved;
        } catch (_) { /* хранилище недоступно */ }
        return 'ru';
    }

    function t(key, vars) {
        let text = WORDS[lang][key] ?? WORDS.ru[key] ?? key;
        if (vars) text = text.replace(/\{(\w+)\}/g, (match, name) => (vars[name] ?? match));
        return text;
    }

    function docWord(count) {
        if (lang === 'kk') return 'құжат';
        const mod10 = count % 10;
        const mod100 = count % 100;
        if (mod10 === 1 && mod100 !== 11) return 'документ';
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'документа';
        return 'документов';
    }

    const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => (
        {'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[ch]
    ));
    const title = item => item?.title?.[lang] || item?.title?.ru || item?.title?.kk || '';

    /* ───────────── Иконки ───────────── */

    const svg = path => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
    const ICON = {
        folder: svg('<path d="M3 7h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 11h18"/>'),
        upload: svg('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>'),
        cloud: svg('<path d="M7 18a5 5 0 0 1-.9-9.9A6 6 0 0 1 17.7 7 4.5 4.5 0 0 1 17.5 18"/><path d="M12 12v9M8.5 15.5 12 12l3.5 3.5"/>'),
        download: svg('<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>'),
        trash: svg('<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
        replace: svg('<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>'),
        link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
        external: svg('<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
        user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
        check: svg('<path d="m5 12 5 5 9-10"/>'),
        info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
        globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
        edit: svg('<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13 7 4 4"/>'),
        image: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>'),
        archive: svg('<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/>'),
        book: svg('<path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4V4Z"/><path d="M9 4v12a4 4 0 0 0-4 4"/>'),
        empty: svg('<path d="M3 7h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M9 15h6"/>'),
        person: '<svg viewBox="0 0 64 72" aria-hidden="true"><circle cx="32" cy="26" r="13" fill="currentColor"/><path d="M6 72c0-16 11.6-27 26-27s26 11 26 27Z" fill="currentColor"/></svg>'
    };

    const FOLDER_COLORS = [
        ['#e1f6f5', '#087e87'], ['#fff0dc', '#d67b08'], ['#ffe7e4', '#dc5a4f'],
        ['#eae8ff', '#6a59c8'], ['#e5f3ff', '#397fba'], ['#e6f7e9', '#318754'],
        ['#fff1d9', '#c87512'], ['#e3f5f5', '#188691'], ['#ffe9f2', '#bc4e7c']
    ];

    /* ───────────── Форматы файлов ───────────── */

    const FORMATS = {
        pdf: ['pdf', 'application/pdf'],
        doc: ['word', 'application/msword'],
        docx: ['word', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        odt: ['word', 'application/vnd.oasis.opendocument.text'],
        rtf: ['word', 'application/rtf'],
        xls: ['excel', 'application/vnd.ms-excel'],
        xlsx: ['excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ods: ['excel', 'application/vnd.oasis.opendocument.spreadsheet'],
        ppt: ['powerpoint', 'application/vnd.ms-powerpoint'],
        pptx: ['powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        odp: ['powerpoint', 'application/vnd.oasis.opendocument.presentation'],
        jpg: ['image', 'image/jpeg'],
        jpeg: ['image', 'image/jpeg'],
        png: ['image', 'image/png'],
        webp: ['image', 'image/webp'],
        gif: ['image', 'image/gif']
    };
    const ACCEPT = Object.keys(FORMATS).map(ext => `.${ext}`).join(',');
    const IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp';
    const OFFICE = new Set(['word', 'excel', 'powerpoint']);

    const extOf = name => {
        const match = /\.([a-z0-9]{1,6})$/i.exec(String(name || '').split(/[?#]/)[0]);
        return match ? match[1].toLowerCase() : '';
    };
    const formatClass = ext => FORMATS[ext]?.[0] || 'file';
    const mimeOf = ext => FORMATS[ext]?.[1] || 'application/octet-stream';
    const formatLabel = ext => (ext === 'jpeg' ? 'JPG' : (ext || 'FILE').toUpperCase());

    function formatSize(bytes) {
        if (!Number.isFinite(bytes) || bytes <= 0) return '';
        const units = lang === 'kk' ? ['Б', 'КБ', 'МБ', 'ГБ'] : ['Б', 'КБ', 'МБ', 'ГБ'];
        let value = bytes;
        let unit = 0;
        while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
        const digits = unit >= 2 && value < 100 ? 1 : 0;
        return `${value.toFixed(digits).replace('.', ',')} ${units[unit]}`;
    }

    function formatDate(value) {
        if (!value) return '';
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) return value;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);
        const pad = n => String(n).padStart(2, '0');
        return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
    }

    /* ───────────── Каталог ───────────── */

    const catalogs = SITE.catalogs || [];
    const catIndex = new Map();
    const docIndex = new Map();

    (function buildIndex(nodes, parents) {
        nodes.forEach(node => {
            node.children = node.children || [];
            node.documents = node.documents || [];
            const path = [...parents, node];
            catIndex.set(node.id, {node, path, top: path[0]});
            node.documents.forEach((doc, index) => {
                docIndex.set(doc.id, {doc, cat: node, path, top: path[0], order: index + 1});
            });
            buildIndex(node.children, path);
        });
    })(catalogs, []);

    /* В режиме сайта показываются только добавленные документы,
       в режиме загрузки — весь список из исходного сайта. */
    const hasSource = doc => Boolean(doc.file || doc.drive || doc.url);
    const visibleDocs = node => (UPLOAD ? node.documents : node.documents.filter(hasSource));
    const allDocs = node => [...visibleDocs(node), ...node.children.flatMap(allDocs)];
    const allVisible = () => catalogs.flatMap(allDocs);
    const countCategories = () => catIndex.size;

    /* ───────────── Хранилище сайта загрузки ───────────── */

    const Store = {
        manifest: emptyManifest(),
        loaded: !UPLOAD,
        loadError: null,
        drafts: new Map(),
        settingsDraft: null,
        draftsAvailable: true,
        busy: new Map(),
        errors: new Map(),
        token: null,
        user: '',
        canPush: false,
        queue: Promise.resolve()
    };

    function emptyManifest() {
        return {version: 1, updated_at: null, settings: {}, files: {}};
    }

    function normalizeManifest(data) {
        const manifest = emptyManifest();
        if (data && typeof data === 'object') {
            manifest.version = data.version || 1;
            manifest.updated_at = data.updated_at || null;
            manifest.settings = data.settings && typeof data.settings === 'object' ? data.settings : {};
            manifest.files = data.files && typeof data.files === 'object' ? data.files : {};
        }
        return manifest;
    }

    function slotState(id) {
        const draft = Store.drafts.get(id);
        if (draft) return {kind: 'local', record: draft};
        const entry = Store.manifest.files[id];
        if (entry && (entry.path || entry.link)) return {kind: 'published', record: entry};
        return {kind: Store.loaded ? 'missing' : 'checking'};
    }

    const isFilled = doc => UPLOAD
        ? ['local', 'published'].includes(slotState(doc.id).kind)
        : hasSource(doc);

    /* ───────────── Источник документа (для просмотра) ───────────── */

    const objectUrls = new Map();
    function blobUrl(key, blob) {
        const cached = objectUrls.get(key);
        if (cached && cached.blob === blob) return cached.url;
        if (cached) URL.revokeObjectURL(cached.url);
        const url = URL.createObjectURL(blob);
        objectUrls.set(key, {blob, url});
        return url;
    }

    const rawUrl = path => `https://raw.githubusercontent.com/${GH.owner}/${GH.repo}/${GH.branch}/${String(path).split('/').map(encodeURIComponent).join('/')}`;
    const absoluteUrl = path => new URL(path, location.href).href;

    function parseLink(value) {
        let url;
        try { url = new URL(String(value || '').trim()); } catch (_) { return null; }
        if (!/^https?:$/.test(url.protocol)) return null;
        const result = {url: url.href, driveId: null, preview: null};
        const host = url.hostname.replace(/^www\./, '');
        const idFromPath = /\/d\/([a-zA-Z0-9_-]{10,})/.exec(url.pathname);
        const idFromQuery = url.searchParams.get('id');
        if (host === 'drive.google.com') {
            result.driveId = idFromPath?.[1] || (idFromQuery && /^[a-zA-Z0-9_-]{10,}$/.test(idFromQuery) ? idFromQuery : null);
            if (result.driveId) result.preview = `https://drive.google.com/file/d/${result.driveId}/preview`;
        } else if (host === 'docs.google.com') {
            const kind = /^\/(document|spreadsheets|presentation)\/d\//.exec(url.pathname)?.[1];
            if (kind && idFromPath) result.preview = `https://docs.google.com/${kind}/d/${idFromPath[1]}/preview`;
        }
        return result;
    }

    function linkSource(link, extra = {}) {
        const parsed = parseLink(link) || {url: link};
        const driveId = parsed.driveId;
        return {
            kind: 'link',
            url: parsed.url,
            preview: parsed.preview,
            thumb: driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w500` : '',
            download: driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : parsed.url,
            ext: '',
            label: driveId ? 'DRIVE' : 'LINK',
            fclass: 'link',
            ...extra
        };
    }

    function sourceOf(doc) {
        if (!UPLOAD) {
            if (doc.drive) {
                return linkSource(`https://drive.google.com/file/d/${doc.drive}/view`, {
                    label: doc.format || 'PDF', fclass: formatClass(String(doc.format || 'pdf').toLowerCase()), size: doc.size || ''
                });
            }
            if (doc.url) return linkSource(doc.url, {size: doc.size || ''});
            if (doc.file) {
                const ext = extOf(doc.file);
                return {
                    kind: 'file', url: doc.file, absolute: absoluteUrl(doc.file), ext,
                    label: formatLabel(ext), fclass: formatClass(ext), size: doc.size || '',
                    name: doc.file.split('/').pop(), sameOrigin: true
                };
            }
            return null;
        }
        const state = slotState(doc.id);
        const record = state.record;
        if (!record) return null;
        const date = formatDate(record.uploaded_at || record.saved_at);
        if (record.link) return linkSource(record.link, {date, where: state.kind});
        if (state.kind === 'local') {
            const ext = record.ext || extOf(record.name);
            return {
                kind: 'blob', url: blobUrl(`draft:${doc.id}`, record.blob), ext,
                label: formatLabel(ext), fclass: formatClass(ext), size: formatSize(record.size),
                name: record.name, date, where: 'local'
            };
        }
        const ext = record.ext || extOf(record.path);
        return {
            kind: 'remote', url: rawUrl(record.path), absolute: rawUrl(record.path), ext,
            label: formatLabel(ext), fclass: formatClass(ext), size: formatSize(record.size),
            name: record.name || record.path.split('/').pop(), date, where: 'published'
        };
    }

    /* ───────────── Данные организации (боковая панель) ───────────── */

    function effectiveSettings() {
        const merged = {...(SITE.settings || {})};
        if (UPLOAD) {
            Object.assign(merged, Store.manifest.settings || {});
            if (Store.settingsDraft?.values) Object.assign(merged, Store.settingsDraft.values);
        }
        return merged;
    }

    function settingValue(key) {
        const value = effectiveSettings()[key];
        if (!value) return '';
        if (typeof value === 'string') return value.trim();
        return String(value[lang] || value.ru || value.kk || '').trim();
    }

    function settingImage(key) {
        if (UPLOAD && Store.settingsDraft?.[`${key}_blob`]) {
            return blobUrl(`settings:${key}`, Store.settingsDraft[`${key}_blob`]);
        }
        const value = effectiveSettings()[key];
        if (!value || typeof value !== 'string') return '';
        if (/^(https?:|data:|blob:)/.test(value)) return value;
        if (UPLOAD) return rawUrl(value);
        return value;
    }

    /* ───────────── Ссылки на элементы страницы ───────────── */

    const el = {
        workspace: $('#workspace'),
        search: $('#search'),
        select: $('#categorySelect'),
        stats: $('#stats'),
        notices: $('#notices'),
        toasts: $('#toasts'),
        rail: $('#rail'),
        railCopy: $('#railCopy'),
        mobileFooter: $('#mobileFooter'),
        badge: $('#statusBadge'),
        badgeText: $('#statusBadgeText')
    };

    /* ───────────── Маршруты ───────────── */

    function parseRoute() {
        const raw = location.hash.replace(/^#\/?/, '');
        const parts = raw.split('/');
        const decode = value => { try { return decodeURIComponent(value || ''); } catch (_) { return value || ''; } };
        if (parts[0] === 'c' && parts[1]) return {type: 'category', id: decode(parts[1])};
        if (parts[0] === 'd' && parts[1]) return {type: 'document', id: decode(parts[1])};
        if (parts[0] === 'search') return {type: 'search', cat: decode(parts[1]) || 'all', q: decode(parts.slice(2).join('/'))};
        return {type: 'home'};
    }

    const hrefCategory = id => `#/c/${encodeURIComponent(id)}`;
    const hrefDocument = id => `#/d/${encodeURIComponent(id)}`;
    const hrefSearch = (cat, q) => `#/search/${encodeURIComponent(cat || 'all')}/${encodeURIComponent(q)}`;

    let lastListHash = '#/';
    let currentRoute = {type: 'home'};

    function navigate(hash, {replace = false} = {}) {
        const current = location.hash || '#/';
        if (current === hash) {
            render({scroll: !replace});
            return;
        }
        if (replace) {
            history.replaceState(null, '', hash);
            render({scroll: false});
        } else {
            location.hash = hash;
        }
    }

    /* ───────────── Отрисовка ───────────── */

    const openSubcategories = new Set();

    function render({scroll = false, keepScroll = false} = {}) {
        const route = parseRoute();
        const previousType = currentRoute.type;
        currentRoute = route;
        const savedScroll = window.scrollY;

        let html;
        if (route.type === 'category') html = viewCategory(route.id);
        else if (route.type === 'document') html = viewDocument(route.id);
        else if (route.type === 'search') html = viewSearch(route.q, route.cat);
        else html = viewHome();

        if (route.type !== 'document') lastListHash = location.hash || '#/';
        document.body.classList.toggle('document-mode', route.type === 'document');
        el.workspace.innerHTML = `<div class="${keepScroll ? '' : 'workspace-enter'}">${html}</div>`;

        syncSearchControls(route);
        renderStats();
        renderNotices();
        hydratePreviews();

        if (keepScroll) {
            window.scrollTo(0, savedScroll);
        } else if (scroll) {
            if (route.type === 'document' || (route.type === 'home' && previousType === 'document')) {
                window.scrollTo({top: 0});
            } else {
                const top = el.workspace.getBoundingClientRect().top + window.scrollY - 16;
                if (window.scrollY > top) window.scrollTo({top});
            }
        }
    }

    const rerender = () => render({keepScroll: true});

    function syncSearchControls(route) {
        if (route.type === 'search') {
            if (document.activeElement !== el.search) el.search.value = route.q;
            el.select.value = catIndex.has(route.cat) && catalogs.some(c => c.id === route.cat) ? route.cat : 'all';
            return;
        }
        if (document.activeElement !== el.search) el.search.value = '';
        if (route.type === 'category') {
            const entry = catIndex.get(route.id);
            el.select.value = entry ? entry.top.id : 'all';
        } else if (route.type === 'home') {
            el.select.value = 'all';
        }
    }

    function breadcrumb(items) {
        return `<div class="breadcrumb">${items.map((item, index) => {
            const separator = index ? '<span aria-hidden="true">›</span>' : '';
            return item.href
                ? `${separator}<button type="button" data-go="${esc(item.href)}">${esc(item.label)}</button>`
                : `${separator}<span>${esc(item.label)}</span>`;
        }).join('')}</div>`;
    }

    function emptyState(titleKey = 'emptyTitle', leadKey = 'emptyLead') {
        return `<div class="empty">${ICON.empty}<strong>${t(titleKey)}</strong>${t(leadKey)}</div>`;
    }

    function progressOf(nodeDocs) {
        const total = nodeDocs.length;
        const done = nodeDocs.filter(isFilled).length;
        const percent = total ? Math.round((done / total) * 100) : 0;
        return {total, done, percent};
    }

    function meter(percent, done = false) {
        return `<div class="meter${done ? ' is-done' : ''}" role="presentation"><i style="--p:${percent}%"></i></div>`;
    }

    function viewHome() {
        const cards = catalogs.map((category, index) => {
            const [bg, fg] = FOLDER_COLORS[index % FOLDER_COLORS.length];
            const docs = allDocs(category);
            let meta;
            let extra = '';
            let complete = false;
            if (UPLOAD) {
                const progress = progressOf(docs);
                complete = progress.total > 0 && progress.done === progress.total;
                meta = `<b>${progress.done}</b> / ${progress.total} ${t('uploadedShort')}`;
                extra = meter(progress.percent, complete);
            } else {
                meta = `<b>${docs.length}</b> ${docWord(docs.length)} · ${t('open')}`;
            }
            return `<button class="category${complete ? ' is-complete' : ''}" type="button" data-go="${hrefCategory(category.id)}">
                <span class="icon" style="--bg-c:${bg};--fg-c:${fg}">${ICON.folder}</span>
                <strong>${esc(title(category))}</strong>
                <span class="category-meta">${meta}</span>${extra}
            </button>`;
        }).join('');
        return `<div class="section-head"><div><h3>${t('homeTitle')}</h3><p>${t(UPLOAD ? 'homeLeadUpload' : 'homeLead')}</p></div>`
            + `<button class="reset" type="button" data-go="#/">${t('showAll')}</button></div>`
            + (cards ? `<div class="categories">${cards}</div>` : emptyState());
    }

    function subcategoryHtml(node, depth = 0) {
        const docs = allDocs(node);
        const children = node.children.map(child => subcategoryHtml(child, depth + 1)).join('');
        const own = visibleDocs(node);
        let count = `${docs.length} ${docWord(docs.length)}`;
        let extra = '';
        if (UPLOAD) {
            const progress = progressOf(docs);
            count = `${progress.done} / ${progress.total} ${t('uploadedShort')}`;
            extra = meter(progress.percent, progress.total > 0 && progress.done === progress.total);
        }
        const open = openSubcategories.has(node.id) ? ' open' : '';
        return `<details class="subcategory" data-sub="${esc(node.id)}"${open} style="margin-left:${Math.min(depth * 10, 30)}px">
            <summary><span class="subfolder">${ICON.folder}</span><span class="subcategory-title">${esc(title(node))}<span class="subcategory-count">${count}</span></span>${extra}</summary>
            <div class="nested-content">${children}${own.length ? documentRows(own) : (children ? '' : emptyState())}</div>
        </details>`;
    }

    function viewCategory(id) {
        const entry = catIndex.get(id);
        if (!entry) return viewNotFound();
        const category = entry.node;
        const docs = allDocs(category);
        const crumbs = [{label: t('categories'), href: '#/'}];
        entry.path.forEach((node, index) => {
            const last = index === entry.path.length - 1;
            crumbs.push({label: title(node), href: last ? null : hrefCategory(node.id)});
        });
        const parentHref = entry.path.length > 1 ? hrefCategory(entry.path[entry.path.length - 2].id) : '#/';
        let lead = `${docs.length} ${docWord(docs.length)} ${t('inSection')}`;
        if (UPLOAD) {
            const progress = progressOf(docs);
            lead = `${progress.done} / ${progress.total} ${t('uploadedShort')}`;
        }
        const subcategories = category.children.map(child => subcategoryHtml(child)).join('');
        const direct = visibleDocs(category);
        let body = subcategories ? `<div class="subcategories">${subcategories}</div>` : '';
        if (direct.length) body += documentRows(direct);
        else if (!subcategories) body += emptyState();
        return `<div class="view-toolbar"><div class="view-title">${breadcrumb(crumbs)}<h3>${esc(title(category))}</h3><p>${lead}</p></div>`
            + `<button class="back-button" type="button" data-go="${esc(parentHref)}">← ${t('back')}</button></div>${body}`;
    }

    function viewNotFound() {
        return `<div class="view-toolbar"><div class="view-title"><h3>${t('notFound')}</h3></div>`
            + `<button class="back-button" type="button" data-go="#/">← ${t('back')}</button></div>`
            + emptyState('notFound', 'notFoundLead');
    }

    const normalize = value => String(value || '')
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/[әӘ]/g, 'а').replace(/[іІ]/g, 'и').replace(/[ңҢ]/g, 'н').replace(/[ғҒ]/g, 'г')
        .replace(/[үҮұҰ]/g, 'у').replace(/[қҚ]/g, 'к').replace(/[өӨ]/g, 'о').replace(/[һҺ]/g, 'х')
        .replace(/[«»"'.,:;()№_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    function viewSearch(query, catId) {
        const scopeEntry = catId !== 'all' ? catIndex.get(catId) : null;
        const scope = scopeEntry ? allDocs(scopeEntry.node) : allVisible();
        const needle = normalize(query);
        const words = needle.split(' ').filter(Boolean);
        const items = scope.filter(doc => {
            const haystack = normalize(`${doc.title?.ru || ''} ${doc.title?.kk || ''} ${title(docIndex.get(doc.id)?.cat)}`);
            return words.every(word => haystack.includes(word));
        });
        const crumbs = [{label: t('categories'), href: '#/'}, {label: t('search')}];
        return `<div class="view-toolbar"><div class="view-title">${breadcrumb(crumbs)}<h3>${t('searchTitle')}</h3><p>${t('found')}: ${items.length}</p></div>`
            + `<button class="back-button" type="button" data-action="clear-search">← ${t('back')}</button></div>`
            + (items.length ? documentRows(items) : emptyState('noResults', 'noResultsLead'));
    }

    function documentRows(docs) {
        if (!docs.length) return emptyState();
        return `<div class="document-list">${docs.map(doc => (UPLOAD ? uploadRow(doc) : docRow(doc))).join('')}</div>`;
    }

    function docRow(doc) {
        const entry = docIndex.get(doc.id);
        const source = sourceOf(doc);
        const info = [title(entry?.cat), source?.label === 'DRIVE' ? '' : source?.label, source?.size].filter(Boolean).join(' · ');
        return `<div class="doc-row is-docs" data-go="${hrefDocument(doc.id)}">
            <button class="doc-main" type="button" data-go="${hrefDocument(doc.id)}">
                <span class="file-icon format-${esc(source?.fclass || 'file')}">${esc(source?.label || doc.format || 'PDF')}</span>
                <span><span class="doc-name">${esc(title(doc))}</span><span class="doc-info">${esc(info)}</span></span>
            </button>
            <span class="doc-side"><span class="doc-arrow" aria-hidden="true">→</span></span>
        </div>`;
    }

    function statusChip(doc) {
        const busy = Store.busy.get(doc.id);
        if (busy) {
            return `<span class="chip chip-busy" data-chip="${esc(doc.id)}">${esc(busy.label)}</span>`;
        }
        const state = slotState(doc.id);
        const map = {
            missing: ['chip-missing', 'statusMissing'],
            checking: ['chip-busy', 'statusChecking'],
            local: ['chip-local', 'statusLocal'],
            published: ['chip-published', 'statusPublished']
        };
        const [cls, key] = map[state.kind];
        return `<span class="chip ${cls}" data-chip="${esc(doc.id)}">${t(key)}</span>`;
    }

    function fileInput(id, extraClass = 'sr-only') {
        return `<input type="file" class="${extraClass}" data-upload="${esc(id)}" accept="${ACCEPT}">`;
    }

    function uploadRow(doc) {
        const entry = docIndex.get(doc.id);
        const state = slotState(doc.id);
        const source = sourceOf(doc);
        const busy = Store.busy.get(doc.id);
        const filled = state.kind === 'local' || state.kind === 'published';
        const label = filled ? source.label : (doc.format || 'PDF');
        const iconClass = filled ? `format-${source.fclass}` : 'is-missing';
        let info;
        if (filled) {
            info = [title(entry.cat), source.label === 'DRIVE' || source.label === 'LINK' ? t('statusPublished') : '', source.size, source.date]
                .filter(Boolean).join(' · ');
            if (state.kind === 'local') info = `${[title(entry.cat), source.size].filter(Boolean).join(' · ')} · ${t('inBrowser')}`;
        } else {
            info = `${title(entry.cat)} · ${t('expected')}: ${doc.format || 'PDF'}`;
        }
        const error = Store.errors.get(doc.id);
        const action = filled
            ? '<span class="doc-arrow" aria-hidden="true">→</span>'
            : `<label class="row-upload"${busy ? ' hidden' : ''}>${ICON.upload}<span>${t('uploadAction')}</span>${fileInput(doc.id)}</label>`;
        return `<div class="doc-row is-upload is-${state.kind}" data-drop="${esc(doc.id)}">
            <button class="doc-main" type="button" data-go="${hrefDocument(doc.id)}">
                <span class="file-icon ${iconClass}">${esc(label)}</span>
                <span><span class="doc-name">${esc(title(doc))}</span><span class="doc-info">${esc(info)}</span>${error ? `<span class="doc-hint">${esc(error)}</span>` : ''}</span>
            </button>
            <span class="doc-side">${statusChip(doc)}${action}</span>
            <span class="row-progress" data-progress-bar="${esc(doc.id)}" style="--p:${busy ? Math.round(busy.pct * 100) : 0}%"${busy ? '' : ' hidden'}></span>
        </div>`;
    }

    function backHrefForDocument(entry) {
        if (lastListHash && lastListHash !== '#/' && lastListHash !== location.hash) return lastListHash;
        return hrefCategory(entry.cat.id);
    }

    function viewDocument(id) {
        const entry = docIndex.get(id);
        if (!entry || (!UPLOAD && !hasSource(entry.doc))) return viewNotFound();
        const doc = entry.doc;
        const crumbs = [{label: t('categories'), href: '#/'}];
        entry.path.forEach(node => crumbs.push({label: title(node), href: hrefCategory(node.id)}));
        crumbs.push({label: t('document')});
        const toolbar = `<div class="view-toolbar"><div class="view-title">${breadcrumb(crumbs)}<h3>${esc(title(doc))}</h3></div>`
            + `<button class="back-button" type="button" data-go="${esc(backHrefForDocument(entry))}">← ${t('back')}</button></div>`;

        if (UPLOAD) {
            const state = slotState(id);
            if (state.kind === 'missing' || state.kind === 'checking') return toolbar + uploadPanel(doc);
        }
        const source = sourceOf(doc);
        return toolbar + viewerActions(doc, source) + viewer(doc, source);
    }

    function viewerActions(doc, source) {
        const buttons = [];
        if (UPLOAD) buttons.push(statusChip(doc) + (source.date ? `<small class="sr-only">${esc(source.date)}</small>` : ''));
        if (source.kind === 'link') {
            buttons.push(`<a class="action-button" href="${esc(source.url)}" target="_blank" rel="noopener">${ICON.external}${t('openLink')}</a>`);
            if (source.download !== source.url) {
                buttons.push(`<a class="download-button" href="${esc(source.download)}" target="_blank" rel="noopener">${ICON.download}${t('download')}</a>`);
            }
        } else if (source.kind === 'remote') {
            buttons.push(`<button class="download-button" type="button" data-action="download" data-id="${esc(doc.id)}">${ICON.download}${t('download')}</button>`);
        } else {
            buttons.push(`<a class="download-button" href="${esc(source.url)}" download="${esc(source.name || '')}">${ICON.download}${t('download')}</a>`);
        }
        if (UPLOAD) {
            const state = slotState(doc.id);
            const busy = Store.busy.has(doc.id);
            if (state.kind === 'local' && Store.canPush) {
                buttons.push(`<button class="action-button is-primary" type="button" data-action="publish-one" data-id="${esc(doc.id)}"${busy ? ' disabled' : ''}>${ICON.cloud}${t('publishOne')}</button>`);
            }
            buttons.push(`<label class="action-button"${busy ? ' hidden' : ''}>${ICON.replace}${t('replace')}${fileInput(doc.id)}</label>`);
            buttons.push(`<button class="action-button is-danger" type="button" data-action="remove" data-id="${esc(doc.id)}"${busy ? ' disabled' : ''}>${ICON.trash}${t(state.kind === 'local' ? 'removeDraft' : 'remove')}</button>`);
        }
        const error = Store.errors.get(doc.id);
        return `<div class="viewer-actions">${buttons.join('')}</div>${error ? `<p class="upload-error">${esc(error)}</p>` : ''}`;
    }

    function viewer(doc, source) {
        let preview;
        const unavailable = `<div class="preview-unavailable"><div><strong>${t('unavailable')}</strong><p>${t('unavailableLead')}</p></div></div>`;
        const frameTitle = esc(title(doc));
        if (source.kind === 'link') {
            preview = source.preview
                ? `<iframe src="${esc(source.preview)}" title="${frameTitle}" loading="eager" allow="autoplay" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
                : `<div class="preview-unavailable"><div><strong>${t('unavailable')}</strong><p>${t('linkHint')}</p><div class="viewer-buttons"><a class="download-button" href="${esc(source.url)}" target="_blank" rel="noopener">${ICON.external}${t('openLink')}</a></div></div></div>`;
        } else if (source.fclass === 'image') {
            preview = `<img class="document-image" src="${esc(source.url)}" alt="${frameTitle}">`;
        } else if (source.fclass === 'pdf') {
            preview = source.kind === 'remote'
                ? `<div data-remote-src="${esc(source.url)}" data-ext="${esc(source.ext)}" data-title="${frameTitle}"><div class="loading"></div></div>`
                : `<iframe src="${esc(source.url)}" title="${frameTitle}" loading="eager"></iframe>`;
        } else if (OFFICE.has(source.fclass) && source.absolute && !/^(http:\/\/)?(localhost|127\.)/.test(source.absolute.replace(/^https?:\/\//, ''))) {
            preview = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(source.absolute)}" title="${frameTitle}" loading="eager"></iframe>`;
        } else {
            preview = unavailable;
        }

        let thumb = `<span class="page-placeholder format-${esc(source.fclass)}"><b>${esc(source.label)}</b></span>`;
        if (source.fclass === 'image') thumb = `<img src="${esc(source.url)}" alt="">`;
        else if (source.thumb) thumb = `<img src="${esc(source.thumb)}" alt="" referrerpolicy="no-referrer">`;
        const hint = source.kind === 'link' ? t('linkHint')
            : source.fclass === 'image' ? t('imageHint')
                : `<b>${t('pages')}:</b> ${t('pagesHint')}`;
        const meta = [source.label, source.size].filter(Boolean).join(' · ');
        return `<div class="viewer has-sidebar">
            <aside class="viewer-sidebar">
                <strong>${t('overview')}</strong>
                <div class="page-thumbnail">${thumb}<span class="page-number">1</span></div>
                <div class="viewer-file-meta">${esc(meta)}${source.date ? `<br>${esc(source.date)}` : ''}</div>
                <small>${hint}</small>
            </aside>
            <div class="paper document-paper">${preview}</div>
        </div>`;
    }

    function uploadPanel(doc) {
        const id = doc.id;
        const busy = Store.busy.get(id);
        const error = Store.errors.get(id);
        const where = Store.canPush
            ? `<p class="where-note is-site">${ICON.globe}<span>${esc(t('whereSite', {user: Store.user || 'GitHub'}))}</span></p>`
            : `<p class="where-note">${ICON.info}<span>${t('whereLocal')} <button type="button" data-action="login">${t('whereLocalAction')}</button></span></p>`;
        return `<div class="upload-panel">
            <div class="dropzone" data-drop="${esc(id)}">
                <span class="dropzone-icon">${ICON.cloud}</span>
                <strong>${t('uploadTitle')}</strong>
                <p class="need-label">${t('uploadNeed')}</p>
                <p class="need">${esc(title(doc))}</p>
                <p class="drop-text">${t('dropHere')} ${t('or')}</p>
                <label class="file-button"${busy ? ' hidden' : ''}>${ICON.upload}<span>${t('chooseFile')}</span>${fileInput(id)}</label>
                <small>${t('formats')} · ${Store.canPush ? t('maxSize', {mb: MAX_MB}) : t('anySize')}</small>
                <div class="upload-progress" data-progress-box="${esc(id)}"${busy ? '' : ' hidden'}>
                    ${meter(busy ? Math.round(busy.pct * 100) : 0)}<span>${esc(busy?.label || '')}</span>
                </div>
                ${error ? `<p class="upload-error">${esc(error)}</p>` : ''}
            </div>
            <form class="link-form" data-link-form="${esc(id)}">
                <label for="link-${esc(id)}">${t('linkLabel', {mb: MAX_MB})}</label>
                <div class="link-row">
                    <input id="link-${esc(id)}" name="link" type="url" inputmode="url" placeholder="${t('linkPlaceholder')}" autocomplete="off" required>
                    <button class="action-button is-primary" type="submit"${busy ? ' disabled' : ''}>${ICON.link}${t('saveLink')}</button>
                </div>
            </form>
            ${where}
        </div>`;
    }

    /* PDF из GitHub отдаётся как octet-stream, поэтому скачиваем его и показываем через blob. */
    const remoteCache = new Map();
    async function remoteBlob(url, ext) {
        if (remoteCache.has(url)) return remoteCache.get(url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = new Blob([await response.arrayBuffer()], {type: mimeOf(ext)});
        if (remoteCache.size >= 4) {
            const [firstKey] = remoteCache.keys();
            remoteCache.delete(firstKey);
        }
        remoteCache.set(url, blob);
        return blob;
    }

    function hydratePreviews() {
        $$('[data-remote-src]', el.workspace).forEach(async holder => {
            const {remoteSrc, ext} = holder.dataset;
            try {
                const blob = await remoteBlob(remoteSrc, ext);
                if (!holder.isConnected) return;
                const frame = document.createElement('iframe');
                frame.src = blobUrl(`remote:${remoteSrc}`, blob);
                frame.title = holder.dataset.title || '';
                holder.replaceWith(frame);
            } catch (_) {
                if (holder.isConnected) {
                    holder.innerHTML = `<div class="preview-unavailable"><div><strong>${t('unavailable')}</strong><p>${t('unavailableLead')}</p></div></div>`;
                }
            }
        });
    }

    /* ───────────── Шапка, статистика, боковая панель ───────────── */

    function renderStats() {
        const updated = formatDate(UPLOAD ? Store.manifest.updated_at : SITE.updated);
        if (!UPLOAD) {
            const total = allVisible().length;
            el.stats.innerHTML = `
                <div class="stat"><span>${t('categoryLabel')}</span><strong>${countCategories()}</strong><small>${t('categoryNote')}</small></div>
                <div class="stat"><span>${t('documentLabel')}</span><strong>${total}</strong><small>${t(total ? 'documentNote' : 'documentNoteEmpty')}</small></div>
                <div class="stat"><span>${t('lastUpdate')}</span><strong class="is-date">${esc(updated || '—')}</strong><small>${t('actual')}</small></div>`;
            return;
        }
        const docs = allVisible();
        const progress = progressOf(docs);
        const local = docs.filter(doc => slotState(doc.id).kind === 'local').length;
        const site = progress.done - local;
        const left = progress.total - progress.done;
        const loading = !Store.loaded;
        el.stats.innerHTML = `
            <div class="stat"><span>${t('categoryLabel')}</span><strong>${countCategories()}</strong><small>${t('categoryNote')}</small></div>
            <div class="stat"><span>${t('uploadedLabel')}</span><strong>${loading ? '…' : progress.done}<em> / ${progress.total}</em></strong>${meter(progress.percent, left === 0)}<small>${local ? t('uploadedNote', {site, local}) : t('uploadedNoteSite')}</small></div>
            <div class="stat"><span>${t('leftLabel')}</span><strong>${loading ? '…' : left}</strong><small>${left === 0 && !loading ? t('leftNoteDone') : (updated ? t('updatedOn', {date: updated}) : t('notUpdated'))}</small></div>`;
    }

    function renderNotices() {
        if (!UPLOAD) {
            el.notices.innerHTML = '';
            return;
        }
        const notices = [];
        if (Store.loadError) {
            notices.push(`<div class="notice is-error"><span class="notice-text">${t('manifestFail')}</span><span class="notice-actions"><button class="action-button" type="button" data-action="reload">${ICON.replace}${t('reload')}</button></span></div>`);
        }
        const drafts = Store.drafts.size + (Store.settingsDraft ? 1 : 0);
        if (drafts) {
            const label = `${Store.drafts.size} ${docWord(Store.drafts.size)}${Store.settingsDraft ? ` + ${t('schoolInfo').toLowerCase()}` : ''}`;
            notices.push(`<div class="notice is-info"><span class="notice-text">${esc(t('draftsNotice', {n: label}))}</span><span class="notice-actions">`
                + `<button class="action-button is-primary" type="button" data-action="publish-drafts">${ICON.cloud}${t('publishDrafts')}</button>`
                + `<button class="action-button" type="button" data-action="zip">${ICON.archive}${t('downloadZip')}</button></span></div>`);
        } else if (!Store.canPush && currentRoute.type !== 'document') {
            notices.push(`<div class="notice"><span class="notice-text">${t('loginNotice')}</span><span class="notice-actions"><button class="action-button is-primary" type="button" data-action="login">${ICON.user}${t('login')}</button></span></div>`);
        }
        el.notices.innerHTML = notices.join('');
    }

    function renderBadge() {
        if (!UPLOAD) {
            const total = allVisible().length;
            el.badge.classList.toggle('is-warn', total === 0);
            el.badgeText.textContent = t(total ? 'updated' : 'filling');
            return;
        }
        el.badge.classList.toggle('is-warn', !Store.canPush);
        el.badgeText.textContent = Store.canPush ? t('badgeOnline', {user: Store.user || 'GitHub'}) : t('badgeOffline');
    }

    function renderSidebar() {
        const set = (id, value, placeholder) => {
            const node = document.getElementById(id);
            if (!node) return;
            node.textContent = value || placeholder;
            node.classList.toggle('is-placeholder', !value);
        };
        const name = settingValue('site_name');
        set('siteName', name, t('phSiteName'));
        set('slogan', settingValue('slogan'), t('phSlogan'));
        set('directorRole', settingValue('director_role'), t('director'));
        $('#directorRole').classList.remove('is-placeholder');
        set('directorName', settingValue('director_name'), t('phDirector'));
        [['students', 'students'], ['teachers', 'teachers'], ['languages', 'languages'], ['hours', 'hours']].forEach(([key, label]) => {
            $(`#${key}Label`).textContent = t(label);
            set(`${key}Value`, settingValue(key), '—');
        });
        const address = settingValue('address');
        const phone = settingValue('phone');
        const email = settingValue('email');
        set('addressValue', address, t('phAddress'));
        set('phoneValue', phone, t('phPhone'));
        set('emailValue', email, t('phEmail'));
        const linkOrNone = (node, href) => {
            if (href) node.setAttribute('href', href);
            else node.removeAttribute('href');
        };
        linkOrNone($('#mapLink'), address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : '');
        linkOrNone($('#phoneLink'), phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '');
        linkOrNone($('#emailLink'), email ? `mailto:${email}` : '');

        const logo = settingImage('logo');
        $('#brandLogo').innerHTML = logo
            ? `<img src="${esc(logo)}" alt="${esc(name || t('phSiteName'))}">`
            : `<span class="logo-placeholder">${ICON.book}</span>`;
        const photo = settingImage('director_photo');
        $('#directorPhoto').innerHTML = photo
            ? `<img src="${esc(photo)}" alt="${esc(settingValue('director_name') || t('director'))}">`
            : ICON.person;

        let actions = $('.sidebar-actions');
        if (UPLOAD) {
            if (!actions) {
                actions = document.createElement('div');
                actions.className = 'sidebar-actions';
                $('#sidebar').appendChild(actions);
            }
            actions.innerHTML = `<button class="sidebar-button" type="button" data-action="edit-school">${ICON.edit}${t('editSchool')}</button>`;
        }
    }

    function renderChrome() {
        document.documentElement.lang = lang;
        const siteName = settingValue('site_name');
        document.title = siteName ? `${t('pageTitle')} — ${siteName}` : t('pageTitle');
        $('#mainTitle').textContent = t('mainTitle');
        $('#mainLead').textContent = t(UPLOAD ? 'mainLeadUpload' : 'mainLead');
        $('#headerHomeLabel').textContent = t('home');
        $('#languageSwitch').setAttribute('aria-label', t('languageSwitch'));
        $('#sidebar').setAttribute('aria-label', t('sidebarLabel'));
        $('#searchPanel').setAttribute('aria-label', t('searchLabel'));
        $$('[data-lang]').forEach(button => {
            const active = button.dataset.lang === lang;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        el.search.placeholder = t('placeholder');
        el.search.setAttribute('aria-label', t('placeholder'));
        el.select.setAttribute('aria-label', t('allCategories'));
        const current = el.select.value || 'all';
        el.select.innerHTML = `<option value="all">${t('allCategories')}</option>`
            + catalogs.map(category => `<option value="${esc(category.id)}">${esc(title(category))}</option>`).join('');
        el.select.value = catalogs.some(category => category.id === current) ? current : 'all';

        const year = new Date().getFullYear();
        const copy = `© ${year} <b>${esc(siteName || t('pageTitle'))}</b>`;
        el.railCopy.innerHTML = copy;
        const loginButton = UPLOAD
            ? `<button class="rail-user${Store.canPush ? ' is-on' : ''}" type="button" data-action="login" title="${esc(Store.canPush ? t('account') : t('login'))}" aria-label="${esc(Store.canPush ? t('account') : t('login'))}">${ICON.user}</button>`
            : '';
        const existing = $('.rail-user', el.rail);
        if (existing) existing.remove();
        if (loginButton) el.rail.insertAdjacentHTML('afterbegin', loginButton);
        el.mobileFooter.innerHTML = `<span>${copy}</span>${UPLOAD
            ? `<button class="rail-user${Store.canPush ? ' is-on' : ''}" type="button" data-action="login">${ICON.user}${esc(Store.canPush ? (Store.user || t('account')) : t('login'))}</button>`
            : ''}`;
        renderBadge();
        renderSidebar();
    }

    function refreshAll() {
        renderChrome();
        rerender();
    }

    /* ───────────── Сообщения ───────────── */

    function toast(message, type = '', {sticky = false, progress = null} = {}) {
        const node = document.createElement('div');
        node.className = `toast${type ? ` is-${type}` : ''}`;
        node.setAttribute('role', type === 'error' ? 'alert' : 'status');
        const body = document.createElement('div');
        body.className = 'toast-body';
        node.appendChild(body);
        const handle = {
            update(text, value = null) {
                body.innerHTML = `${esc(text)}${value === null ? '' : meter(Math.round(value * 100))}`;
            },
            close() {
                node.remove();
            }
        };
        handle.update(message, progress);
        el.toasts.appendChild(node);
        if (!sticky) setTimeout(() => node.remove(), type === 'error' ? 9000 : 4500);
        return handle;
    }

    /* ───────────── События ───────────── */

    function bindEvents() {
        window.addEventListener('hashchange', () => render({scroll: true}));

        document.addEventListener('click', event => {
            const go = event.target.closest('[data-go]');
            if (go && !event.target.closest('label, input, a[href]')) {
                event.preventDefault();
                navigate(go.dataset.go);
                return;
            }
            const action = event.target.closest('[data-action]');
            if (action && !action.disabled) {
                event.preventDefault();
                handleAction(action.dataset.action, action.dataset.id, action);
            }
        });

        el.workspace.addEventListener('toggle', event => {
            const details = event.target;
            if (!details.matches?.('details[data-sub]')) return;
            if (details.open) openSubcategories.add(details.dataset.sub);
            else openSubcategories.delete(details.dataset.sub);
        }, true);

        $('#headerHome').addEventListener('click', () => {
            el.search.value = '';
            navigate('#/');
        });

        $$('[data-lang]').forEach(button => {
            button.addEventListener('click', () => {
                if (button.dataset.lang === lang) return;
                lang = button.dataset.lang;
                try { localStorage.setItem('attestation-lang', lang); } catch (_) { /* без сохранения */ }
                if (new URLSearchParams(location.search).has('lang')) {
                    const url = new URL(location.href);
                    url.searchParams.delete('lang');
                    history.replaceState(null, '', url.pathname + url.search + url.hash);
                }
                refreshAll();
            });
        });

        let searchTimer;
        el.search.addEventListener('input', () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(runSearch, 200);
        });
        el.search.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                clearTimeout(searchTimer);
                runSearch();
            }
        });
        el.select.addEventListener('change', () => {
            if (el.search.value.trim()) {
                runSearch();
                return;
            }
            navigate(el.select.value === 'all' ? '#/' : hrefCategory(el.select.value));
        });

        if (!UPLOAD) return;

        el.workspace.addEventListener('change', event => {
            const input = event.target;
            if (!input.matches('input[type=file][data-upload]')) return;
            const file = input.files?.[0];
            const id = input.dataset.upload;
            input.value = '';
            if (file) handleFile(id, file);
        });

        el.workspace.addEventListener('submit', event => {
            const form = event.target.closest('[data-link-form]');
            if (!form) return;
            event.preventDefault();
            handleLink(form.dataset.linkForm, form.elements.link.value);
        });

        const hasFiles = event => Array.from(event.dataTransfer?.types || []).includes('Files');
        let activeZone = null;
        const setZone = zone => {
            if (activeZone === zone) return;
            activeZone?.classList.remove('is-drop');
            activeZone = zone;
            activeZone?.classList.add('is-drop');
        };
        document.addEventListener('dragover', event => {
            if (!hasFiles(event)) return;
            event.preventDefault();
            const zone = event.target.closest?.('[data-drop]') || null;
            event.dataTransfer.dropEffect = zone ? 'copy' : 'none';
            setZone(zone);
        });
        document.addEventListener('dragleave', event => {
            if (!event.relatedTarget || !document.documentElement.contains(event.relatedTarget)) setZone(null);
        });
        document.addEventListener('drop', event => {
            if (!hasFiles(event)) return;
            event.preventDefault();
            const zone = event.target.closest?.('[data-drop]');
            setZone(null);
            const file = event.dataTransfer.files?.[0];
            if (zone && file) handleFile(zone.dataset.drop, file);
        });
    }

    function runSearch() {
        const query = el.search.value.trim();
        const cat = el.select.value || 'all';
        if (!query) {
            if (currentRoute.type === 'search') navigate(cat === 'all' ? '#/' : hrefCategory(cat), {replace: true});
            return;
        }
        navigate(hrefSearch(cat, query), {replace: currentRoute.type === 'search'});
    }

    function handleAction(name, id, node) {
        switch (name) {
            case 'clear-search':
                el.search.value = '';
                navigate(el.select.value === 'all' ? '#/' : hrefCategory(el.select.value));
                break;
            case 'login':
                openLoginDialog();
                break;
            case 'logout':
                logout();
                break;
            case 'reload':
                location.reload();
                break;
            case 'download':
                downloadRemote(id, node);
                break;
            case 'remove':
                removeDocument(id);
                break;
            case 'publish-one':
                publishDrafts([id]);
                break;
            case 'publish-drafts':
                publishDrafts();
                break;
            case 'zip':
                downloadZip(node);
                break;
            case 'edit-school':
                openSchoolDialog();
                break;
            default:
                break;
        }
    }

    /* ───────────── GitHub ───────────── */

    const API = 'https://api.github.com';
    const repoPath = `/repos/${GH.owner}/${GH.repo}`;
    const repoName = `${GH.owner}/${GH.repo}`;

    function apiError(status, message) {
        const error = new Error(message || `HTTP ${status}`);
        error.status = status;
        return error;
    }

    async function gh(path, {method = 'GET', body, raw = false, token = Store.token} = {}) {
        const headers = {
            Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (body !== undefined) headers['Content-Type'] = 'application/json';
        let response;
        try {
            response = await fetch(API + path, {
                method, headers, cache: 'no-store',
                body: body === undefined ? undefined : JSON.stringify(body)
            });
        } catch (_) {
            throw apiError(0, t('errNetwork'));
        }
        if (!response.ok) {
            let message = '';
            try { message = (await response.json()).message; } catch (_) { /* пустой ответ */ }
            throw apiError(response.status, message);
        }
        if (response.status === 204) return null;
        return raw ? response.text() : response.json();
    }

    function humanError(error) {
        const message = String(error?.message || '');
        if (/too large/i.test(message) || error?.status === 413) return t('errTooLarge');
        if (error?.status === 401) return t('errAuth');
        if (error?.status === 403 || error?.status === 404) return t('errForbidden');
        if (error?.status === 0) return t('errNetwork');
        return message || t('errNetwork');
    }

    async function loadManifest() {
        try {
            const text = await gh(`${repoPath}/contents/manifest.json?ref=${encodeURIComponent(GH.branch)}`, {raw: true});
            Store.manifest = normalizeManifest(JSON.parse(text));
            Store.loadError = null;
        } catch (error) {
            if (error.status === 404) {
                Store.manifest = emptyManifest();
                Store.loadError = null;
            } else {
                try {
                    const response = await fetch(`${rawUrl('manifest.json')}?t=${Date.now()}`, {cache: 'no-store'});
                    if (!response.ok) throw apiError(response.status);
                    Store.manifest = normalizeManifest(await response.json());
                    Store.loadError = null;
                } catch (fallbackError) {
                    Store.loadError = fallbackError;
                }
            }
        }
        Store.loaded = true;
    }

    async function createUploadsBranch() {
        const tree = await gh(`${repoPath}/git/trees`, {
            method: 'POST',
            body: {tree: [{path: 'manifest.json', mode: '100644', type: 'blob', content: `${JSON.stringify(emptyManifest(), null, 2)}\n`}]}
        });
        const commit = await gh(`${repoPath}/git/commits`, {
            method: 'POST', body: {message: 'Init uploads storage', tree: tree.sha, parents: []}
        });
        await gh(`${repoPath}/git/refs`, {method: 'POST', body: {ref: `refs/heads/${GH.branch}`, sha: commit.sha}});
    }

    /* Одна загрузка = один коммит в ветку uploads (файл + manifest.json).
       При одновременной записи из другого браузера коммит пересобирается. */
    async function commitChange(message, build) {
        for (let attempt = 0; attempt < 5; attempt++) {
            let headSha;
            let treeSha;
            try {
                const ref = await gh(`${repoPath}/git/ref/heads/${GH.branch}`);
                headSha = ref.object.sha;
                treeSha = (await gh(`${repoPath}/git/commits/${headSha}`)).tree.sha;
            } catch (error) {
                if (error.status === 404 && attempt === 0) {
                    await createUploadsBranch();
                    continue;
                }
                throw error;
            }
            let manifest;
            try {
                manifest = normalizeManifest(JSON.parse(await gh(`${repoPath}/contents/manifest.json?ref=${headSha}`, {raw: true})));
            } catch (error) {
                if (error.status !== 404) throw error;
                manifest = emptyManifest();
            }
            const change = build(manifest) || {};
            manifest.updated_at = new Date().toISOString();
            const entries = (change.add || []).map(file => ({path: file.path, mode: '100644', type: 'blob', sha: file.sha}));
            const removals = (change.remove || []).filter(Boolean).map(path => ({path, mode: '100644', type: 'blob', sha: null}));
            const manifestEntry = {path: 'manifest.json', mode: '100644', type: 'blob', content: `${JSON.stringify(manifest, null, 2)}\n`};
            let tree;
            try {
                tree = await gh(`${repoPath}/git/trees`, {method: 'POST', body: {base_tree: treeSha, tree: [...entries, ...removals, manifestEntry]}});
            } catch (error) {
                if (!removals.length || error.status !== 422) throw error;
                tree = await gh(`${repoPath}/git/trees`, {method: 'POST', body: {base_tree: treeSha, tree: [...entries, manifestEntry]}});
            }
            const commit = await gh(`${repoPath}/git/commits`, {
                method: 'POST', body: {message, tree: tree.sha, parents: [headSha]}
            });
            try {
                await gh(`${repoPath}/git/refs/heads/${GH.branch}`, {method: 'PATCH', body: {sha: commit.sha, force: false}});
                Store.manifest = manifest;
                return manifest;
            } catch (error) {
                if (error.status === 422 || error.status === 409) continue;
                throw error;
            }
        }
        throw apiError(409, t('errBusy'));
    }

    function readBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
            reader.onerror = () => reject(reader.error || new Error('read'));
            reader.readAsDataURL(blob);
        });
    }

    async function uploadBlob(blob, onProgress) {
        const content = await readBase64(blob);
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${API}${repoPath}/git/blobs`);
            xhr.setRequestHeader('Accept', 'application/vnd.github+json');
            xhr.setRequestHeader('Authorization', `Bearer ${Store.token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-GitHub-Api-Version', '2022-11-28');
            xhr.upload.onprogress = event => {
                if (event.lengthComputable && onProgress) onProgress(event.loaded / event.total);
            };
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try { resolve(JSON.parse(xhr.responseText).sha); } catch (error) { reject(error); }
                    return;
                }
                let message = '';
                try { message = JSON.parse(xhr.responseText).message; } catch (_) { /* не JSON */ }
                reject(apiError(xhr.status, message));
            };
            xhr.onerror = () => reject(apiError(0, t('errNetwork')));
            xhr.send(JSON.stringify({content, encoding: 'base64'}));
        });
    }

    /* ───────────── Черновики в браузере (IndexedDB) ───────────── */

    const Drafts = {
        db: null,
        open() {
            if (this.db) return Promise.resolve(this.db);
            return new Promise((resolve, reject) => {
                if (!('indexedDB' in window)) {
                    reject(new Error('indexedDB'));
                    return;
                }
                const request = indexedDB.open(`attestation-upload:${repoName}`, 1);
                request.onupgradeneeded = () => request.result.createObjectStore('drafts', {keyPath: 'id'});
                request.onsuccess = () => {
                    this.db = request.result;
                    resolve(this.db);
                };
                request.onerror = () => reject(request.error);
            });
        },
        async run(mode, operation) {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction('drafts', mode);
                const request = operation(transaction.objectStore('drafts'));
                transaction.oncomplete = () => resolve(request?.result);
                transaction.onerror = () => reject(transaction.error);
                transaction.onabort = () => reject(transaction.error);
            });
        },
        all() { return this.run('readonly', store => store.getAll()); },
        put(record) { return this.run('readwrite', store => store.put(record)); },
        remove(id) { return this.run('readwrite', store => store.delete(id)); }
    };

    async function loadDrafts() {
        try {
            const records = await Drafts.all();
            Store.drafts.clear();
            Store.settingsDraft = null;
            (records || []).forEach(record => {
                if (record.id === SETTINGS_ID) Store.settingsDraft = record;
                else if (docIndex.has(record.id)) Store.drafts.set(record.id, record);
            });
        } catch (_) {
            Store.draftsAvailable = false;
        }
    }

    /* ───────────── Загрузка файлов ───────────── */

    function setBusy(id, pct, label) {
        const first = !Store.busy.has(id);
        Store.busy.set(id, {pct, label});
        if (first) {
            rerender();
            return;
        }
        const percent = `${Math.round(pct * 100)}%`;
        $$(`[data-progress-bar="${CSS.escape(id)}"]`).forEach(node => node.style.setProperty('--p', percent));
        $$(`[data-chip="${CSS.escape(id)}"]`).forEach(node => { node.textContent = label; });
        $$(`[data-progress-box="${CSS.escape(id)}"]`).forEach(node => {
            node.hidden = false;
            node.querySelector('.meter i')?.style.setProperty('--p', percent);
            const text = node.querySelector('span');
            if (text) text.textContent = label;
        });
    }

    function clearBusy(id) {
        Store.busy.delete(id);
    }

    function enqueue(task) {
        const run = Store.queue.then(task, task);
        Store.queue = run.catch(() => {});
        return run;
    }

    function docTitle(id, language = lang) {
        const doc = docIndex.get(id)?.doc;
        return doc?.title?.[language] || doc?.title?.ru || id;
    }

    function handleFile(id, file) {
        if (!docIndex.has(id) || Store.busy.has(id)) return;
        const ext = extOf(file.name);
        Store.errors.delete(id);
        if (!FORMATS[ext]) {
            Store.errors.set(id, t('badType'));
            rerender();
            return;
        }
        if (Store.canPush) {
            if (file.size > MAX_BYTES) {
                Store.errors.set(id, t('tooLarge', {size: formatSize(file.size), mb: MAX_MB}));
                rerender();
                return;
            }
            setBusy(id, 0, t('statusQueued'));
            enqueue(() => publishFile(id, file, file.name)).catch(() => {});
        } else {
            saveDraft(id, {kind: 'file', blob: file, name: file.name, size: file.size, ext});
        }
    }

    async function saveDraft(id, data) {
        const record = {id, ...data, saved_at: new Date().toISOString()};
        try {
            await Drafts.put(record);
            Store.drafts.set(id, record);
            Store.errors.delete(id);
            toast(t('savedLocal', {title: docTitle(id)}), 'ok');
        } catch (_) {
            Store.errors.set(id, t('errStorage'));
            toast(t('errStorage'), 'error');
        }
        rerender();
    }

    async function publishFile(id, blob, name) {
        const entry = docIndex.get(id);
        const ext = extOf(name);
        const title = docTitle(id);
        const progressToast = toast(t('preparing'), '', {sticky: true, progress: 0});
        try {
            setBusy(id, 0.02, t('preparing'));
            const sha = await uploadBlob(blob, value => {
                const label = t('uploading', {title, pct: Math.round(value * 100)});
                setBusy(id, value * 0.9, `${Math.round(value * 100)}%`);
                progressToast.update(label, value * 0.9);
            });
            setBusy(id, 0.95, t('saving'));
            progressToast.update(t('saving'), 0.95);
            const path = `files/${entry.cat.id}/${id}-${sha.slice(0, 8)}.${ext}`;
            await commitChange(`Загружен документ: ${docTitle(id, 'ru')}`, manifest => {
                const old = manifest.files[id];
                manifest.files[id] = {
                    path, name, size: blob.size, ext,
                    uploaded_at: new Date().toISOString(),
                    by: Store.user || null
                };
                return {add: [{path, sha}], remove: old?.path && old.path !== path ? [old.path] : []};
            });
            Store.errors.delete(id);
            toast(t('uploadedToast', {title}), 'ok');
            return true;
        } catch (error) {
            const message = t('uploadFail', {err: humanError(error)});
            Store.errors.set(id, message);
            toast(message, 'error');
            if (error.status === 401) logout(true);
            throw error;
        } finally {
            progressToast.close();
            clearBusy(id);
            rerender();
        }
    }

    function handleLink(id, value) {
        const parsed = parseLink(value);
        Store.errors.delete(id);
        if (!parsed) {
            Store.errors.set(id, t('badLink'));
            rerender();
            return;
        }
        if (!Store.canPush) {
            saveDraft(id, {kind: 'link', link: parsed.url});
            return;
        }
        setBusy(id, 0.5, t('saving'));
        enqueue(() => publishLink(id, parsed.url)).catch(() => {});
    }

    async function publishLink(id, link) {
        try {
            await commitChange(`Добавлена ссылка: ${docTitle(id, 'ru')}`, manifest => {
                const old = manifest.files[id];
                manifest.files[id] = {link, uploaded_at: new Date().toISOString(), by: Store.user || null};
                return {remove: old?.path ? [old.path] : []};
            });
            Store.errors.delete(id);
            toast(t('linkSaved', {title: docTitle(id)}), 'ok');
            return true;
        } catch (error) {
            const message = t('uploadFail', {err: humanError(error)});
            Store.errors.set(id, message);
            toast(message, 'error');
            if (error.status === 401) logout(true);
            throw error;
        } finally {
            clearBusy(id);
            rerender();
        }
    }

    async function removeDocument(id) {
        const state = slotState(id);
        const name = docTitle(id);
        if (state.kind === 'local') {
            if (!confirm(t('confirmRemoveDraft', {title: name}))) return;
            try { await Drafts.remove(id); } catch (_) { /* уже удалён */ }
            Store.drafts.delete(id);
            toast(t('removedToast'), 'ok');
            rerender();
            return;
        }
        if (state.kind !== 'published') return;
        if (!Store.canPush) {
            openLoginDialog();
            return;
        }
        if (!confirm(t('confirmRemove', {title: name}))) return;
        setBusy(id, 0.5, t('saving'));
        enqueue(async () => {
            try {
                await commitChange(`Удалён документ: ${docTitle(id, 'ru')}`, manifest => {
                    const old = manifest.files[id];
                    delete manifest.files[id];
                    return {remove: old?.path ? [old.path] : []};
                });
                Store.errors.delete(id);
                toast(t('removedToast'), 'ok');
            } catch (error) {
                toast(t('uploadFail', {err: humanError(error)}), 'error');
                if (error.status === 401) logout(true);
            } finally {
                clearBusy(id);
                rerender();
            }
        });
    }

    async function publishDrafts(onlyIds = null) {
        if (!Store.canPush) {
            openLoginDialog();
            return;
        }
        const records = [...Store.drafts.values()].filter(record => !onlyIds || onlyIds.includes(record.id));
        const settingsRecord = !onlyIds ? Store.settingsDraft : null;
        let published = 0;
        let skipped = 0;
        const total = records.length + (settingsRecord ? 1 : 0);
        let index = 0;
        const summary = toast(t('publishProgress', {i: 1, n: total}), '', {sticky: true, progress: 0});
        for (const record of records) {
            index++;
            summary.update(t('publishProgress', {i: index, n: total}), (index - 1) / total);
            if (record.kind === 'file' && record.size > MAX_BYTES) {
                skipped++;
                Store.errors.set(record.id, t('tooLarge', {size: formatSize(record.size), mb: MAX_MB}));
                continue;
            }
            try {
                if (record.kind === 'link') {
                    setBusy(record.id, 0.5, t('saving'));
                    await enqueue(() => publishLink(record.id, record.link));
                } else {
                    setBusy(record.id, 0, t('statusQueued'));
                    await enqueue(() => publishFile(record.id, record.blob, record.name));
                }
                await Drafts.remove(record.id).catch(() => {});
                Store.drafts.delete(record.id);
                published++;
            } catch (error) {
                if (error.status === 401) break;
            }
        }
        if (settingsRecord) {
            index++;
            summary.update(t('publishProgress', {i: index, n: total}), (index - 1) / total);
            try {
                await enqueue(() => publishSettings(settingsRecord.values || {}, {
                    logo: settingsRecord.logo_blob || null,
                    director_photo: settingsRecord.director_photo_blob || null
                }));
                await Drafts.remove(SETTINGS_ID).catch(() => {});
                Store.settingsDraft = null;
                published++;
            } catch (_) { /* сообщение уже показано */ }
        }
        summary.close();
        toast(t('publishDone', {n: published}), 'ok');
        if (skipped) toast(t('publishSkipped', {n: skipped, mb: MAX_MB}), 'error');
        refreshAll();
    }

    async function downloadRemote(id, button) {
        const source = sourceOf(docIndex.get(id).doc);
        if (!source) return;
        button.disabled = true;
        try {
            const blob = await remoteBlob(source.url, source.ext);
            saveBlob(blob, source.name || `${id}.${source.ext}`);
        } catch (_) {
            window.open(source.url, '_blank', 'noopener');
        } finally {
            button.disabled = false;
        }
    }

    function saveBlob(blob, name) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 60000);
    }

    /* ───────────── Архив ZIP (без сжатия, имена в UTF-8) ───────────── */

    const CRC_TABLE = (() => {
        const table = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
            table[n] = c >>> 0;
        }
        return table;
    })();

    function crc32(bytes) {
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    async function makeZip(files) {
        const encoder = new TextEncoder();
        const now = new Date();
        const time = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
        const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
        const parts = [];
        const central = [];
        let offset = 0;
        for (const file of files) {
            const name = encoder.encode(file.name);
            const blob = file.blob instanceof Blob ? file.blob : new Blob([file.blob]);
            const crc = crc32(new Uint8Array(await blob.arrayBuffer()));
            const size = blob.size;
            const local = new DataView(new ArrayBuffer(30));
            local.setUint32(0, 0x04034b50, true);
            local.setUint16(4, 20, true);
            local.setUint16(6, 0x0800, true);
            local.setUint16(10, time, true);
            local.setUint16(12, date, true);
            local.setUint32(14, crc, true);
            local.setUint32(18, size, true);
            local.setUint32(22, size, true);
            local.setUint16(26, name.length, true);
            parts.push(local, name, blob);
            const header = new DataView(new ArrayBuffer(46));
            header.setUint32(0, 0x02014b50, true);
            header.setUint16(4, 20, true);
            header.setUint16(6, 20, true);
            header.setUint16(8, 0x0800, true);
            header.setUint16(12, time, true);
            header.setUint16(14, date, true);
            header.setUint32(16, crc, true);
            header.setUint32(20, size, true);
            header.setUint32(24, size, true);
            header.setUint16(28, name.length, true);
            header.setUint32(42, offset, true);
            central.push(header, name);
            offset += 30 + name.length + size;
        }
        const centralSize = central.reduce((sum, part) => sum + part.byteLength, 0);
        const end = new DataView(new ArrayBuffer(22));
        end.setUint32(0, 0x06054b50, true);
        end.setUint16(8, files.length, true);
        end.setUint16(10, files.length, true);
        end.setUint32(12, centralSize, true);
        end.setUint32(16, offset, true);
        return new Blob([...parts, ...central, end], {type: 'application/zip'});
    }

    const safeName = value => String(value || '').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) || 'file';

    async function downloadZip(button) {
        if (button) button.disabled = true;
        const progress = toast(t('zipBuilding'), '', {sticky: true});
        try {
            const files = [];
            const rows = [['Раздел', 'Документ', 'Статус', 'Файл / ссылка']];
            const links = [];
            catalogs.flatMap(allDocs).forEach(doc => {
                const entry = docIndex.get(doc.id);
                const folder = entry.path.map(node => safeName(node.title.ru)).join('/');
                const state = slotState(doc.id);
                const number = String(entry.order).padStart(2, '0');
                let target = '';
                if (state.kind === 'local' && state.record.kind === 'file') {
                    target = `${folder}/${number}. ${safeName(doc.title.ru)}.${state.record.ext || extOf(state.record.name)}`;
                    files.push({name: target, blob: state.record.blob});
                } else if (state.record?.link) {
                    target = state.record.link;
                    links.push(`${entry.path.map(node => node.title.ru).join(' / ')} / ${doc.title.ru}\n${state.record.link}\n`);
                } else if (state.kind === 'published') {
                    target = rawUrl(state.record.path);
                }
                const status = {local: 'В браузере', published: 'На сайте', missing: 'Нужно загрузить', checking: '—'}[state.kind];
                rows.push([entry.path.map(node => node.title.ru).join(' / '), doc.title.ru, status, target]);
            });
            const csv = `﻿${rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\r\n')}`;
            files.push({name: 'Список документов.csv', blob: new Blob([csv], {type: 'text/csv'})});
            if (links.length) files.push({name: 'Ссылки.txt', blob: new Blob([links.join('\n')], {type: 'text/plain'})});
            if (Store.settingsDraft) {
                files.push({name: '_Данные организации/данные.json', blob: new Blob([JSON.stringify(Store.settingsDraft.values || {}, null, 2)], {type: 'application/json'})});
                ['logo', 'director_photo'].forEach(key => {
                    const blob = Store.settingsDraft[`${key}_blob`];
                    if (blob) files.push({name: `_Данные организации/${key}.${extOf(blob.name) || 'jpg'}`, blob});
                });
            }
            const zip = await makeZip(files);
            saveBlob(zip, `documents-${formatDate(new Date().toISOString())}.zip`);
            toast(t('zipReady'), 'ok');
        } catch (error) {
            toast(t('uploadFail', {err: error.message}), 'error');
        } finally {
            progress.close();
            if (button) button.disabled = false;
        }
    }

    /* ───────────── Вход (ключ GitHub) ───────────── */

    const TOKEN_KEY = `attestation-token:${repoName}`;

    function storedToken() {
        try {
            return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || '';
        } catch (_) {
            return '';
        }
    }

    function storeToken(token, remember) {
        try {
            sessionStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(TOKEN_KEY);
            if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
        } catch (_) { /* без сохранения */ }
    }

    async function verifyToken(token) {
        const repo = await gh(repoPath, {token});
        if (!repo?.permissions?.push) throw apiError(403, t('loginFail', {repo: repoName}));
        let user = '';
        try { user = (await gh('/user', {token})).login || ''; } catch (_) { /* у ключа нет доступа к профилю */ }
        return user;
    }

    function logout(expired = false) {
        Store.token = null;
        Store.user = '';
        Store.canPush = false;
        storeToken('', false);
        if (expired) toast(t('errAuth'), 'error');
        refreshAll();
    }

    function dialog(id, html) {
        let node = document.getElementById(id);
        if (!node) {
            node = document.createElement('dialog');
            node.id = id;
            node.className = 'modal';
            document.body.appendChild(node);
            node.addEventListener('click', event => {
                if (event.target === node) node.close();
            });
        }
        node.innerHTML = html;
        $$('[data-close]', node).forEach(button => button.addEventListener('click', () => node.close()));
        return node;
    }

    function openLoginDialog() {
        if (Store.canPush) {
            const node = dialog('accountDialog', `<div class="modal-form">
                <div class="modal-head"><div><h3>${t('account')}</h3><p>${esc(t('accountLead', {repo: repoName}))}</p></div><button class="modal-close" type="button" data-close aria-label="${t('close')}">×</button></div>
                <div class="modal-body"><div class="account-card">${ICON.check}<div><strong>${esc(t('loginOk', {user: Store.user || 'GitHub'}))}</strong><span>${esc(repoName)}</span></div></div></div>
                <div class="modal-foot"><button class="action-button is-danger" type="button" id="logoutButton">${t('logout')}</button><button class="action-button is-primary" type="button" data-close>${t('close')}</button></div>
            </div>`);
            $('#logoutButton', node).addEventListener('click', () => {
                node.close();
                logout();
            });
            node.showModal();
            return;
        }
        const steps = ['tokenStep1', 'tokenStep2', 'tokenStep3', 'tokenStep4']
            .map(key => `<li>${t(key, {repo: esc(repoName)})}</li>`).join('');
        const node = dialog('loginDialog', `<form class="modal-form" id="loginForm" method="dialog">
            <div class="modal-head"><div><h3>${t('loginTitle')}</h3><p>${t('loginLead')}</p></div><button class="modal-close" type="button" data-close aria-label="${t('close')}">×</button></div>
            <div class="modal-body">
                <div class="field"><label for="tokenInput">${t('tokenLabel')}</label><input id="tokenInput" type="password" autocomplete="off" spellcheck="false" placeholder="${t('tokenPlaceholder')}" required></div>
                <label class="field-check"><input type="checkbox" id="rememberToken" checked> ${t('remember')}</label>
                <details class="hint"><summary>${t('howToken')}</summary><ol class="steps">${steps}</ol></details>
                <p class="form-message" id="loginMessage" role="status"></p>
            </div>
            <div class="modal-foot"><button class="action-button" type="button" data-close>${t('cancel')}</button><button class="action-button is-primary" type="submit" id="loginSubmit">${ICON.user}${t('login')}</button></div>
        </form>`);
        const form = $('#loginForm', node);
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const token = $('#tokenInput', node).value.trim();
            const message = $('#loginMessage', node);
            const submit = $('#loginSubmit', node);
            if (!token) return;
            submit.disabled = true;
            message.className = 'form-message';
            message.textContent = t('checking');
            try {
                const user = await verifyToken(token);
                Store.token = token;
                Store.user = user;
                Store.canPush = true;
                storeToken(token, $('#rememberToken', node).checked);
                node.close();
                toast(t('loginOk', {user: user || 'GitHub'}), 'ok');
                await loadManifest();
                refreshAll();
            } catch (error) {
                message.className = 'form-message is-error';
                message.textContent = error.status === 401 ? t('errAuth') : (error.status === 0 ? t('errNetwork') : t('loginFail', {repo: repoName}));
            } finally {
                submit.disabled = false;
            }
        });
        node.showModal();
        $('#tokenInput', node).focus();
    }

    /* ───────────── Данные организации ───────────── */

    const SETTINGS_FIELDS = [
        ['site_name', 'fSiteName', true],
        ['slogan', 'fSlogan', true],
        ['director_role', 'fDirectorRole', true],
        ['director_name', 'fDirectorName', true],
        ['students', 'students', true],
        ['teachers', 'teachers', true],
        ['languages', 'languages', true],
        ['hours', 'hours', true],
        ['address', 'fAddress', true],
        ['phone', 'fPhone', false],
        ['email', 'fEmail', false]
    ];

    function openSchoolDialog() {
        const current = effectiveSettings();
        const value = (key, language) => {
            const item = current[key];
            if (!item) return '';
            if (typeof item === 'string') return language ? (language === 'ru' ? item : '') : item;
            return language ? (item[language] || '') : '';
        };
        const fields = SETTINGS_FIELDS.map(([key, label, multi]) => (multi
            ? `<fieldset class="field-group"><legend>${t(label)}</legend><div class="field-grid">
                <div class="field"><label for="s-${key}-kk">${t('kk')}</label><input id="s-${key}-kk" name="${key}.kk" value="${esc(value(key, 'kk'))}"></div>
                <div class="field"><label for="s-${key}-ru">${t('ru')}</label><input id="s-${key}-ru" name="${key}.ru" value="${esc(value(key, 'ru'))}"></div>
            </div></fieldset>`
            : `<div class="field"><label for="s-${key}">${t(label)}</label><input id="s-${key}" name="${key}" value="${esc(typeof current[key] === 'string' ? current[key] : '')}" ${key === 'email' ? 'type="email"' : 'type="text"'}></div>`
        )).join('');
        const imageField = (key, label) => {
            const src = settingImage(key);
            return `<div class="field"><span class="label">${t(label)}</span><div class="image-field">
                <span class="thumb" data-thumb="${key}">${src ? `<img src="${esc(src)}" alt="">` : ICON.image}</span>
                <label class="action-button">${ICON.upload}${t('chooseImage')}<input class="sr-only" type="file" accept="${IMAGE_ACCEPT}" data-image="${key}"></label>
            </div></div>`;
        };
        const node = dialog('schoolDialog', `<form class="modal-form" id="schoolForm" method="dialog">
            <div class="modal-head"><div><h3>${t('schoolInfo')}</h3><p>${t('schoolInfoLead')}</p></div><button class="modal-close" type="button" data-close aria-label="${t('close')}">×</button></div>
            <div class="modal-body">
                <div class="field-grid">${imageField('logo', 'fLogo')}${imageField('director_photo', 'fPhoto')}</div>
                ${fields}
                <p class="where-note${Store.canPush ? ' is-site' : ''}">${Store.canPush ? ICON.globe : ICON.info}<span>${Store.canPush ? esc(t('whereSite', {user: Store.user || 'GitHub'})) : t('whereLocal')}</span></p>
                <p class="form-message" id="schoolMessage" role="status"></p>
            </div>
            <div class="modal-foot"><button class="action-button" type="button" data-close>${t('cancel')}</button><button class="action-button is-primary" type="submit" id="schoolSubmit">${ICON.check}${t('save')}</button></div>
        </form>`);
        const images = {};
        $$('[data-image]', node).forEach(input => {
            input.addEventListener('change', () => {
                const file = input.files?.[0];
                const message = $('#schoolMessage', node);
                if (!file) return;
                if (!['jpg', 'jpeg', 'png', 'webp'].includes(extOf(file.name)) || file.size > IMAGE_MAX_BYTES) {
                    message.className = 'form-message is-error';
                    message.textContent = t('badImage');
                    input.value = '';
                    return;
                }
                message.textContent = '';
                images[input.dataset.image] = file;
                const thumb = $(`[data-thumb="${input.dataset.image}"]`, node);
                thumb.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="">`;
            });
        });
        $('#schoolForm', node).addEventListener('submit', async event => {
            event.preventDefault();
            const form = event.target;
            const values = {};
            SETTINGS_FIELDS.forEach(([key, , multi]) => {
                if (multi) {
                    values[key] = {kk: form.elements[`${key}.kk`].value.trim(), ru: form.elements[`${key}.ru`].value.trim()};
                } else {
                    values[key] = form.elements[key].value.trim();
                }
            });
            const submit = $('#schoolSubmit', node);
            submit.disabled = true;
            try {
                if (Store.canPush) {
                    await enqueue(() => publishSettings(values, images));
                    toast(t('settingsSaved'), 'ok');
                } else {
                    const previous = Store.settingsDraft || {};
                    const record = {
                        id: SETTINGS_ID, kind: 'settings', values,
                        logo_blob: images.logo || previous.logo_blob || null,
                        director_photo_blob: images.director_photo || previous.director_photo_blob || null,
                        saved_at: new Date().toISOString()
                    };
                    await Drafts.put(record);
                    Store.settingsDraft = record;
                    toast(t('settingsSavedLocal'), 'ok');
                }
                node.close();
                refreshAll();
            } catch (error) {
                const message = $('#schoolMessage', node);
                message.className = 'form-message is-error';
                message.textContent = error?.status !== undefined ? t('uploadFail', {err: humanError(error)}) : t('errStorage');
            } finally {
                submit.disabled = false;
            }
        });
        node.showModal();
    }

    async function publishSettings(values, images = {}) {
        const add = [];
        const newPaths = {};
        for (const key of ['logo', 'director_photo']) {
            const blob = images[key];
            if (!blob) continue;
            const ext = extOf(blob.name) || 'jpg';
            const sha = await uploadBlob(blob);
            newPaths[key] = `files/_school/${key}-${sha.slice(0, 8)}.${ext}`;
            add.push({path: newPaths[key], sha});
        }
        await commitChange('Обновлены данные организации', manifest => {
            const remove = [];
            const settings = {...manifest.settings, ...values};
            Object.entries(newPaths).forEach(([key, path]) => {
                const old = manifest.settings[key];
                if (old && old !== path && String(old).startsWith('files/')) remove.push(old);
                settings[key] = path;
            });
            manifest.settings = settings;
            return {add, remove};
        });
    }

    /* ───────────── Запуск ───────────── */

    async function initUpload() {
        const token = storedToken();
        const tasks = [loadDrafts()];
        if (token) {
            tasks.push(verifyToken(token).then(user => {
                Store.token = token;
                Store.user = user;
                Store.canPush = true;
            }).catch(error => {
                if (error.status === 401 || error.status === 403) storeToken('', false);
            }));
        }
        await Promise.all(tasks);
        await loadManifest();
        refreshAll();
    }

    bindEvents();
    renderChrome();
    render();
    if (UPLOAD) initUpload();
})();
