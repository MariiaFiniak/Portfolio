//
"use strict"

let isMobile

function documentActions(e) {
  console.log("Клік на документі:", e.target)
}
function dynamicAdaptHeader() {
  console.log("dynamicAdaptHeader викликаний")
}

// Визначаємо мобільний режим
function windowLoad() {
  isMobile = window.navigator.userAgentData?.mobile
  if (isMobile) {
    document.body.setAttribute("data-touch", "")
  }

  document.addEventListener("click", documentActions)
  dynamicAdaptHeader()
}


window.addEventListener("load", windowLoad)

// ---Burger---

const iconMenu = document.querySelector(".icon-menu")
const mobileMenu = document.querySelector(".mobile-menu")
const mobileMenuList = mobileMenu?.querySelector(".mobile-menu__list")
const body = document.body
const header =
  document.querySelector(".top-header") ||
  document.querySelector(".site-header")

// Елементи, які потрібно переносити
const signUpLi = document.querySelector(".actions-top-header")?.closest("li")
const currencyLi = document.querySelector(".lang-currency")?.closest("li")

// Рідний батько для повернення назад
const originalNav = document.querySelector(".navigation__list")

// ----- функція переносу в мобільне меню
function moveToMobile() {
  if (signUpLi) mobileMenuList.append(signUpLi)
  if (currencyLi) mobileMenuList.append(currencyLi)
}

// ----- повернути назад на десктоп
function moveToDesktop() {
  if (signUpLi) originalNav.append(signUpLi)
  if (currencyLi) originalNav.append(currencyLi)
}

// --- BURGER CLICK
if (iconMenu && mobileMenu) {
  iconMenu.addEventListener("click", () => {
    body.classList.toggle("open-menu")
    mobileMenu.classList.toggle("active")
    header?.classList.toggle("active")

    if (body.classList.contains("open-menu")) {
      moveToMobile()
    } else {
      moveToDesktop()
    }
  })
}

// --- AUTO RETURN WHEN SCREEN BIGGER
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    body.classList.remove("open-menu")
    mobileMenu.classList.remove("active")
    header?.classList.remove("active")

    moveToDesktop()
  }
})

// --- Скрол при кліку на моб меню
const menuItems = document.querySelectorAll(".mobile-menu__item")
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetSelector = item.querySelector("a")?.getAttribute("href")
    if (targetSelector && targetSelector.startsWith("#")) {
      const targetBlock = document.querySelector(targetSelector)
      if (targetBlock) targetBlock.scrollIntoView({ behavior: "smooth" })
    }

    // Закриваємо меню після кліку
    body.classList.remove("open-menu")
    mobileMenu.classList.remove("active")
    header?.classList.remove("active")
  })
})


// ---Top Header---
// Зміна фону заголовка при скролі
const headerElement = document.querySelector(".top-header")

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    headerElement.classList.add("scrolled")
  } else {
    headerElement.classList.remove("scrolled")
  }
})

// ---Subscribe Form---
// Обробка форми підписки
window.addEventListener("load", () => {
  const form = document.getElementById("subscribeForm")
  const emailInput = form.querySelector(".subscribe-form__input")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = emailInput.value.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email!")
      return
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        },
      )

      const data = await response.json()
      console.log("API response:", data)
      alert("Email successfully sent to API 🚀")

      // Зберігаємо email у localStorage
      const subscribers = JSON.parse(localStorage.getItem("subscribers")) || []
      if (!subscribers.includes(email)) {
        subscribers.push(email)
        localStorage.setItem("subscribers", JSON.stringify(subscribers))
      } else {
        alert("You are already subscribed!")
      }

      emailInput.value = "" // Очищуємо поле
    } catch (error) {
      console.error("API error:", error)
      alert("Something went wrong 😢")
    }
  })
})

