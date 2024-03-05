// У файлі src/scripts/router.js
document.addEventListener('DOMContentLoaded', () => {
    loadSection('home'); // Початкове завантаження головної сторінки
    initializeBreadcrumbs(); // Ініціалізація breadcrumbs
});

function initializeBreadcrumbs() {
    updateBreadcrumbs(['home']);
}


function updateBreadcrumbs(pathArray) {
    const breadcrumbsContainer = document.getElementById('breadcrumbs');
    breadcrumbsContainer.innerHTML = ''; // Очищуємо поточні breadcrumbs

    pathArray.forEach((path, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = path; // Тут можна замінити на назви, зрозумілі користувачеві
        a.href = "#";
        a.onclick = () => {
            const sectionPath = pathArray.slice(0, index + 1).join('/');
            loadSection(sectionPath, index > 0);
        };
        li.appendChild(a);
        breadcrumbsContainer.appendChild(li);

        if (index < pathArray.length - 1) {
            li.appendChild(document.createTextNode(' / '));
        }
    });
}


function loadSection(sectionName, isSubsection = false) {
    const mainContent = document.querySelector('main');
    let path;

    // Оновлення breadcrumbs в залежності від розділу
    const pathArray = isSubsection ? sectionName.split('/') : [sectionName];
    updateBreadcrumbs(pathArray);

    // Визначення шляху до файлу
    if (sectionName === 'home') {
        path = `sections/home.html`;
    } else if (sectionName === 'login' || sectionName === 'register') {
        path = `sections/${sectionName}.html`;
    } else if (isSubsection) {
        const [section, subsection] = sectionName.split('/');
        path = `sections/${section}/${subsection}.html`;
    } else {
        path = `sections/${sectionName}/index.html`;
    }

    fetch(path)
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html;
            mainContent.dataset.originalContent = html;
            updateActiveLink(sectionName);
            attachCardListeners();
        })
        .catch(error => console.error('Error loading section:', error));
}

// Функція для оновлення класу 'active'
function updateActiveLink(sectionName) {
    // Видаляємо клас 'active' з усіх посилань
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Додаємо клас 'active' до посилання поточної секції або основного розділу підрозділу
    document.querySelectorAll(`.nav-link[data-section="${sectionName}"], .nav-link[data-main-section="${sectionName}"]`).forEach(link => {
        link.classList.add('active');
    });
}


// Функція для навішування обробників подій на навігаційні посилання
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionName = e.target.getAttribute('data-section');
        loadSection(sectionName);
    });
});

// Функція для навішування обробників подій на картки
// Оновлена функція attachCardListeners для передачі основного розділу
function attachCardListeners() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const section = card.getAttribute('data-section');
            const mainSection = card.getAttribute('data-main-section');
            const isSubsection = section !== mainSection; // Перевірка, чи є це підрозділ
            loadSection(`${mainSection}/${section}`, isSubsection);
        });
    });
}

