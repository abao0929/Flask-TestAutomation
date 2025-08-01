// flash_auto_hide.js
export function initFlashAutoHide() {
  setTimeout(function() {
    $("#flash-messages .alert").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove();
    });
  }, 3000);
}
