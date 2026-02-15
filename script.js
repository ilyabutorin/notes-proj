const model = {
    notes: [],

    createNote(title, description, color) {
        const newNote = {
            id: new Date().getTime(),
            title: title,
            description: description,
            color: color,
            isFavourite: false
        }
        this.notes.unshift(newNote)
    },

    toggleFavourite(id) {
        const newArr = this.notes.map((note) => {
            if (note.id === id) {
                note.isFavourite = !note.isFavourite
            }
            return note
        })
        this.notes = newArr
    },

    deleteNote(id) {
        const newArr = this.notes.filter((note) => {
            return note.id !== id
        })
        this.notes = newArr
    }
}

const view = {
    init() {
        this.renderNotes(model.notes)
        const form = document.querySelector('.note-form')
        const titleInput = document.querySelector('#note-title')
        const descriptionInput = document.querySelector('#note-text')
        const favFilter = document.querySelector('#filter-favorites')
        const ul = document.querySelector('.notes-list')

        form.addEventListener('submit', (e) => {
            e.preventDefault()
            const title = titleInput.value.trim()
            const description = descriptionInput.value.trim()
            const selectedColor = document.querySelector('input[name="color"]:checked').value
            controller.createNote(title, description, selectedColor)

        })

        ul.addEventListener('click', (e) => {
            const li = e.target.closest('li')
            if (!li) return

            const noteId = +li.dataset.id

            const deleteBtn = e.target.closest('.delete-btn')
            if (deleteBtn) {
                controller.deleteNote(noteId)
                return
            }
            const favBtn = e.target.closest('.fav-btn')
            if (favBtn) {
                controller.toggleFavourite(noteId)
                return
            }
        })

        favFilter.addEventListener('change', (e) => {
            controller.toggleFilter(e.target.checked)
        })
    },

    renderNotes(notes) {
        const ul = document.querySelector('.notes-list')

        if (notes.length === 0) {
            ul.innerHTML = `
                <li class="empty">У вас ещё нет ни одной заметки.<br> Заполните поля выше и создайте свою первую заметку!</li>
            `
            return
        }

        let notesHTML = ''

        for (let i = 0; i < notes.length; i++) {
            const note = notes[i]

            notesHTML += `
        <li data-id="${note.id}">
            <div class="li-head ${note.color}">
                <p class="note-title">${note.title}</p>
                <div class="note-actions">
                <button class="fav-btn ${note.isFavourite ? 'is-favourite' : ''}" type="button">
                <img class="fav-icon-off" src="./images/icons/heart-inactive.png" alt="">
                <img class="fav-icon-on" src="./images/icons/heart-active.png" alt="">
                </button>
                <button class="delete-btn" type="button">
                <img class="delete-icon" src="./images/icons/trash.png" alt=""></button>
                </div>
            </div>
            <p class="note-description">${note.description}</p>
        </li>
        `
        }

        ul.innerHTML = notesHTML
    },

    resetForm() {
        const form = document.querySelector('.note-form')
        form.reset()
    },

    showMessege(text, type) {
        const messegeBox = document.querySelector('.messages-box')
        const messege = document.createElement('div')
        messege.classList.add('messege', type)

        const icon = document.createElement('img')
        icon.classList.add('messege-icon')
        if (type === 'success') {
            icon.src = './images/icons/done.png'
            icon.alt = 'success'
        } else if (type === 'error') {
            icon.src = './images/icons/warning.png'
            icon.alt = 'error'
        }

        const span = document.createElement('span')
        span.textContent = text

        messege.append(icon, span)
        messegeBox.append(messege)

        setTimeout(() => {
            messege.remove()
        }, 3000);
    }
}

const controller = {
    onlyFavourites: false,

    createNote(title, description, color) {
        if (!title || !description) {
            view.showMessege('Заполните все поля!', 'error')
            return
        }
        if (title.length > 50) {
            view.showMessege('Максимальная длина заголовка - 50 символов', 'error')
            return
        }

        model.createNote(title, description, color)
        view.showMessege('Заметка добавлена', 'success')
        view.resetForm()
        this.render()
    },

    deleteNote(noteId) {
        model.deleteNote(noteId)
        view.showMessege('Заметка удалена!', 'success')
        this.render()
    },

    toggleFavourite(noteId) {
        model.toggleFavourite(noteId)
        this.render()
    },

    toggleFilter(value) {
        this.onlyFavourites = value
        this.render()
    },

    render() {
        const notesCount = document.querySelector('#total-notes-count')
        const favCountEl = document.querySelector('#favourites-count')
        document.querySelector('.filter-box').style.display = model.notes.length ? 'flex' : 'none'

        let notesToShow = model.notes
        if (this.onlyFavourites) {
            notesToShow = model.notes.filter(note => note.isFavourite)
        }

        view.renderNotes(notesToShow)

        notesCount.textContent = model.notes.length

        let favCount = model.notes.filter(note => note.isFavourite).length
        if (this.onlyFavourites) {
            favCountEl.textContent = `Избранных: ${favCount}`
        } else {
            favCountEl.textContent = ''
        }
    },
}

view.init()
controller.render()