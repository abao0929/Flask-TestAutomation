// locator_pagination.js
export function initLocatorPagination() {
  $('#locator-list-partial').on('click', '.page-ajax', function(e) {
    e.preventDefault();
    const page = $(this).data('page');
    $.get("/locator/list", {page: page}, function(data){
      $('#locator-list-partial').html(data);
    });
  });
}
