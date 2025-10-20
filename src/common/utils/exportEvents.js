import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * 导出pdf
 */
export async function exportPdf(elementPdf, fileName = "exported.pdf") {
    if (!elementPdf) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 获取元素位置和尺寸
    const elementRect = elementPdf.getBoundingClientRect();
    const totalHeight = elementPdf.scrollHeight;
    const viewportHeight = window.innerHeight;

    let currentPosition = 0;
    let pageNumber = 0;

    while (currentPosition < totalHeight) {
        // 计算当前截图区域
        const clipHeight = Math.min(viewportHeight, totalHeight - currentPosition);

        const canvas = await html2canvas(elementPdf, {
            useCORS: true,
            scale: 2,
            logging: false,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowHeight: clipHeight,
            y: currentPosition,
            height: clipHeight,
            onclone: (clonedDoc, clonedElement) => {
                // 调整克隆元素的位置以显示正确内容
                clonedElement.style.transform = `translateY(-${currentPosition}px)`;
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pageWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        if (pageNumber > 0) {
            pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        currentPosition += viewportHeight;
        pageNumber++;
    }

    pdf.save(fileName);
}


/**
 * 导出html
 */
export async function exportHtml(elementHtml, fileName = "exported.html"){
    // 1 获取样式
    const styleSheets = Array.from(document.styleSheets);
    let styleContent = '';
    for (const sheet of styleSheets) {
        try {
            // 外链样式
            if (sheet.href) {
                const res = await fetch(sheet.href);
                const text = await res.text();
                styleContent += `\n/* From ${sheet.href} */\n${text}\n`;
            } else {
                // 内联样式
                const rules = Array.from(sheet.cssRules || []);
                styleContent += rules.map(rule => rule.cssText).join('\n');
            }
        } catch (e) {
            console.warn('读取样式失败:', sheet.href, e);
        }
    }

    // 2 将图片转成 base64（可选：离线可用）
    const imgs = elementHtml.querySelectorAll("img");

    for (let img of imgs) {
        try {
            // 如果是 data: 开头的图片就跳过
            if (img.src.startsWith("data:")) continue;

            const response = await fetch(img.src, { mode: "cors" });
            const blob = await response.blob();
            const reader = new FileReader();
            img.src = await new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (err) {
            console.warn("图片转base64失败:", img.src, err);
        }
    }

    // 3 把外链 <script src=""> 下载并内联
    const scripts = document.querySelectorAll("script");
    debugger
    let scriptContent = "";
    for (const script of scripts) {
        try {
            if (script.src) {
                const res = await fetch(script.src);
                const text = await res.text();
                scriptContent += `\n/* From ${script.src} */\n${text}\n`;
            } else if (script.textContent.trim()) {
                scriptContent += `\n${script.textContent}\n`;
            }
        } catch (err) {
            console.warn("脚本下载失败:", script.src, err);
        }
    }

    // 4 将脚本内容 base64 封装，防止在 HTML 中被直接显示
    const encodedScript = btoa(unescape(encodeURIComponent(scriptContent)));

    // 5 添加 React 挂载逻辑（恢复事件）
    const rehydrateScript = `
      (function() {
        const jsBase64 = "${encodedScript}";
        const jsText = decodeURIComponent(escape(atob(jsBase64)));
    
        // 动态执行所有脚本
        const s = document.createElement('script');
        s.type = "text/javascript";
        s.text = jsText;
        document.body.appendChild(s);
    
        // React 重新挂载（确保事件恢复）
        if (window.React && window.ReactDOM && window.App) {
          const root = document.getElementById('root') || document.querySelector('.edit-box');
          if (root) {
            window.ReactDOM.hydrate(window.React.createElement(window.App), root);
          }
        }
      })();`;

    const reactRes = await fetch('https://unpkg.com/react@17.0.2/umd/react.development.js');
    const reactText = await reactRes.text();

    const reactDomRes = await fetch('https://unpkg.com/react-dom@17.0.1/umd/react-dom.development.js');
    const reactDomText = await reactDomRes.text();

    // 6 拼接完整 HTML
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${fileName}</title>
        <style>${styleContent}</style>
      </head>
      <body>
        ${elementHtml.outerHTML}
        <script>${reactText}</script>
        <script>${reactDomText}</script>
        <script>${rehydrateScript}</script>
      </body>
    </html>`;

    // 4 导出文件
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
}
