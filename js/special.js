function loadTeam() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "team.json?v=" + Date.now(), true); // добавили анти-кеш
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const team = JSON.parse(xhr.responseText);
          const teamList = document.getElementById('teamList');
          teamList.innerHTML = '';

          team.forEach(member => {
            const li = document.createElement('li');
            li.className = 'member';
            if (member.role.toLowerCase().includes('co-funder')) {
              li.classList.add('co-funder');
            }

            li.innerHTML = `
              <div class="thumb">
                <img src="${member.img}" alt="${member.name}">
              </div>
              <div class="description">
                <h4>${member.name}</h4>
                <span class="role">${member.role}</span>
                <p>${member.description}<br>
                  <a href="${member.usernameLink}" target="_blank">@${member.username}</a>
                  <a href="${member.phoneLink}">${member.phone}</a>
                </p>
              </div>
            `;
            teamList.appendChild(li);
          });

        } catch (e) {
          console.error('Ошибка при парсинге JSON:', e);
        }
      } else {
        console.error('Ошибка загрузки team.json: статус', xhr.status);
      }
    }
  };
  xhr.send();
}

loadTeam();