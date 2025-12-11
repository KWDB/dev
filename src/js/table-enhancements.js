/**
 * 表格增强功能 - 排序、搜索、分页等
 * 为 Docusaurus 文档中的表格添加交互功能
 */

// 表格排序功能
class TableSorter {
  constructor(table) {
    this.table = table;
    this.headers = table.querySelectorAll('th');
    this.tbody = table.querySelector('tbody');
    this.rows = Array.from(this.tbody.querySelectorAll('tr'));
    this.currentSort = { column: -1, direction: 'asc' };
    
    this.init();
  }
  
  init() {
    // 为表头添加排序功能
    this.headers.forEach((header, index) => {
      // 跳过空表头或不需要排序的列
      if (header.textContent.trim() === '' || header.hasAttribute('data-no-sort')) {
        return;
      }
      
      header.setAttribute('data-sortable', 'true');
      header.style.cursor = 'pointer';
      
      header.addEventListener('click', () => {
        this.sortTable(index);
      });
    });
  }
  
  sortTable(columnIndex) {
    const isCurrentColumn = this.currentSort.column === columnIndex;
    const direction = isCurrentColumn && this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    
    // 更新排序状态
    this.currentSort = { column: columnIndex, direction };
    
    // 清除所有表头的排序指示器
    this.headers.forEach(header => {
      header.removeAttribute('data-sort');
    });
    
    // 设置当前列的排序指示器
    this.headers[columnIndex].setAttribute('data-sort', direction);
    
    // 排序行数据
    const sortedRows = this.rows.sort((a, b) => {
      const aCell = a.cells[columnIndex];
      const bCell = b.cells[columnIndex];
      
      if (!aCell || !bCell) return 0;
      
      const aValue = this.getCellValue(aCell);
      const bValue = this.getCellValue(bCell);
      
      let result = 0;
      
      // 数字比较
      if (this.isNumeric(aValue) && this.isNumeric(bValue)) {
        result = parseFloat(aValue) - parseFloat(bValue);
      }
      // 日期比较
      else if (this.isDate(aValue) && this.isDate(bValue)) {
        result = new Date(aValue) - new Date(bValue);
      }
      // 字符串比较
      else {
        result = aValue.localeCompare(bValue, 'zh-CN', { numeric: true });
      }
      
      return direction === 'asc' ? result : -result;
    });
    
    // 重新排列表格行
    sortedRows.forEach(row => this.tbody.appendChild(row));
    
    // 添加排序动画效果
    this.addSortAnimation();
  }
  
  getCellValue(cell) {
    // 获取单元格的文本内容，去除HTML标签
    return cell.textContent || cell.innerText || '';
  }
  
  isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  
  isDate(value) {
    return !isNaN(Date.parse(value));
  }
  
  addSortAnimation() {
    this.table.style.opacity = '0.7';
    setTimeout(() => {
      this.table.style.opacity = '1';
    }, 150);
  }
}

// 表格搜索功能
class TableSearch {
  constructor(table, searchInput) {
    this.table = table;
    this.searchInput = searchInput;
    this.tbody = table.querySelector('tbody');
    this.rows = Array.from(this.tbody.querySelectorAll('tr'));
    
    this.init();
  }
  
  init() {
    this.searchInput.addEventListener('input', (e) => {
      this.filterTable(e.target.value);
    });
  }
  
  filterTable(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    this.rows.forEach(row => {
      const cells = Array.from(row.cells);
      const rowText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');
      
      if (term === '' || rowText.includes(term)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
    
    // 更新斑马纹效果
    this.updateZebraStripes();
  }
  
  updateZebraStripes() {
    const visibleRows = this.rows.filter(row => row.style.display !== 'none');
    visibleRows.forEach((row, index) => {
      row.style.backgroundColor = index % 2 === 0 ? '' : 'var(--ifm-color-emphasis-50)';
    });
  }
}

// 表格分页功能
class TablePagination {
  constructor(table, pageSize = 10) {
    this.table = table;
    this.tbody = table.querySelector('tbody');
    this.rows = Array.from(this.tbody.querySelectorAll('tr'));
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.rows.length / this.pageSize);
    
    this.init();
  }
  
  init() {
    if (this.rows.length <= this.pageSize) {
      return; // 不需要分页
    }
    
    this.createPaginationControls();
    this.showPage(1);
  }
  
  createPaginationControls() {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'table-pagination';
    
    // 上一页按钮
    const prevButton = document.createElement('button');
    prevButton.textContent = '‹ 上一页';
    prevButton.addEventListener('click', () => this.goToPage(this.currentPage - 1));
    paginationContainer.appendChild(prevButton);
    
    // 页码按钮容器
    this.pageButtonsContainer = document.createElement('div');
    this.pageButtonsContainer.style.display = 'flex';
    this.pageButtonsContainer.style.gap = '0.25rem';
    paginationContainer.appendChild(this.pageButtonsContainer);
    
    // 下一页按钮
    const nextButton = document.createElement('button');
    nextButton.textContent = '下一页 ›';
    nextButton.addEventListener('click', () => this.goToPage(this.currentPage + 1));
    paginationContainer.appendChild(nextButton);
    
    // 将分页控件插入到表格后面
    this.table.parentNode.insertBefore(paginationContainer, this.table.nextSibling);
    
    this.prevButton = prevButton;
    this.nextButton = nextButton;
    
    this.updatePaginationControls();
  }
  
  showPage(pageNumber) {
    const startIndex = (pageNumber - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    this.rows.forEach((row, index) => {
      if (index >= startIndex && index < endIndex) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
    
    this.currentPage = pageNumber;
    this.updatePaginationControls();
  }
  
  goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      return;
    }
    this.showPage(pageNumber);
  }
  
  updatePaginationControls() {
    // 更新按钮状态
    this.prevButton.disabled = this.currentPage === 1;
    this.nextButton.disabled = this.currentPage === this.totalPages;
    
    // 更新页码按钮
    this.pageButtonsContainer.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.className = i === this.currentPage ? 'active' : '';
      pageButton.addEventListener('click', () => this.goToPage(i));
      this.pageButtonsContainer.appendChild(pageButton);
    }
  }
}

// 表格导出功能
class TableExporter {
  constructor(table) {
    this.table = table;
  }
  
  exportToCSV() {
    const rows = Array.from(this.table.querySelectorAll('tr'));
    const csvContent = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      return cells.map(cell => {
        const text = cell.textContent.replace(/"/g, '""');
        return `"${text}"`;
      }).join(',');
    }).join('\n');
    
    this.downloadFile(csvContent, 'table-data.csv', 'text/csv');
  }
  
  exportToJSON() {
    const headers = Array.from(this.table.querySelectorAll('th')).map(th => th.textContent.trim());
    const rows = Array.from(this.table.querySelectorAll('tbody tr'));
    
    const data = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      const rowData = {};
      cells.forEach((cell, index) => {
        if (headers[index]) {
          rowData[headers[index]] = cell.textContent.trim();
        }
      });
      return rowData;
    });
    
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, 'table-data.json', 'application/json');
  }
  
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// 主初始化函数
function initializeTableEnhancements() {
  // 检查是否在浏览器环境中
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTables);
  } else {
    initTables();
  }
}

function initTables() {
  const tables = document.querySelectorAll('.markdown table');
  
  tables.forEach(table => {
    // 跳过已经初始化的表格
    if (table.hasAttribute('data-enhanced')) {
      return;
    }
    
    table.setAttribute('data-enhanced', 'true');
    
    // 为表格添加响应式容器
    if (!table.parentElement.classList.contains('table-responsive')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
    
    // 初始化排序功能
    new TableSorter(table);
    
    // 如果表格行数较多，添加分页功能
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length > 10) {
      new TablePagination(table, 10);
    }
    
    // 添加工具栏（搜索和导出）
    createTableToolbar(table);
  });
}

function createTableToolbar(table) {
  const toolbar = document.createElement('div');
  toolbar.className = 'table-toolbar';
  
  // 搜索输入框
  const searchContainer = document.createElement('div');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = '搜索表格内容...';
  searchInput.className = 'table-search';
  searchContainer.appendChild(searchInput);
  
  // 导出按钮
  const exportContainer = document.createElement('div');
  const exportButton = document.createElement('button');
  exportButton.textContent = '导出 CSV';
  exportButton.className = 'table-export';
  exportContainer.appendChild(exportButton);
  
  toolbar.appendChild(searchContainer);
  toolbar.appendChild(exportContainer);
  
  // 将工具栏插入到表格前面
  table.parentNode.insertBefore(toolbar, table);
  
  // 初始化搜索功能
  new TableSearch(table, searchInput);
  
  // 初始化导出功能
  const exporter = new TableExporter(table);
  exportButton.addEventListener('click', () => {
    exporter.exportToCSV();
  });
}

// 响应式表格处理
function handleResponsiveTables() {
  // 检查是否在浏览器环境中
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  const tables = document.querySelectorAll('.markdown table');
  
  function checkTableWidth() {
    tables.forEach(table => {
      const container = table.closest('.table-responsive');
      if (!container) return;
      
      // 在小屏幕上启用卡片布局
      if (window.innerWidth <= 480) {
        table.classList.add('table-card');
        
        // 为每个单元格添加数据标签
        const headers = Array.from(table.querySelectorAll('th'));
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          cells.forEach((cell, index) => {
            if (headers[index]) {
              cell.setAttribute('data-label', headers[index].textContent.trim());
            }
          });
        });
      } else {
        table.classList.remove('table-card');
      }
    });
  }
  
  // 初始检查
  checkTableWidth();
  
  // 监听窗口大小变化
  window.addEventListener('resize', checkTableWidth);
}

// 自动初始化（仅在浏览器环境中）
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initializeTableEnhancements();
  handleResponsiveTables();
}

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TableSorter,
    TableSearch,
    TablePagination,
    TableExporter,
    initializeTableEnhancements,
    handleResponsiveTables
  };
}