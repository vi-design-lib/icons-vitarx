import Icons from '@/widgets/Icons.js'
import { createElement, Element } from 'vitarx'

export default abstract class SvgIcon extends Icons {
  // 子类必须实现，返回svg的viewBox属性
  abstract get viewBox(): string
  // 子类必须实现，返回的数组中的每个元素为path的d属性
  abstract get paths(): string[]
  // 子类必须实现，返回图标的标签名，用于无障碍访问
  abstract get label(): string
  /**
   * @inheritDoc
   */
  protected override build(): Element {
    const children = this.paths.map((d, i) => {
      if (this.pathFill) {
        const fill = this.pathFill[i] ?? 'currentColor'
        return createElement('path', { d, fill })
      }
      return createElement('path', { d })
    })
    return createElement('svg', {
      viewBox: this.viewBox,
      width: this.size,
      height: this.size,
      color: this.color,
      ariaLabel: this.label,
      style: this.style,
      class: this.className,
      children
    })
  }
}
