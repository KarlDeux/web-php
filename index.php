<?php // vim: et
/*
   If you're reading this, it isn't because you've found a security hole.
   this is an open source website. read and learn!
*/

/* ------------------------------------------------------------------------- */

// Get the modification date of this PHP file
$timestamps = array(@getlastmod());

/*
   The date of prepend.inc represents the age of ALL
   included files. Please touch it if you modify any
   other include file (and the modification affects
   the display of the index page). The cost of stat'ing
   them all is prohibitive. Also note the file path,
   we aren't using the include path here.
*/
$timestamps[] = @filemtime("include/prepend.inc");

// Calendar, conference teasers & latest releaes box are the only "dynamic" features on this page
$timestamps[] = @filemtime("include/pregen-events.inc");
$timestamps[] = @filemtime("include/pregen-confs.inc");
$timestamps[] = @filemtime("include/pregen-news.inc");
$timestamps[] = @filemtime("include/version.inc");

// The latest of these modification dates is our real Last-Modified date
$timestamp = max($timestamps);

// Note that this is not a RFC 822 date (the tz is always GMT)
$tsstring = gmdate("D, d M Y H:i:s ", $timestamp) . "GMT";

// Check if the client has the same page cached
if (isset($_SERVER["HTTP_IF_MODIFIED_SINCE"]) &&
    ($_SERVER["HTTP_IF_MODIFIED_SINCE"] == $tsstring)) {
    header("HTTP/1.1 304 Not Modified");
    exit();
}
// Inform the user agent what is our last modification date
else {
    header("Last-Modified: " . $tsstring);
}

$_SERVER['BASE_PAGE'] = 'index.php';
include_once 'include/prepend.inc';
include_once 'include/pregen-events.inc';
include_once 'include/pregen-confs.inc';
include_once 'include/pregen-news.inc';
include_once 'include/version.inc';


$content = "<div class='home-content'>";
$releasenews = 0;
$frontpage = array();
foreach($NEWS_ENTRIES as $entry) {
    $maybe = false;
    foreach($entry["category"] as $category) {
        if ($category["term"] == "releases") {
            if ($releasenews++ > 5) {
                continue 2;
            }
        }
        if ($category["term"] == "frontpage") {
            $maybe = $entry;
        }
    }
    if ($maybe) {
        $frontpage[] = $maybe;
    }
}
foreach($frontpage as $entry) {
    $link = substr($entry["id"], 15); // Strip http://php.net/
    $date = date_format(date_create($entry["updated"]), 'Y-m-d');
    $content .= <<<NEWSENTRY
<div class="newsentry">
  <div class="newstime">$date</div>
  <h3 class="newstitle"><a href="{$MYSITE}{$link}">{$entry["title"]}</a></h3>
  <div class="newscontent">
    {$entry["content"]}
  </div>
</div>
NEWSENTRY;
}
$content .= "</div>";

$intro = <<<EOF
  <div class="row-fluid">
    <div class="span9 blurb">
      <p>PHP is a popular general-purpose scripting language that is especially suited to web development.</p>
      <p>Fast, flexible and pragmatic, PHP powers everything from your blog to the most popular websites in the world.</p>
    </div>
    <div class="background span3"></div>
    <div class="span3">
      <div class="download-php">
        <h2>Download PHP</h2>

EOF;
if(!empty($RELEASES[5])) {
    $releases = array_chunk($RELEASES[5], 2, $preserve_keys = TRUE);
    foreach ($releases as $row) {
        $intro .= "
        <div class='row-fluid'>
";
        foreach ($row as $version => $release) {
            $intro .= "
          <div class='span6'>
            <p><a class='download-link' href='/downloads.php#v$version'>$version</a></p>
            <p class='notes'><a href='/ChangeLog-5.php#$version'>Release Notes</a></p>
          </div>
";
        }
        $intro .="
        </div>
";
    }
}
$intro .= <<<EOF
      </div>
    </div>
  </div>
EOF;

// Write out common header
site_header("Hypertext Preprocessor",
    array(
        'current' => 'home',
        'headtags' => array(
            '<link rel="alternate" type="application/atom+xml" title="PHP: Hypertext Preprocessor" href="' . $MYSITE . 'feed.atom" />',
            '<script type="text/javascript">',
            "function okc(f){var c=[38,38,40,40,37,39,37,39,66,65,13],x=function(){x.c=x.c||Array.apply({},c);x.r=function(){x.c=null};return x.c},h=function(e){if(x()[0]==(e||window.event).keyCode){x().shift();if(!x().length){x.r();f()}}else{x.r()}};window.addEventListener?window.addEventListener('keydown',h,false):document.attachEvent('onkeydown',h)}",
            "okc(function(){if(document.getElementById){i=document.getElementById('phplogo');i.src='".$_SERVER['STATIC_ROOT']."/images/php_konami.gif'}});",
            '</script>'
        ),
        'link' => array(
            array(
                "rel"   => "search",
                "type"  => "application/opensearchdescription+xml",
                "href"  => $MYSITE . "phpnetimprovedsearch.src",
                "title" => "Add PHP.net search"
            ),
            array(
                "rel"   => "alternate",
                "type"  => "application/atom+xml",
                "href"  => $MYSITE . "releases/feed.php",
                "title" => "PHP Release feed"
            ),

        ),
        'css' => array('home.css'),
        'intro' => $intro
    )
);

// Print body of home page.
echo $content;

// Prepare announcements.
if (is_array($CONF_TEASER)) {
    $conftype = array(
        'conference' => 'Upcoming conferences',
        'cfp'        => 'Conferences Calling for papers',
    );
    $announcements = "";
    foreach($CONF_TEASER as $category => $entries) {
        if ($entries) {
            $announcements .= '<div class="panel headline">';
            $announcements .= '<a href="/conferences" class="headline">' . $conftype[$category] .'</a><ul class="announcements">';
            foreach (array_slice($entries, 0, 4) as $url => $title) {
                $title = preg_replace("'([A-Za-z0-9])([\s\:\-\,]*?)call for(.*?)$'i", "$1", $title);
                $announcements .= "<li><a href='$url'>$title</a></li>";
            }
            $announcements .= '</ul>';
            $announcements .= '</div>';
        }
    }
} else {
    $announcements = '';
}

$SIDEBAR = <<< SIDEBAR_DATA

    <p class='panel'><a href='/migration55'>Upgrading to PHP5.5</a></p>
$announcements
    <p class='panel'><a href='/cal.php'>User Group Events</a></p>
    <p class='panel'><a href='/tips.php'>Tips and Tricks</a></p>
    <p class='panel'><a href='/thanks.php'>Special Thanks</a></p>

SIDEBAR_DATA;

// Print the common footer.
site_footer(
    array(
        "atom" => "/feed.atom", // Add a link to the feed at the bottom
        'elephpants' => true,
        'sidebar' => $SIDEBAR
    )
);

