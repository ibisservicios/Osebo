// Generated by CoffeeScript 1.3.3
var page;

page = {
  title: '',
  focus: function() {
    $('#content-wrap').redactor({
      focus: true,
      fixed: true,
      imageUpload: 'upload.php',
      imageUploadCallback: function(obj, json) {
        if (!json.img) {
          return $("#content").prepend('<div class="alert alert-block alert-error fade in"><button type="button" class="close" data-dismiss="alert">×</button><p>The upload folder does not exist. Please first create the upload folder.</p></div>');
        }
      }
    });
    this.title = $('#title').text();
    $('#title').after('<input type="text" name="title" placeholder="Title" value="' + this.title + '" autofocus class="span12">').remove();
    $('#save').attr('disabled', false);
    return $("#public").show();
  },
  "new": function() {
    $('#content-wrap').setCode('');
    $('input[name="id"]').attr('disabled', true);
    return $('input[name="title" placeHolder="Title"]').val('').focus();
  },
  save: function() {
    var html, id, lang, status, subpage;
    this.title = $('input[name="title"]').val();
    html = $('#content-wrap').getCode();
    status = $('input[name="status"]').is(':checked') ? 1 : 2;
    lang = $('input[name="lang"]').val();
    id = $('input[name="id"]:not(:disabled)').val();
    subpage = $('input[name="subpage"]').val();
    return $.ajax({
      type: 'POST',
      url: 'cms.save.php',
      dataType: 'html',
      data: {
        title: this.title,
        content: html,
        status: status,
        lang: lang,
        subpage: subpage,
        id: id
      },
      error: function() {
        return $("#content").prepend('<div class="alert alert-block alert-error fade in"><button type="button" class="close" data-dismiss="alert">×</button><p>Unexpected error. Please revise the configuration.</p></div>');
      },
      success: function(data) {
        var li, url;
        data = JSON.parse(data);
        url = data.lang + '/' + data.id + '/' + data.flatten;
        li = '<li><a href="' + url + '" data-id="' + data.id + '">' + data.title + '</a></li>';
        if (data.status === 1) {
          $('header ul').append(li);
        } else {
          $('header a[data-id="' + data.id + '"]').before(li).remove();
        }
        if (Modernizr.history) {
          history.pushState(null, null, url);
        } else {
          window.location = url;
        }
        $('#content-wrap').destroyEditor();
        $('input[name="title"]').after('<h2 id="title">' + page.title + '</h2>').remove();
        $('#save').attr('disabled', true);
        return $("#public").hide();
      }
    });
  },
  "delete": function(id) {
    $("#content").css('opacity', '0.2');
    $("#wrapper").prepend('<div class="alert alert-block alert-warning fade in undo"><button type="button" class="close" data-dismiss="alert">×</button><p>This page was deleted <a href="#" title="undo" data-id="' + id + '">undo</a></p></div>');
    return $.post("cms.ajax.php", {
      "delete": id
    }, function(data) {
      $("#edit, #save").hide();
      return $('header a[data-id="' + id + '"]').hide();
    });
  },
  undo: function(id) {
    $("#content").css("opacity", "1");
    return $.post("cms.ajax.php", {
      undo: id
    }, function(data) {
      $("#edit, #save").show();
      $('header a[data-id="' + id + '"]').show();
      return $('.undo').remove();
    });
  }
};

$('#edit').on('click', function() {
  return page.focus();
});

$('.new').on('click', function() {
  var sub, subpage;
  sub = $(this).data('sub');
  subpage = $('input[name="subpage"]').val(sub);
  page.focus();
  return page["new"]();
});

$('#save').on('click', function() {
  return page.save();
});

$('#delete').on('click', function(e) {
  var id;
  e.preventDefault(e);
  id = $(this).data('id');
  return page["delete"](id);
});

$('#wrapper').on('click', '.undo a', function(e) {
  var id;
  e.preventDefault();
  id = $(this).data('id');
  return page.undo(id);
});
