window.addEventListener('DOMContentLoaded', () => {

let menuBtn = document.querySelector('.menu-btn');
let menu = document.querySelector('.menu');



menuBtn.addEventListener('click', function(){
	menuBtn.classList.toggle('active');
	menu.classList.toggle('active');
    //document.body.style.overflow = 'hidden';

   if (menuBtn.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
   }else {
        document.body.style.overflow = '';
   }
})

menu.addEventListener('click', (e) => {
    if (e.target === menu) {
        menu.classList.remove('active');
        menuBtn.classList.remove('active');  
        document.body.style.overflow = '';              
    }
});

//---------------------//

let dollarShow = document.querySelector(".kurs-usa");
let euroShow = document.querySelector(".kurs-euro");
let poundShow = document.querySelector(".kurs-pound");
let zlShow = document.querySelector(".kurs-zl");


function show (event) {
    //event.preventDefault(); 

    let apiUrl = `https://api.monobank.ua/bank/currency`;

    axios.get(apiUrl)
    .then(function (response) {

      
      let dataDollar = response.data[0];
      let dataEuro = response.data[1];
      let dataPound = response.data[3];
      let dataZl = response.data[82];

      let dollar = dataDollar.rateSell;
      let euro = dataEuro.rateSell;
      let pound = dataPound.rateCross;
      let zl = dataZl.rateCross;

 /*     console.log(euro);
      console.log(pound);
      console.log(zl);
      console.log(dollar*1.002); */

      dollarShow.innerHTML = (dollar*1.002).toFixed(2);
      euroShow.innerHTML = (euro*1.002).toFixed(2);
      poundShow.innerHTML = (pound+1).toFixed(2);
      zlShow.innerHTML = (zl*1.08).toFixed(2);


      console.log(response.data);
    });
}
show()







//---------------------//

/*class MenuCard {
    constructor(src, descrFirst, descrSecond, descrThird, parentSelector) {
        
        this.src = src;
        this.descrFirst = descrFirst;
        this.descrSecond = descrSecond;    
        this.descrThird = descrThird; 
        this.parent = document.querySelector(parentSelector);      
    }
  
    render() {
        const element = document.createElement('div');
        element.innerHTML = `
            <div class="shops__about-card">
                <div class="shops__info-img"><img src=${this.src} alt=""></div>
                <div class="shops__about-info">                                
                    <div class="shops__info-text">
                        <ul class="shops__info-list" id="items">
                            <li class="shops__info-item">${this.descrFirst}.</li>
                            <li class="shops__info-item">${this.descrSecond}.</li>
                            <li>${this.descrThird}.</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    this.parent.append(element);
    }
}
new MenuCard (
    "img/h-m.svg",
    'Шведський бренд одягу та косметики',
    'Відмінною рисою якого є модний та якісний одяг за доступними цінами',
    'В ассортіменті є: жіночий, чоловічий, дитячий одяг, а також товари для дому',
    '.shops__about'
).render();

new MenuCard (
    "img/zara-logo.svg",
    'Торгівельна мережа групи компаній Inditex Group',
    'Завжди дуже швидко реагує на сучасні тенденції',
    'Надає широкий вибір різноманітного одягу для чоловіків, жінок і дітей. А також товари для дому',
    '.shops__about'
).render();

new MenuCard (
    "img/mango.svg",
    'Популярний іспанський бренд',
    'Відмінною рисою якого є дотримання принципів зручності, актуальності та природності',
    'Спеціалізується на виробництві одягу, взуття та аксесуарів для жінок, чоловіків і дітей.',
    '.shops__about'
).render();

new MenuCard (
    "img/kiko-milano-logo.png",
    'Бренд декоративної косметики №1 в Італії',
    'Продукти бренду виготовлені з безпечної сертифікованої сировини',
    'В асортименті є сотні кольорів і текстур для сміливих експериментів з макіяжем',
    '.shops__about'
).render();

new MenuCard (
    "img/lidl.svg",
    'Найбільша мережа супермаркетів-дискаунтерів у Європі',
    'Акції, в рамках яких можна заощадити до 50-80%',
    'Можна знайти будь-що: від продуктів харчування до садового інвентарю.',
    '.shops__about'
).render();

new MenuCard (
    "img/George.svg",
    'Англійська торгова марка',
    'Доступний ціновий діапазон, знаходиться в сегменті «Mass market»',
    'Спеціалізується на виробництві одягу для жінок, чоловіків і дітей.',
    '.shops__about'
).render(); */
//---------------------//









});