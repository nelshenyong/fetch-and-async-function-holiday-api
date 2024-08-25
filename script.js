let holidayTemplate = Handlebars.compile(document.getElementById("holidayCard").innerHTML);

let currentYear = new Date().getFullYear();
let currentMonth = 1;
let loading = false;

async function fetchHolidays(year = null, month = null) {
    let apiUrl = 'https://dayoffapi.vercel.app/api';
    if (year) {
        apiUrl += `?year=${year}`;
    }
    if (month) {
        apiUrl += year ? `&month=${month}` : `?month=${month}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();
    return { holidays: data };
}

function renderHolidays(holidayList) {
    const container = document.getElementById('content');
    const html = holidayTemplate(holidayList);
    container.insertAdjacentHTML('beforeend', html);
}

async function initialLoad() {
    const holidayList = await fetchHolidays(currentYear);
    renderHolidays(holidayList);
}

document.getElementById("loadHolidays").addEventListener('click', async () => {
    const year = document.getElementById("yearInput").value || currentYear;
    const month = document.getElementById("monthInput").value || null;
    const holidayList = await fetchHolidays(year, month);
    document.getElementById('content').innerHTML = '';
    renderHolidays(holidayList);
});

document.getElementById("refreshHolidays").addEventListener('click', async () => {
    document.getElementById('content').innerHTML = ''; 
    currentYear = new Date().getFullYear();
    currentMonth = 1;
    const holidayList = await fetchHolidays(currentYear);
    renderHolidays(holidayList);
});

window.addEventListener('scroll', async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
        loading = true;
        currentYear--;
        const holidayList = await fetchHolidays(currentYear);
        renderHolidays(holidayList);
        loading = false;
    }
});

document.getElementById("yearText").textContent = new Date().getFullYear();

initialLoad();

let dark = JSON.parse(localStorage.getItem('dark') || 'false');
const icon = document.getElementById("icon");
const circle = document.querySelector('.circle');

function darkToggle() {
  icon.classList.toggle('dark');
  circle.classList.toggle('dark');
  document.body.classList.toggle('dark');
}

if (dark) {
  darkToggle();
}

icon.addEventListener('click', function() {
  dark = !dark;
  localStorage.setItem('dark', dark);
  darkToggle();
});