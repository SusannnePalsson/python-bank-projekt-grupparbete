google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(init);

async function init() {
  const SQL = await initSqlJs({
    locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${f}`
  });

  const res = await fetch("/student_depression.db");
  const buf = await res.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buf));

  const stmt = db.prepare(`
    SELECT sleepDuration, depression FROM Studentmentalhealth
  `);

  let under6 = 0, under6Dep = 0;
  let over6 = 0, over6Dep = 0;

  while (stmt.step()) {
    const row = stmt.getAsObject();
    const sleep = Number(row.sleepDuration);
    const depression = Number(row.depression);

    if (!isNaN(sleep) && !isNaN(depression)) {
      if (sleep < 6) {
        under6++;
        if (depression === 1) under6Dep++;
      } else {
        over6++;
        if (depression === 1) over6Dep++;
      }
    }
  }
  stmt.free();

  const percentUnder6 = under6 ? (under6Dep / under6) * 100 : 0;
  const percentOver6 = over6 ? (over6Dep / over6) * 100 : 0;

  drawContent(percentUnder6, percentOver6);
}

function drawContent(under6, over6) {
  const content = document.getElementById("content");
  content.innerHTML = `
    <h2>Kausalitet: Vad kan orsaka depression?</h2>
    <p>
      Korrelation visar samband – men kausalitet handlar om orsak. I den här analysen försöker jag resonera kring
      <strong>vilka faktorer som kan orsaka depression</strong> bland studenter, baserat på både data och vad vi vet från verkligheten.
    </p>

    <h3>Varför sömn trots låg korrelation?</h3>
    <p>
      Även om <strong>Pearson r för sömn (sleepDuration)</strong> är nära 0 (r ≈ -0.08), visar diagrammen att studenter som sover mindre
      än 6 timmar ofta är deprimerade. Sömnbrist är också en välkänd riskfaktor för psykisk ohälsa enligt forskning. 
      <br><br>
      Därför valde jag att ta med sömn som en möjlig orsak till depression, trots att sambandet inte var statistiskt starkt i vår data.
    </p>

    <h3>Stapeldiagram: Sömn och depression</h3>
    <p>
      Diagrammet nedan visar andelen deprimerade bland de som sover < 6 timmar jämfört med ≥ 6 timmar. Det tyder på att sömnbrist <em>kan</em> vara en möjlig orsak.
    </p>
    <div id="barChart" style="width: 700px; height: 400px;"></div>

    <h3>Slutsatser kring möjliga orsaker</h3>
    <ul>
      <li><strong>Sömn:</strong> Visuellt mönster tyder på samband, trots låg korrelation. Biologiskt rimligt.</li>
      <li><strong>Ekonomisk stress:</strong> Svagt positivt samband (r ≈ 0.36). Stress påverkar psykiskt mående.</li>
      <li><strong>Familjehistoria:</strong> Svag korrelation, men kan påverka i verkligheten (genetik, miljö).</li>
    </ul>
  `;

  drawBarChart(under6, over6);
}

function drawBarChart(under6, over6) {
  const data = google.visualization.arrayToDataTable([
    ["Sömngrupp", "Andel deprimerade"],
    ["< 6h sömn", under6],
    ["≥ 6h sömn", over6]
  ]);

  const options = {
    title: "Andel deprimerade baserat på sömntid",
    hAxis: { title: "Sömn per natt" },
    vAxis: { title: "Procent deprimerade", minValue: 0, maxValue: 100 },
    legend: "none"
  };

  const chart = new google.visualization.ColumnChart(document.getElementById("barChart"));
  chart.draw(data, options);
}









