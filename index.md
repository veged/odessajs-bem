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

### Вводный текст (первый уровень текста)


*  Второй уровень текста
	* Третий уровень текста (буллиты)
	* Третий уровень текста (буллиты)

	1. Четвертый уровень текста

## Заголовок

### Вводный текст (первый уровень текста)
![placeholder](pictures/vertical-placeholder.png){:.right}

*  Второй уровень текста
	* Третий уровень текста (буллиты)
	* Третий уровень текста (буллиты)

	1. Четвертый уровень текста


## Заголовок
{:.with-big-quote}
> Цитата

Текст
{:.note}


## Code Samples JS highlight

{% highlight javascript linenos %}
	var jar,
    rstoreNames = /[^\w]/g,
    storageInfo = window.storageInfo || window.webkitStorageInfo,
    toString = "".toString;

  jar = this.jar = function( name, storage ) {
      return new jar.fn.init( name, storage );
  };

  jar.storages = [];
  jar.instances = {};
  jar.prefixes = {
      storageInfo: storageInfo
  };

{% endhighlight %}

## Code Samples CSS highlight

{% highlight css %}
	/* Code blocks */
	pre[class*="language-"] {
		padding: 1em;
		margin: .5em 0;
		overflow: auto;
		border-radius: 0.3em;
	}
{% endhighlight %}

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
