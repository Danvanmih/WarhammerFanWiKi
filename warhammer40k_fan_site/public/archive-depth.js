(()=>{
  const style=document.createElement('style');
  style.textContent=`
  .depth-grid,.knowledge-grid,.curated-grid{display:grid;gap:14px}
  .knowledge-grid{grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
  .depth-grid{grid-template-columns:1fr}
  .knowledge-card{border:1px solid #2e3132;background:#0c0e0f;padding:18px}
  .knowledge-card h3{margin:0 0 12px;font:700 17px Cinzel;text-transform:uppercase}
  .knowledge-card ul{margin:0;padding-left:18px;display:grid;gap:7px}
  .knowledge-card li{color:#9ca09b;line-height:1.55;font-size:13px}
  .quote-strip{display:grid;gap:10px}
  .quote-chip{border:1px solid #383228;background:linear-gradient(180deg,#18140f,#0b0d0e);padding:12px 14px;color:#d6c08a;font:700 12px/1.45 'Roboto Condensed';letter-spacing:.04em;text-transform:uppercase}
  .deep-source-note{margin-top:12px;color:#666b67;font-size:11px;line-height:1.5}
  .map-side .map-preview{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border:1px solid #34383a;margin:16px 0 14px;background:#090b0c}
  .map-side .map-related,.map-side .map-context{margin-top:16px;padding-top:14px;border-top:1px solid #232627}
  .map-side .map-related span,.map-side .map-context span{display:block;color:#8a7650;font:700 9px 'Roboto Condensed';letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px}
  .map-side .map-related button{width:100%;margin:0 0 8px;border:1px solid #313536;background:#101214;color:#d3d0c6;padding:9px 11px;text-align:left;font-size:12px}
  .map-side .map-related button:hover{border-color:#6f5c39;color:#f0dfc0}
  .map-side .map-context small,.map-side .map-source-note{display:block;color:#656a67;font-size:11px;line-height:1.55}
  .map-side .map-source-note a{color:#a78d55}
  .detail-main .deep-added h2{font-size:24px}
  .detail-main .deep-added .eyebrow{margin-bottom:8px}
  .zoom-low .map-point:not(.critical):not(.major) span{display:none!important}
  .zoom-mid .map-point:not(.critical) span{font-size:9px;opacity:.88}
  .zoom-high .map-point span{display:block!important}
  .detail-gallery .media-figure.media-error{display:none}
  .curated-grid article{border:1px solid #2d3132;background:#0d0f10;padding:18px}
  .curated-grid article h3{margin:0 0 12px;font:700 16px Cinzel;text-transform:uppercase}
  .curated-grid .relation-list{gap:8px}
  `;
  document.head.appendChild(style);

  const L=window.LORE||{};
  const DEPTH={
    faction:{
      imperium:{
        sections:[
          ['Как устроен Империум', 'Империум — это не единое гладкое государство, а гигантская и противоречивая конструкция. Он держится на Терре, Адептус Терра, Адептус Механикус, Астра Милитарум, Флоте, Инквизиции, тысячах орденов Астартес и миллионах автономных губернаторов. Именно эта смесь бюрократии, религии, карательной силы и инерции делает его одновременно устойчивым и чудовищно неэффективным.'],
          ['Почему Империум так важен', 'Почти любой крупный сюжет 40K так или иначе измеряется относительно Империума: он задаёт масштаб, определяет язык войны, хранит память о Великом крестовом походе и показывает, как мечта об объединении человечества превратилась в режим выживания. Через Империум удобно понимать и Хаос, и Астартес, и Инквизицию, и Адептус Механикус.'],
          ['Империум после Великого Разлома', 'После падения Кадии и появления Великого Разлома Империум оказался буквально расколот. Возвращение Робута Жиллимана и Крестовый поход Индомитус не отменили кризис — они лишь дали системе шанс не рухнуть сразу. Отсюда особая важность тем Imperium Sanctus и Imperium Nihilus, логистики, религии и новых Примарис-подкреплений.']
        ],
        books:['Eisenhorn','Vaults of Terra','Watchers of the Throne','Dark Imperium','Dawn of Fire','Carrion Throne','Helsreach'],
        games:['Warhammer 40,000: Rogue Trader','Space Marine / Space Marine 2','Dawn of War (серия)','Battlefleet Gothic: Armada','Darktide','Inquisitor – Martyr'],
        quotes:['THE EMPEROR PROTECTS','THOUGHT FOR THE DAY','FAITH IS THE SHIELD OF HUMANITY']
      },
      chaos:{
        sections:[
          ['Хаос — не просто враг', 'Силы Хаоса — это не одна армия, а целая система внутренних конфликтов. Боги Варпа, легионы-предатели, демоны, культы, Чёрный Легион, Тёмный Механикус и смертные чемпионы постоянно сотрудничают и одновременно пожирают друг друга. Это делает Хаос не только военной угрозой, но и метафизическим принципом распада.'],
          ['Долгая война', 'После Ереси Хоруса конфликт не закончился, а сменил форму. Для предателей главной рамкой стала Долгая война — тысячелетнее стремление сокрушить Империум, отомстить за прошлое и навязать галактике собственный порядок. В современной эпохе эту линию в первую очередь символизирует Абаддон.'],
          ['Почему Хаос притягателен в лоре', 'Хаос интересен тем, что показывает цену имперских ошибок. Почти каждый крупный кризис начинается с идеализма, гордыни, жажды знания или власти — и лишь потом вырождается в служение Варпу. Поэтому материалы по Хаосу особенно сильны, когда читаются рядом с историями Императора, примархов и Инквизиции.']
        ],
        books:['Horus Rising','The First Heretic','Betrayer','The Talon of Horus','Black Legion','Lords of Silence','Night Lords Omnibus'],
        games:['Chaos Gate – Daemonhunters','Dawn of War: Dark Crusade / Soulstorm','Battlefleet Gothic: Armada 2','Space Marine 2 (как противник)','Rogue Trader'],
        quotes:['LET THE GALAXY BURN','LONG WAR','BLOOD, DECAY, EXCESS, CHANGE']
      },
      aeldari:{
        sections:[
          ['Старая раса на руинах величия', 'Аэльдари — одна из самых древних и культурно сложных цивилизаций сеттинга. Их трагедия в том, что почти вся современная политика народа строится вокруг последствий древней катастрофы: Падения и рождения Слаанеш. Любая ветвь аэльдари — это попытка выжить после утраты прежнего могущества.'],
          ['Пути и самоконтроль', 'Миры-корабли, экзодиты, Иврейн и последователи Иннеада, корсары и друкхари показывают разные ответы на один и тот же кризис. Особенно важна идея Пути — дисциплины, с помощью которой аэльдари пытаются не сорваться в ту же бездну, что когда-то уничтожила их империю.'],
          ['Как читать аэльдари', 'Лучше всего воспринимать их не как «эльфов в космосе», а как цивилизацию памяти, пророчества и медленного вымирания. Через них раскрываются темы судьбы, дальнего планирования, психологической цены бессмертия и войны через ограниченные элитные силы.']
        ],
        books:['Path of the Eldar','Valedor','Jain Zar','The Ynnari books','Asurmen: Hand of Asuryan'],
        games:['Dawn of War (серия)','Battlefleet Gothic: Armada 2','Gladius','Rogue Trader'],
        quotes:['THE FUTURE IS A KNIFE-EDGE','PATH AND DISCIPLINE','THE FALL IS NEVER FORGOTTEN']
      },
      necrons:{
        sections:[
          ['Древние хозяева материи', 'Некроны интересны тем, что их технологии и исторический горизонт выходят далеко за пределы большинства рас. Это не просто «роботы-скелеты», а фрагмент космологической древности, переживший богов, звёздные войны и миллионы лет забвения.'],
          ['Династии и личность', 'Самые сильные тексты про некронов работают тогда, когда показывают, что за металлической оболочкой стоят характер, гордыня, абсурдная аристократия и память о смертности. Тразин, Орикан и Безмолвный Король особенно хорошо демонстрируют, что некроны бывают не только безликой угрозой.'],
          ['Пилоны, Парии и антиварп', 'В современной эпохе особую роль играют темы ноктилита, пилонов чёрного камня, Парии Нексус и попыток некронов навязать галактике порядок, в котором сама активность Варпа станет ограниченной. Это даёт им стратегическую роль гораздо шире обычных вторжений.']
        ],
        books:['The Infinite and the Divine','The Twice-Dead King','Severed','Indomitus'],
        games:['Mechanicus','Gladius','Battlefleet Gothic: Armada 2','Rogue Trader'],
        quotes:['THEY AWAKEN','ORDER AGAINST THE WARP','DYNASTY NEVER DIES']
      },
      tyranids:{
        sections:[
          ['Не империя, а биологическая катастрофа', 'Тираниды — угроза другого типа. У них нет привычной дипломатии, государства или идеологии: они представляют собой биосистему тотального поглощения. Поэтому их лучше понимать не как очередную армию, а как давление экосистемы и стратегии улья на весь сеттинг.'],
          ['Флоты-ульи как характеры', 'Бегемот, Кракен, Левиафан, Кронос и другие флоты-ульи нужны не только для различения цветов или доктрин. Через них сеттинг показывает разные решения одной задачи: штурм, рассечение, психическая война, подавление Варпа и адаптация к обороне жертвы.'],
          ['Почему они так страшны', 'Тираниды ломают привычную логику героического 40K. Даже если конкретную битву удалось выиграть, сама логика истощения, биомассы и бесконечной адаптации остаётся. Их вторжение всегда ставит вопрос не только о храбрости, но и о логистике, времени и цене победы.']
        ],
        books:['Devastation of Baal','Leviathan','Warriors of Ultramar','Valedor'],
        games:['Space Hulk: Tactics','Gladius','Space Marine 2','Dawn of War II','Battle Sector'],
        quotes:['THE HIVE HUNGERS','ADAPTATION IS THEIR DOCTRINE','CONSUME, EVOLVE, RETURN']
      },
      tau:{
        sections:[
          ['Молодая держава с иной логикой', 'Империя Т’ау резко отличается от других больших сил 40K. Она моложе, технологичнее в прикладном смысле и опирается на идею Высшего Блага. Именно поэтому её истории часто строятся не на упадке прошлого, а на напряжении между экспансией, идеологией и реальной ценой порядка.'],
          ['Касты и политика', 'Т’ау невозможно понимать только через боевые костюмы. Их общество держится на кастах, дипломатии, пропаганде и вспомогательных расах. С этой точки зрения военные победы всегда связаны с вопросом: где заканчивается рациональное государство и начинается мягкая, но жёсткая форма контроля.'],
          ['Почему Т’ау важны для контраста', 'Т’ау — один из лучших инструментов, чтобы увидеть, насколько чудовищен обычный фон 40K. На их фоне Империум, Хаос и даже многие ксеносы читаются особенно резко: через сравнение технологий, морали, потерь и отношения к населению.']
        ],
        books:['Farsight: Crisis of Faith','Farsight: Empire of Lies','Damocles','Fire Warrior'],
        games:['Dawn of War: Dark Crusade / Soulstorm','Battle Sector (DLC/contexts)','Gladius'],
        quotes:['FOR THE GREATER GOOD','SEPTS, SPHERES, EXPANSION','THE FUTURE CAN BE ENGINEERED']
      },
      orks:{
        sections:[
          ['Орки как стихийная сила', 'Орки одновременно смешны и катастрофичны. Они превращают войну в способ существования, а не в политическое средство, и именно за счёт этого способны быть комическими на поверхности и ужасающими по последствиям. Waaagh! — это не только армия, но и коллективный импульс роста, насилия и импровизации.'],
          ['Почему орки опаснее, чем кажутся', 'За внешним хаосом у орков есть своя логика: чем больше конфликт, тем быстрее они растут, вооружаются и объединяются. Поэтому недооценка орков в сюжете почти всегда заканчивается тем, что «локальная банда» превращается в планетарную или секторную катастрофу.'],
          ['Газгкулл и орочий масштаб', 'Через Газгкулла и войны за Армагеддон особенно хорошо видно, что орки могут быть не просто шумным фоном, а полноценной исторической силой. В их лучших сюжетах смешиваются чёрный юмор, бешеная энергия и ощущение, что галактика буквально не может избавиться от этой биологической военной массы.']
        ],
        books:['Ghazghkull Thraka: Prophet of the Waaagh!','Brutal Kunnin','Warboss','Helsreach / Armageddon context'],
        games:['Shootas, Blood & Teef','Dakka Squadron','Dawn of War (серия)','Battlefleet Gothic: Armada 2'],
        quotes:['WAAAGH!','ORKS NEVER THINK SMALL','SPEED, NOISE, BRUTALITY']
      }
    },
    character:{
      emperor:{
        sections:[
          ['Центральный миф сеттинга', 'Император Человечества — не просто персонаж, а стержень всей мифологии 40K. Его можно читать как исторического правителя, как сверхчеловеческого архитектора Империума и как фигуру, вокруг которой возник культ, уже слабо похожий на первоначальный проект рационального объединения человечества.'],
          ['Почему он так неоднозначен', 'В лучших текстах Император не сводится ни к «безупречному спасителю», ни к «главному виновнику». Его решения дали человечеству шанс на галактический рывок, но те же решения запустили масштабные трагедии: подавление веры, секретность, жёсткую иерархию, создание примархов и колоссальную цену любого просчёта.'],
          ['Император в 40K', 'Современный Император почти отсутствует как действующее лицо, но присутствует везде как политическая, религиозная и психическая реальность. Через него связаны Терра, Золотой Трон, Астрономикон, Инквизиция, Кустодес и все великие споры о том, что именно он хотел построить.']
        ],
        books:['Master of Mankind','The End and the Death','Valdor: Birth of the Imperium','The Horus Heresy (серия)'],
        games:['Rogue Trader','Battlefleet Gothic: Armada 2','Darktide (фон Империума)'],
        quotes:['THE EMPEROR PROTECTS','MASTER OF MANKIND','A GOLDEN THRONE FOR A DYING AGE']
      },
      guilliman:{
        sections:[
          ['Государственник среди полубогов', 'Робут Жиллиман особенно выделяется на фоне других примархов тем, что его сила — не только в войне, но и в администрировании, стратегии и умении превращать победу в устойчивую систему. Поэтому он важен сразу в двух эпохах: как примарх XIII легиона и как фактический кризисный управленец М42.'],
          ['Жиллиман после возвращения', 'Вернувшись в расколотую галактику, Жиллиман оказался в мире, который одновременно держится на его прошлом наследии и уже почти не соответствует его прежним представлениям. Именно это напряжение — между рационализмом, культом Императора и необходимостью править религиозной империей — делает его одной из сильнейших современных фигур 40K.'],
          ['Почему его удобно использовать как точку входа', 'Жиллиман связывает Кодекс Астартес, Ультрамар, Примарис, Индомитус, конфликт с Хаосом и современную политику Империума. Через него можно быстро перейти от эпохи Ереси к новейшему лору.']
        ],
        books:['Know No Fear','Dark Imperium','Plague War','Godblight','Dawn of Fire'],
        games:['Space Marine 2','Gladius','Rogue Trader (фон эпохи)','Battlefleet Gothic: Armada 2'],
        quotes:['COURAGE AND HONOUR','ULTRAMAR ENDURES','ORDER IS A WEAPON']
      },
      lion:{
        sections:[
          ['Рыцарь старой школы', 'Лион Эль’Джонсон — один из самых «рыцарских» примархов, но его рыцарство холодное и скрытное. В нём сочетаются охотник, командир и фигура глубокой тайны, что идеально отражает характер Тёмных Ангелов и историю Калибана.'],
          ['Возвращение в Imperium Nihilus', 'Современное возвращение Льва важно не только само по себе, но и как ответ на новое состояние галактики. Лион действует в условиях тьмы, изоляции и обрывков старой власти, что делает его не просто «вернувшимся примархом», а самостоятельным центром силы в половине Империума, отрезанной Разломом.'],
          ['Тайна Падших', 'Ни одна статья о Льве не бывает полной без темы Падших и разрушения Калибана. Это один из самых сильных внутренних мифов всего Астартес-лора: честь ордена, вина, умолчание и тысячелетнее стремление контролировать собственное прошлое.']
        ],
        books:['Descent of Angels','Fallen Angels','The Lion','Son of the Forest','Arks of Omen: The Lion'],
        games:['Dawn of War mods / fan presence','Rogue Trader (lore references)','Space Marine 2 (background era)'],
        quotes:['THE LION RETURNS','SECRETS ARE ALSO WEAPONS','CALIBAN REMEMBERS']
      },
      horus:{
        sections:[
          ['Точка разлома истории', 'Хорус Луперкаль нужен сеттингу как фигура исторического перелома. Пока он лоялен, Империум движется к единству; после его падения всё начинает измеряться Ересью. Поэтому даже в современном 40K Хорус важен не как «умерший злодей», а как причина почти всех крупнейших трещин в памяти человечества.'],
          ['Почему падение Хоруса работает', 'Трагедия Хоруса сильна тем, что она не выглядит случайной. Его гордость, колоссальные ожидания, сложные отношения с Императором и психологическая уязвимость делают Ересь не внезапным поворотом, а последовательным разложением героя-победителя.'],
          ['Символ наследия предателей', 'Даже когда центр повествования смещается к Абаддону, тень Хоруса никуда не исчезает. Чёрный Легион и вообще вся память о XVI легионе строятся вокруг наследия, которое одновременно вдохновляет и давит.']
        ],
        books:['Horus Rising','False Gods','Galaxy in Flames','The End and the Death','The Talon of Horus'],
        games:['Horus Heresy: Legions','Battlefleet Gothic: Armada 2','Rogue Trader (исторический фон)'],
        quotes:['WARMASTER','I WAS THERE','THE REBELLION THAT BROKE THE AGE']
      },
      sanguinius:{
        sections:[
          ['Трагический идеал', 'Сангвиний — один из самых любимых примархов именно потому, что соединяет возвышенность и обречённость. Он одновременно символизирует благородство Астартес и напоминает, что в 40K самые светлые фигуры часто платят за это самую высокую цену.'],
          ['Кровь, пророчество и жертва', 'Истории про Сангвиния почти всегда работают на пересечении трёх тем: ангельский образ, тень внутреннего проклятия и ясное предчувствие собственной гибели. Это делает его центральным узлом не только для Кровавых Ангелов, но и для самой эмоциональной стороны Ереси.'],
          ['Наследие для Кровавых Ангелов', 'После смерти Сангвиния его влияние не исчезает, а превращается в культурную и биологическую судьбу ордена. Чёрная Ярость, Красная Жажда, культ памяти и стремление соответствовать недостижимому идеалу — всё это продолжение личности примарха.']
        ],
        books:['Fear to Tread','The End and the Death','Ruinstorm','Devastation of Baal'],
        games:['Battle Sector','Dawn of War','Space Marine 2 (background presence)'],
        quotes:['ANGEL OF BAAL','NOBILITY IN THE FACE OF DOOM','HE KNEW AND STILL STOOD']
      },
      abaddon:{
        sections:[
          ['Наследник, который отказался быть тенью', 'Абаддон интересен тем, что не хочет просто копировать Хоруса. В его образе важна идея самостоятельного центра силы: бывший первый капитан XVI легиона создаёт Чёрный Легион и превращает разрозненных предателей в политический и военный проект нового типа.'],
          ['Чёрные крестовые походы и стратегия истощения', 'Долгое время Абаддона упрощали до образа «вечно не побеждающего злодея», но современный лор переосмыслил его как стратега, который методично разрушал опоры Империума. Падение Кадии и кампании М42 сильно усилили его статус.'],
          ['Почему он важен для современного 40K', 'Если Хорус — символ исторического разлома, то Абаддон — символ того, как этот разлом продолжает работать в настоящем. Через него удобно читать Чёрный Легион, Арки Предзнаменования, Вашторра и общую стратегию Хаоса в М42.']
        ],
        books:['The Talon of Horus','Black Legion','Arks of Omen','Fall of Cadia'],
        games:['Battlefleet Gothic: Armada 2','Dawn of War','Chaos Gate – Daemonhunters'],
        quotes:['THE DESPOILER','NO TRUE HEIR BOWS TO THE PAST','THE LONG WAR CONTINUES']
      },
      malcador:{
        sections:[
          ['Гражданский мозг Империума', 'Малкадор особенно важен потому, что показывает «негромкую» сторону раннего Империума: не штурм, а управление, тайную работу, политику и умение держать целую цивилизацию на грани.'],
          ['Связь между Императором и будущими институтами', 'Через Малкадора удобно понимать происхождение Инквизиции, Серых Рыцарей, регентства Терры и всей скрытой архитектуры власти, которая переживёт Ересь.'],
          ['Осада Терры и цена верности', 'Его финальная жертва особенно сильна тем, что Малкадор никогда не был фронтовым символом вроде примархов, но именно на нём в критический момент держалась сама возможность для Императора покинуть Трон и закончить войну.']
        ],
        books:['The Buried Dagger','The End and the Death','Valdor: Birth of the Imperium','The Siege of Terra'],
        games:['Rogue Trader (as lore context)','Horus Heresy fan adaptations'],
        quotes:['REGENT OF TERRA','THE SIGILLITE','POWER WITHOUT THE THRONE']
      }
    },
    legion:{
      ultramarines:{sections:[['Не только «синие по уставу»','Ультрамарины часто ошибочно сводятся к образу чрезмерно дисциплинированного легиона, но их сила именно в масштабе: это огромная военная и цивилизационная машина, тесно связанная с Ультрамаром и идеей того, что Астартес могут не только завоёвывать, но и удерживать пространство.'],['Почему Калт и Ультрамар важны','Через кампании вроде Калта раскрывается, что XIII легион не просто «правильный», а невероятно выносливый под ударом идеологического и военного предательства.'],['После Ереси','Именно Ультрамарины теснее всего связаны с Codex Astartes и последующим устройством орденской системы.']],books:['Know No Fear','Unremembered Empire','Dark Imperium'],games:['Space Marine 2','Dawn of War','Gladius'],quotes:['COURAGE AND HONOUR','ULTRAMAR ENDURES']},
      'dark-angels':{sections:[['Первый легион','Тёмные Ангелы важны уже тем, что они Первый легион. В них соединились старшинство, огромный арсенал, рыцарский миф и глубоко спрятанный внутренний разлом.'],['Калибан и секреты','Калибан — не просто родной мир, а источник всей поздней культуры легиона и ордена: охота, тайные круги, рыцарские братства, вина и молчание.'],['Падшие как вечная травма','История Падших делает этот легион одной из самых самоедских сил Империума.']],books:['Descent of Angels','Fallen Angels','Son of the Forest'],games:['Dawn of War','Space Marine 2 (era background)'],quotes:['THE FIRST','REPENTANCE AND SECRECY']},
      'blood-angels':{sections:[['Эстетика и ярость','Кровавые Ангелы сочетают художественность, благородство и внутреннюю монструозность. За красивым фасадом скрывается постоянная борьба с наследием крови Сангвиния.'],['Красная Жажда и Чёрная Ярость','Именно внутреннее проклятие делает их уникальными среди лоялистов. Истории ордена почти всегда о борьбе не только с врагом, но и с собой.'],['Бaal и выживание','Битва за Баал показывает их как символ стойкости, а не только падения.']],books:['Fear to Tread','Devastation of Baal','Dante'],games:['Battle Sector','Dawn of War'],quotes:['ANGELS ENCARMINE','NOBILITY AND FURY']},
      'space-wolves':{sections:[['Легион, который не хотел быть обычным','Космические Волки важны как анти-модель к формализму Империума. Они опираются на саги, личную честь, фенрисийские обычаи и самостоятельность.'],['Русс и роль исполнителя','В лоре Волки часто оказываются инструментом грубой, но решительной силы — в том числе тогда, когда другие части Империума колеблются.'],['Почему их любят и критикуют','Их образ держится на сильной идентичности, но именно поэтому вызывает полярные реакции — и это делает их заметными.']],books:['Prospero Burns','Wolfsbane','Ragnar Blackmane'],games:['Space Wolf','Dawn of War'],quotes:['FOR RUSS AND THE ALLFATHER','SAGA BEFORE DOCTRINE']}
    },
    chapter:{
      'ultramarines-chapter':{sections:[['Орден как лицо Империума','Ультрамарины-орден — один из самых узнаваемых образов всего Warhammer 40,000. Именно через них многие впервые знакомятся с Астартес, Кодексом и понятием орденской войны.'],['Практическая функция в сеттинге','Они часто служат «чистой линией отсчёта»: рядом с ними легче увидеть, в чём уникальность других орденов, предателей и ксеносов.']],books:['Dark Imperium','Knights of Macragge','Uriel Ventris (серия)'],games:['Space Marine / Space Marine 2','Dawn of War'],quotes:['COURAGE AND HONOUR']},
      'dark-angels-chapter':{sections:[['Орден тайн','Современные Тёмные Ангелы — это не просто наследники Первого легиона, а целая система скрытых кругов, посвящений и охоты на Падших.'],['Чем они отличаются от других лоялистов','У них почти всегда двойной сюжет: внешний враг и внутренний секрет.']],books:['Legacy of Caliban','Son of the Forest'],games:['Dawn of War','various tabletop video adaptations'],quotes:['REPENT!']},
      'blood-angels-chapter':{sections:[['Орден прекрасной трагедии','Кровавые Ангелы как орден строят весь свой стиль на борьбе за человечность и контроль над наследственным безумием.'],['Почему они важны','Через них особенно ярко видно, что Астартес могут быть не только машинами войны, но и носителями высокой культуры, памяти и почти религиозной скорби.']],books:['Dante','Devastation of Baal','Mephiston books'],games:['Battle Sector'],quotes:['FOR BAAL']},
      'black-templars':{sections:[['Крестовый орден','Чёрные Храмовники воплощают религиозно-воинственный облик Империума. Они ближе всех к вечному крестовому походу, фанатизму и отказу от оседлой стабильности.'],['Почему они так заметны','Там, где другие ордена действуют по операционным задачам, Тemplars часто ощущаются как движение, вера и нескончаемая экспедиция.']],books:['Helsreach','Black Templars by Guy Haley'],games:['Dawn of War','various fan mods'],quotes:['NO PITY! NO REMORSE! NO FEAR!']}
    }
  };

  const ensurePath=(obj,path)=>path.reduce((a,k)=>(a[k]=a[k]||{}),obj);
  window.EXPANDED_LORE=window.EXPANDED_LORE||{};
  const src=(title,url)=>[title,url];
  const ensureSource=(record,title,url)=>{
    record.sources=record.sources||[];
    if(!record.sources.some(([t,u])=>t===title||u===url)) record.sources.push(src(title,url));
  };
  const by=(type,id)=>window.collections?.[type]?.find(x=>x.id===id) || window.getRecord?.(type,id);

  Object.entries(DEPTH).forEach(([type,items])=>{
    window.EXPANDED_LORE[type]=window.EXPANDED_LORE[type]||{};
    Object.entries(items).forEach(([id,data])=>{
      const cur=window.EXPANDED_LORE[type][id]=window.EXPANDED_LORE[type][id]||{};
      cur.sections=[...(cur.sections||[]),...(data.sections||[])];
      cur.reading=[...(cur.reading||[]),...((data.books||[]).slice(0,4))].filter((v,i,a)=>a.indexOf(v)===i);
      const rec=by(type,id);
      if(rec){
        ensureSource(rec,'Warhammer 40k Wiki / Fandom','https://warhammer40k.fandom.com/wiki/'+encodeURIComponent((rec.en||rec.name||'').replaceAll(' ','_')));
        ensureSource(rec,'Warhammer 40,000 Wiki (RU portal)','https://warhammer40k.fandom.com/ru/wiki/Warhammer_40,000_Wiki');
        if(type==='character' || type==='legion' || type==='chapter' || type==='faction') rec.mediaSite='fandom';
      }
    });
  });

  window.MEDIA_LIBRARY=window.MEDIA_LIBRARY||{};
  const ml=window.MEDIA_LIBRARY;
  ml.faction=Object.assign(ml.faction||{}, {
    imperium:[{src:'/assets/imperium-city.jpg',caption:'Империум Человечества — административное и военное лицо галактической державы',credit:'Imperium Archive · curated local art'}],
    chaos:[{src:'/assets/chaos-rift.jpg',caption:'Великий Разлом и визуальный образ сил Хаоса',credit:'Imperium Archive · curated local art'}],
    aeldari:[{src:'/assets/aeldari-craftworld.webp',caption:'Мир-корабль и визуальный образ аэльдари',credit:'Imperium Archive · curated local art'}],
    drukhari:[{src:'/assets/drukhari-commorragh.webp',caption:'Комморра и эстетика друкхари',credit:'Imperium Archive · curated local art'}],
    orks:[{src:'/assets/orks-war.webp',caption:'Орки и орочья военная культура',credit:'Imperium Archive · curated local art'}],
    necrons:[{src:'/assets/trazyn-hero.webp',caption:'Некронская эстетика и династическое наследие',credit:'Imperium Archive · curated local art'}],
    tyranids:[{src:'/assets/tyranids-war.webp',caption:'Тиранидская биоугроза',credit:'Imperium Archive · curated local art'}],
    tau:[{src:'/assets/tau-empire.webp',caption:'Империя Т’ау и её технологический стиль',credit:'Imperium Archive · curated local art'}],
    mechanicus:[{src:'/assets/mechanicus-forge.webp',caption:'Фордж-миры и индустриальная эстетика Механикус',credit:'Imperium Archive · curated local art'}]
  });

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const relationLabel=(type,id)=>by(type,id)?.name||id;
  const listBlock=(title,items,small)=>items?.length?`<article class="knowledge-card"><h3>${esc(title)}</h3><ul>${items.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>${small?`<p class="deep-source-note">${esc(small)}</p>`:''}</article>`:'';
  const quoteBlock=items=>items?.length?`<section class="detail-block deep-added"><p class="eyebrow">ARCHIVE PHRASES</p><h2>Формулы, девизы и тематические маркеры</h2><div class="quote-strip">${items.map(v=>`<div class="quote-chip">${esc(v)}</div>`).join('')}</div><p class="deep-source-note">Короткие формулы оставлены как ориентиры по настроению и лексике сеттинга, а не как полный цитатник художественных произведений.</p></section>`:'';

  function detailPack(type,id){ return DEPTH[type]?.[id] || null; }

  const originalRenderDetail=window.renderDetail;
  if(originalRenderDetail){
    window.renderDetail=function(type,o){
      const result=originalRenderDetail(type,o);
      const pack=detailPack(type,o.id);
      const main=document.querySelector('#detailPage .detail-main');
      if(main){
        main.querySelectorAll('.knowledge-extension,.quote-extension').forEach(n=>n.remove());
        if(pack){
          const knowledge=`<section class="detail-block deep-added knowledge-extension"><div class="block-head"><div><p class="eyebrow">DEEP ARCHIVE</p><h2>Книги, игры и дополнительные ориентиры</h2></div><small>Подборка для углубления: без спойлеров, но с правильными точками входа.</small></div><div class="knowledge-grid">${listBlock('Ключевые книги и серии',pack.books,'Это навигационный список по теме: романы, циклы и крупные лорные опоры.')} ${listBlock('Игры и адаптации',pack.games,'Игры помогают быстро почувствовать эстетику и роль фракции/персонажа, но канон всегда лучше проверять по кодексам и книгам.')} ${listBlock('Почему читать именно это', (pack.books||[]).slice(0,3).map((b,i)=> i===0?`${b} — сильная стартовая точка по теме.`:i===1?`${b} — даёт более широкий контекст и соседние сюжетные линии.`:`${b} — полезен для перехода к смежным персонажам, войнам и институтам.`), 'Подсказки составлены как маршрут чтения, а не как строгий рейтинг.')} </div><p class="deep-source-note">Дополнительно проект опирается на Lexicanum, Warhammer 40k Wiki / Fandom, Warhammer Community и собственные авторские сводки архива.</p></section>`;
          const quotes=quoteBlock(pack.quotes||[]);
          const anchor=main.querySelector('.gallery-block') || main.lastElementChild;
          if(anchor) anchor.insertAdjacentHTML('beforebegin', knowledge + quotes);
        }
      }
      return result;
    }
  }

  const originalSelect=window.selectMapRecord;
  if(originalSelect){
    window.selectMapRecord=function(id){
      const out=originalSelect(id);
      const p=by('location',id);
      const side=document.getElementById('mapSide');
      if(p&&side){
        const existing=side.querySelector('.map-preview-wrap');
        if(existing) existing.remove();
        const img=window.assetFor ? window.assetFor('location',p) : '/assets/galaxy-atlas.webp';
        const related=(p.connections||[]).slice(0,5).filter(([t,i])=>by(t,i));
        side.insertAdjacentHTML('afterbegin',`<div class="map-preview-wrap"><img class="map-preview" src="${esc(img)}" alt="${esc(p.name)}"></div>`);
        side.insertAdjacentHTML('beforeend',`
          <div class="map-context"><span>Контекст точки</span><small>${esc(p.importance||p.summary||'Запись используется как карта-переход к полной статье архива.')}</small></div>
          ${related.length?`<div class="map-related"><span>Связанные записи</span>${related.map(([t,i,l])=>`<button data-detail="${t}" data-id="${i}">${esc(l||relationLabel(t,i))} →</button>`).join('')}</div>`:''}
          <div class="map-source-note">Карта остаётся схематической: расположение объектов трактуется как относительное и сверяется с фанатскими картографическими ресурсами и вики-источниками, включая <a href="https://jambonium.co.uk/40kmap/" target="_blank" rel="noreferrer">Jambonium 40K Map</a> и <a href="https://warhammer40k.fandom.com/ru/wiki/Warhammer_40,000_Wiki" target="_blank" rel="noreferrer">Warhammer 40,000 Wiki</a>.</div>`);
      }
      return out;
    }
  }

  const originalUpdate=window.updateMapTransform;
  if(originalUpdate){
    window.updateMapTransform=function(){
      const r=originalUpdate();
      const stage=document.getElementById('galaxyStage');
      if(stage && window.mapState){
        stage.classList.remove('zoom-low','zoom-mid','zoom-high');
        stage.classList.add(window.mapState.scale<0.72?'zoom-low':window.mapState.scale<1.05?'zoom-mid':'zoom-high');
      }
      return r;
    }
  }

  window.addEventListener('load',()=>{
    const side=document.querySelector('.side-disclaimer');
    if(side && !side.dataset.depthExtended){
      side.dataset.depthExtended='1';
      side.insertAdjacentHTML('beforebegin','<div class="side-divider"><span>ИСТОЧНИКИ</span></div><div class="side-links"><a href="https://warhammer40k.fandom.com/ru/wiki/Warhammer_40,000_Wiki" target="_blank" rel="noreferrer">Warhammer 40,000 Wiki (RU) ↗</a><a href="https://wh40k.lexicanum.com/wiki/Main_Page" target="_blank" rel="noreferrer">Lexicanum ↗</a><a href="https://jambonium.co.uk/40kmap/" target="_blank" rel="noreferrer">Jambonium 40K Map ↗</a></div>');
    }
    if(window.updateMapTransform) window.updateMapTransform();
  });
})();
