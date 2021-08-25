document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const jumper = document.createElement('div')
    let jumperLeftMargin = 50
    let jumperBottomMargin = 150
    let running = true
    let platformCount = 5
    let platforms = []
    let isJumping = false
    let isMovingLeft = false
    let isMovingRight = false
    let upTimerId
    let downTimerId
    let leftTimerId
    let rightTimerId
    let score = 0

    class Platform {
        constructor(newPlatformBottom) {
            this.bottom = newPlatformBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)

        }
    }
    function createJumper() {
        grid.appendChild(jumper)
        jumper.classList.add('jumper')
        jumperLeftMargin = platforms[0].left
        jumper.style.left = jumperLeftMargin + 'px'
        jumper.style.bottom = jumperBottomMargin + 'px'
    }

    function createPlatforms() {
        for(let i = 0; i < platformCount; i++) {
            let platformMargin = 600 / platformCount
            let newPlatformBottom = 100 + i * platformMargin
            let newPlatform = new Platform(newPlatformBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms() {
        if(jumperBottomMargin > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                    score++
                }
            })
        }
    }

    function drop() {
        isJumping = false
        clearInterval(upTimerId)
        downTimerId = setInterval(function() {
            jumperBottomMargin -=5
            jumper.style.bottom = jumperBottomMargin + 'px'
            if(jumperBottomMargin <=0 ){
                gameOver()
            }
            platforms.forEach(platform => {
                if (jumperBottomMargin >= platform.bottom
                    && jumperBottomMargin <= platform.bottom + 15
                    && jumperLeftMargin + 60 >= platform.left
                    && jumperLeftMargin <= platform.left + 85
                    && !isJumping) {
                        console.log("Safe Landing!")
                        jump()
                    }
            })
        },30)
    }

    function jump() {
        console.log("here")
        isJumping = true
        clearInterval(downTimerId)
        upTimerId = setInterval(function() {
            let oldJumperBottomMargin = jumperBottomMargin
            let jumpDistance = Math.min(200,520-oldJumperBottomMargin)
            jumperBottomMargin += jumpDistance
            console.log(jumperBottomMargin)
            jumper.style.bottom = jumperBottomMargin
            if(jumperBottomMargin >= oldJumperBottomMargin + jumpDistance) {
                drop()
            }
        },30)
    }

    function moveLeft() {
        if(isMovingRight || isMovingLeft) {
            clearInterval(rightTimerId)
            clearInterval(leftTimerId)
            isMovingRight = false
        }
        isMovingLeft = true
        jumper.style.backgroundImage = "url(img/Jumper_back.png)"
        leftTimerId = setInterval(function() {
            if(jumperLeftMargin >= 0) {
                jumperLeftMargin -=5
                jumper.style.left = jumperLeftMargin + 'px'
            }
        },30)
    }

    function moveRight() {
        if(isMovingLeft || isMovingRight) {
            clearInterval(leftTimerId)
            clearInterval(rightTimerId)
            isMovingLeft = false
        }
        isMovingRight = true
        jumper.style.backgroundImage = "url(img/Jumper_front.png)"
        rightTimerId = setInterval(function() {
            if(jumperLeftMargin <=340) {
                jumperLeftMargin += 5
                jumper.style.left = jumperLeftMargin + 'px'
            }
        },30)
    }

    function controller(e) {
        if(e.key == "ArrowLeft") {
            moveLeft()
        }
        else if(e.key== "ArrowRight") {
            moveRight()
        }
    }

    function gameOver() {
        running = false
        while(grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        grid.innerHTML = score
    }

    function start() {
        if(running) {
            createPlatforms()
            createJumper()
            console.log(jumperBottomMargin)
            setInterval(movePlatforms,30)
            jump()
            document.addEventListener('keyup',controller)
        }
    }

    start()
})