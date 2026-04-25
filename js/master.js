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
    
    const sheetUrl = https://docs.google.com/spreadsheets/d/e/2PACX-1vQNO7w4N3S8LqTHigAnUygflNpqnMZKXSD-azc2o8W-m4R4_Slp4VP6E6y1a03zcXugMeITlDyUBdEw/pub?gid=972364105&single=true&output=csv;
    
    const container = document.getElementById('zemi-results-container');
    if(!container) return;

    container.innerHTML = '<p style="text-align: center; color: #cecece;">現在の希望状況を読み込んでいます...</p>';

    fetch(sheetUrl)
        .then(response => response.text())
        .then(csvText => {
            const rows = parseCSV(csvText);
            let htmlString = '';

            // 1行目（見出し）を飛ばしてループ
            for(let i = 1; i < rows.length; i++) {
                const row = rows[i];
                // A〜D列（4列分）があるかチェック
                if(row.length < 4 || !row[0]) continue;

                const fieldName = row[0]; // A列：分野名
                const first = row[1] || 0; // B列：第1希望
                const second = row[2] || 0; // C列：第2希望
                const third = row[3] || 0; // D列：第3希望

                // シンプルなカード形式で表示
                htmlString += `
                <div class="zemi-card-sp" style="margin-bottom: 1rem; background: rgba(255,255,255,0.05); border: 1px solid #555; border-radius: 8px; padding: 1rem;">
                    <h3 style="margin: 0 0 0.8rem 0; font-size: 1.1rem; color: #fff; border-left: 4px solid #91b825; padding-left: 0.8rem;">
                        ${fieldName}
                    </h3>
                    
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <span style="background: #e6b422; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">
                            第1希望: ${first}人
                        </span>
                        <span style="background: #999; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">
                            第2希望: ${second}人
                        </span>
                        <span style="background: #c57f2e; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">
                            第3希望: ${third}人
                        </span>
                    </div>
                </div>`;
            }
            
            container.innerHTML = htmlString || '<p style="text-align: center; color: #cecece;">現在、希望分野はまだありません。</p>';
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = '<p style="text-align: center; color: #cecece;">データの読み込みに失敗しました。</p>';
        });
});

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
