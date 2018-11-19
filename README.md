# remora
Framework agnostic lib for stick-scrolling DOM elements.

Just wrap your block into following markup

```
<div id="container">
  <div id="target">Your content here</div>
</div>  
```

and launch

```
let myRemora = new Remora({
  target: document.getElementById('target'),
  container: document.getElementById('container')
})
```

dont forget to destroy then dont need more.
```
myRemora.destroy()
```

super simple :)
