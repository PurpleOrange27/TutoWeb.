/* =========================================
   MASTER SCRIPT - KELOMPOK 11 (FINAL MERGED)
   Fitur: Auth, Register, UI/UX, Animations
   ========================================= */

// 1. AUTH GUARD (Jalankan SEBELUM DOM Loaded agar proteksi cepat)
checkAuthentication();

function checkAuthentication() {
  const isLoginPage = window.location.pathname.includes("login.html");
  const isLoggedIn = localStorage.getItem("user_token");

  // Cek posisi folder (apakah di root atau di dalam materi/)
  const isInMateri = window.location.pathname.includes("/materi/");
  const pathToRoot = isInMateri ? "../" : "";

  if (!isLoggedIn) {
    // JIKA BELUM LOGIN:
    if (!isLoginPage) {
      // Tendang ke halaman login jika mencoba akses halaman lain
      window.location.href = pathToRoot + "login.html";
    }
  } else {
    // JIKA SUDAH LOGIN:
    if (isLoginPage) {
      // Tendang ke home jika mencoba buka halaman login lagi
      window.location.href = "index.html";
    }
  }
}

// Event Listener saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initActiveLink();
  initScrollAnimation();
});

/* -----------------------------------------
   2. FITUR LOGIN & REGISTER (UPDATED - USERNAME CHECK)
   ----------------------------------------- */

// Fungsi Login (Backup logic di script.js)
function handleLogin(e) {
  if (e) e.preventDefault();

  // Ambil input Username (bukan Email lagi)
  const userInput = document.getElementById("loginUser").value; 
  const passInput = document.getElementById("password").value;

  // Ambil data database
  const dbUsername = localStorage.getItem("db_username");
  const dbPass = localStorage.getItem("db_password");
  const dbName = localStorage.getItem("db_name");

  if (!dbUsername) {
    // Fungsi Toast Baru (jika ada) atau Alert biasa
    if(typeof showCustomToast === 'function') {
        showCustomToast("⚠️ Akun belum terdaftar.", "error");
    } else {
        alert("Akun belum terdaftar.");
    }
    return false;
  }

  // Cek Username & Password
  if (userInput === dbUsername && passInput === dbPass) {
    localStorage.setItem("user_token", "session_active_123");
    
    if(typeof showCustomToast === 'function') {
        showCustomToast("✅ Login Berhasil! Mengalihkan...", "success");
    }

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } else {
    if(typeof showCustomToast === 'function') {
        showCustomToast("❌ Username atau Password salah!", "error");
    } else {
        alert("Username atau Password salah!");
    }
  }
  return false;
}

/* -----------------------------------------
   3. FITUR LOGOUT (UPDATED)
   ----------------------------------------- */
function handleLogout() {
  if (confirm("Yakin ingin keluar dari akun?")) {
    showToast("👋 Sampai Jumpa!", "success");

    // Hapus sesi dan data user agar bersih saat login ulang
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");

    const isInMateri = window.location.pathname.includes("/materi/");
    const pathToRoot = isInMateri ? "../" : "";

    setTimeout(() => {
      window.location.href = pathToRoot + "login.html";
    }, 1000);
  }
}

/* -----------------------------------------
   3. FITUR LOGOUT
   ----------------------------------------- */
function handleLogout() {
  if (confirm("Yakin ingin keluar dari akun?")) {
    showToast("👋 Sampai Jumpa!", "success");

    // Hapus sesi
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_name");

    // Deteksi path agar redirect tidak error
    const isInMateri = window.location.pathname.includes("/materi/");
    const pathToRoot = isInMateri ? "../" : "";

    setTimeout(() => {
      window.location.href = pathToRoot + "login.html";
    }, 1000);
  }
}

/* -----------------------------------------
   4. NAVBAR & MOBILE MENU (Versi Lengkap)
   ----------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");

  // Efek Scroll pada Navbar
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  // Toggle Menu Mobile
  if (burger) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("nav-active");

      // Animasi link muncul satu per satu
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = "";
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`;
        }
      });
      burger.classList.toggle("toggle");
    });

    // Tutup menu jika klik di luar
    document.addEventListener("click", (e) => {
      if (
        !nav.contains(e.target) &&
        !burger.contains(e.target) &&
        nav.classList.contains("nav-active")
      ) {
        nav.classList.remove("nav-active");
        burger.classList.remove("toggle");
        navLinks.forEach((link) => {
          link.style.animation = "";
        });
      }
    });
  }
}

/* -----------------------------------------
   5. UTILITY FUNCTIONS & ANIMATIONS
   ----------------------------------------- */

// Highlight Menu Aktif
function initActiveLink() {
  const currentLocation = location.href;
  const menuItem = document.querySelectorAll(".nav-links a");
  const dropdownBtn = document.querySelector(".dropbtn");

  menuItem.forEach((item) => {
    if (item.href === currentLocation) {
      item.classList.add("active");
      // Jika link ada di dalam dropdown, highlight parent-nya juga
      if (item.closest(".dropdown-content") && dropdownBtn) {
        dropdownBtn.classList.add("active");
      }
    }
  });
}

// Animasi Scroll (Fade In Up)
function initScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show-animate");
    });
  });

  // Target elemen yang mau dianimasikan
  const hiddenElements = document.querySelectorAll(
    ".course-card, .feature-box, .sub-bab, .team-card, .content-card"
  );
  hiddenElements.forEach((el) => observer.observe(el));
}

// Fitur Show/Hide Code (Untuk halaman Materi)
function showHide(id) {
  var x = document.getElementById(id);
  var btn = document.querySelector(`button[onclick="showHide('${id}')"]`);
  if (x.style.display === "none" || x.style.display === "") {
    x.style.display = "block";
    if (btn) btn.innerText = "🙈 Sembunyikan Kode";
  } else {
    x.style.display = "none";
    if (btn) btn.innerText = "👁️ Lihat Kode";
  }
}

// Toast Notification System
function showToast(message, type = "success") {
  const existingToast = document.getElementById("toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = `show ${type}`;
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

// Handler Form Kontak (Halaman Contact) - UPDATE EMAIL
function handleContact(e) {
  e.preventDefault();

  const form = document.getElementById("contactForm");
  const nama = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const pesan = document.getElementById("pesan").value;
  const btnSubmit = form.querySelector("button[type='submit']");

  if (nama && email && pesan) {
    // 1. Ubah teks tombol loading
    const originalBtnText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'Mengirim... <i class="fas fa-spinner fa-spin"></i>';
    btnSubmit.disabled = true;

    // 2. Siapkan data form
    const formData = new FormData(form);

    // 3. Kirim via Fetch ke FormSubmit
    // GANTI EMAIL DI URL BAWAH INI JIKA PERLU
    fetch("https://formsubmit.co/ajax/rrusdiaputra@gmail.com", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Sukses
        showToast(`✅ Terima kasih, ${nama}! Pesan terkirim.`, "success");
        form.reset();
      })
      .catch((error) => {
        // Gagal
        console.error("Error:", error);
        showToast("⚠️ Maaf, terjadi kesalahan jaringan.", "error");
      })
      .finally(() => {
        // Kembalikan tombol seperti semula
        btnSubmit.innerHTML = originalBtnText;
        btnSubmit.disabled = false;
      });
  } else {
    showToast("⚠️ Harap lengkapi semua data.", "error");
  }
  return false;
}

/* -----------------------------------------
   6. FITUR DARK / LIGHT MODE (NEW)
   ----------------------------------------- */

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
});

function initTheme() {
  const themeBtn = document.getElementById("theme-toggle");
  const body = document.body;

  // 1. Cek Local Storage (Apakah user pernah pilih mode?)
  const savedTheme = localStorage.getItem("site_theme");

  // Jika ada simpanan 'light', aktifkan mode terang
  if (savedTheme === "light") {
    body.classList.add("light-mode");
    if (themeBtn) themeBtn.innerText = "☀️"; // Icon Matahari
  } else {
    // Default Dark
    if (themeBtn) themeBtn.innerText = "🌙"; // Icon Bulan
  }

  // 2. Event Listener Tombol
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      body.classList.toggle("light-mode");

      // Cek kondisi sekarang
      if (body.classList.contains("light-mode")) {
        localStorage.setItem("site_theme", "light");
        themeBtn.innerText = "☀️";
        showToast("☀️ Mode Terang Diaktifkan", "success");
      } else {
        localStorage.setItem("site_theme", "dark");
        themeBtn.innerText = "🌙";
        showToast("🌙 Mode Gelap Diaktifkan", "success");
      }
    });
  }
}
// --- Responsive Menu Toggle ---
function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  const burger = document.querySelector(".burger");

  // Toggle Menu
  navLinks.classList.toggle("active");

  // Burger Animation
  burger.classList.toggle("toggle");
}

// Menutup menu saat link diklik (khusus mobile)
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    const navLinks = document.querySelector(".nav-links");
    if (navLinks.classList.contains("active")) {
      toggleMenu();
    }
  });
});
document.addEventListener('DOMContentLoaded', function() {
    // Memastikan video dan iframe responsif
    const videos = document.querySelectorAll('iframe, video');
    videos.forEach(v => {
        v.style.width = '100%';
    });

    // Menangani klik pada menu sidebar di mobile agar otomatis scroll ke atas
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Perbaikan interaksi tombol (Touch Support)
    const buttons = document.querySelectorAll('button, .btn-prev, .btn-next');
    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        }, {passive: true});
        btn.addEventListener('touchend', function() {
            this.style.opacity = '1';
        }, {passive: true});
    });
});
// Memastikan area tap minimal 44px untuk kenyamanan jari
document.querySelectorAll('.btn-toggle-answer, .btn-cta, .btn-demo').forEach(button => {
    button.style.minHeight = '44px';
    button.style.minWidth = '44px';
});

// Menangani Scaling Dinamis pada Proyek Akhir (Bab 8)
window.addEventListener('resize', () => {
    const gridDemo = document.querySelector('.grid-demo');
    if (gridDemo) {
        if (window.innerWidth < 480) {
            gridDemo.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            gridDemo.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
    }
});
