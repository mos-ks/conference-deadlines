document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("data/conferences.yml");
    const text = await response.text();
    const conferences = jsyaml.load(text); // Parse YAML into JavaScript objects
  
    const now = new Date();
    const upcoming = [];
    const past = [];
  
    // Split conferences into upcoming and past
    conferences.forEach(conf => {
      const deadline = new Date(conf.deadline);
      if (deadline >= now) {
        upcoming.push(conf);
      } else {
        past.push(conf);
      }
    });
  
    // Sort conferences by deadline
    upcoming.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    past.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
  
    // Render upcoming conferences
    const upcomingList = document.getElementById("upcoming-list");
    upcoming.forEach(conf => {
      const div = document.createElement("div");
      div.classList.add("conference");
      div.innerHTML = `
        <h3><a href="${conf.link}" target="_blank">${conf.title} ${conf.year}</a></h3>
        <p>${conf.place} | ${conf.date}</p>
        <p>Deadline: ${new Date(conf.deadline).toLocaleString()} (${conf.timezone})</p>
        <p>${conf.note || ""}</p>
        <div class="countdown" data-deadline="${conf.deadline}"></div>
      `;
      upcomingList.appendChild(div);
    });
  
    // Render past conferences
    const pastList = document.getElementById("past-list");
    past.forEach(conf => {
      const div = document.createElement("div");
      div.classList.add("conference");
      div.innerHTML = `
        <h3><a href="${conf.link}" target="_blank">${conf.title} ${conf.year}</a></h3>
        <p>${conf.place} | ${conf.date}</p>
        <p>Deadline was: ${new Date(conf.deadline).toLocaleString()}</p>
        <p>${conf.note || ""}</p>
      `;
      pastList.appendChild(div);
    });
  
    // Add countdown timers
    document.querySelectorAll(".countdown").forEach(timer => {
      const deadline = new Date(timer.dataset.deadline);
      setInterval(() => {
        const now = new Date();
        const diff = deadline - now;
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          timer.textContent = `Time left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          timer.textContent = "Deadline passed!";
        }
      }, 1000);
    });
  });
  