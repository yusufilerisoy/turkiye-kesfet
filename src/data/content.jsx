/* content.jsx — 7 bölge intro + 3 mini görev her biri, ayrıca 15 soruluk Final Quiz */

const REGIONS_CONTENT = {
  karadeniz: {
    teaser: "🌧️ Yağmurlu ormanlar ve çay tarlaları seni bekliyor",
    intro: {
      missionTitle: "Bitki Örtüsü Uzmanı",
      story: "Sis dağların üstüne çöktü, çay tarlaları yağmurla parladı. Burada her şey yeşil — ormanlar, fındık bahçeleri, hatta evlerin çatıları bile… Sen Bitki Örtüsü Uzmanı rozetini kazanmaya hazır mısın?",
      facts: [
        { icon: "🌧️", label: "İklim", value: "Her mevsim yağışlı" },
        { icon: "🌳", label: "Bitki örtüsü", value: "Gür ormanlar" },
        { icon: "🍃", label: "Önemli ürünler", value: "Çay, fındık, mısır" },
        { icon: "🏔️", label: "Yer şekilleri", value: "Dağlık ve engebeli" }
      ],
      estimatedMin: "4–6"
    },
    missions: [
      {
        type: "single-choice",
        title: "Karadeniz'in iklimi nasıldır?",
        prompt: "Sana en doğru gelen seçeneği işaretle.",
        options: [
          "Her mevsim yağışlı, ılıman",
          "Yazları sıcak ve kurak, kışları ılık",
          "Karasal — yazlar sıcak, kışlar soğuk",
          "Sert karasal — kışları çok soğuk ve karlı"
        ],
        correct: 0,
        hint: "Karadeniz kıyıları boyunca yağmur bulutları her mevsim eksik olmaz."
      },
      {
        type: "multi-select",
        title: "Karadeniz'de yetişen ürünleri seç (birden fazla doğru var).",
        prompt: "Bu bölgede üretilen tarım ürünlerini işaretle.",
        options: ["Çay", "Pamuk", "Fındık", "Mısır", "Muz"],
        correct: [0, 2, 3],
        hint: "Yağışlı iklim çay ve fındığı sever; mısır da Karadeniz'in geleneksel ürünüdür."
      },
      {
        type: "scenario",
        title: "Hikâye: Rize'de bir sabah",
        story: "Ayşe sabah uyandığında pencereden dışarı baktı. Yine sis ve yağmur vardı. Annesi bahçeden taze yapraklar topluyordu. Ayşe annesine 'Bu yapraklarla ne yapacağız?' diye sordu.",
        prompt: "Annesinin topladığı yapraklar büyük ihtimalle hangi ürünündür?",
        options: ["Zeytin yaprağı", "Çay yaprağı", "Tütün yaprağı"],
        correct: 1,
        hint: "Karadeniz'de sis ve yağışlı iklim hangi içeceğin tarımı için idealdir?"
      }
    ]
  },

  akdeniz: {
    teaser: "☀️ Mavi deniz, narenciye bahçeleri ve antik kıyılar",
    intro: {
      missionTitle: "İklim Avcısı",
      story: "Güneş tepeden vuruyor, deniz pırıl pırıl. Antalya'nın sahillerinde turistler, dağlarda da çam ormanları ve sedirler… Akdeniz'in ikliminin sırrını çözecek misin?",
      facts: [
        { icon: "☀️", label: "İklim", value: "Yazları sıcak ve kurak" },
        { icon: "🌿", label: "Bitki örtüsü", value: "Maki, kızılçam" },
        { icon: "🍊", label: "Önemli ürünler", value: "Narenciye, muz, pamuk" },
        { icon: "🏖️", label: "Yer şekilleri", value: "Toros Dağları, kıyılar" }
      ],
      estimatedMin: "4–6"
    },
    missions: [
      {
        type: "single-choice",
        title: "Akdeniz ikliminin temel özelliği nedir?",
        prompt: "En doğru tanımı seç.",
        options: [
          "Yazları sıcak ve kurak, kışları ılık ve yağışlı",
          "Her mevsim yağışlı ve ılıman",
          "Yazları kısa ve serin, kışları çok karlı",
          "Yıl boyu kar yağar"
        ],
        correct: 0,
        hint: "Tatil reklamlarında 'güneşli yazlar' diye geçer."
      },
      {
        type: "multi-select",
        title: "Akdeniz Bölgesi'nde yetişen ürünleri seç.",
        prompt: "Bu sıcak iklimde yetişen ürünleri işaretle.",
        options: ["Portakal", "Muz", "Çay", "Pamuk", "Fındık"],
        correct: [0, 1, 3],
        hint: "Sıcak iklim narenciye ve muzu sever; pamuk da Çukurova'da boldur."
      },
      {
        type: "drag-match",
        title: "Eşleştir: Akdeniz şehri → Ünlü olduğu özelliği.",
        prompt: "Soldaki şehirleri sağdaki özellikleriyle eşleştir.",
        pairs: [
          { left: "Antalya", right: "Turizm cenneti" },
          { left: "Adana", right: "Pamuk ve kebap" },
          { left: "Mersin", right: "Liman ve narenciye" }
        ],
        hint: "Antalya turistlerin gözdesidir; Adana ise pamukla ünlüdür."
      }
    ]
  },

  ege: {
    teaser: "🌿 Zeytinlikler ve antik kıyıların büyüsü",
    intro: {
      missionTitle: "Tarım Dedektifi",
      story: "Zeytin ağaçları rüzgârla sallanıyor, antik tiyatroların taşları güneşle ısınıyor. Ege'nin girintili çıkıntılı kıyılarında her köyün bir hikâyesi var…",
      facts: [
        { icon: "☀️", label: "İklim", value: "Akdeniz iklimi (ılıman)" },
        { icon: "🫒", label: "Bitki örtüsü", value: "Zeytin, maki" },
        { icon: "🌾", label: "Önemli ürünler", value: "Zeytin, üzüm, incir, tütün" },
        { icon: "🏛️", label: "Yer şekilleri", value: "Girintili çıkıntılı kıyı, ovalar" }
      ],
      estimatedMin: "4–6"
    },
    missions: [
      {
        type: "single-choice",
        title: "Ege Bölgesi'nin en sembol ürünü hangisidir?",
        prompt: "Bölgenin manzarasını süsleyen ağacı seç.",
        options: ["Çay", "Zeytin", "Fındık", "Pamuk"],
        correct: 1,
        hint: "Ege manzarasının vazgeçilmezi: gümüş yapraklı, yaşlı ağaçlar."
      },
      {
        type: "drag-match",
        title: "Eşleştir: Ürün → Kullanım alanı.",
        prompt: "Soldaki ürünleri sağdaki kullanım alanlarına bağla.",
        pairs: [
          { left: "Zeytin", right: "Yağ ve kahvaltılık" },
          { left: "Üzüm", right: "Şarap ve kuru üzüm" },
          { left: "İncir", right: "Kuru meyve" },
          { left: "Tütün", right: "Endüstri ürünü" }
        ],
        hint: "Üzüm denilince akla şarap ve kuru üzüm gelir."
      },
      {
        type: "map-mark",
        title: "Haritada Ege Bölgesi'ne tıkla.",
        prompt: "Türkiye haritasında Ege Bölgesi'ni bul ve tıkla.",
        targetRegionId: "ege",
        distractors: ["marmara", "akdeniz", "icanadolu"],
        hint: "Türkiye'nin batı kıyısı boyunca uzanır."
      }
    ]
  },

  icanadolu: {
    teaser: "🌾 Geniş bozkırlar ve başak tarlaları",
    intro: {
      missionTitle: "Yer Şekli Kâşifi",
      story: "Uçsuz bucaksız bozkırlar, sarı başak tarlaları ve uzakta görünen küçük tepeler. Türkiye'nin tam ortasındasın — burada gökyüzü çok geniş, ufuk çok uzaktır…",
      facts: [
        { icon: "🌡️", label: "İklim", value: "Karasal — sıcak yaz, soğuk kış" },
        { icon: "🌾", label: "Bitki örtüsü", value: "Bozkır (step)" },
        { icon: "🍞", label: "Önemli ürünler", value: "Buğday, arpa, şeker pancarı" },
        { icon: "🏞️", label: "Yer şekilleri", value: "Geniş ovalar ve platolar" }
      ],
      estimatedMin: "4–6"
    },
    missions: [
      {
        type: "single-choice",
        title: "İç Anadolu'nun temel bitki örtüsü nedir?",
        prompt: "En doğru tanımı seç.",
        options: ["Gür ormanlar", "Bozkır (step)", "Maki", "Tundra"],
        correct: 1,
        hint: "Yağış az olunca uzun ağaçlar yetişmez; kısa otlar hâkimdir."
      },
      {
        type: "single-choice",
        title: "Türkiye'nin en çok hangi tahılı yetiştirilen bölge buradadır?",
        prompt: "Ekmeğin en önemli ham maddesi.",
        options: ["Pirinç", "Mısır", "Buğday", "Yulaf"],
        correct: 2,
        hint: "Konya Ovası 'Türkiye'nin tahıl ambarı' diye bilinir."
      },
      {
        type: "scenario",
        title: "Hikâye: Konya Ovası'nda Yaz",
        story: "Mehmet dedesinin köyüne gitti. Yazın ortasıydı, hava çok sıcaktı ama gece olunca üşüdü. Sabah uyandığında geniş tarlaları gördü; sarı başaklar rüzgârla sallanıyordu.",
        prompt: "Mehmet'in tariflediği iklim hangisidir?",
        options: ["Akdeniz iklimi", "Karasal iklim", "Karadeniz iklimi"],
        correct: 1,
        hint: "Yaz sıcak, kış soğuk, gündüz-gece farkı belirgin: hangi iklim?"
      }
    ]
  },

  marmara: {
    teaser: "🌊 Boğazlar, köprüler ve sanayi şehirleri",
    intro: {
      missionTitle: "Şehir Mühendisi",
      story: "Boğaz'ın iki yakası arasında köprüler, fabrikaların bacaları, gemilerin sirenleri… Marmara, Türkiye'nin en kalabalık ve hareketli bölgesi. Burada coğrafya ve insan iç içe geçer.",
      facts: [
        { icon: "🌊", label: "Konum", value: "İki kıta arasında — Boğazlar" },
        { icon: "🏙️", label: "Nüfus", value: "Türkiye'nin en kalabalık bölgesi" },
        { icon: "🏭", label: "Ekonomi", value: "Sanayi ve ticaret merkezi" },
        { icon: "🌡️", label: "İklim", value: "Geçiş iklimi (Akdeniz–Karadeniz)" }
      ],
      estimatedMin: "4–6"
    },
    missions: [
      {
        type: "single-choice",
        title: "Marmara Bölgesi'ni özel kılan en önemli özelliği nedir?",
        prompt: "Bölgenin coğrafi konumunu en iyi anlatan seçeneği işaretle.",
        options: [
          "İki kıtayı (Asya ve Avrupa) birleştirir",
          "Türkiye'nin en yüksek dağı buradadır",
          "En çok orman bu bölgededir",
          "Türkiye'nin doğusunda yer alır"
        ],
        correct: 0,
        hint: "İstanbul Boğazı iki kıtayı ayırır."
      },
      {
        type: "multi-select",
        title: "Marmara Bölgesi'nde bulunan büyük şehirleri seç.",
        prompt: "Türkiye'nin en kalabalık bölgesindeki şehirleri işaretle.",
        options: ["İstanbul", "Bursa", "İzmir", "Kocaeli", "Konya"],
        correct: [0, 1, 3],
        hint: "İzmir Ege'de, Konya İç Anadolu'dadır."
      },
      {
        type: "scenario",
        title: "Hikâye: Boğaz'dan bakan çocuk",
        story: "Zeynep, İstanbul Boğazı kıyısında bir banktan denizi izliyordu. Bir yanda Asya, bir yanda Avrupa görünüyordu. Babası 'Burası dünyada eşi olmayan bir yerdir' dedi.",
        prompt: "Zeynep'in oturduğu şehir hangi özel özelliğe sahiptir?",
        options: [
          "İki kıta üzerine kurulmuştur",
          "Türkiye'nin en küçük şehridir",
          "Sadece kışın sıcak olur"
        ],
        correct: 0,
        hint: "İstanbul'u dünyada eşsiz kılan kıtalar arası konumudur."
      }
    ]
  },

  doguanadolu: {
    teaser: "⛰️ Karlı sıradağlar ve Türkiye'nin çatısı",
    intro: {
      missionTitle: "Dağ Tırmanıcısı",
      story: "Türkiye'nin çatısındasın. Burada dağlar gökyüzüne uzanır, kışlar uzun ve karlıdır. Ağrı Dağı uzakta, beyaz tepesiyle parlıyor. Yaylalar yeşil, vadiler derindir…",
      facts: [
        { icon: "🏔️", label: "Yer şekilleri", value: "Türkiye'nin en yüksek bölgesi" },
        { icon: "❄️", label: "İklim", value: "Sert karasal — uzun ve soğuk kış" },
        { icon: "🐑", label: "Hayvancılık", value: "Küçükbaş, büyükbaş" },
        { icon: "🌋", label: "Önemli zirve", value: "Ağrı Dağı (5137 m)" }
      ],
      estimatedMin: "4–6"
    },
    missions: [
      {
        type: "single-choice",
        title: "Türkiye'nin en yüksek dağı hangi bölgededir?",
        prompt: "5137 metrelik Ağrı Dağı hangi bölgenin sınırları içindedir?",
        options: ["Karadeniz", "Doğu Anadolu", "İç Anadolu", "Akdeniz"],
        correct: 1,
        hint: "Doğunun zirveleri en yüksek olanlardır."
      },
      {
        type: "single-choice",
        title: "Doğu Anadolu'da hangi ekonomik faaliyet ön plandadır?",
        prompt: "Yaylaların ve geniş otlakların etkisini düşün.",
        options: ["Turizm", "Hayvancılık", "Sanayi", "Balıkçılık"],
        correct: 1,
        hint: "Yüksek yaylalar koyun ve sığır için idealdir."
      },
      {
        type: "map-mark",
        title: "Haritada Doğu Anadolu'ya tıkla.",
        prompt: "Türkiye'nin doğusundaki yüksek dağlık bölgeyi bul.",
        targetRegionId: "doguanadolu",
        distractors: ["icanadolu", "karadeniz", "guneydogu"],
        hint: "Türkiye'nin en doğusunda, sağ üst kısımda."
      }
    ]
  },

  guneydogu: {
    teaser: "🔥 Pamuk tarlaları, GAP ve sıcak güneş",
    intro: {
      missionTitle: "Su Mühendisi",
      story: "Sıcak güneş, pamuk tarlaları ve büyük barajlar. GAP projesi sayesinde kuru topraklar bereketli ovalara dönüşüyor. Burada Mezopotamya'nın izleri var…",
      facts: [
        { icon: "🔥", label: "İklim", value: "Çok sıcak ve kurak yazlar" },
        { icon: "💧", label: "Önemli proje", value: "GAP (Güneydoğu Anadolu Projesi)" },
        { icon: "☁️", label: "Önemli ürünler", value: "Pamuk, antep fıstığı, mercimek" },
        { icon: "🏛️", label: "Tarih", value: "Göbeklitepe ve Mezopotamya" }
      ],
      estimatedMin: "4–6"
    },
    missions: [
      {
        type: "single-choice",
        title: "GAP Projesi'nin asıl amacı nedir?",
        prompt: "Bölgenin en büyük kalkınma projesi.",
        options: [
          "Sulama ve enerji üretimi",
          "Yeni şehirler kurmak",
          "Turizm geliştirmek",
          "Orman ekimi yapmak"
        ],
        correct: 0,
        hint: "Fırat ve Dicle nehirleri üzerinde barajlarla yapılır."
      },
      {
        type: "multi-select",
        title: "Güneydoğu'nun ünlü ürünlerini seç.",
        prompt: "Bu bölgede üretilen ürünleri işaretle.",
        options: ["Antep fıstığı", "Çay", "Pamuk", "Mercimek", "Fındık"],
        correct: [0, 2, 3],
        hint: "Antep fıstığının adı bile bölgeyi söylüyor."
      },
      {
        type: "scenario",
        title: "Hikâye: Şanlıurfa'da bir öğle",
        story: "Ali, dedesinin tarlasına gitti. Hava çok sıcaktı, termometre 42 dereceyi gösteriyordu. Tarlalardaki pamuklar açmaya başlamıştı. Dedesi 'Eskiden bu topraklar kuruydu, şimdi su geliyor' dedi.",
        prompt: "Dedesinin bahsettiği 'su geliyor' ifadesi hangi projeye işaret eder?",
        options: ["GAP Projesi", "Marmaray", "Zafer Tüneli"],
        correct: 0,
        hint: "Güneydoğu'da sulama denilince akla GAP gelir."
      }
    ]
  }
};

/* ========== FİNAL QUİZ — 15 soru ========== */
const FINAL_QUIZ = [
  {
    q: "Türkiye'nin en yüksek dağı hangi bölgede yer alır?",
    options: ["Karadeniz", "Doğu Anadolu", "İç Anadolu"],
    correct: 1
  },
  {
    q: "Hangi bölge her mevsim yağışlıdır?",
    options: ["Karadeniz", "İç Anadolu", "Güneydoğu Anadolu"],
    correct: 0
  },
  {
    q: "Çay tarımı en çok hangi bölgede yapılır?",
    options: ["Ege", "Karadeniz", "Akdeniz"],
    correct: 1
  },
  {
    q: "Türkiye'nin en kalabalık bölgesi hangisidir?",
    options: ["Marmara", "İç Anadolu", "Ege"],
    correct: 0
  },
  {
    q: "Türkiye'nin tahıl ambarı olarak bilinen ova hangisidir?",
    options: ["Çukurova", "Konya Ovası", "Bafra Ovası"],
    correct: 1
  },
  {
    q: "Akdeniz iklimi yazları nasıldır?",
    options: ["Soğuk ve karlı", "Sıcak ve kurak", "Yağışlı ve serin"],
    correct: 1
  },
  {
    q: "Antep fıstığı hangi bölgede yetişir?",
    options: ["Güneydoğu Anadolu", "Karadeniz", "Marmara"],
    correct: 0
  },
  {
    q: "Türkiye'nin en sembol ürünlerinden zeytin en çok hangi bölgede yetişir?",
    options: ["Karadeniz", "Ege", "Doğu Anadolu"],
    correct: 1
  },
  {
    q: "İç Anadolu'da görülen bitki örtüsüne ne ad verilir?",
    options: ["Maki", "Bozkır (step)", "Tayga"],
    correct: 1
  },
  {
    q: "İki kıta arasında yer alan bölge hangisidir?",
    options: ["Akdeniz", "Marmara", "Ege"],
    correct: 1
  },
  {
    q: "Pamuk üretimi en çok hangi iki bölgede yoğundur?",
    options: ["Akdeniz ve Güneydoğu", "Karadeniz ve Marmara", "İç Anadolu ve Doğu"],
    correct: 0
  },
  {
    q: "GAP Projesi'nin temel amacı nedir?",
    options: ["Turizm geliştirmek", "Sulama ve enerji üretimi", "Orman ekimi"],
    correct: 1
  },
  {
    q: "Türkiye'nin en uzun nehri hangisidir?",
    options: ["Sakarya", "Kızılırmak", "Fırat"],
    correct: 1
  },
  {
    q: "Doğu Anadolu'da en yaygın ekonomik faaliyet hangisidir?",
    options: ["Turizm", "Hayvancılık", "Balıkçılık"],
    correct: 1
  },
  {
    q: "Fındık üretiminde dünya lideri olan bölge hangisidir?",
    options: ["Karadeniz", "Akdeniz", "Marmara"],
    correct: 0
  }
];

Object.assign(window, { REGIONS_CONTENT, FINAL_QUIZ });
