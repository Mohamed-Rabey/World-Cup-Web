document.addEventListener('DOMContentLoaded', () => {
    let menu = document.querySelector('.nav_menu');
    let menu_toggle = document.querySelector('.mobile-menu-icon');
    let menu_toggle_icon = document.querySelector('.mobile-menu-icon ion-icon');
    menu_toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        menu.classList.contains('active') ?
            menu_toggle_icon.setAttribute('name', 'close-outline') :
            menu_toggle_icon.setAttribute('name', 'menu-outline');
    });
    let days = document.querySelector('.days');
    let hours = document.querySelector('.hours');
    let minutes = document.querySelector('.minutes');
    let seconds = document.querySelector('.seconds');
    const start = new Date('2026-11-20 16:00:00Z').getTime();

    function time() {
        requestAnimationFrame(time);
        const current = new Date().getTime();
        const remaining = start - current;
        let totalDay = Math.floor(remaining / 1000 / 60 / 60 / 24);
        let totalHour = Math.floor((remaining / 1000 / 60 / 60) % 24);
        let totalMin = Math.floor((remaining / 1000 / 60) % 60);
        let totalSec = Math.floor((remaining / 1000) % 60);
        days.innerText = `${totalDay < 10 ? '0' + totalDay : totalDay}`;
        hours.innerText = `${totalHour < 10 ? '0' + totalHour : totalHour}`;
        minutes.innerText = `${totalMin < 10 ? '0' + totalMin : totalMin}`;
        seconds.innerText = `${totalSec < 10 ? '0' + totalSec : totalSec}`;
        if (remaining < 0) {
            document.querySelector('.worldcup-count-down').innerHTML = `
         <h3 class="running">World Cup Running</h3>   
         `;
            cancelAnimationFrame(time);
        }
    }
    time();
});

async function fetchPoints() {
    let points_wrapper = document.querySelector('.points-container');
    let loader = document.querySelector('.loader');
    let url = 'https://world-cup.codsfli.com/points.php';
    let data = await fetch(url);
    if (data.ok) {
        setTimeout(async() => {
                    loader.remove();
                    let response = await data.json();
                    response.map((groups) => {
                                let sor = groups.teams.sort((a, b) => {
                                    return a.position - b.position;
                                });
                                points_wrapper.innerHTML += `
                <div class="points-table">
  <h1 class="group-heading">${groups.group}</h1>
  <table>
    <thead>
      <tr>
        <th>Team</th>
        <th>MP</th>
        <th>L</th>
        <th>D</th>
        <th>W</th>
        <th>PTS</th>
      </tr>
    </thead>
    <tbody>
      ${sor
        .map(
          (team) => `
      <tr>
        <td>
          <div class="d-a">
            <img
              src="${team.flag}"
              alt="${team.Team}"
              class="team-flag"
            />
            <span>${team.flag
              .split('https://world-cup.codsfli.com/flag/')
              .join('')
              .split('.png')
              .join('')}</span>
          </div>
        </td>
        <td>${team.match_play}</td>
        <td>${team.loss}</td>
        <td>${team.draw}</td>
        <td>${team.win}</td>
        <td>${team.points}</td>
      </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
</div>
                `;
      });
    }, 1000);
  }
}
fetchPoints();

let scroll_btn = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        scroll_btn.classList.add('active');
    } else {
        scroll_btn.classList.remove('active');
    }
});

scroll_btn.addEventListener('click', () => {
    document.documentElement.scrollIntoView({
        behavior: 'smooth',
    });
});

async function fetchMatch() {
    let match_by_date = document.querySelector('#match-date');
    let match_by_group = document.querySelector('#match-group');
    let data = await fetch('./fifa-world-cup.json');
    let response = await data.json();
    let all_match = [];

    function randerDom(match, selector) {
        selector.innerHTML += `
        <div class="match">
        <div class="match-info">
            <h4 class="group">${match.group}</h4>
            <h4>Match Number<span class="badge">${match.matchNumber}</span> </h4>
        </div>
        <div class="flags">
            <div class="home-flag">
                <img src="${match.home_flag}" alt="${match.home_team}" class="flag" />
            <h3 class="home-team">${match.home_team}</h3>
            </div>
            <span class="vs">
            VS
            </span>
            <div class="away-flag">
            <img src="${match.away_flag}" alt="${match.away_team}" class="flag" />
            <h3 class="home-team">${match.away_team}</h3>
            </div>
        </div>
        <div class="time-area">
            <div class="time">
                <h4 class="month">${match.month}</h4>
                <h4 class="day">${match.day}</h4>
                <h4 class="date">${match.date}</h4>
            </div>
            <h4 class="match-time">${match.localTime}</h4>
        </div>
     </div>
  `;
    }

    for (let i = 0; i < response.length; i++) {
        let time = new Date(response[i]['DateUtc']);
        let localTime = time.toLocaleTimeString().replace(':00:00', ':00');
        let day_month = time.toString().split(' ');
        let date = day_month[2];
        let home_team = response[i]['HomeTeam'];
        let home_flag = response[i]['flag'][0];
        let away_team = response[i]['AwayTeam'];
        let away_flag = response[i]['flag'][1];
        let stadium = response[i]['Location'];
        let group = response[i]['Group'];
        let matchNumber = response[i]['MatchNumber'];
        let roundNumber = response[i]['RoundNumber'];
        let Match = {
            localTime,
            day: day_month[0],
            month: day_month[1],
            home_team,
            home_flag,
            away_team,
            away_flag,
            stadium,
            group,
            matchNumber,
            roundNumber,
            date,
        };
        all_match.push(Match);
        randerDom(Match, match_by_date);
    }

    function fBg(group) {
        return all_match.filter((g) => {
            return g.group.includes(group);
        });
    }
    let filter_by_group = [
        ...fBg('Group A'),
        ...fBg('Group B'),
        ...fBg('Group C'),
        ...fBg('Group D'),
        ...fBg('Group E'),
        ...fBg('Group F'),
        ...fBg('Group G'),
        ...fBg('Group H'),
    ];
    for (let j = 0; j < filter_by_group.length; j++) {
        randerDom(filter_by_group[j], match_by_group);
    }
}
fetchMatch();
