// Ladda databasen och bibliotek
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(init);

let db = null;

async function init() {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
  });

  const response = await fetch("/student_depression.db");
  const buffer = await response.arrayBuffer();
  db = new SQL.Database(new Uint8Array(buffer));

  // Skapa innehåll på sidan
  const container = document.createElement("div");
  container.style.padding = "20px";
  container.innerHTML = `
    <h1>Normalfördelning: Sömntimmar hos studenter</h1>
    <p><strong>Syftet med denna sida</strong> är att undersöka om variabeln <strong>sleepDuration</strong> – alltså hur många timmar per natt en student sover – är normalfördelad.</p>
    <div style="background:#eaf3ff;padding:10px;margin:10px 0;">
      <strong>Varför just sömn?</strong>
      <ul>
        <li><strong>Numerisk och kontinuerlig:</strong> SleepDuration mäts i timmar och kan anta många olika värden (t.ex. 4.5, 6, 8).</li>
        <li><strong>Passar för normalfördelning:</strong> Variabler som är kvantitativa kan vi analysera med histogram.</li>
        <li><strong>Andra variabler passar inte:</strong> T.ex. depression (0/1) eller financialStress (1–5) är kategoriska.</li>
      </ul>
    </div>
    <h2>Histogram: Antal studenter per antal sömntimmar</h2>
    <div id="chart" style="width: 800px; height: 400px;"></div>
  `;
  document.body.appendChild(container);

  // Hämta sömndata
  const result = db.exec("SELECT sleepDuration FROM Studentmentalhealth")[0];
  const values = result.values.map(row => Number(row[0])).filter(v => !isNaN(v));

  // Skapa frekvenstabell
  const counts = {};
  values.forEach(v => {
    const bin = Math.round(v); // grupperar t.ex. 6.3 → 6
    counts[bin] = (counts[bin] || 0) + 1;
  });

  const chartData = new google.visualization.DataTable();
  chartData.addColumn("number", "Sömn per natt (timmar)");
  chartData.addColumn("number", "Antal studenter");
  Object.keys(counts).sort((a, b) => a - b).forEach(key => {
    chartData.addRow([Number(key), counts[key]]);
  });

  const chart = new google.visualization.ColumnChart(document.getElementById("chart"));
  chart.draw(chartData, {
    title: "Hur mycket sover studenter?",
    hAxis: { title: "Sömn per natt (timmar)" },
    vAxis: { title: "Antal studenter" },
    legend: "none",
    colors: ["#3366cc"]
  });

  //  Lägg till slutsats här!
  const conclusion = document.createElement("div");
  conclusion.style.background = "#eaf3ff";
  conclusion.style.padding = "15px";
  conclusion.style.marginTop = "20px";
  conclusion.innerHTML = `
    <h3>Vad visar diagrammet?</h3>
    <p>Histogrammet visar hur många studenter som sover ett visst antal timmar per natt. Om staplarna bildar en klockform är fördelningen ungefär normal.</p>
    <h4><strong>Tolkning:</strong></h4>
    <p>
      I vårt fall är sömn ungefär normalfördelad. Det finns en topp kring mitten (t.ex. 6–7 timmar), men det är inte helt symmetriskt. 
      Därför kan vi säga att <em>sleepDuration</em> liknar en normalfördelning men är <em>inte perfekt</em>.
    </p>
  `;
  document.body.appendChild(conclusion);
}







