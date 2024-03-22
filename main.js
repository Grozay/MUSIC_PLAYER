
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player')
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist');
const PLAYER_STORAGE_KEY = 'PLAYER'
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Chúng ta của tương lai',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Sau lời từ khước',
            singer: 'Phan Mạnh Quỳnh',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Making my way',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Khuông mặt đáng thương',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: "THERE'S NO ONE AT ALL",
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: "Hãy trao cho anh",
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: "Chúng ta của hiện tại",
            singer: 'Sơn Tùng MTP',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => (
            `
            <div class="song ${index === 0 ? 'active' : ''}"  data-index=${index}>
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        ))
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    loadCurrentSong: function () {
        // console.log(cdThumb)
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    handleEven: function () {

        const _this = this;
        //sử lí phóng to thu nhỏ cdthumb
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scroll = window.scrollY;
            const newCdWidth = cdWidth - scroll;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }
        //sử lí cd quay/dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,//10s
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        //sử lí click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //khi song được thay đổi
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //khi song bị dừng
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
            // console.log(audio.currentTime)
        }

        //sử lí tua thêm oninput nó sẽ không lỗi nữa
        progress.oninput = function () {
            const seekPercentage = progress.value;
            const seekTime = seekPercentage * audio.duration / 100;
            audio.currentTime = seekTime;
        };



        //next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            $$('.song').forEach((song, index) => {
                const shouldBeActive = (index === _this.currentIndex);
                song.classList.toggle("active", shouldBeActive);
            });
            // _this.render()
        }

        //prevsong
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            $$('.song').forEach((song, index) => {
                const shouldBeActive = (index === _this.currentIndex);
                song.classList.toggle("active", shouldBeActive);
            });
            // _this.render()
        }
        //bật / tắc Btn random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle("active", _this.isRandom)
        }

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle("active", _this.isRepeat)
        }
        //next khi end bài
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        playlist.onclick = function (e) {
            const songElement = e.target.closest('.song:not(.active)')
            if (songElement || e.target.closest('.option')) {
                if (songElement) {
                    _this.currentIndex = songElement.dataset.index;
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                    $$('.song').forEach((song) => {
                        const shouldBeActive = (_this.currentIndex == song.dataset.index);
                        song.classList.toggle("active", shouldBeActive);
                        console.log(shouldBeActive)
                    });

                }
            }
        }
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        console.log(newIndex)
        this.loadCurrentSong();
    },

    start: function () {
        //load localstorage
        this.loadConfig()
        // định nghĩa thuộc tính cho object
        this.defineProperties()

        //tải bài hát đầu tiên vào UI khi chạy app
        this.loadCurrentSong()

        //lắng nghe / sử lí các sự kiện
        this.handleEven()

        //render ra giao diện
        this.render();

        randomBtn.classList.toggle("active", this.isRandom)
        repeatBtn.classList.toggle("active", this.isRepeat)

    }
}

app.start()
