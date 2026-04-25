const responsive_menu_btn = document.querySelector('.responsive_btn');

if (responsive_menu_btn) {
  responsive_menu_btn.addEventListener('click', menuToggle);
}

function menuToggle() {
  const pcMenu = document.querySelector('.main-nav');
  const spMenu = document.querySelector('.main-nav-sp');

  if (pcMenu) {
    pcMenu.classList.toggle('menu_active');
  }

  if (spMenu) {
    spMenu.classList.toggle('menu_active');
  }

  responsive_menu_btn.classList.toggle('active');
}






document.addEventListener('DOMContentLoaded', () => {
    
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQNO7w4N3S8LqTHigAnUygflNpqnMZKXSD-azc2o8W-m4R4_Slp4VP6E6y1a03zcXugMeITlDyUBdEw/pub?gid=972364105&single=true&output=csv' ;
    
    const container = document.getElementById('zemi-results-container');
    if(!container) return;

    container.innerHTML = '<p style="text-align: center; color: #cecece;">現在の希望状況を読み込んでいます...</p>';

fetch(sheetUrl)
        .then(response => response.text())
        .then(csvText => {
            const allRows = parseCSV(csvText);
            // ヘッダーを除外して、第1希望（B列/index 1）の多い順に並び替え
            const dataRows = allRows.slice(1)
                .filter(row => row[0]) // 分野名が空の行を除外
                .sort((a, b) => Number(b[1]) - Number(a[1]));

            let top3Html = '';
            let otherHtml = '';

            dataRows.forEach((row, index) => {
                const fieldName = row[0];
                const first = row[1] || 0;
                const second = row[2] || 0;
                const third = row[3] || 0;

                const cardHtml = `
                <div class="zemi-card-sp" style="margin-bottom: 1rem; background: rgba(255,255,255,0.05); border: 1px solid #555; border-radius: 8px; padding: 1rem;">
                    <h3 style="margin: 0.8rem 0; font-size: 1.1rem; color: #fff; border-left: 4px solid #91b825; padding-left: 0.8rem;">
                        ${fieldName}
                    </h3>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="background: #e6b422; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">第1希望: ${first}人</span>
                        <span style="background: #999; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">第2希望: ${second}人</span>
                        <span style="background: #c57f2e; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">第3希望: ${third}人</span>
                    </div>
                </div>`;

                if (index < 3) {
                    top3Html += cardHtml;
                } else {
                    otherHtml += cardHtml;
                }
            });

            // HTMLの組み立て
            let finalHtml = top3Html;

            // 4位以降がある場合のみ、隠しエリアとボタンを追加
            if (otherHtml !== '') {
                finalHtml += `
                    <div id="other-zemi-fields" style="display: none;">${otherHtml}</div>
                    <div style="text-align: center; margin-top: 1rem;">
                        <button id="toggle-zemi-btn" class="btn" style="font-size: 0.9rem; padding: 0.5rem 1rem; background: #555;">
                            すべての希望分野を表示
                        </button>
                    </div>
                `;
            }

            container.innerHTML = finalHtml || '<p style="text-align: center; color: #cecece;">現在、希望分野はまだありません。</p>';

            // ボタンのクリックイベント設定
            const toggleBtn = document.getElementById('toggle-zemi-btn');
            const otherFields = document.getElementById('other-zemi-fields');
            if (toggleBtn && otherFields) {
                toggleBtn.addEventListener('click', () => {
                    const isHidden = otherFields.style.display === 'none';
                    otherFields.style.display = isHidden ? 'block' : 'none';
                    toggleBtn.textContent = isHidden ? '表示を戻す' : 'すべての希望分野を表示';
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = '<p style="text-align: center; color: #cecece;">データの読み込みに失敗しました。</p>';
        });
});

// CSVパース関数
function parseCSV(str) {
    const result = [];
    let row = [], inQuotes = false, val = "";
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (inQuotes) {
            if (c === '"' && str[i+1] === '"') { val += '"'; i++; }
            else if (c === '"') { inQuotes = false; }
            else { val += c; }
        } else {
            if (c === '"') { inQuotes = true; }
            else if (c === ',') { row.push(val); val = ""; }
            else if (c === '\n' || c === '\r') {
                row.push(val); val = ""; result.push(row); row = [];
                if (c === '\r' && str[i+1] === '\n') i++;
            }
            else { val += c; }
        }
    }
    if (val || row.length > 0) { row.push(val); result.push(row); }
    return result;
}

// CSVパース関数（ここは共通）
function parseCSV(str) {
    const result = [];
    let row = [], inQuotes = false, val = "";
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (inQuotes) {
            if (c === '"' && str[i+1] === '"') { val += '"'; i++; }
            else if (c === '"') { inQuotes = false; }
            else { val += c; }
        } else {
            if (c === '"') { inQuotes = true; }
            else if (c === ',') { row.push(val); val = ""; }
            else if (c === '\n' || c === '\r') {
                row.push(val); val = ""; result.push(row); row = [];
                if (c === '\r' && str[i+1] === '\n') i++;
            }
            else { val += c; }
        }
    }
    if (val || row.length > 0) { row.push(val); result.push(row); }
    return result;
}



















// ゼミ班アコーディオン
function setupAccordion(headerClass, itemClass, contentClass) {
  document.querySelectorAll(headerClass).forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;

      // 他を閉じる
      document.querySelectorAll(itemClass).forEach((el) => {
        if (el !== item) {
          el.classList.remove('active');
          const c = el.querySelector(contentClass);
          if (c) c.style.maxHeight = null;
        }
      });

      item.classList.toggle('active');
      const content = item.querySelector(contentClass);

      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  });
}

// PC用
setupAccordion(
  '.accordion-header',
  '.accordion-item',
  '.accordion-content'
);

// SP用
setupAccordion(
  '.accordion-header-sp',
  '.accordion-item-sp',
  '.accordion-content-sp'
);

(function () {
  const buttons = document.querySelectorAll('.js-pop-btn');

  function closeAll() {
    document.querySelectorAll('.fuzzy-pop').forEach(pop => {
      pop.classList.remove('show');
    });
  }

  function positionPop(btn, pop) {
    const rect = btn.getBoundingClientRect();
    const gap = 8;

    let left = rect.left;
    let top = rect.bottom + gap;

    pop.style.left = (left + window.scrollX) + 'px';
    pop.style.top  = (top + window.scrollY) + 'px';
  }

  // ボタン側の処理
  buttons.forEach(btn => {
    const targetId = btn.dataset.target;
    const pop = document.getElementById(targetId);

    btn.addEventListener('click', e => {
      e.stopPropagation();

      const isOpen = pop.classList.contains('show');
      closeAll();

      if (!isOpen) {
        positionPop(btn, pop);
        pop.classList.add('show');
      }
    });
  });

  // ×ボタンで閉じる
  document.querySelectorAll('.js-pop-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      closeAll();
    });
  });

  // 外クリックで閉じる
  document.addEventListener('click', closeAll);

  // リサイズ・スクロールで閉じる
  window.addEventListener('resize', closeAll);
  window.addEventListener('scroll', closeAll);
})();
