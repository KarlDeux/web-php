    </section><!-- layout-content -->
    <?php
    if (!empty($config['spanning-content'])) {
        print "<div class='spanning-content'>";
        print $config['spanning-content'];
        print "</div>";
    }

    ?>
<?php if (!empty($config['sidebar'])): ?>
    <aside class="tips span3">
        <div class="border first"></div>
        <div class="border second"></div>
        <div class="border third"></div>
        <div class="inner"><?php echo $config['sidebar']; ?></div>
    </aside>
<?php endif; ?>

  </div><!-- layout -->
  </div>
         
  <footer>
    <div class="container footer-content">
      <div class="row-fluid">
      <ul class="footmenu">
        <li><a href="/copyright.php">Copyright &copy; 2001-<?php echo date('Y'); ?> The PHP Group</a></li>
        <li><a href="/my.php">My PHP.net</a></li>
        <li><a href="/contact.php">Contact</a></li>
        <li><a href="/sites.php">Other PHP.net sites</a></li>
        <li><a href="/mirrors.php">Mirror sites</a></li>
        <li><a href="/privacy.php">Privacy policy</a></li>
      </ul>
      </div>
    </div>
  </footer>

    <?php
    // if elephpants enabled, insert placeholder nodes
    // to be populated with images via javascript.
    if (isset($config['elephpants'])) {
        print "<div class='elephpants'><div class=images></div></div>";
    }
    ?>

<script type="text/javascript">
  var GoSquared = {};
  GoSquared.acct = "GSN-094556-T";
  (function(w){
    function gs(){
      w._gstc_lt = +new Date;
      var d = document, g = d.createElement("script");
      g.type = "text/javascript";
      g.src = "//d1l6p2sc9645hc.cloudfront.net/tracker.js";
      var s = d.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(g, s);
    }
    w.addEventListener ?
      w.addEventListener("load", gs, false) :
      w.attachEvent("onload", gs);
  })(window);
</script>

 <!-- External and third party libraries. -->
 <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
 <script type="text/javascript" src="/cached.php?f=/js/ext/hogan-2.0.0.min.js&t=2"></script>
 <script type="text/javascript" src="/cached.php?f=/js/ext/typeahead.min.js&t=2"></script>

 <?php
 // Nick bjori's last modified code for our own JS files.
 $jsfiles = array('search.js', 'common.js');
 foreach ($jsfiles as $filename) {
   $path = dirname(dirname(__FILE__)).'/js/'.$filename;
   echo '<script type="text/javascript" src="/cached.php?f=/js/'.$filename.'&t='.@filemtime($path).'"></script>';
 }

 include 'uservoice.inc';
 ?>

</body>
</html>

