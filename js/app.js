import { html, Component, render } from '../js/spux.js'
import '../js/dior.js'

const json = di.data['@graph']

async function getVersion() {
  const response = await fetch('./package.json')
  const data = await response.json()
  return data.version
}

var version = await getVersion()

function Ontology(props) {
  return html`
    <div>
      <h1>${props.title}</h1>
      <p>${props.description}</p>
      <p style="font-style: italic;">Version: ${version}</p>
    </div>
  `
}

function Category(props) {
  function handleHeadingClick(e) {
    e.preventDefault()
    const id = e.target.id
    window.history.pushState(null, null, `#${id}`)
  }

  return html`
    <div>
      <h1 id="${props.id}" onClick=${handleHeadingClick}>${props.id}</h1>
      <p>Comment: ${props.comment}</p>
      <p>Term status: ${props.termStatus}</p>
    </div>
  `
}

function App() {
  const ontology = json.find(item => item['@type'] === 'owl:Ontology')
  const items = json.filter(item => {
    const t = item['@type']
    return Array.isArray(t) ? t.includes('rdfs:Class') : t === 'rdfs:Class'
  })

  const properties = json.filter(item => {
    const t = item['@type']
    return Array.isArray(t) ? t.includes('rdfs:Property') : t === 'rdfs:Property'
  })

  return html`
    <a href="https://github.com/mashlib/solidos" class="github-fork">
      <img
        decoding="async"
        loading="lazy"
        width="149"
        height="149"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_white_ffffff.png?resize=149%2C149"
        class="attachment-full size-full"
        alt="Fork me on GitHub"
        data-recalc-dims="1"
      />
    </a>

    <header class="w3c-header">
      <h1><a style="text-decoration: none" href="https://github.com/SolidOS" target="_blank" rel="noopener noreferrer">SolidOS</a></h1>
      <h2>Vocabulary</h2>
    </header>
    <div class="container">
      <${Ontology} title=${ontology.title} description=${ontology.description} />
      <hr />
      ${items.length > 0 && html`
        <h2>Classes</h2>
        ${items.map(
          item => html`
            <div class="property-block">
              <${Category}
                id="${item['@id'].split(/[:#\/]/).pop()}"
                comment=${item.comment}
                termStatus=${item.term_status}
              />
            </div>
          `
        )}
        <hr />
      `}

      <h2>Properties</h2>
      ${properties.map(
        item => html`
          <div class="property-block">
            <${Category}
              id="${item['@id'].split(/[:#\/]/).pop()}"
              comment=${item.comment}
              termStatus=${item.term_status}
            />
          </div>
        `
      )}
    </div>
  `
}

render(html`<${App} />`, document.body)
