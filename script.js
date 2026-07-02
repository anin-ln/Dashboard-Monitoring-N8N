//API CONFIG

const API_URL = "http://localhost:5678/webhook/dashboard2";


//CHART VARIABLE

let developerChart = null;
let repositoryChart = null;
let pieChart = null;


//LOAD DASHBOARD

async function loadDashboard() {

    try {

        const response = await fetch(API_URL + "?t=" + Date.now(), {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        console.clear();
        console.log("Dashboard Data", data);

        updateStatistic(data);

        updateTopDeveloper(data.topDeveloper);

        updateTopRepository(data.topRepository);

        updateCharts(data);

        document.getElementById("lastUpdate").textContent =
            "Last Update : " + new Date().toLocaleString("id-ID");

    }

    catch (error) {

        console.error(error);

        document.getElementById("topDeveloper").innerHTML =
            "<p>❌ Gagal mengambil data.</p>";

        document.getElementById("topRepository").innerHTML =
            "<p>❌ Periksa Webhook n8n.</p>";

    }

}


//STATISTIC

function updateStatistic(data) {

    document.getElementById("totalRepository").textContent =
        data.totalRepository || 0;

    document.getElementById("totalCommit").textContent =
        data.totalCommit || 0;

    document.getElementById("totalDeveloper").textContent =
        data.totalDeveloper || 0;

}


//TOP DEVELOPER

function updateTopDeveloper(list) {

    const container = document.getElementById("topDeveloper");

    container.innerHTML = "";

    list.forEach((item, index) => {

        container.innerHTML += `

        <div class="row">

            <div class="rank">
                #${index + 1}
            </div>

            <div class="name">
                ${item.developer}
            </div>

            <div class="value">
                ${item.total_commit} commit
            </div>

        </div>

        `;

    });

}



//TOP REPOSITORY

function updateTopRepository(list) {

    const container = document.getElementById("topRepository");

    container.innerHTML = "";

    list.forEach((item, index) => {

        container.innerHTML += `

        <div class="row">

            <div class="rank">
                #${index + 1}
            </div>

            <div class="name">
                ${item.repository}
            </div>

            <div class="value">
                ${item.total_commit} commit
            </div>

        </div>

        `;

    });

}



//CHART

function updateCharts(data) {

    const developerName =
        data.topDeveloper.map(item => item.developer);

    const developerCommit =
        data.topDeveloper.map(item => item.total_commit);


    const repositoryName =
        data.topRepository.map(item => item.repository);

    const repositoryCommit =
        data.topRepository.map(item => item.total_commit);


    if (developerChart) developerChart.destroy();

    developerChart = new Chart(

        document.getElementById("developerChart"),

        {

            type: "bar",

            data: {

                labels: developerName,

                datasets: [{

                    label: "Commit",

                    data: developerCommit,

                    borderWidth: 2

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );


    if (repositoryChart) repositoryChart.destroy();

    repositoryChart = new Chart(

        document.getElementById("repositoryChart"),

        {

            type: "bar",

            data: {

                labels: repositoryName,

                datasets: [{

                    label: "Commit",

                    data: repositoryCommit,

                    borderWidth: 2

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );


    if (pieChart) pieChart.destroy();

    pieChart = new Chart(

        document.getElementById("pieChart"),

        {

            type: "pie",

            data: {

                labels: developerName,

                datasets: [{

                    data: developerCommit

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        }

    );

}


//START

loadDashboard();

setInterval(loadDashboard, 30000);