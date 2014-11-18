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

## &nbsp;
{:.with-big-quote}
> Цитата

Текст
{:.note}

## Code Samples CSS highlight

~~~ markup
<h1>Yandex</h1>
~~~

## Code Samples JavaScript highlight

~~~ javascript
!function() {
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

    jar.prototype = this.jar.fn = {
        constructor: jar,

        version: 0,

        storages: [],
        support: {},

        types: [ "xml", "html", "javascript", "js", "css", "text", "json" ],

        init: function( name, storage ) {

            // Name of a object store must contain only alphabetical symbols or low dash
            this.name = name ? name.replace( rstoreNames, "_" ) : "jar";
            this.deferreds = {};

            if ( !storage ) {
                this.order = jar.order;
            }

            // TODO – add support for aliases
            return this.setup( storage || this.storages );
        },

        // Setup for all storages
        setup: function( storages ) {
            this.storages = storages = storages.split ? storages.split(" ") : storages;

            var storage,
                self = this,
                def = this.register(),
                rejects = [],
                defs = [];

            this.stores = jar.instances[ this.name ] || {};

            // Jar store meta-info in lc, if we don't have it – reject call
            if ( !window.localStorage ) {
                window.setTimeout(function() {
                    def.reject();
                });
                return this;
            }

            // Initiate all storages that we can work with
            for ( var i = 0, l = storages.length; i < l; i++ ) {
                storage = storages[ i ];

                // This check needed if user explicitly specified storage that
                // he wants to work with, whereas browser don't implement it
                if ( jar.isUsed( storage ) ) {

                    // If jar with the same name was created, do not try to re-create store
                    if ( !this.stores[ storage ] ) {

                        // Initiate storage
                        defs.push( this[ storage ]( this.name, this ) );

                        // Initiate meta-data for this storage
                        this.log( storage );
                    }

                } else {
                    rejects.push( storage );
                }
            }

            if ( !this.order ) {
                this.order = {};

                for ( i = 0, l = this.types.length; i < l; i++ ) {
                    this.order[ this.types[ i ] ] = storages;
                }
            }

            if ( rejects.length == storages.length ) {
                window.setTimeout(function() {
                    def.reject();
                });

            } else {
                jar.when.apply( this, defs )
                    .done(function() {
                        jar.instances[ this.name ] = this.stores;

                        window.setTimeout(function() {
                            def.resolve([ self ]);
                        });
                    })
                    .fail(function() {
                        def.reject();
                    });
            }
            return this;
        }
    };

    jar.fn.init.prototype = jar.fn;

    jar.has = function( base, name ) {
        return !!jar.fn.meta( name, base.replace( rstoreNames, "_" ) );
    };
}.call( window );
~~~

## Code Samples CSS highlight

~~~ css
    /* Code blocks */
    pre[class*="language-"] {
        padding: 1em;
        margin: .5em 0;
        overflow: auto;
        border-radius: 0.3em;
    }
~~~

## Заголовок
{:.images}

![](pictures/horizontal-placeholder.png)
*Текст*

![](pictures/horizontal-placeholder.png)
*Текст*

![](pictures/horizontal-placeholder.png)
*Текст*

## Заголовок
{:.images .two}

![](pictures/horizontal-middle-placeholder.png)
*Текст*

![](pictures/horizontal-middle-placeholder.png)
*Текст*

## Заголовок
{:.center}

![](pictures/horizontal-big-placeholder.png)

## **![](pictures/cover-placeholder.png)**

## ![](pictures/horizontal-cover-placeholder.png)
{:.cover}

## Even Tables

<!-- Need to add row `th` somehow -->

|  Locavore      | Umami       | Helvetica | Vegan     |
+----------------|-------------|-----------|-----------+
| Fingerstache   | Kale        | Chips     | Keytar    |
| Sriracha       | Gluten-free | Ennui     | Keffiyeh  |
| Thundercats    | Jean        | Shorts    | Biodiesel |
| Terry          | Richardson  | Swag      | Blog      |
+----------------|-------------|-----------|-----------+
| Terry          | Richardson  | Swag      | Blog      |

## **Контакты** {#contacts}

<div class="info">
    <p class="author">{{ site.author.name }}</p>
    <p class="position">{{ site.author.position }}</p>

    <div class="contacts">
        <p class="phone">+7 (000) 000-00-00</p>
        <p class="twitter">@twitter</p>
        <p class="mail">почта@yandex-team.ru</p>
        <!-- <p class="vk">vk</p> -->
        <p class="facebook">facebook</p>
    </div>
</div>
