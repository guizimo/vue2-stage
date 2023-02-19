// 正则表达式
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/

// htmlparser2

export function parseHTML(html) {

  // 转成抽象语法树
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = []
  let currentParent
  let root

  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }

  function start(tag, attrs) {
    let node = createASTElement(tag, attrs)
    if (!root) {
      root = node
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node
  }

  function end() {
    stack.pop()
    currentParent = stack[stack.length - 1]
  }

  function chars(text) {
    text = text.replace(/\s/g, '')
    text && currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentParent
    })
  }

  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let attr, end
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5]})
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }

  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) { // 开始标签
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }
  return root
}
