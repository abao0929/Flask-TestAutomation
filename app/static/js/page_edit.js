// page_edit.js
export function initPageEdit() {
  // 行内编辑Pages
  $('.modal').on('click', '.edit-page-btn', function () {
    var $tr = $(this).closest('tr');
    var $btn = $(this);

    if ($btn.text() === 'Edit') {
      // 进入编辑模式
      $tr.find('.page-name-text,.page-url-text').addClass('d-none');
      $tr.find('input[name="name"],input[name="url"]').removeClass('d-none');
      $btn.text('Save').removeClass('btn-outline-primary').addClass('btn-success');
    } else {
      // 保存编辑
      var pageId = $tr.data('page-id');
      var newName = $tr.find('input[name="name"]').val();
      var newUrl = $tr.find('input[name="url"]').val();

      $.post('/page/edit/' + pageId, { name: newName, url: newUrl }, function (resp) {
        $tr.find('.page-name-text').text(newName).removeClass('d-none');
        $tr.find('.page-url-text').text(newUrl).removeClass('d-none');
        $tr.find('input[name="name"],input[name="url"]').addClass('d-none');
        $btn.text('Edit').removeClass('btn-success').addClass('btn-outline-primary');
      });
    }
  });
}
