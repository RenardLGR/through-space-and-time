window.addEventListener('load', () => {
    document.querySelector('#content').classList.add('fade-in-slide');
})

const pauseBtn = document.querySelector('.pause-btn')
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused
    pauseBtn.innerText = isPaused ? "Play" : "Pause"
})