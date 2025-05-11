// Ladda Google Charts 
// Det här laddar in biblioteket för att rita diagram
// Vi använder "corechart" för att visa scatterplots

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(init);

// Skapa en funktion för att hämta data från SQLite-databasen
let dbQuery = (function () {
  let db = null;
  return {
    // Laddar databasen från en .db-fil
    use: async function (filename) {
      const SQL = await initSqlJs({
        locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${f}`
      });
      const res = await fetch(`/${filename}.db`);
      const buf = await res.arrayBuffer();
      db = new SQL.Database(new Uint8Array(buf));
    },
    // Kör en SQL-fråga och returnerar resultat som array av objekt
    run: async function (sql) {
      const stmt = db.prepare(sql);
      const result = [];
      while (stmt.step()) result.push(stmt.getAsObject());
      stmt.free();
      return result;
    }
  };
})();

// Initierar allt efter laddning
async function init() {
  try {
    // Ladda databasen "student_depression.db"
    await dbQuery.use('student_depression');

    // Hämta data från tabellen "Studentmentalhealth"
    const data = await dbQuery.run(`
      SELECT sleepDuration, financialStress, familyMentalHistory, depression
      FROM Studentmentalhealth
    `);

    // Variabler som vi vill analysera mot depression
    const variables = ["sleepDuration", "financialStress", "familyMentalHistory"];

    // Skapa innehållet på sidan
    const container = document.createElement("div");
    container.style.padding = "20px";
    document.body.appendChild(container);
    container.innerHTML = `
      <h2>Korrelation mellan faktorer och depression</h2>
      <p>Den här sidan visar hur starkt varje vald faktor hänger ihop med depression hos studenter. Använd dropdownen nedan för att välja en faktor och se dess samband.</p>
      <p><em>Observera:</em> Ett r-värde nära 0 betyder att det inte finns ett tydligt statistiskt samband i datan. Det betyder dock inte att faktorn är oviktig i verkligheten – det kan bero på att datamängden är liten eller att andra faktorer påverkar resultatet.</p>
      <ul>
        <li><strong>sleepDuration:</strong> sömntimmar per natt – negativt r-värde visar svagt samband. Om r är nära 0 (t.ex. -0.08), betraktas det som inget tydligt samband.</li>
        <li><strong>financialStress:</strong> ekonomisk stress (1–5) – har visat ett svagt positivt samband.</li>
        <li><strong>familyMentalHistory:</strong> psykisk ohälsa i familjen – mycket svagt eller inget samband, beroende på r-värde.</li>
      </ul>
      <div style="margin-bottom: 10px;">
        <label for="varSelect">Välj variabel: </label>
        <select id="varSelect">
          ${variables.map(v => `<option value="${v}">${v}</option>`).join("")}
        </select>
      </div>
      <div id="chart" style="width: 700px; height: 400px;"></div>
      <div id="info" style="margin-top: 15px; font-size: 1.1em;"></div>
    `;

    // Koppla dropdown till diagramfunktion
    const select = document.getElementById("varSelect");
    select.addEventListener("change", () => draw(data, select.value));

    // Visa första diagrammet direkt
    draw(data, variables[0]);

  } catch (err) {
    document.body.innerHTML = `<p style="color:red">❌ Fel: ${err.message}</p>`;
  }
}

// Rita scatterplot baserat på vald variabel
function draw(data, variable) {
  // Filtrera bort ogiltiga värden
  const filtered = data
    .map(r => [Number(r[variable]), Number(r.depression)])
    .filter(r => !isNaN(r[0]) && !isNaN(r[1]));

  // Förbered datat för Google Charts
  const chartData = new google.visualization.DataTable();
  chartData.addColumn("number", variable);
  chartData.addColumn("number", "Depression");
  chartData.addRows(filtered);

  // Rita scatterplot med trendlinje
  const chart = new google.visualization.ScatterChart(document.getElementById("chart"));
  chart.draw(chartData, {
    title: `Samband mellan ${variable} och depression`,
    hAxis: { title: variable },
    vAxis: { title: "Depression (0 = Nej, 1 = Ja)", minValue: -0.2, maxValue: 1.2 },
    legend: "none",
    pointSize: 6,
    trendlines: {
      0: {
        type: "linear",
        color: "blue",
        lineWidth: 2,
        opacity: 0.5,
        showR2: true
      }
    }
  });

  // Räkna ut Pearson-korrelation
  const x = filtered.map(d => d[0]);
  const y = filtered.map(d => d[1]);
  const r = pearson(x, y).toFixed(2);

  // Visa tolkning och sammanfattning
  document.getElementById("info").innerHTML = interpretPearson(variable, r);
}

// Pearson-korrelationen räknas ut här (formel)
function pearson(x, y) {
  const n = x.length;
  const avgX = x.reduce((a, b) => a + b, 0) / n;
  const avgY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - avgX;
    const dy = y[i] - avgY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  return num / Math.sqrt(denX * denY);
}

// Sammanfattning beroende på korrelationsvärde
function interpretPearson(variable, r) {
  r = parseFloat(r);
  let tolkning = "inget tydligt samband";
  if (r >= 0.5) tolkning = "ett starkt positivt samband";
  else if (r >= 0.2) tolkning = "ett svagt positivt samband";
  else if (r <= -0.5) tolkning = "ett starkt negativt samband";
  else if (r <= -0.2) tolkning = "ett svagt negativt samband";

  const beskrivning = {
    sleepDuration: "Antal timmar studenten sover per natt. Mer sömn kan betyda bättre återhämtning. Även om r är negativt, så är ett värde nära 0 som t.ex. -0.08 inte ett tydligt samband.",
    financialStress: "Hur stressad studenten känner sig ekonomiskt (1 = lite, 5 = mycket). Ett positivt r-värde visar att mer stress kan hänga ihop med depression.",
    familyMentalHistory: "Om studenten har psykisk ohälsa i familjen (0 = Nej, 1 = Ja). R-värdet visar om det finns ett samband, men värden nära 0 betyder svagt eller inget samband. Det betyder dock inte att det saknar betydelse i verkligheten."
  };

  return `
    <p><strong>Beskrivning av ${variable}:</strong> ${beskrivning[variable]}</p>
    <p><strong>Pearson r:</strong> ${r}</p>
    <p><strong>Tolkning:</strong> Det finns ${tolkning} mellan <strong>${variable}</strong> och <strong>depression</strong>.</p>
  `;
}


