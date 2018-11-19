export default class Remora {
  constructor(props) {

    this.lastScroll = window.scrollY;
    this.lastDirection = null;

    this.gaps = Object.assign({ 
      top: 0, 
      bottom: 0 
    }, props.gaps || {})

    this.target = props.target;
    this.container = props.container;

    this.adjustPosition = this.adjustPosition.bind(this);

    this.init(props);
  }

  init() {
    if (!this.isDomNode(this.target) || !this.isDomNode(this.container)) {
      throw new Error(`'target' and 'container' params must be a DOM element`);
    }

    if (Object.keys(this.gaps).some(key => Number.isNaN(this.gaps[key]))) {
      throw new Error(`'gaps' values must be numbers`);
    }

    this.prepare();
    this.setListeners();
    this.adjustPosition();
  }

  destroy() {
    this.removeListeners();
  }

  prepare() {
    this.target.style.width = '100%';

    this.container.style.position = 'relative';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
  }

  isDomNode(input) {
    return (
      typeof Node === "object" ? 
        input instanceof Node : 
        input && typeof input === "object" && typeof input.nodeType === "number" && typeof input.nodeName==="string"
    );
  }

  setListeners() {
    document.addEventListener('scroll', this.adjustPosition, { passive: true });

    if (window.ResizeObserver) {
      this._resizeObserver = new ResizeObserver(this.adjustPosition);
      this._resizeObserver.observe(this.target);
    }
  }

  removeListeners() {
    document.removeEventListener('scroll', this.adjustPosition);

    if (this._resizeObserver) {
      this._resizeObserver.unobserve(this.target);
    }
  }

  adjustPosition() {
    let targetRect = this.target.getBoundingClientRect(),
      containerRect = this.container.getBoundingClientRect(),
      direction = window.scrollY >= this.lastScroll ? 'down' : 'up',
      isTargetOverflow = targetRect.height > innerHeight;

    if (this.lastDirection && isTargetOverflow && direction !== this.lastDirection) {
      this.release(Math.abs(containerRect.top - targetRect.top), targetRect.height);
    } else {
      if (direction == 'down') {
        if (isTargetOverflow) {
          (targetRect.bottom + this.gaps.bottom) < innerHeight && this.stick(
            innerHeight - targetRect.height - this.gaps.bottom);

          containerRect.bottom <= targetRect.bottom && this.release(
            Math.abs(containerRect.height - targetRect.height), targetRect.height);
          
        } else {
          containerRect.top < this.gaps.top && this.stick(this.gaps.top);
        }
      } else {
        targetRect.top >= this.gaps.top && this.stick(this.gaps.top);

        containerRect.top >= this.gaps.top && this.release(0, targetRect.height);
      }
    }
      
    this.lastScroll = window.scrollY;
    this.lastDirection = direction;
  }

  stick(top) {
    this.target.style.position = 'sticky';
    this.target.style.top = `${top}px`;
  }
  
  release(top, height) {
    this.target.style.position = 'absolute';
    this.target.style.top = `${top}px`;
    this.target.style.height = `${height}px`;
  }
}