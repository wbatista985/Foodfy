/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const currentPage = location.pathname
const menuItems = document.querySelectorAll('header .link')

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active')
  }
}

function paginate (selectedPage, totalPages) {
  const pages = []
  let oldPage

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage === 1 || currentPage === totalPages
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

    if (
      firstAndLastPage ||
      (pagesAfterSelectedPage && pagesBeforeSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...')
      }

      if (oldPage && currentPage - oldPage === 2) {
        pages.push(oldPage + 1)
      }

      pages.push(currentPage)
      oldPage = currentPage
    }
  }

  return pages
}

function createPagination (pagination) {
  const filter = pagination.dataset.filter
  const page = +pagination.dataset.page
  const total = +pagination.dataset.total
  const pages = paginate(page, total)

  let elements = ''

  for (const page of pages) {
    if (String(page).includes('...')) {
      elements += `<span>${page}</span>`
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
      } else {
        elements += `<a href="?page=${page}">${page}</a>`
      }
    }
  }

  pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')

if (pagination) {
  createPagination(pagination)
}

const getLimit = () => {
  const input = document.querySelector('#photos-container')
  if (input == null) return null
  const limit = input.className.replace(/limit=/, '')
  return limit
}

const PhotosUpload = {
  input: '',
  preview: document.querySelector('#photos-preview'),
  uploadLimit: getLimit(),
  files: [],
  handleFileInput (event) {
    const { files: fileList } = event.target
    PhotosUpload.input = event.target

    if (this.hasLimit(event)) return

    Array.from(fileList).forEach((file) => {
      const reader = new FileReader()

      PhotosUpload.files.push(file)

      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)

        const div = PhotosUpload.getContainer(image)
        PhotosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file)
    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  getAllFiles () {
    const dataTransfer =
      new ClipboardEvent('').clipboardData || new DataTransfer()

    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  hasLimit (event) {
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no m??ximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach((item) => {
      if (item.classList && item.classList.value === 'photo') {
        photosDiv.push(item)
      }
    })

    const totalPhotos = fileList.length + photosDiv.length

    if (totalPhotos > uploadLimit) {
      alert('Voc?? atingiu o limite m??ximo de fotos')
      event.preventDefault()
      return true
    }

    return false
  },
  getContainer (image) {
    const div = document.createElement('div')
    div.classList.add('photo')

    div.onclick = PhotosUpload.removePhoto

    div.appendChild(image)

    div.appendChild(PhotosUpload.getRemoveButton())

    return div
  },
  getRemoveButton () {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  },
  removePhoto (event) {
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    photoDiv.remove()
  },
  removeOldPhoto (event) {
    const photoDiv = event.target.parentNode

    if (photoDiv.id) {
      const removedFiles = document.querySelector(
        'input[name="removed_files"]'
      )
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove()
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage (e) {
    const { target } = e

    ImageGallery.previews.forEach((preview) =>
      preview.classList.remove('active')
    )
    target.classList.add('active')

    ImageGallery.highlight.src = target.src
    Lightbox.image.src = target.src
  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeBottom: document.querySelector('.lightbox-target a.lightbox-close'),
  open () {
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.target.style.bottom = 0
    Lightbox.closeBottom.style.top = 0
  },
  close () {
    Lightbox.target.style.opacity = 0
    Lightbox.target.style.top = '-100%'
    Lightbox.target.style.bottom = 'initial'
    Lightbox.closeBottom.style.top = '-80px'
  }
}

const Validate = {
  apply (input, func) {
    Validate.clearErrors(input)

    const results = Validate[func](input.value)
    input.value = results.value

    if (results.error) Validate.displayError(input, results.error)
  },
  displayError (input, error) {
    input.classList.add('error')
    input.focus()
  },
  isEmail (value) {
    let error = null
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!value.match(mailFormat)) error = 'Email inv??lido'

    return {
      error,
      value
    }
  },
  clearErrors (input) {
    input.classList.remove('error')
  },
  isCpfCnpj (value) {
    let error = null
    const clearValues = value.replace(/\D/g, '')

    if (clearValues.length > 11 && clearValues.length !== 14) {
      error = 'CNPJ incorreto'
    } else if (clearValues.length < 12 && clearValues.length !== 11) {
      error = 'CPF incorreto'
    }

    return {
      error,
      value
    }
  },
  isCep (value) {
    let error = null
    const clearValues = value.replace(/\D/g, '')

    if (clearValues.length !== 8) {
      error = 'CEP incorreto'
    }

    return {
      error,
      value
    }
  }
}
