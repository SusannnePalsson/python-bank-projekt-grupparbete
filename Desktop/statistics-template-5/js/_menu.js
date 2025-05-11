import createMenu from './libs/createMenu.js';

createMenu('Studenthälsa', [
  { name: 'Introduktion', script: 'Introduktion.js' },
  { name: 'Korrelation', script: 'korrelation.js' },
  { name: 'Kausalitet', script: 'kausalitet.js' },
  { name: 'Normalfördelning', script: 'normalfordelning.js' },
  { name: 'Slutsats', script: 'slutsats.js' }
  
]);
