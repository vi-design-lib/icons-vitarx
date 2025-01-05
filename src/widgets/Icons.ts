import {
  createElement,
  Element,
  mergeCssClass,
  mergeCssStyle,
  reactive,
  type WebRuntimeDom,
  Widget
} from 'vitarx'

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
   *
   * 仅内部自带的图标支持，自定义图标不支持。
   *
   * @default undefined
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
  /**
   * 引用自定义图标
   *
   * 使用该属性的前提必须在index.html中引入iconfont.js文件
   *
   * @default ''
   */
  use?: string
}

/**
 * # Icon抽象类
 *
 * 图标抽象类，用于定义图标的公共属性和构建方法。
 *
 * @abstract
 */
export default class Icons extends Widget<IconProps> {
  static #commonProps: Omit<IconProps, 'use'> = reactive({
    size: '1em',
    color: 'currentColor',
    style: undefined,
    className: undefined,
    pathFill: undefined
  })

  /**
   * 设置公共属性
   *
   * @param {Omit<IconProps, 'use'>} props - 公共属性
   */
  static setCommonProps(props: Omit<IconProps, 'use'>) {
    Object.assign(Icons.#commonProps, props)
  }

  get size() {
    return this.props.size || Icons.#commonProps.size || '1em'
  }

  get color() {
    return this.props.color || Icons.#commonProps.color || 'currentColor'
  }

  get style() {
    if (this.props.style && Icons.#commonProps.style) {
      return mergeCssStyle(this.props.style, Icons.#commonProps.style)
    }
    return this.props.style || Icons.#commonProps.style
  }

  get className() {
    if (this.props.className && Icons.#commonProps.className) {
      return mergeCssClass(this.props.className, Icons.#commonProps.className)
    }
    return this.props.className || Icons.#commonProps.className
  }

  /**
   * 获取path的填充颜色
   *
   * @private
   */
  protected get pathFill() {
    return this.props.pathFill || Icons.#commonProps.pathFill
  }

  /**
   * 使用的图标
   */
  get use() {
    const use = this.props.use
    if (!use) return ''
    return use.startsWith('#') ? use : `#${use}`
  }

  /**
   * @inheritDoc
   */
  protected build(): Element {
    return createElement(
      'svg',
      {
        width: this.size,
        height: this.size,
        color: this.color,
        style: this.style,
        class: this.className
      },
      createElement('use', { 'xlink:href': this.use })
    )
  }
}
