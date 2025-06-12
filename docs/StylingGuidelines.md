Use the Block, Element, Modifier (BEM) methodology for naming CSS classes.

A block is a top-level abstraction of a new component, for example a button. This block should be thought of as a parent
Example: `.btn { }` 

Elements (child items) can be placed inside and are denoted by appending two underscores to the block name. 
Example: `.btn__price`

Modifiers can manipulate the block so that we can theme or style that particular component without inflicting changes on a completely unrelated module. Shown by appending two hyphens to the name of the block.
Example: `.btn--orange`

Using CSS Modules in JSX
```jsx
import styles from './Button.module.css'
...  
<button className={styles.btn}>{...}</button>
<button className={styles['btn--orange']}>{...}</button>
```


Resources:
- [CSS-Tricks: BEM101](https://css-tricks.com/bem-101/)