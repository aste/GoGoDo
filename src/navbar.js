
export function setupNavBar() {
    const collapsedClass = "navCollapsed";
    const nav = document.querySelector(".nav")
    const navBorder = nav.querySelector(".navBorder")

    navBorder.addEventListener('click', () => {
        nav.classList.toggle(collapsedClass);
        if (navBorder.innerHTML === '→') {
            navBorder.innerHTML = '←'
        } else { navBorder.innerHTML = '→' }
    })
}