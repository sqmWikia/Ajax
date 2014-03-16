/*
** Quick Delete/multiCats - multipleCategories
** Deletes all the pages in specified categories (default: Category:Candidates_for_deletion)
** extension of http://dev.wikia.com/wiki/QuickDelete/code.js
** @author: http://c.wikia.com /wiki/User:Fubuki風吹
*/
 
(function ($, mw) {
  var config = {
    server: mw.config.get('wgServer'),
    namespace: mw.config.get('wgCanonicalNamespace'),
    title: mw.config.get('wgTitle'),
    edittoken: mw.user.tokens.get('editToken'),
    usergroups: mw.config.get('wgUserGroups'),
    buttonText: window.buttonText || 'Delete All'
  };
  var categories = window.categories || ['Candidates for deletion'],
      reasons = window.reasons || ['Marked for deletion'];
  for (i = 0; i < categories.length; i++) {
    if ((config.namespace == 'Category') && (config.title == categories[i])) {
      if ((config.usergroups.indexOf('sysop') !== -1) || (config.usergroups.indexOf('bureaucrat') !== -1)) {
        $('.wikinav2 .WikiaPageHeader').css('padding-right','0');
        var deleteAllButton = '<button class="wikia-button deleteAll">' + config.buttonText + '</button>';
        $('#WikiaPageHeader .comments.talk').after(deleteAllButton);
        $('.deleteAll').on('click', checkDeletion).css('margin','3px 5px');
      }
    }
  }
  function checkDeletion() {
    $.showCustomModal('Confirm deletion', 'Are you sure you want to delete all pages in [' + config.namespace + ':' + config.title + ']?<br>Make sure to check if all the pages need to be deleted!', {
      id: 'deleteModal',
      width: 650,
      buttons: [{
        defaultButton: true,
        message: 'Delete',
        handler: function() {
          deletePages();
        }
      }, {
        message: 'Cancel',
        handler: function() {
          cancelDeletion();
        }
      }]
    });
  }
  function deletePages() {
    cancelDeletion();
    var pages = [];
    $('#mw-pages .mw-content-ltr li').each(function() {
      pages.push($(this).text());
    });
    if (pages.length > 0) {
      for (i = 0; i < pages.length; i++) {
        var deleteURL = config.server + '/api.php?action=delete&title=' + encodeURIComponent(pages[i]) + '&token=' + encodeURIComponent(config.edittoken) + '&reason=' + encodeURIComponent(reasons[i]);
        $.post(deleteURL);
      }
      $.showCustomModal('Deleted', 'All pages in [' + config.namespace + ':' + config.category + '] have been deleted.', {
        id: 'deleted',
        width: 450,
        buttons: [{
          defaultButton: true,
          id: 'refresh',
          message: 'Refresh',
          handler: function() {
            window.location.reload();
          }
        }]
      });
    } else if (pages.length == 0) {
      $.showCustomModal('No pages found', 'No pages found in this category.', {
        id: 'no-pages',
        width: 450,
        buttons: [{
          defaultButton: true,
          message: 'OK',
          handler: function() {
            $('#no-pages').closeModal();
          }
        }]
      });
    }
  }
  function cancelDeletion() {
    $('#deleteModal').closeModal();
  }
}) (jQuery, mediaWiki);
