import { computed, createElement, DomHelper, type Element, reactive, Widget } from 'vitarx'

const exclude: Array<keyof IconProps> = [
  'className',
  'color',
  'pathFill',
  'size',
  'style',
  'rotate',
  'use',
  'ariaLabel',
  'ariaHidden'
] as const
export interface IconProps {
  /**
   * 图标样式类名
   */
  className?: Vitarx.HTMLClassProperties
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
  style?: Vitarx.HTMLStyleProperties
  /**
   * 图标旋转角度
   *
   * @default 0
   */
  rotate?: number
  /**
   * 引用自定义图标
   *
   * 要使用自定义图标，必须在`index.html`中导入相关的资源，
   *
   * ```html
   * // 一次性导入内置图标库 550+ 图标
   * // 并不建议这样做，使用组件方式使用图表，可以在打包时进行摇树优化，减小包体积
   * <script src="node_modules/@vi-design/icons-vitarx/dist/assets/iconfont.js"></script>
   *
   * // 导入自定义的图标库
   * <script src="https://at.alicdn.com/t/c/font_4802092_0jhy18kzqt7.js"></script>
   *
   * 使用 use 属性引用图标
   * <Icons use="icon-name"></Icons>
   * ```
   *
   * @default ''
   */
  use?: string
  /**
   * 辅助文本
   *
   * @default undefined
   */
  ariaLabel?: string
  /**
   * 辅助文本是否隐藏
   *
   * @default true
   */
  ariaHidden?: boolean
}

/**
 * Icons 类是一个用于渲染 SVG 图标的组件类，继承自 Widget 基类。
 * 该类提供了一套统一的图标渲染方案，支持自定义图标大小、颜色、样式等属性，
 * 并内置了无障碍访问支持。
 *
 * 核心功能：
 * - 支持设置全局公共属性（通过 setCommonProps 方法）
 * - 支持自定义图标大小、颜色、旋转角度等属性
 * - 支持自定义样式和 CSS 类名
 * - 支持无障碍访问（aria-label 和 aria-hidden）
 * - 支持图标路径填充色自定义
 *
 * 使用示例：
 * ```tsx
 * // 设置全局公共属性
 * Icons.setCommonProps({
 *   size: '2em',
 *   color: '#333'
 * });
 *
 * // 使用图标
 * //  use:图标名称或 ID  , size:图标大小 , rotate:图标旋转角度
 * <Icons use="icon-name" size="1.5em" rotate="90"/> // 此种方式必须在index.html加载iconfont.js
 * ```
 *
 * 构造函数参数：
 * @param props - 图标属性对象，包含以下可选属性：
 *   - use: 图标名称或 ID（必需）
 *   - size: 图标大小，默认为 '1em'
 *   - color: 图标颜色，默认为 'currentColor'
 *   - style: 自定义样式对象
 *   - className: 自定义 CSS 类名
 *   - pathFill: 图标路径填充色
 *   - rotate: 旋转角度（度数）
 *   - ariaLabel: 无障碍文本
 *   - ariaHidden: 是否隐藏无障碍文本，默认为 true
 *
 * 注意事项：
 * - 图标名称（use 属性）会自动添加 # 前缀（如果未提供）
 * - 当同时设置实例属性和全局公共属性时，实例属性优先级更高
 * - rotate 属性默认为 0，表示不旋转
 * - ariaLabel 默认使用图标名称（去掉 # 前缀）
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

  #style = computed(() => {
    if (this.props.style && Icons.#commonProps.style) {
      return DomHelper.mergeCssStyle(this.props.style, Icons.#commonProps.style)
    }
    return this.props.style || Icons.#commonProps.style
  })

  get style() {
    return this.#style.value
  }

  #className = computed(() => {
    if (this.props.className && Icons.#commonProps.className) {
      return DomHelper.mergeCssClass(this.props.className, Icons.#commonProps.className)
    }
    return this.props.className || Icons.#commonProps.className
  })

  get className() {
    return this.#className.value
  }
  /**
   * 获取图标旋转角度
   */
  get rotate() {
    return this.props.rotate ?? Icons.#commonProps.rotate ?? 0
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
   * 无障碍文本
   */
  get ariaLabel() {
    return this.props.ariaLabel || Icons.#commonProps.ariaLabel || this.use.replace(/^#/, '')
  }

  /**
   * 无障碍文本是否隐藏
   */
  get ariaHidden() {
    return this.props.ariaHidden ?? Icons.#commonProps.ariaHidden ?? true
  }

  /**
   * svg属性
   */
  get svgProps() {
    const props: Record<string, any> = {
      width: this.size,
      height: this.size,
      color: this.color,
      'aria-hidden': this.ariaHidden,
      'aria-label': this.ariaLabel,
      'v-bind': [this.props, exclude]
    }
    if (this.className) props.class = this.className
    if (this.style) props.style = this.style
    if (this.rotate) props.transform = `rotate(${this.rotate})`
    return props
  }

  /**
   * @inheritDoc
   */
  build(): Element {
    return createElement('svg', this.svgProps, createElement('use', { 'xlink:href': this.use }))
  }
}
