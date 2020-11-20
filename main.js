'use strict';

const selectCities = document.getElementById('select-cities'),
    dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
    dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
    dropdownAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
    dropdownLists = document.querySelector('.dropdown-lists'),
    button = document.querySelector('.button'),
    btnClose = document.querySelector('.close-button'),
    cookie = document.cookie.split('; ')[0].split('=');

dropdownDefault.style.display = 'none';
dropdownSelect.style.display = 'none';
dropdownAutocomplete.style.display = 'none';

let data = '';

const setCookie = (cname, cvalue, exdays = 1) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

const getData = () => {
    data = JSON.parse(localStorage.getItem('data'));
    filtered().sortCountry();

    if(localStorage.getItem('reload') === 'true'){
        localStorage.setItem('reload', false);
        location.href = location.href;
    }
};

const getDataFromServer = (url) => {

    const local = cookie[1] ? cookie[1] : prompt('Введите локаль: '),
        loader = document.querySelector('.loader');

    setCookie('local', local); 

    loader.style.display = 'block';
    setTimeout(() => {
        fetch(url)
        .then(response => response.json())
        .then(result => {
            localStorage.setItem('data', JSON.stringify(result[local]));
            localStorage.setItem('reload', true);
            loader.style.display = 'none';
        })
        .then(() => getData())
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

    const sortCountryArray = () => {
        const local = cookie[1],
            newData = [];
        local === 'RU' ? newData.push(data[0], data[1], data[2]) :
        local === 'EN' ? newData.push(data[2], data[1], data[0]) :
        local === 'DE' ? newData.push(data[1], data[2], data[0]) : '';

        data = newData;
    };

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
        search: search,
        sortCountry: sortCountryArray
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

if(!localStorage.getItem('data')|| !cookie[1]){
    getDataFromServer('./db_cities.json');
}
getData();

