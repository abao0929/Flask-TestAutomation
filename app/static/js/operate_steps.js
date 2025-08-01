// operate_steps.js
export function initOperateSteps() {
  let steps = [];

  // 添加步骤
  $('#all-locators-list').on('click', '.list-group-item', function(){
    const data = $(this).data();
    steps.push({...data});
    renderSteps();
  });

  // 删除步骤
  $('#steps-list').on('click', '.step-delete', function(){
    const idx = $(this).closest('li').data('step-idx');
    steps.splice(idx, 1);
    renderSteps();
  });

  // 渲染步骤区
  function renderSteps() {
    $('#steps-list').empty();
    steps.forEach(function(data, i){
      const stepHtml = `
        <li class="list-group-item d-flex justify-content-between align-items-center" data-step-idx="${i}">
          <span>
            <span class="badge bg-primary me-2">${data.operate}</span>
            <strong>${data.name}</strong>
            <span class="text-muted ms-2">[${data.page}]</span>
          </span>
          <span>
            <a href="javascript:;" class="step-delete text-danger ms-2" title="delete">
              <i class="bi bi-trash"></i>
            </a>
          </span>
        </li>
      `;
      $('#steps-list').append(stepHtml);
    });
  }

  // 生成操作流程JSON文件
  $('#generate-json').on('click', function(){
    const output = steps.map((item, idx) => ({
      step: idx + 1,
      ...item
    }));
    const content = JSON.stringify(output, null, 2);

    // 下载文件
    const blob = new Blob([content], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'operate_flow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
