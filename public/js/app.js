$(document).ready(function () {

  // confirmations
  $('.confirm').submit(function (e) {
    e.preventDefault();
    var self = this;
    var msg = 'Are you sure?';
    bootbox.confirm(msg, 'cancel', 'Yes! I am sure', function (action) {
      if (action) {
        $(self).unbind('submit');
        $(self).trigger('submit');
      }
    });
  });

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });

  jQuery('.fade1').fadeIn(800, function(){
  });

  var playing = true;

  $('#audio-control').click(function() {
      if (playing == false) {
        var v = document.getElementsByTagName("audio")[0];
        v.play();
        playing = true; 
        $(this).css('backgroundPosition', 'left -52px');
        console.log("playing status is " + playing);
      } else {
        var v = document.getElementsByTagName("audio")[0];
        v.pause();
        playing = false;
        $(this).css('backgroundPosition', 'left top');
        console.log("playing status is " + playing);
      }
  });

});

