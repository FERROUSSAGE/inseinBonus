'use strict';

const selectCities = document.getElementById('select-cities'),
    dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
    dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
    dropdownAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
    dropdownLists = document.querySelector('.dropdown-lists'),
    button = document.querySelector('.button'),
    btnClose = document.querySelector('.close-button');

dropdownDefault.style.display = 'none';
dropdownSelect.style.display = 'none';
dropdownAutocomplete.style.display = 'none';

const data = [
    {
        "country": "Россия",
        "count": "144500000",
        "cities": [
            {
                "name": "Рязань",
                "count": "538962",
                "link": "https://ru.wikipedia.org/wiki/%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%8C"
            },
            {
                "name": "Москва",
                "count": "12615882",
                "link": "https://ru.wikipedia.org/wiki/%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0"
            },
            {
                "name": "Санкт-Петербург",
                "count": "5383968",
                "link": "https://ru.wikipedia.org/wiki/%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3"
            },
            {
                "name": "Краснодар",
                "count": "918145",
                "link": "https://ru.wikipedia.org/wiki/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B4%D0%B0%D1%80"
            },
            {
                "name": "Екатеринбург",
                "count": "1484456",
                "link": "https://ru.wikipedia.org/wiki/%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3"
            },
            {
                "name": "Ростов-на-Дону",
                "count": "1130305",
                "link": "https://ru.wikipedia.org/wiki/%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83"
            },
            {
                "name": "Воронеж",
                "count": "1054537",
                "link": "https://ru.wikipedia.org/wiki/%D0%92%D0%BE%D1%80%D0%BE%D0%BD%D0%B5%D0%B6"
            }
        ]

    },
    {
        "country": "Германия",
        "count": 82175684 ,
        "cities": [
            {
                "name": "Берлин",
                "count": "3613495",
                "link": "https://ru.wikipedia.org/wiki/%D0%91%D0%B5%D1%80%D0%BB%D0%B8%D0%BD"
            },
            {
                "name": "Мюнхен",
                "count": "1456039",
                "link": "https://ru.wikipedia.org/wiki/%D0%9C%D1%8E%D0%BD%D1%85%D0%B5%D0%BD"
            },
            {
                "name": "Франкфурт-на-Майне",
                "count": "736414",
                "link": "https://ru.wikipedia.org/wiki/%D0%A4%D1%80%D0%B0%D0%BD%D0%BA%D1%84%D1%83%D1%80%D1%82-%D0%BD%D0%B0-%D0%9C%D0%B0%D0%B9%D0%BD%D0%B5"
            },
            {
                "name": "Кёльн",
                "count": "1080394",
                "link": "https://ru.wikipedia.org/wiki/%D0%9A%D1%91%D0%BB%D1%8C%D0%BD"
            }
        ]
    },
    {
        "country": "Англия",
        "count": 53012456,
        "cities": [
            {
                "name": "Лондон",
                "count": " 8869898",
                "link": "https://ru.wikipedia.org/wiki/%D0%9B%D0%BE%D0%BD%D0%B4%D0%BE%D0%BD"
            },
            {
                "name": "Манчестер",
                "count": "545500",
                "link": "https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D0%BD%D1%87%D0%B5%D1%81%D1%82%D0%B5%D1%80"
            },
            {
                "name": "Эдинбург",
                "count": "488100",
                "link": "https://ru.wikipedia.org/wiki/%D0%AD%D0%B4%D0%B8%D0%BD%D0%B1%D1%83%D1%80%D0%B3"
            },
            {
                "name": "Бристоль",
                "count": "567111",
                "link": "https://ru.wikipedia.org/wiki/%D0%91%D1%80%D0%B8%D1%81%D1%82%D0%BE%D0%BB%D1%8C"
            }
        ]

    }
]


const generateContent = (data, selector, step) => {
    const dropdownCol = document.querySelector(selector);

    data.forEach((item) => {
        const countryBlock = document.createElement('div');
        countryBlock.classList.add('dropdown-lists__countryBlock');
        countryBlock.dataset.country = item.country;

        let content = '';
        if(item.country){
            content = `
            <div class="dropdown-lists__total-line">
                <div class="dropdown-lists__country">${item.country}</div>
                <div class="dropdown-lists__count">${item.count}</div>
            </div>
            `;
        }
        if(item.cities){
            item.cities.forEach((city, i) => {
                if(i >= step) return;
                content += `
                <div class="dropdown-lists__line">
                    <div class="dropdown-lists__city" data-link=${city.link}>${city.name}</div>
                    <div class="dropdown-lists__count">${city.count}</div>
                </div>
                `;
            });
        } else {
            content += `
            <div class="dropdown-lists__line" data-link=${item.link}>
                <div class="dropdown-lists__city">${item.name}</div>
                <div class="dropdown-lists__count">${item.count}</div>
            </div>
            `;
        }

        countryBlock.innerHTML = content;
        dropdownCol.append(countryBlock);
    });
};

const filtered = () => {

    const search = (value) => {
        const newData = [];
        data.forEach(item => {
            if(!item.country.toLowerCase().indexOf(value.toLowerCase())){
                newData.push(item);
            }
            item.cities.forEach(city => {
                if(!city.name.toLowerCase().indexOf(value.toLowerCase())){
                    newData.push(city);
                }
            });
        });
        if(newData.length === 0){
            newData.push({
                name: 'Ничего не найдено!',
                count: ''
            });
        }
        return newData;
    };

    const sortCountry = (country) => {
        const newData = [];
        data.forEach(item => {
            if(item.country !== country) return;
            newData.push(item);
        });
        return newData;
    };

    const sortCount = () => {
        const newData = data;
        newData.cities = [];

        newData.forEach((item) => {
            newData.cities.push(item.cities.sort((a, b) => b.count - a.count));
        });
        return newData;
    };

    return {
        count: sortCount,
        country: sortCountry,
        search: search
    };
};

const putDataInput = (value) => {
    btnClose.style.display = 'block';

    selectCities.focus();
    selectCities.value = value;
};

selectCities.addEventListener('click', (e) => {
    document.querySelector('.dropdown-lists__col').innerHTML = '';

    dropdownDefault.style.display = 'block';
    dropdownSelect.style.display = 'none';
    dropdownAutocomplete.style.display = 'none';

    generateContent(filtered().count(),'.dropdown-lists__list--default > .dropdown-lists__col', 3);
});

selectCities.addEventListener('input', (e) => {
    const target = e.target;
    
    document.querySelector('.dropdown-lists__list--autocomplete > .dropdown-lists__col').innerHTML = '';

    if(target.value !== ''){
        dropdownDefault.style.display = 'none';
        dropdownSelect.style.display = 'none';
        dropdownAutocomplete.style.display = 'block';

        generateContent(filtered().search(target.value), '.dropdown-lists__list--autocomplete > .dropdown-lists__col');
    } else {
        dropdownDefault.style.display = 'block';
        dropdownSelect.style.display = 'none';
        dropdownAutocomplete.style.display = 'none';

        btnClose.style.display = 'none';
    }
});

dropdownLists.addEventListener('click', (e) => {
    const target = e.target,
        country = target.closest('.dropdown-lists__countryBlock').dataset.country;

    if(target.closest('.dropdown-lists__line > .dropdown-lists__city')){
        button.href = target.dataset.link;
        putDataInput(target.textContent);
    }
    if(target.closest('.dropdown-lists__list--default > div > div > .dropdown-lists__total-line')){
        dropdownDefault.style.display = 'none';
        dropdownSelect.style.display = 'block';
        generateContent(filtered().country(country), '.dropdown-lists__list--select > .dropdown-lists__col');

        putDataInput(country);
    }
    if(target.closest('.dropdown-lists__list--select > div > div > div.dropdown-lists__total-line')){
        dropdownSelect.style.display = 'none';
        dropdownDefault.style.display = 'block';

        selectCities.value = '';
        target.closest('.dropdown-lists__col').innerHTML = '';
    }
});

btnClose.addEventListener('click', () => {
    selectCities.value = '';
    dropdownDefault.style.display = 'none';
    dropdownSelect.style.display = 'none';
    dropdownAutocomplete.style.display = 'none';

    btnClose.style.display = 'none';
});
button.addEventListener('click', () => selectCities.value = '');
