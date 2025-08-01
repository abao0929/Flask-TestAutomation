// static/js/locator_list.js
export function initLocatorDeleteConfirm() {
  let locatorToDeleteForm = null;

  // 监听每个删除图标按钮
  $(document).on('click', '.delete-locator-btn', function(e){
    e.preventDefault();
    locatorToDeleteForm = $(this).closest('form');
    $('#deleteLocatorModal').modal('show');
  });

  // 监听确认删除按钮
  $('#confirmDeleteLocatorBtn').on('click', function(){
    if(locatorToDeleteForm) {
      locatorToDeleteForm.submit();
      locatorToDeleteForm = null;
      $('#deleteLocatorModal').modal('hide');
    }
  });
}
