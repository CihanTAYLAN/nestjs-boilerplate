async function setup() {
  let configJ = await fetch('/swagger-doc-json').then((response) =>
    response.json(),
  );

  docContainer.innerHTML = `<elements-api  data-theme='dark' apidescriptiondocument='${JSON.stringify(configJ).replaceAll('"', '&quot;').replaceAll("'", '&#39;')}' layout="sidebar" router="hash"></elements-api>`;

  const stopligtScript = document.createElement('script');
  stopligtScript.setAttribute('src', '/public/doc/stoplight.min.js');
  document.head.appendChild(stopligtScript);

  const jqueryScript = document.createElement('script');
  jqueryScript.setAttribute('src', '/public/doc/jquery.min.js');
  document.head.appendChild(jqueryScript);

  const searchString = document.createElement('script');
  searchString.setAttribute('src', '/public/doc/sl-search.js');
  document.head.appendChild(searchString);

  setTimeout(() => {
    $('#loader').remove();
    $('#loader').remove();
    $('#docContainer').css('display', 'block');
  }, 1000);
}

setup();
