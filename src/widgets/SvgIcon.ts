import { createElement, type Element } from 'vitarx'
import Icons from './Icons.js'

export default abstract class SvgIcon extends Icons {
  // 子类必须实现，返回svg的viewBox属性
  abstract get viewBox(): string
  // 子类必须实现，返回的数组中的每个元素为path的d属性
  abstract get paths(): string[]
  /**
   * @inheritDoc
   */
  override build(): Element {
    const children = this.paths.map((d, i) => {
      const fill = this.pathFill?.[i] ?? 'currentColor'
      return createElement('path', { d, fill })
    })
    return createElement('svg', {
      ...this.svgProps,
      viewBox: this.viewBox,
      children
    })
  }
}
