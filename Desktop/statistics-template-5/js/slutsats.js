document.getElementById("content").innerHTML = `
  <h2>Slutsats: Vad påverkar depression hos studenter?</h2>
  <p>
    Jag har undersökt tre olika faktorer som kan hänga ihop med depression: sömn, ekonomisk stress och psykisk ohälsa i familjen.
    Här sammanfattar vi vad datan visade och vad man kan dra för slutsatser.
  </p>

  <h3> Sömn (sleepDuration)</h3>
  <p>
    Pearson r ≈ -0.08 – visar inget tydligt statistiskt samband. Men i scatterdiagrammet ser vi att de som sover mindre
    verkar ha högre andel depression. Det kan tyda på att sömnbrist ändå har betydelse, även om sambandet inte är linjärt.
  </p>
  <p><strong>Slutsats:</strong> Sömnbrist kan vara en möjlig orsak till depression, men mer data behövs.</p>

  <h3> Ekonomisk stress (financialStress)</h3>
  <p>
    Pearson r ≈ 0.36 – visar ett svagt positivt samband. Ju mer ekonomisk stress en student känner,
    desto större risk att vara deprimerad enligt vår data.
  </p>
  <p><strong>Slutsats:</strong> Ekonomisk oro kan vara en bidragande faktor till psykisk ohälsa hos studenter.</p>

  <h3> Psykisk ohälsa i familjen (familyMentalHistory)</h3>
  <p>
    Pearson r ≈ 0.05 – mycket svagt samband. Det tyder på att det inte finns ett tydligt statistiskt samband i vår data.
    Men det betyder inte att faktorn saknar betydelse i verkligheten – det kan bero på att vårt datamaterial är begränsat.
  </p>
  <p><strong>Slutsats:</strong> Det är möjligt att familjebakgrund påverkar, men vår data visar inget tydligt samband.</p>
`;
    const container = document.createElement("div");
    container.style.padding = "20px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.color = "black";

    container.innerHTML = `
  <h1>Slutsats: Vad säger histogrammet om sömn?</h1>

  <p>
    När vi analyserade variabeln <strong>sleepDuration</strong> (antal timmar sömn per natt)
    såg vi att den visar ett mönster som <strong>påminner om en normalfördelning</strong>.
  </p>

  <h2>Tolkning</h2>
  <ul>
    <li>De flesta studenter sover runt 6–7 timmar per natt.</li>
    <li>Färre studenter sover väldigt lite eller väldigt mycket (t.ex. 4 eller 9 timmar).</li>
    <li>Fördelningen ser ut som en “klockform” vilket tyder på en ungefärlig normalfördelning.</li>
  </ul>

  <p>
    Det betyder att sömntimmar bland studenter varierar på ett sätt som vi ofta ser i naturliga fenomen.
    Det är viktigt, eftersom många statistiska tester kräver att datan är normalfördelad.
  </p>
`;

    document.body.appendChild(container);

