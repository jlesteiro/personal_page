function parseDateString(dateStr) {
  if (!dateStr) return new Date(0); // fallback for missing date

  const [monthNameRaw, yearRaw] = dateStr.split(' ');
  const monthName = monthNameRaw.trim();
  const year = parseInt(yearRaw);

  const months = {
    Jan: 0, January: 0,
    Feb: 1, February: 1,
    Mar: 2, March: 2,
    Apr: 3, April: 3,
    May: 4,
    Jun: 5, June: 5,
    Jul: 6, July: 6,
    Aug: 7, August: 7,
    Sep: 8, Sept: 8, September: 8,
    Oct: 9, October: 9,
    Nov: 10, November: 10,
    Dec: 11, December: 11
  };

  const month = months[monthName] ?? 0;
  return new Date(year, month);
}

function render() {
  const request = new XMLHttpRequest();
  request.open('GET', 'cv_entries.json', false); // 'false' makes it synchronous (blocking)
  request.send(null);

  if (request.status !== 200) {
    alert("Could not load json file");
  }
  const data = JSON.parse(request.responseText);

  data.profile.email = data.profile.email.join(' | ');
  data.skills_summary.languages = data.skills_summary.languages.join(' | ');
  data.skills_summary.programming = data.skills_summary.programming.join(' | ');
  data.skills_summary.additional_tools = data.skills_summary.additional_tools.join(' | ');

  const conferences = data.conference_participation;

  if (!Array.isArray(conferences)) {
    throw new Error("Expected 'conference_participation' to be an array.");
  }

  conferences.sort((a, b) => parseDateString(b.date) - parseDateString(a.date));

  data.conference_participation = {
    "recent": conferences.slice(0, 5),
    "additional": conferences.slice(5)
  };

  const template = document.getElementById('template').innerHTML;
  const rendered = Mustache.render(template, data);
  document.getElementById('target').innerHTML = rendered;
}