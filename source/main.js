import { existsInDOM, e, hasClass } from "./helpers";

class NvSlider {
    constructor(options) {
        this.options = Object.assign({
            container: 'main',
            nextBtn: 'next',
            prevBtn: 'prev',
            width: "100%",
            height: "300px",
            slices:10,
            offset: 500,
            speed: 60
        }, options)
        this.images = [];
        this.bootstrap();
        this.currentSlide = undefined;
        this.promises = [];
        this.animating = false;
    }
    loadImages(images) {
        this.images = [...this.images, ...images];
        return this;
    }
    ini() {
        this.makeSlides();
    }

    makeSlides() {
        let imageLen = this.images.length;
        this.images.forEach((image, index) => {
            let slide = document.createElement('div'),
                zIndex = imageLen--;
                console.log(zIndex);
            slide.setAttribute('style', `position:absolute;top:0;left:0;width:100%;height:100%;z-index:${zIndex}`);
            slide.setAttribute('class', `slide`);
            const partHeight = this.container.offsetHeight;
            const fullWidth = this.container.offsetWidth;
            const partWidth = this.container.offsetWidth / this.options.slices;
            let nextPart = 0;
            // console.log(part);
            for (let i = 0; i < this.options.slices; i++) {
                let slideItem = document.createElement('div');
                slideItem.setAttribute('style', `background-image:url(${image});background-position: ${nextPart}px 0px;background-size: ${fullWidth}px ${partHeight}px; background-repeat: no-repeat; width:${partWidth}px;height:${partHeight}px;display:inline-block`)
                slide.appendChild(slideItem);
                nextPart -= partWidth;
            }
            this.container.appendChild(slide);
            if (index == 0) {
                this.currentSlide = slide;
            }
        });
    }

    bootstrap() {
        this.container = e(`[data-bi-slider="${this.options.container}"]`);
        this.prevBtn = e(`[data-bi-slider="${this.options.prevBtn}"]`);
        this.nextBtn = e(`[data-bi-slider="${this.options.nextBtn}"]`);
        this.options['computedSpeed'] = 1000/this.options.speed;
        this.validate();
        this.setup();
    }

    validate() {
        if (!existsInDOM(this.container)) {
            throw Error(4004, "Element no found");
        }
    }

    setup() {
        this.container.setAttribute("style", `display:block; width:${this.options.width};height:${this.options.height};position:relative;`);
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
    }

    next() {
        if (this.animating) {
            return;
        }
        this.setupSlide('next');

        this.animating = true;

        this.animate();

        Promise.all(this.promises).then((result) => {
            this._changeSlideTo('next');
            this.resetSlideComponents();
            this.animating = false;
        });

    }

    prev() {
        if (this.animating) {
            return;
        }
        this.setupSlide('prev');
        this.animating = true;

        this.animate();

        Promise.all(this.promises).then((result) => {
            this._changeSlideTo('prev');
            this.resetSlideComponents();
            this.animating = false;
        });
    }

    _changeSlideTo(order) {
        const { type, child } = (order == "prev") ? { type: 'previousSibling', child: 'lastChild' } : { type: "nextElementSibling", child: 'firstChild' };
        this.toBeReseted = this.currentSlide;
        
        let newCurrentSlide = hasClass(this.currentSlide[type], 'slide') ? this.currentSlide[type] : this.container[child];
        newCurrentSlide.style.zIndex = 2;
        this.currentSlide.style.zIndex = 0;
        this.currentSlide = newCurrentSlide;
    }

    setupSlide(order){
        const { type, child } = (order == "prev") ? { type: 'previousSibling', child: 'lastChild' } : { type: "nextElementSibling", child: 'firstChild' };
        let newCurrentSlide = hasClass(this.currentSlide[type], 'slide') ? this.currentSlide[type] : this.container[child];
        
        this.container.childNodes.forEach(e=>{
            e.style.zIndex=0;
        })
        
        newCurrentSlide.style.zIndex = 1;
        this.currentSlide.style.zIndex = 2;
    }

    rotateEl(el, promise) {
        let deg = el.getAttribute('data-bi-deg') ? el.getAttribute('data-bi-deg') : 0;
        deg = parseFloat(deg);
        if (deg <= 90) {
            el.style.webkitTransform = `rotateX(${deg}deg)`;
            el.style.MozTransform = `rotateX(${deg}deg)`;
            el.style.msTransform = `rotateX(${deg}deg)`;
            el.style.OTransform = `rotateX(${deg}deg)`;
            el.style.transform = `rotateX(${deg}deg)`;
            el.style.opacity = 1 - (deg+10)/100;
            deg += 0.5;

            el.setAttribute('data-bi-deg', deg);
            return setTimeout(this.rotateEl.bind(this, el, promise), this.options.computedSpeed);
        } else {
            promise(true);
        }
    }
    animate() {
        this.promises = [];
        let offset = 0;
        this.currentSlide.childNodes.forEach((node, i) => {
            let resolve;
            let promise = new Promise((r, e) => {
                resolve = r;
            });

            setTimeout(this.rotateEl.bind(this, node, resolve), offset)

            offset += this.options.offset;
            this.promises.push(promise);
        })
    }
    resetSlideComponents(){
        this.toBeReseted.childNodes.forEach(el=>{
            el.setAttribute('data-bi-deg', 0);
            el.style.webkitTransform = `rotateX(0deg)`;
            el.style.MozTransform = `rotateX(0deg)`;
            el.style.msTransform = `rotateX(0deg)`;
            el.style.OTransform = `rotateX(0deg)`;
            el.style.transform = `rotateX(0deg)`;
            el.style.opacity = 1; 
        })
    }
}

export default NvSlider;