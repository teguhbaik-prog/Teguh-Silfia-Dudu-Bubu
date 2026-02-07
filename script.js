/* =========================================================
   CONFIG
   ========================================================= */
const APP_PASSWORD = "123456"; // ganti password di sini (sederhana sesuai permintaan)

const SPECIAL_DATES = {
  birthday: { month: 7, day: 26, message: "Selamat Ulang Tahun, Sayang 🎂💗" },
  anniversary: { month: 8, day: 16, message: "Happy Anniversary Kita 💍✨" }
};

/* =========================================================
   DATA STRUCTURE (ISI DATA DI SINI SAJA)
   ========================================================= */
const photos = [
  // { src: "media/photos/1.jpg", caption: "Pantai pertama kita" }
];

const videos = [
  // { src: "media/videos/1.mp4", thumbnail: "media/thumbs/1.jpg", title: "Liburan Kita" }
];

const audios = [
  // { src: "media/audio/1.mp3", title: "Our Song", mood: "romantis" }
];

const timeline = [
  // { date: "2024-02-14", title: "Pertama Bertemu", description: "Hari yang tak terlupakan", image: "" }
];

/* =========================================================
   DOM ELEMENTS
   ========================================================= */
const passwordPage = document.getElementById("password-page");
const mainContent = document.getElementById("main-content");

const photoGrid = document.getElementById("photo-grid");
const videoList = document.getElementById("video-list");
const mainVideoPlayer = document.getElementById("main-video-player");

const audioPlayer = document.getElementById("main-audio-player");
const musicList = document.getElementById("music-list");

const timelineContainer = document.getElementById("timeline-container");
const letterContainer = document.getElementById("letter-container");

/* =========================================================
   PASSWORD PAGE
   ========================================================= */
document.getElementById("password-submit").addEventListener("click", () => {
  const input = document.getElementById("password-input").value;
  const error = document.getElementById("password-error");

  if (input === APP_PASSWORD) {
    passwordPage.style.opacity = "0";
    setTimeout(() => {
      passwordPage.style.display = "none";
      mainContent.hidden = false;
      mainContent.classList.add("fade-in", "show");
      initApp();
    }, 500);
  } else {
    error.textContent = "Password salah";
  }
});

/* =========================================================
   INIT APP
   ========================================================= */
function initApp() {
  applySavedTheme();
  checkSpecialDate();
  renderTimeline();
  renderPhotos();
  renderVideos();
  renderMusic();
  renderLoveLetter();
}

/* =========================================================
   DAY / NIGHT MODE
   ========================================================= */
function toggleTheme() {
  document.body.classList.toggle("night");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("night") ? "night" : "day"
  );
}

function applySavedTheme() {
  if (localStorage.getItem("theme") === "night") {
    document.body.classList.add("night");
  }
}

/* =========================================================
   SPECIAL DATE MODE
   ========================================================= */
function checkSpecialDate() {
  const now = new Date();
  Object.values(SPECIAL_DATES).forEach(event => {
    if (
      now.getMonth() + 1 === event.month &&
      now.getDate() === event.day
    ) {
      alert(event.message); // efek ringan & aman performa
    }
  });
}

/* =========================================================
   PHOTO GALLERY (LAZY LOAD + BERTAHAP)
   ========================================================= */
function renderPhotos() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector("img");
        img.src = img.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  });

  photos.forEach(photo => {
    const item = document.createElement("div");
    item.className = "media-item fade-in";

    const img = document.createElement("img");
    img.dataset.src = photo.src;
    img.alt = photo.caption || "";

    item.appendChild(img);
    photoGrid.appendChild(item);
    observer.observe(item);
  });
}

/* =========================================================
   VIDEO GALLERY
   ========================================================= */
function renderVideos() {
  videos.forEach(video => {
    const item = document.createElement("div");
    item.className = "media-item";

    const img = document.createElement("img");
    img.src = video.thumbnail;
    img.alt = video.title;

    item.addEventListener("click", () => {
      mainVideoPlayer.pause();
      mainVideoPlayer.src = video.src;
      mainVideoPlayer.load();
    });

    item.appendChild(img);
    videoList.appendChild(item);
  });
}

/* =========================================================
   MUSIC PLAYLIST (ADVANCED)
   ========================================================= */
let currentTrack = 0;

function renderMusic(filterMood = null) {
  musicList.innerHTML = "";
  const filtered = filterMood
    ? audios.filter(a => a.mood === filterMood)
    : audios;

  filtered.forEach((audio, index) => {
    const li = document.createElement("li");
    li.textContent = audio.title;

    li.addEventListener("click", () => {
      currentTrack = index;
      playTrack(filtered);
    });

    musicList.appendChild(li);
  });
}

function playTrack(list) {
  audioPlayer.pause();
  audioPlayer.src = list[currentTrack].src;
  audioPlayer.load();
}

/* =========================================================
   LOVE LETTER (SCROLL REVEAL)
   ========================================================= */
function renderLoveLetter() {
  const text = `
    Terima kasih sudah hadir dalam hidupku.
    Setiap hari bersamamu adalah anugerah.
  `;

  text.split("").forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.opacity = 0;
    letterContainer.appendChild(span);
  });

  const spans = letterContainer.querySelectorAll("span");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        spans.forEach((s, i) => {
          setTimeout(() => (s.style.opacity = 1), i * 30);
        });
      }
    });
  });

  observer.observe(letterContainer);
}

/* =========================================================
   TIMELINE
   ========================================================= */
function renderTimeline() {
  timeline.forEach(item => {
    const box = document.createElement("div");
    box.className = "fade-in";

    box.innerHTML = `
      <h4>${item.date}</h4>
      <strong>${item.title}</strong>
      <p>${item.description}</p>
    `;

    timelineContainer.appendChild(box);
  });
}
