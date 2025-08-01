// main.js
import { initLocatorPagination } from './locator_pagination.js';
import { initPageEdit } from './page_edit.js';
import { initFlashAutoHide } from './flash_auto_hide.js';
import { initOperateSteps } from './operate_steps.js';
import { initLocatorDeleteConfirm } from './locator_list.js';

$(function() {
  initLocatorPagination();
  initPageEdit();
  initFlashAutoHide();
  initOperateSteps();
  initLocatorDeleteConfirm();
});
