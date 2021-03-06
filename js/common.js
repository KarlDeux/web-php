/* Plugins, etc, are on top. */

String.prototype.escapeSelector = function()
{
  return this.replace(/(.|#)([ #;&,.+*~\':"!^$\[\]\(\)=>|\/])/g, '$1' + '\\\\$2');
}

String.prototype.toInt = function()
{
  return parseInt(this);
}

/* {{{ Hash Scroll */
var jHtmlBody = $('html, body');
function scroll(target, interval)
{
  if (typeof interval == 'undefined')
    interval = 400;

  var hash = target;
  target = $('[id="' + target.substring(1) + '"]');
  
  var offsetTop = 
    target.offset().top 
    - 52
    - target.css('margin-top').toInt()
  ;

  jHtmlBody.animate(
    {scrollTop: offsetTop}, 
    interval,
    function()
    {
      if (window.location.hash != hash)
      {
        window.location.hash = hash;
        window.scrollTo(0, offsetTop);
      }
    }
  );

  return false;
}
/* }}} */

/** {{{
* jQuery.ScrollTo - Easy element scrolling using jQuery.
* Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
* Dual licensed under MIT and GPL.
* @author Ariel Flesler
* @version 1.4.6
*/
(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,targ,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
/*}}}*/

$(window).load(function()
{
  // Fire our scroll, webkit needs onload
  if (window.location.hash)
  {
    scroll(window.location.hash, 0);
  }
});

$(document).ready(function() {

    // Ugh, cookie handling.
    var cookies = document.cookie.split(";");


    var $docs = $('.docs');
    var $refsect1 = $docs.find('.refentry .refsect1');
    var $docsDivWithId = $docs.find('div[id]');
    $docsDivWithId.children("h1, h2, h3, h4").each(function(){
        $(this).append("<a class='genanchor' href='#" + $(this).parent().attr("id") + "'> ¶</a>");
    });
    
    /**
    var scrollHeightOfHeadnav = - document.getElementById('head-nav').scrollHeight;
    scrollHeightOfHeadnav -= 12; //some margin
    $parameters = $refsect1.filter(".parameters").find(".term .parameter");
    $refsect1.find(".parameter").each(function () {
        var $node = $(this);
        var $nodeText = $node.text();
        if ($nodeText[0].charAt(0) === '$') {
            $nodeText = $nodeText.substring(1);
        }
        $parameters.each(function (idx, param) {
            var $param = $(param);
            if ($param.text() == $nodeText) {
                $node.click(function() {
                    $.scrollTo($param, 600, {'offset':{'top':scrollHeightOfHeadnav}});
                });
            }
        });
    });
    */

    $('.refentry code.parameter').click(function(event)
    {
      var id = $(this).text().replace(/^[&$]{0,2}/g, '');
      var offsetTop = $('.parameters .parameter:contains("' + id + '")').offset().top - 52;
      $.scrollTo({top: offsetTop, left: 0}, 400);
    });

    var $headingsWithIds = $('h1 a[id], h2 a[id], h3 a[id], h4 a[id]');
    $headingsWithIds.each(function(){
        var $this = $(this);
        $this.after("<a class='genanchor' href='#" + $this.attr('id') + "'> ¶</a>")
    });
    $('h1[id], h2[id], h3[id], h4[id]').each(function() {
        var $this = $(this);
        $this.append("<a class='genanchor' href='#" + $this.attr('id') + "'> ¶</a>");
    });

    // Bind events for #[id]
    $(window).on('hashchange', function(e) {
      e.preventDefault();
      return false;
    });

    $('a[href^=#]').click(function(e) {
      e.preventDefault();
      scroll($.attr(this, 'href'), 400);      
      return false;
    });

    var $elephpants = $(".elephpants");
    var $elephpantsImages = $elephpants.find('.images');
    // load the elephpant images if elephpants div is in the dom.
    $elephpantsImages.first().each(function (idx, node) {

        // function to fetch and insert images.
        var fetchImages = function() {

            // determine how many elephpants are required to fill the
            // viewport and subtract for any images we already have.
            var count = Math.ceil($(document).width() / 75)
                      - $elephpantsImages.find("img").length;

            // early exit if we don't need any images.
            if (count < 1) {
                return;
            }

            // do the fetch.
            $.ajax({
                url:      '/images/elephpants.php?count=' + count,
                dataType: 'json',
                success:  function(data) {
                    var photo, image;
                    for (photo in data) {
                        photo = data[photo];
                        link  = $('<a>');
                        link.attr('href',    photo.url);
                        link.attr('title',   photo.title);
                        image = $('<img>');
                        image.attr('src',    'data:image/jpeg;base64,' + photo.data);
                        $(node).append(link.append(image));
                    }
                },
                error:    function() {
                    $elephpants.hide();
                }
            });

        }

        // begin by fetching the images we need now.
        fetchImages();

        // fetch more if viewport gets larger.
        var deferred = null;
        $(window).resize(function() {
            window.clearTimeout(deferred);
            deferred = window.setTimeout(function(){
                fetchImages();
            }, 250);
        });
    });
    
    // We have <p> tags generated with nothing in them and it requires a PHD change, meanwhile this fixes it.
    $refsect1.find('p').each(function() {
        var $this = $(this), html = $this.html();
        if(html !== null && html.replace(/\s|&nbsp;/g, '').length == 0) {
            $this.remove();
        }
    });

/*{{{ Scroll to top */
    (function() {
        var settings = {
            text: 'To Top',
            min: 200,
            inDelay:600,
            outDelay:400,
            containerID: 'toTop',
            containerHoverID: 'toTopHover',
            scrollSpeed: 400,
            easingType: 'linear'
        };
        var containerIDhash = '#' + settings.containerID;
        var containerHoverIDHash = '#'+settings.containerHoverID;

        $('body').append('<a href="#" id="'+settings.containerID+'" onclick="return false;"><img src="/images/to-top@2x.png" width="40" height="40" alt="'+settings.text+'"/></a>');
        $(containerIDhash).hide().click(function(){
            $('html, body').animate({scrollTop:0}, settings.scrollSpeed, settings.easingType);
            $('#'+settings.containerHoverID, this).stop().animate({'opacity': 0 }, settings.inDelay, settings.easingType);
            return false;
        })
        .prepend('<span id="'+settings.containerHoverID+'"></span>')
        .hover(function() {
            $(containerHoverIDHash, this).stop().animate({
                'opacity': 1
            }, 600, 'linear');
        }, function() {
            $(containerHoverIDHash, this).stop().animate({
                'opacity': 0
            }, 700, 'linear');
        });

        $(window).scroll(function() {
            var sd = $(window).scrollTop();
            if (typeof document.body.style.maxHeight === "undefined") {
                $(containerIDhash).css({
                    'position': 'absolute',
                    'top': $(window).scrollTop() + $(window).height() - 50
                });
            }
            if ( sd > settings.min ) {
                $(containerIDhash).fadeIn(settings.inDelay);
            } else {
                $(containerIDhash).fadeOut(settings.outDelay);
            }
        });    

    })();
/*}}}*/

/*{{{User Notes*/
    $("#usernotes a.usernotes-voteu, #usernotes a.usernotes-voted").each(
    function () {
      $(this).click(
        function (event) {
          event.preventDefault();
          var url = $(this).attr("href");
          var id = url.match(/\?id=(\d+)/)[1];
          var request = $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            headers: {"X-Json": "On" },
            beforeSend: function() {
              $("#Vu"+id).hide();
              $("#Vd"+id).hide();
              $("#V"+id).html("<img src=\"/images/working.gif\" alt=\"Working...\" border=\"0\" title=\"Working...\" />");
            }
          });
          request.done(function(data) {
            if(data.success != null && data.success == true) {
              $("#V"+id).html("<div style=\"float: left; width: 16px; height: 16px; background-image: url(/images/notes-features.png); background-position:-32px 16px; margin-right: 8px; overflow: hidden;\" border=\"0\" alt=\"success\" title=\"Thank you for voting!\"></div>" + data.update);
            }
            else {
              var responsedata = "Error :(";
              if (data.msg != null) {
                responsedata = data.msg;
              }
              $("#V"+id).html("<div style=\"float: left; width: 16px; height: 16px; background-image: url(/images/notes-features.png); background-position:-32px 0px; margin-right: 8px; overflow: hidden;\" border=\"0\" alt=\"fail\" title=\"" + responsedata + "\"></div>");
            }
          });
          request.fail(function(jqXHR, textStatus) {
            $("#Vu"+id).show();
            $("#Vd"+id).show();
            $("#V"+id).html("<div style=\"float: left; width: 16px; height: 16px; background-image: url(/images/notes-features.png); background-position:-32px 0px; margin-right: 8px; overflow: hidden;\" border=\"0\" alt=\"fail\" title=\"Error :(\"></div>");
          });
          request.always(function(data) {
            $("#V"+id).fadeIn(500, "linear");
          });
        }
      );
    }
    );
/*}}}*/

    // Search box autocomplete.
    jQuery("#topsearch .search-query").search({
        language: getLanguage(),
        limit: 3
    });
    
});

/**
 * Determine what language to present to the user.
 */
function getLanguage()
{
    return document.documentElement.lang;
}

// vim: set ts=4 sw=4 et:
