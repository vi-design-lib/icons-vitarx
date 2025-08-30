# @vi-design/icons-vitarx

这是为[vitarx框架](https://github.com/vitarx-lib/core)打造的图标组件库
_____________________________________________________________________

## 安装
```bash
npm install @vi-design/icons-vitarx
```

## 基本使用
```jsx
import { IconHome } from '@vi-design/icons-vitarx'

export default function App() {
  // 默认图标大小为1em，默认颜色为inherit
  return <IconHome />
  // 自定义图标大小
  return <IconHome size="24px" />
  // 自定义图标颜色
  return <IconHome color="red" />
  // 自定义图标样式
  return <IconHome style={{ color: 'red' }} />
  // 自定义css class
  return <IconHome className="my-icon" />
  // 填充颜色，仅对有多个path的图标有效，Home图标只有一个path，所以不会生效
  return <IconHome pathFill={['#fff', '#000']} />
  // 图标旋转90°
  return <IconHome rotate={90} />
}
```

## 可选属性
```ts
type IconProps = {
  /**
   * 图标样式类名
   */
  className?: Vitarx.HtmlClassProperties
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
  style?: Vitarx.HtmlStyleProperties
  /**
   * 图标旋转角度
   *
   * @default 0
   */
  rotate?: number
  /**
   * 引用自定义图标
   *
   * 使用该属性的前提必须在index.html中引入iconfont.js文件
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
  /** 除以上属性以外还支持所有其他和svg元素已关的属性，包括事件，会自动绑定给svg元素 */
  [key: string]: any
}
```

## 全局共享属性
```ts
// main.ts
import { Icons } from '@vi-design/icons-vitarx'
// 通过 Icons.setCommonProps 设置全局共享属性
Icons.setCommonProps({
  size: '16px',
  color: '#000'
})
```

## 自定义图标
```jsx
import { Icons } from '@vi-design/icons-vitarx'

// 在index.html中引入阿里巴巴矢量图标库生成的iconfont.js文件，CDN载入示例如下
// <script src="https://at.alicdn.com/t/c/font_4802092_rowj3d2e2gm.js"></script>

export default function App() {
  // 使用自定义的图标，同样会继承Icons.setCommonProps设置的全局属性
  return <Icons use="icon-name" />
}
```
