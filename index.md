---

layout: default

---

# Яндекс

## **{{ site.presentation.title }}** {#cover}

<div class="s">
    <div class="service">{{ site.presentation.service }}</div>
</div>

{% if site.presentation.nda %}
<div class="nda"></div>
{% endif %}

<div class="info">
	<p class="author">{{ site.author.name }}, <br/> {{ site.author.position }}</p>
</div>

## Слайды
{:.with-big-quote}

> [bit.ly/odessajs2015-bem](https://bit.ly/odessajs2015-bem)

будет много ссылок
{:.note}

## Мастер-класс: строим сервис по БЭМ
{:.section}

### Используем БЭМ

## Для тех, кто ничего не знает про БЭМ
{:.code-with-text}

* [Начало](https://ru.bem.info/method/definitions/)
* [Вебинар с самых азов](https://ru.bem.info/talks/beminar-css-2015/)
* [Видео с прошлого выступления на OdessaJS](https://ru.bem.info/talks/bem-odessajs-2014/)
* [Форум](https://ru.bem.info/forum/)

~~~markup
                      __
                     /  \        ______________
                     |  |       /               \
                     @  @       | It looks      |
                     || ||      | like you      |
                     || ||   <--| are nterested |
                     |\_/|      | in BEM.       |
                     \___/      \______________ /

~~~

## Мастер-класс: строим сервис по БЭМ
{:.section}

### Используем БЭМ<br/>в существующем коде

## Мастер-класс: строим сервис по БЭМ
{:.section}

### Используем БЭМ<br/>в существующем коде<br/>на примере Material Design Lite

## &nbsp;
{:.section}

### Material Design Lite

## &nbsp;
{:.with-big-quote}
> Create a visual language that synthesizes classic principles of good design with the innovation and possibility of technology and science.

google.com/design/spec/material-design/introduction.html
{:.note}

## &nbsp;
{:.with-big-quote}
> Гугл делает «убийцу Бутстрапа», внутри БЭМ... БЭМ, Карл!

из внутренней переписки Яндекса
{:.note}

## Material Design Lite

### Смотрим внутрь

* [Сайт](http://www.getmdl.io)
* [Код](https://github.com/google/material-design-lite)
    * [src/](https://github.com/google/material-design-lite/tree/master/src)
        * блоки ([button](https://github.com/google/material-design-lite/tree/master/src/button), [menu](https://github.com/google/material-design-lite/tree/master/src/menu))
        * «не блоки» ([_variables.scss](https://github.com/google/material-design-lite/blob/master/src/_variables.scss), [mdlComponentHandler.js](https://github.com/google/material-design-lite/blob/master/src/mdlComponentHandler.js))
    * порядок сборки
        * CSS: [src/material-design-lite.scss](https://github.com/google/material-design-lite/blob/master/src/material-design-lite.scss)
        * JS: [gulpfile.js](https://github.com/google/material-design-lite/blob/master/gulpfile.js#L195)

## Material Design Lite

### Смотрим внутрь

* [шаблоны страниц](https://github.com/google/material-design-lite/tree/master/templates)
    * [HTML](https://github.com/google/material-design-lite/blob/master/templates/text-only/index.html)
    * [CSS](https://github.com/google/material-design-lite/blob/master/templates/text-only/styles.css)


## &nbsp;
{:.section}

### BEM Project Stub


## BEM Project Stub
{:.code-with-text}

### Смотрим внутрь

* [Описание](https://ru.bem.info/tutorials/project-stub/)
* [Код](https://github.com/bem/project-stub)
    * *.blocks
    * *.bundles
    * сборка: [.enb/make.js](https://github.com/bem/project-stub/blob/bem-core/.enb/make.js)


## BEM Project Stub
{:.code-with-text}

### Смотрим внутрь

* [Описание](https://ru.bem.info/tutorials/project-stub/)
* [Код](https://github.com/bem/project-stub)
    * *.blocks
    * *.bundles
    * сборка: [.enb/make.js](https://github.com/bem/project-stub/blob/bem-core/.enb/make.js)

~~~clike
     (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
~~~

## &nbsp;
{:.with-big-quote}
> [Как устроены БЭМ-проекты](https://ru.bem.info/tools/bem/enb-bem-techs/bem-project/)

новая документация
{:.note}


## Material Design Lite
{:.section}

### Что можно изменить

## Что можно изменить

* Блоки и страницы на файловой системе ⓵

## Что можно изменить

* Блоки и страницы на файловой системе ⓵
* Сборка только нужного ⓸

## Что можно изменить

* Блоки и страницы на файловой системе ⓵
* Сборка только нужного ⓸
    * Вспомогательный код в виде блоков ⓶

## Что можно изменить

* Блоки и страницы на файловой системе ⓵
* Сборка только нужного ⓸
    * Вспомогательный код в виде блоков ⓶
    * Зависимости между блоками ⓷


## &nbsp;
{:.with-big-quote}
> [Подробно про формат *.deps.js](https://ru.bem.info/technology/deps/about/)

новая документация
{:.note}

## &nbsp;
{:.with-big-quote}
> &nbsp;…но зачем?

история про буханку и троллейбус
{:.note}

## «…но зачем?»
{:code-with-text}

* Оптимизация размера
* Точечные переопределения

~~~clike
      ᕦ(ò_óˇ)ᕤ
~~~

## Точечные переопределения
{:.code-with-text}

pages/text-only/blocks/mdl-color-definitions/mdl-color-definitions.scss

~~~scss
$color-primary: $palette-pink-500 !default;
$color-primary-dark: $palette-pink-700 !default;
~~~

## Material Design Lite
{:.section}

### Что ещё можно изменить

## Что ещё можно изменить
{:.code-with-text}

Пристальный взгляд Фрая

~~~markup
<ul class="mdl-menu mdl-menu--bottom-right">
    <li class="mdl-menu__item">Lorem</li>
    <li class="mdl-menu__item">Ipsum</li>
</ul>
~~~

## Что ещё можно изменить
{:.code-with-text}

Ничего не напоминает?

~~~markup
<ul style="background-color: green" class="mdl-menu mdl-menu--bottom-right">
    <li style="color: red" class="mdl-menu__item">Lorem</li>
    <li style="color: red" class="mdl-menu__item">Ipsum</li>
</ul>
~~~

~~~clike
     (ノಠ益ಠ)ノ彡┻━┻
~~~

## Что ещё можно изменить
{:.code-with-text}

CSS

~~~scss
.mdl-menu {
    background-color: green;

    &__item {
        color: red;
    }
}
~~~

HTML

~~~
mdl-menu tag ul
    __item tag li
~~~


## Что ещё можно изменить
{:.code-with-text}

CSS

~~~scss
.mdl-menu {
    background-color: green;

    &__item {
        color: red;
    }
}
~~~

BEMHTML ⓹

~~~javascript
block('mdl-menu')(
    tag()('ul'),
    elem('item').tag()('li')
)
~~~

## Что ещё можно изменить
{:.code-with-text}

BEMHTML ⓹

~~~javascript
block('mdl-menu')(
    tag()('ul'),
    elem('item').tag()('li')
)
~~~

BEMJSON ⓹

~~~javascript
{
    block: 'mdl-menu',
    mods: { 'bottom-right': true },
    content: [
        { elem: 'item', content: 'Lorem' },
        { elem: 'item', content: 'Ipsum' }
    ]
}
~~~

## BEMHTML+BEMJSON

* [Доклад «BEMHTML. NOT yet another шаблонизатор»](https://events.yandex.ru/lib/talks/43/)
* [BEMHTML: документация](https://ru.bem.info/technology/bemhtml/current/rationale/)
* [BEMJSON: документация](https://ru.bem.info/technology/bemjson/)
* [Превращаем HTML в BEMJSON](https://github.com/bem-incubator/html2bemjson) (проект из [БЭМ-инкубатора](https://github.com/bem-incubator/))

~~~clike
     ☜( ಠ‿↼ )☞
~~~


## Material Design Lite
{:.section}

### A ещё?

## A ещё?

Автоматическое построение сайта библиотеки блоков ⓺:

* документация: Markdown, JSDoc
* «живые» примеры
* тесты

Для примера: [bem-components](https://ru.bem.info/libs/bem-components)


## Используем БЭМ
{:.section}

### в существующем коде



## &nbsp;
{:.section}

### Заключение

## Заключение

* можно <s>грабить корованы</s> делать свои библиотеки
* это не так уж <s>сложно</s> страшно ;-)

## Заключение

* можно <s>грабить корованы</s> делать свои библиотеки
* это не так уж <s>сложно</s> страшно ;-)

~~~markup
                      __
                     /  \        ______________
                     |  |       /               \
                     @  @       | It looks      |
                     || ||      | like you      |
                     || ||   <--| are nterested |
                     |\_/|      | in BEM.       |
                     \___/      \______________ /

~~~

## **Контакты** {#contacts}

<div class="info">
<p class="author">{{ site.author.name }}</p>
<p class="position">{{ site.author.position }}</p>

    <div class="contacts">
        <p class="contacts-left github">github.com/veged</p>
        <p class="contacts-left contacts-top mail">veged@yandex-team.ru</p>
        <p class="contacts-right twitter">@veged</p>
        <!-- <p class="contacts-right contacts-bottom vk">vk</p> -->
        <p class="contacts-right contacts-top facebook">veged</p>
    </div>
</div>
