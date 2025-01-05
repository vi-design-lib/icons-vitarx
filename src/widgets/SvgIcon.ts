import { createElement, Element, reactive, type WebRuntimeDom, Widget } from 'vitarx'

export type IconProps = {
  /**
   * 图标样式类名
   */
  className?: WebRuntimeDom.HTMLClassProperties
  /**
   * 图标默认颜色
   */
  color?: string
  /**
   * 图标路径填充颜色
   *
   * 可以为具有多个路径的图标，单独设置填充颜色。
   */
  pathFill?: string[]
  /**
   * 图标尺寸
   *
   * @default `1em`
   */
  size?: string
  /**
   * 图标样式
   *
   * @default undefined
   */
  style?: WebRuntimeDom.HTMLStyleProperties
}

/**
 * # Icon抽象类
 *
 * 图标抽象类，用于定义图标的公共属性和构建方法。
 *
 * @abstract
 */
export default abstract class SvgIcon extends Widget<IconProps> {
  static #commonProps: IconProps = reactive({
    size: '1em',
    color: 'currentColor',
    style: undefined,
    className: undefined,
    pathFill: undefined
  })

  /**
   * 设置公共属性
   *
   * @param {IconProps} props - 公共属性
   */
  static setCommonProps(props: IconProps) {
    Object.assign(SvgIcon.#commonProps, props)
  }

  get size() {
    return this.props.size || SvgIcon.#commonProps.size || '1em'
  }

  get color() {
    return this.props.color || SvgIcon.#commonProps.color || 'currentColor'
  }

  get style() {
    return this.props.style || SvgIcon.#commonProps.style
  }

  get className() {
    return this.props.className || SvgIcon.#commonProps.className
  }

  // 子类必须实现，返回svg的viewBox属性
  abstract get viewBox(): string
  // 子类必须实现，返回的数组中的每个元素为path的d属性
  abstract get paths(): string[]
  // 子类必须实现，返回图标的标签名，用于无障碍访问
  abstract get label(): string
  /**
   * 获取path的填充颜色
   *
   * @private
   */
  private get pathFill() {
    return this.props.pathFill || SvgIcon.#commonProps.pathFill
  }

  /**
   * @inheritDoc
   */
  protected build(): Element {
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
