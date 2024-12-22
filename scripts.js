const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSLaShL-N5m5XLscc8Yh6StmqVoWm2935RFpMtJV-3s5HBnyYH5RoImEi6OZ_cqtd6gg/exec';

async function fetchData() {
    const loader = document.getElementById('loader');

    let response;

    try {
        response = await fetch(SCRIPT_URL, {
            method: 'GET',
        });
    } catch (error) {
        console.error('Error:', error);
        const p = document.createElement('p');
        p.textContent = 'Failed to load data. Please try again later.';
        document.body.appendChild(p);
        return;
    } finally {
        loader.style.display = 'none';
    }

    const data = await response.json();
    const tbody = document.querySelector('#gifts-table tbody');
    tbody.innerHTML = '';

    data.slice(1).forEach(row => {
        appendRow(row, tbody);
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            const description = e.target.getAttribute('data-description');
            const selected = e.target.checked;

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, selected }),
            });
        });
    });
}

function appendRow(row, tbody) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${row[0]}</td>
        <td>${replaceUrlsWithLinks(row[1])}</td>
        <td>
            <label>
            <input type="checkbox" ${row[2] ? 'checked disabled' : ''}
                data-description="${row[0]}">
                <span class="custom-checkbox ${row[2] ? ' checkbox-fetched-checked' : 'checkbox-fetched-unchecked'}"></span>
            </label>
        </td>
    `;
    tbody.appendChild(tr);
}

function replaceUrlsWithLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${domain}</a>`;
    });
}

function adjustBodyWidth() {
    document.body.style.width = window.innerWidth + 'px';
}

window.addEventListener('resize', adjustBodyWidth);

fetchData();
adjustBodyWidth();
