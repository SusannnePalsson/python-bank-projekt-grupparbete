const container = document.createElement("div");
container.style.fontFamily = "Arial, sans-serif";
container.style.color = "black";
container.style.padding = "20px";

container.innerHTML = `
  <h1>Psykisk ohälsa bland studenter i Indien – en statistisk analys</h1>

  <p>
    Denna rapport undersöker vilka faktorer som kan ha samband med psykisk ohälsa bland studenter i Indien.
    Vi använder data från databasen student_depression.db och analyserar sambanden med hjälp av
    statistik, visualiseringar och interaktiva diagram.
  </p>

  <h2>Syfte</h2>
  <p>
    Målet är att identifiera mönster och samband mellan faktorer som sömn, ekonomi och familjebakgrund –
    och hur dessa kan relatera till risken för depression hos studenter i Indien.
  </p>

  <h2>Rapportens delar</h2>
  <ul>
    <li><strong>Korrelation:</strong> Visar samband mellan olika faktorer och depression med interaktiva diagram.</li>
    <li><strong>Kausalitet:</strong> Resonemang om orsakssamband – vad påverkar vad?</li>
    <li><strong>Normalfördelning:</strong> Undersöker om t.ex. sömn är normalfördelad.</li>
    <li><strong>Slutsats:</strong> Sammanfattning av analysen.</li>
  </ul>

  <h2>Analyserade variabler</h2>
  <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
    <thead>
      <tr><th>Variabel</th><th>Beskrivning</th></tr>
    </thead>
    <tbody>
      <tr><td>depression</td><td>Målvariabel – 0 = ej deprimerad, 1 = deprimerad</td></tr>
      <tr><td>sleepDuration</td><td>Sömn per natt (i timmar)</td></tr>
      <tr><td>financialStress</td><td>Ekonomisk stress (skala 1–5)</td></tr>
      <tr><td>familyMentalIllness</td><td>Psykisk ohälsa i familjen (0 = Nej, 1 = Ja)</td></tr>
    </tbody>
  </table>
`;

document.body.appendChild(container);

