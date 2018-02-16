import {
    Component,
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';

import './zoom.css';

/**
 * A material design file upload queue component.
 */
@Directive({
    selector: 'img[zoom]',
  })
  export class ZoomDirective  {

    private _element: HTMLImageElement;
    private parentDivTag: HTMLDivElement;
    private overlayDivTag: HTMLDivElement;

    private transitionEndEvent: string = this.getTransitionEndEvent();
    private isTransitionSupported = this.checkIfTransitionSupported();

    private isZoomActive: boolean = false;
    private initialScrollPosition: any = null;

    WINDOW_HEIGHT_OFFSET = 80;
    WINDOW_WIDTH_OFFSET = 80;
    _imgScaleFactor = 0;
    constructor(private element:  ElementRef,
                private renderer: Renderer2) {
        this._element = this.element.nativeElement;
    }

    @Input('zoom')
    set zoom(value: any) {
    }

    @HostListener('click', ['$event'])
    public renderZoom($event: any): any {

        if(this.isZoomActive) return;

        if(!this._element || this._element.tagName != 'IMG') return;

        if (this._element.width >= (window.innerWidth - this.WINDOW_WIDTH_OFFSET)) return;
        
        // create a div with class zoom-img-wrap
        this.parentDivTag = this.renderer.createElement('div');
        this.renderer.addClass(this.parentDivTag, 'zoom-img-wrap');

        this.renderer.insertBefore(this._element.parentElement, this.parentDivTag, this._element);
        this.renderer.appendChild(this.parentDivTag, this._element);

        this.renderer.addClass(this._element, 'zoom-img');

        this.overlayDivTag = this.renderer.createElement('div');
        this.renderer.addClass(this.overlayDivTag, 'zoom-overlay');
        this.renderer.appendChild(document.body, this.overlayDivTag);

        this.calculateZoom();
        this.triggerAnimation();
        
        this.initialScrollPosition =  window.pageYOffset || document.documentElement.scrollTop;

        this.renderer.listen('document', 'scroll', this.scrollHandler.bind(this));        
        this.renderer.listen('document', 'keyup', this.keyUpHandler.bind(this));
        this.renderer.listen('document', 'click', this.clickHandler.bind(this));

        if ('bubbles' in $event) {
          if ($event.bubbles) $event.stopPropagation();
        } else {
          $event.cancelBubble = true;
        }

        this.isZoomActive = true;

    }

    private clickHandler($event: any) {
      if($event.preventDefault) {
        $event.preventDefault();
      } else {
        $event.returnValue = false;
      }

      if ('bubbles' in $event) {
        if ($event.bubbles) $event.stopPropagation();
      } else {
        $event.cancelBubble = true;
      }
      this.closeActiveZoom(false);
    }

    private keyUpHandler($event: any) {
      if($event.keyCode == 27) this.closeActiveZoom(false);
    }

    private scrollHandler($event: any) {
        if (this.initialScrollPosition === null) this.initialScrollPosition = (window.pageYOffset || document.documentElement.scrollTop);
        var deltaY = this.initialScrollPosition - (window.pageYOffset || document.documentElement.scrollTop);
        if (Math.abs(deltaY) >= 40) this.closeActiveZoom(false);
    }

    private calculateZoom() {
        this._element.offsetWidth // repaint before animating
    
        //https://html5test.com/results/desktop.html HTML5 properties
        var originalFullImageWidth  = this._element.naturalWidth
        var originalFullImageHeight = this._element.naturalHeight;
    
        var maxScaleFactor = originalFullImageWidth / this._element.width;
    
        var viewportHeight = (window.innerHeight - this.WINDOW_HEIGHT_OFFSET);
        var viewportWidth  = (window.innerWidth- this.WINDOW_WIDTH_OFFSET);
    
        var imageAspectRatio    = originalFullImageWidth / originalFullImageHeight
        var viewportAspectRatio = viewportWidth / viewportHeight
    
        if (originalFullImageWidth < viewportWidth && originalFullImageHeight < viewportHeight) {
          this._imgScaleFactor = maxScaleFactor
    
        } else if (imageAspectRatio < viewportAspectRatio) {
          this._imgScaleFactor = (viewportHeight / originalFullImageHeight) * maxScaleFactor
    
        } else {
          this._imgScaleFactor = (viewportWidth / originalFullImageWidth) * maxScaleFactor
        }
    }

    private triggerAnimation() {
      this._element.offsetWidth // repaint before animating
      
      let scrollTop   = window.scrollX;
  
      let viewportY = scrollTop + (window.innerHeight / 2);
      let viewportX = (window.innerWidth/ 2);
  
      let imageCenterY = this._element.getBoundingClientRect().top + (this._element.height / 2);
      let imageCenterX = this._element.getBoundingClientRect().left + (this._element.width / 2);
  
      let _translateY = viewportY - imageCenterY;
      let _translateX = viewportX - imageCenterX;
  
      let targetTransform = 'scale(' + this._imgScaleFactor + ')';
      let imageWrapTransform = 'translate(' + _translateX + 'px, ' + _translateY + 'px)';
  
      if(this.isTransitionSupported) {
        imageWrapTransform += ' translateZ(0)';
      }
  

      this.renderer.setStyle(this._element, 'transform', targetTransform);
      this.renderer.setStyle(this._element, '-ms-transform', targetTransform);
      this.renderer.setStyle(this._element, '-webkit-transform', targetTransform);

      this.renderer.setStyle(this.parentDivTag, 'transform', imageWrapTransform);
      this.renderer.setStyle(this.parentDivTag, '-ms-transform', imageWrapTransform);
      this.renderer.setStyle(this.parentDivTag, '-webkit-transform', imageWrapTransform);
  
      this.renderer.addClass(document.body, 'zoom-overlay-open');
    }



    private closeActiveZoom (forceDispose: boolean) {
      if (!this.isZoomActive) return;

      if(forceDispose) {
        this.disposeZoom();
      } else {
        this.unZoom();
      }

      this.initialScrollPosition = null;

      document.removeEventListener('scroll', this.scrollHandler, true);      
      document.removeEventListener('click', this.clickHandler, true);
      document.removeEventListener('keyup', this.keyUpHandler, true);
      
      this.isZoomActive = false;
    }

    public unZoom() {

      this.renderer.removeClass(document.body, 'zoom-overlay-open');
      this.renderer.addClass(document.body, 'zoom-overlay-transitioning');

      this.renderer.setStyle(this._element, 'transform', '');
      this.renderer.setStyle(this._element, '-ms-transform', '');
      this.renderer.setStyle(this._element, '-webkit-transform', '');

      this.renderer.setStyle(this.parentDivTag, 'transform', '');
      this.renderer.setStyle(this.parentDivTag, '-ms-transform', '');
      this.renderer.setStyle(this.parentDivTag, '-webkit-transform', '');
      
      if (!this.isTransitionSupported) {
        return this.disposeZoom();
      }
  
      this.emulateTransitionEnd(this._element, 300, this.disposeZoom.bind(this));

   }

    private disposeZoom() {
      if (this.parentDivTag && this.parentDivTag.parentNode) {
        this.renderer.removeClass(this._element, 'zoom-img');

        //  TODO need to destroy the nodes?
        this.parentDivTag.parentNode.replaceChild(this._element, this.parentDivTag);

        this.overlayDivTag.parentNode.removeChild(this.overlayDivTag);

        this.renderer.removeClass(document.body, 'zoom-overlay-transitioning');        
      }
    }

    /**** Utility functions *****/

    private checkIfTransitionSupported(): boolean {
      let style: any = document.body.style;
      return style.WebkitTransition !== undefined || style.MozTransition !== undefined || style.OTransition !== undefined || style.transition !== undefined;
    }

    private emulateTransitionEnd(element: any, duration: number, eventCallback: () => void) {
      let called = false;
      let _func = (e: any) => {
        eventCallback();
        called = true;
        e.target.removeEventListener(e.type, _func);
      };
      this.element.nativeElement.addEventListener(this.transitionEndEvent, _func);
      let callback = () => {if (!called) {element.dispatchEvent(new Event(this.transitionEndEvent))}};
      setTimeout(callback, duration);
    }

    private getTransitionEndEvent(): string {
      let el = this.renderer.createElement('bootstrap');
  
      var transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd'
      , 'MozTransition'    : 'transitionend'
      , 'OTransition'      : 'oTransitionEnd otransitionend'
      , 'transition'       : 'transitionend'
      }
  
      for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
          this.renderer.destroyNode(el);
          return transEndEventNames[name];
        }
      }
    }
  }