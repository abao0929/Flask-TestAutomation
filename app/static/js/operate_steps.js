// static/js/operate_steps.js

export function initOperateSteps() {
  let steps = [];

  // 1. 添加步骤
  $('#all-locators-list').on('click', '.list-group-item', function(){
    const data = $(this).data();
    // 新增时加 input_value 字段（仅 input 操作）
    let step = {...data};
    if (step.operate === 'input') {
      step.input_value = "";
    }
    steps.push(step);
    renderSteps();
  });

  // 2. 删除步骤
  $('#steps-list').on('click', '.step-delete', function(){
    const idx = $(this).closest('li').data('step-idx');
    steps.splice(idx, 1);
    renderSteps();
  });

  // 3. 输入框内容实时保存到 steps
  $('#steps-list').on('input', '.step-input-value', function(){
    const idx = $(this).data('step-idx');
    steps[idx].input_value = $(this).val();
  });

  // 4. 渲染步骤列表
  function renderSteps() {
    $('#steps-list').empty();
    steps.forEach(function(data, i){
      let inputHtml = '';
      if (data.operate === 'input') {
        inputHtml = `
          <input type="text" class="form-control form-control-sm ms-2 step-input-value"
            placeholder="输入值"
            value="${data.input_value ? data.input_value : ''}"
            data-step-idx="${i}"
            style="width:180px; display:inline-block;">
        `;
      }
      const stepHtml = `
        <li class="list-group-item d-flex justify-content-between align-items-center" data-step-idx="${i}">
          <span>
            <span class="badge bg-primary me-2">${data.operate}</span>
            <strong>${data.name}</strong>
            <span class="text-muted ms-2">[${data.page}]</span>
            ${inputHtml}
          </span>
          <span>
            <a href="javascript:;" class="step-delete text-danger ms-2" title="删除">
              <i class="bi bi-trash"></i>
            </a>
          </span>
        </li>
      `;
      $('#steps-list').append(stepHtml);
    });
  }

  // 5. 显示生成流程弹窗
  $('#show-generate-json-modal').on('click', function() {
    $('#generateJsonModal').modal('show');
    $('#jsonFileName').val('operate_flow.json');
  });

  // 6. 生成流程文件
  $('#confirm-generate-json-btn').on('click', function(){
    let fileName = $('#jsonFileName').val().trim();
    if (!fileName) {
      $('#jsonFileName').addClass('is-invalid');
      return;
    }
    if (!fileName.endsWith('.json')) fileName += '.json';

    // 导出时包含 input_value 字段
    const output = steps.map((item, idx) => {
      let stepData = {
        step: idx + 1,
        ...item
      };
      if (item.operate === 'input') {
        stepData.input_value = item.input_value || "";
      }
      return stepData;
    });
    const content = JSON.stringify(output, null, 2);

    const blob = new Blob([content], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    $('#generateJsonModal').modal('hide');
  });
}
