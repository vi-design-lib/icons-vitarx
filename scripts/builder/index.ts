import { load } from 'cheerio'
import * as fs from 'node:fs'
import * as https from 'node:https'
import nodePath from 'node:path'

interface Glyph {
  icon_id: string
  name: string
  font_class: string
  unicode: string
  unicode_decimal: number
  component_name: string
}

interface IconfontJson {
  id: string
  name: string
  font_family: string
  css_prefix_text: string
  description: string
  glyphs: Glyph[]
  outline: number[]
  filled: number[]
}

/**
 * 下载iconfont.js内容
 *
 * @param {string} iconfontJsUrl - iconfont.js URL
 * @return {Promise<string>} svg 内容
 */
function downloadAndParseIconfont(iconfontJsUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log('Downloading iconfont.js...')
    https
      .get(iconfontJsUrl, (response) => {
        let data = ''
        response.on('data', (chunk) => {
          data += chunk
        })
        response.on('end', () => {
          const regex = /<svg.*?>.*?<\/svg>/s
          const match = data.match(regex)
          if (!match) return reject(new Error('No SVG found in iconfont.js'))
          fs.writeFileSync(nodePath.join(process.cwd(), 'iconfont.js'), data)
          resolve(match[0])
        })
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

/**
 * 去除前缀并转换为大驼峰格式
 *
 * @param {string} id - id
 * @param {string} prefix - 要去除的前缀
 * @return {string}
 */
function toPascalCase(id: string, prefix: string = ''): string {
  const withoutPrefix = prefix && id.startsWith(prefix) ? id.slice(prefix.length) : id
  const formattedId = withoutPrefix.includes('_') ? withoutPrefix.replace(/_/g, '-') : withoutPrefix
  return formattedId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

const iconfontJsUrl = 'https://at.alicdn.com/t/c/font_4802092_rowj3d2e2gm.js'
const outDir = nodePath.join(process.cwd(), '..', '..', 'src/widgets/icons')
const iconfontJsonPath = nodePath.join(process.cwd(), 'iconfont.json')
const iconfontJsPath = nodePath.join(process.cwd(), '..', '..', 'src/assets/iconfont.ts')

;(async function () {
  // 创建目录
  fs.mkdirSync(outDir, { recursive: true })

  // 读取iconfont.json
  const iconfontJson = JSON.parse(fs.readFileSync(iconfontJsonPath).toString()) as IconfontJson
  const { css_prefix_text: prefix, glyphs } = iconfontJson

  // 图标id->name映射
  const iconMap = new Map<string, Glyph>()
  glyphs.forEach((glyph) => {
    iconMap.set(prefix + glyph.font_class, glyph)
  })

  // 下载和解析iconfont.js
  const svgContent = await downloadAndParseIconfont(iconfontJsUrl)
  // 解析svg内容
  const $ = load(svgContent)
  let exports: string[] = []

  // 遍历svg子元素，生成组件
  $('svg')
    .find('symbol')
    .each((_i, el) => {
      const symbolEl = $(el)
      const paths: string[] = []

      // 遍历路径元素
      symbolEl.find('path').each((_i2, child) => {
        paths.push($(child).attr('d')!)
      })

      const id = symbolEl.attr('id')!
      const glyph = iconMap.get(id)!

      // 设置组件名称
      glyph.component_name = toPascalCase(id)

      const { name, font_class, component_name } = glyph
      const viewBox = $(el).attr('viewBox')!

      const componentCode = `// 此文件由 scripts/builder/index.ts 自动生成
import SvgIcon from '../SvgIcon.js'

/**
 * ${name} SVG图标
 * 
 * 图标详情：
 * - name: ${name}
 * - label: ${font_class}
 * - paths: ${paths.length}
 * - viewBox: ${viewBox}
 */
export default class ${component_name} extends SvgIcon {
  get paths() {
    return ${JSON.stringify(paths)}
  }
  get viewBox() {
    return '${viewBox}'
  }
  override get use() {
    return '${font_class}'
  }
}`

      const componentPath = nodePath.join(outDir, `${component_name}.ts`)
      fs.writeFileSync(componentPath, componentCode)

      exports.push(`export {default as ${component_name}} from './${component_name}.js'`)
    })

  fs.writeFileSync(nodePath.join(outDir, 'index.ts'), exports.join('\n'))

  // 对glyphs数组进行排序
  iconfontJson.glyphs = Array.from(iconMap.entries())
    .sort((a, b) => a[1].component_name.localeCompare(b[1].component_name))
    .map(([_key, glyph]) => glyph)

  // 创建 filled 和 outline 数组
  const filled: number[] = []
  const outline: number[] = []

  iconfontJson.glyphs.forEach((item, index) => {
    if (item.font_class.endsWith('-fill')) {
      filled.push(index)
    } else {
      outline.push(index)
    }
  })

  iconfontJson.filled = filled
  iconfontJson.outline = outline

  // 写入iconfont.ts文件
  const iconfontJsCode = `// 此文件由 scripts/builder/index.ts 自动生成
export default ${JSON.stringify(iconfontJson, null, 2)} as const
`
  fs.writeFileSync(iconfontJsPath, iconfontJsCode)

  console.log(`解析和组件生成已完成，共计生成：${glyphs.length}个图标组件。`)
})()
