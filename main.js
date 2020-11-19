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

let data = [],
    id = '';

const getData = (url) => {

    const loader = document.querySelector('.loader');
    loader.style.display = 'block';

    setTimeout(() => {
        fetch(url)
        .then(response => response.json())
        .then(result => {
            data = result.RU;
            loader.style.display = 'none';
        })
        .catch(err => {
            throw new Error(err);
        });
    }, 1000)
};

const generateContent = (data, selector, step) => {
    const dropdownCol = document.querySelector(selector);

    data.forEach((item) => {
        const countryBlock = document.createElement('div');
        countryBlock.classList.add('dropdown-lists__countryBlock');
        countryBlock.dataset.country = item.country;

        let content = '',
            word = '';
        if(item.country){
            content = `
            <div class="dropdown-lists__total-line">
                <div class="dropdown-lists__country">${
                    item.country.split('').forEach((key, i) => {
                        if(i < item.nameLength){
                            word += `<span style='background-color:red'>${key}</span>`;
                        } else {
                            word += key;
                        }
                    }), word}
                </div>
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
        } else if(item){
            content += `
            <div class="dropdown-lists__line" data-link=${item.link}>
                <div class="dropdown-lists__city">${
                    item.name.split('').forEach((key, i) => {
                        if(i < item.nameLength){
                            word += `<span style='color: green'>${key}</span>`;
                        } else {
                            word += key;
                        }
                    }), word}
                </div>
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
        const newData = [],
            valueLength = value.length;
        data.forEach(item => {
            if(!item.country.toLowerCase().indexOf(value.toLowerCase())){
                newData.push({
                    'country': item.country,
                    'count': item.count,
                    'cities': item.cities,
                    'nameLength': valueLength
                });
            }
            item.cities.forEach(city => {
                if(!city.name.toLowerCase().indexOf(value.toLowerCase())){
                    newData.push({
                        'name': city.name,
                        'count': city.count,
                        'link': city.link,
                        'nameLength': valueLength
                    });
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

    let count = 0;

    if(target.closest('.dropdown-lists__line > .dropdown-lists__city')){
        button.href = target.dataset.link;
        putDataInput(target.textContent);
    }

    if(target.closest('.dropdown-lists__list--default > div > div > .dropdown-lists__total-line')){
        const animate = () => {
            count += 5;
            dropdownDefault.style.transform = `translateX(${count}%)`;
            if(count < 100){
                requestAnimationFrame(animate)
            } else if( count === 100){
                dropdownDefault.style.display = 'none';
                dropdownSelect.style.display = 'block';
                dropdownDefault.style.transform = `translateX(0)`;
            }
        };

        requestAnimationFrame(animate);

        generateContent(filtered().country(country), '.dropdown-lists__list--select > .dropdown-lists__col');

        putDataInput(country);
    }

    if(target.closest('.dropdown-lists__list--select > div > div > div.dropdown-lists__total-line')){
        const animate = () => {
            count -= 5;
            dropdownSelect.style.transform = `translateX(${count}%)`;
            if(count > -100){
                requestAnimationFrame(animate)
            }
            if(count === -100){
                dropdownSelect.style.display = 'none';
                dropdownDefault.style.display = 'block';
                target.closest('.dropdown-lists__col').innerHTML = '';
                dropdownSelect.style.transform = `translateX(0)`;
            }
        };

        requestAnimationFrame(animate);
        selectCities.value = '';
        btnClose.style.display = 'none';

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

getData('./db_cities.json');

