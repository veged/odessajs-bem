---

layout: default

title: Название темы

---

# <span>Яндекс</span> {#splash}

## **{{ page.title }}** {#cover}
<div class="service">Сервис</div>
<div class="nda"></div>

<div class="info">
	<p class="author">{{ site.author.name }}, <br/> {{ site.author.position }}</p>
</div>

## Название темы
{:.section}

### Название раздела

<div class="down-arrow"></div>

## Заголовок
{:.introductory}

### Вводный текст (первый уровень текста)


*  Второй уровень текста
	* Третий уровень текста (буллиты)
	* Третий уровень текста (буллиты)

	1. Четвертый уровень текста

## Заголовок
{:.introductory}

### Вводный текст (первый уровень текста)


*  Второй уровень текста
	* Третий уровень текста (буллиты)
	* Третий уровень текста (буллиты)

	1. Четвертый уровень текста

![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

## Plain Text on Your Slides

Lorem ipsum dolor sit amet, consectetur [adipisicing](#all-kind-of-lists) elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, *quis nostrud* exercitation ullamco laboris **nisi ut aliquip** ex ea commodo consequat. Duis aute irure <i>dolor</i> in reprehenderit in voluptate velit esse cillum <b>dolore</b> eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in `<culpa>` qui officia deserunt mollit anim id est laborum.


## Serious Citations

<figure markdown="1">

> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.

<figcaption>Marcus Tullius Cicero</figcaption>
</figure>

## Code Samples

	<!DOCTYPE html>
	<html lang="en">
	<mark><head></mark> <mark class="comment"><!--Comment--></mark>
		<title>Shower</title>
		<meta charset="<mark class="important">UTF-8</mark>">
		<link rel="stylesheet" href="screen.css">
	<mark></head></mark>

## Code Samples HTML highlight

{:.language-markup}
	<!DOCTYPE html>
	<html lang="en">
	<head> <!--Comment-->
		<title>Shower</title>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="screen.css">
	</head>

## Code Samples JS highlight

{:.language-javascript .line-numbers}
	function log(data) {
	  var props = [];
	  for (var key in data) {
		var value = encodeURIComponent(data[key]);
		props.push(encodeURIComponent(key) + '=' + value);
	  }
	  new Image().src = '/log?' + props.join('&');
	}

## Code Samples CSS highlight

{:.language-css}
	/* Code blocks */
	pre[class*="language-"] {
		padding: 1em;
		margin: .5em 0;
		overflow: auto;
		border-radius: 0.3em;
	}

## Even Tables

<!-- Need to add row `th` somehow -->

|  Locavore      | Umami       | Helvetica | Vegan     |
+----------------|-------------|-----------|-----------+
|* Fingerstache *| Kale        | Chips     | Keytar    |
|* Sriracha     *| Gluten-free | Ennui     | Keffiyeh  |
|* Thundercats  *| Jean        | Shorts    | Biodiesel |
|* Terry        *| Richardson  | Swag      | Blog      |

It’s good to have information organized.

## Pictures
{:.cover #Picture}

![](pictures/picture.jpg)
<!-- photo by John Carey, fiftyfootshadows.net -->

## **You can even shout this way**

## Inner Navigation

1. Lets you reveal list items one by one
2. …To keep some key points
3. …In secret from audience
4. …But it will work only once
5. …Nobody wants to see the same joke twice

## ![](http://shwr.me/pictures/logo.svg) [See more on GitHub](https://github.com/shower/shower/)
{:.shout #SeeMore}

## **Спасибо!** {#thanks}

<div class="info">
	<p class="author">{{ site.author.name }}</p>
</div>
