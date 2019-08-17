// import axios from 'axios';

function randomText() {
  const arr = [
    'gulp',
    'sass',
    'scss',
    'babel',
    `browser sync`,
    'autoprefixer',
    'sourcemaps',
    `webpack stream`,
    `es6 modules`,
    'stylelint',
    'axios',
  ];

  arr.forEach(text =>
    document
      .querySelector('.list')
      .insertAdjacentHTML('beforeend', `<li class="listItem">${text}</li>`),
  );
}

randomText();
