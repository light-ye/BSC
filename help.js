// 获取除 table1 之外的所有表格元素
const tables = document.querySelectorAll('table:not(.table1)');
// 记录拖动状态和相关元素
let isDragging = false;
let draggedElement;
let cloneElement;
let offsetX, offsetY;

// 为每个表格的单元格添加事件监听器
tables.forEach(table => {
    table.addEventListener('mousedown', startDrag);
});

// 开始拖动事件处理函数
function startDrag(e) {
    if (isDragging) return;
    // 获取点击的单元格元素
    draggedElement = e.target.closest('td');
    if (!draggedElement) return;

    // 检查是否是拖动出来的元素，如果是则不复制
    if (draggedElement.dataset.isClone === 'true') {
        directDragStart(e);
        return;
    }

    isDragging = true;
    // 复制单元格元素
    cloneElement = draggedElement.cloneNode(true);
    cloneElement.style.position = 'absolute';
    cloneElement.style.zIndex = 1000;
    cloneElement.dataset.isClone = 'true';

    // 保持克隆元素大小和原元素一致
    const rect = draggedElement.getBoundingClientRect();
    cloneElement.style.width = rect.width + 'px';
    cloneElement.style.height = rect.height + 'px';

    document.body.appendChild(cloneElement);

    // 计算偏移量
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // 添加移动和结束拖动事件监听器
    document.addEventListener('mousemove', moveElement);
    document.addEventListener('mouseup', endDrag);

    // 为克隆元素添加双击删除事件监听器
    cloneElement.addEventListener('dblclick', function () {
        this.parentNode.removeChild(this);
    });
}

// 直接拖动开始处理函数（针对已拖动出来的元素）
function directDragStart(e) {
    isDragging = true;
    cloneElement = draggedElement;

    // 计算偏移量
    const rect = draggedElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // 添加移动和结束拖动事件监听器
    document.addEventListener('mousemove', moveElement);
    document.addEventListener('mouseup', endDrag);

    // 为拖动的克隆元素添加双击删除事件监听器
    cloneElement.addEventListener('dblclick', function () {
        this.parentNode.removeChild(this);
    });
}

// 移动元素事件处理函数
function moveElement(e) {
    if (isDragging) {
        cloneElement.style.left = (e.clientX - offsetX) + 'px';
        cloneElement.style.top = (e.clientY - offsetY) + 'px';
    }
}

// 结束拖动事件处理函数
function endDrag() {
    if (isDragging) {
        isDragging = false;
        document.removeEventListener('mousemove', moveElement);
        document.removeEventListener('mouseup', endDrag);
    }
}

// 为页面上已有的克隆元素添加双击删除事件监听器（用于处理之前拖动出来的元素）
document.querySelectorAll('td[data-is-clone="true"]').forEach(clone => {
    clone.addEventListener('dblclick', function () {
        this.parentNode.removeChild(this);
    });
});
    