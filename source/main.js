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
            auto: 5000
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
        window.addEventListener('resize', this.reRenderSlider.bind(this));
        this.makeSlides();
        this.setAuto()
    }
    setAuto(){
        this.autoAnim = setInterval(this.next.bind(this), this.options.auto);
    }

    reRenderSlider(){
        this.animating = false;
        this.container.innerHTML = "";
        this.makeSlides();
    }
    makeSlides() {
        let imageLen = this.images.length;
        this.images.forEach((image, index) => {
            let slide = document.createElement('div'),
                zIndex = imageLen--;
            slide.setAttribute('style', `position:absolute;top:0;left:0;width:100%;height:100%;z-index:${zIndex}`);
            slide.setAttribute('class', `slide`);
            const partHeight = this.container.offsetHeight;
            const fullWidth = this.container.offsetWidth;
            const partWidth = this.container.offsetWidth / this.options.slices;
            let nextPart = 0;
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

        this.container.addEventListener('mouseenter', this.stopAuto.bind(this))
        this.container.addEventListener('mouseleave', this.activateAuto.bind(this))
    }

    activateAuto(){
        this.setAuto();
    }
    stopAuto(){
        clearInterval(this.autoAnim);
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

    animate() {
        this.promises = [];
        let offset = 10;
        this.currentSlide.classList.add('nv-slide-trans');

        this.currentSlide.childNodes.forEach((node, i) => {
            let result;
            let promise = new Promise((r,e)=>{
                result=r;
           });
           
           node.addEventListener('transitionend', ()=>{
                result()
           });

           setTimeout(()=>{
                node.classList.add("nv-slide-rotate");
           }, offset)

           offset += this.options.offset;

           this.promises.push(promise); 
        })
    }
    resetSlideComponents(){
        this.toBeReseted.classList.remove('nv-slide-trans')
        this.toBeReseted.childNodes.forEach(el=>{
           el.classList.remove("nv-slide-rotate");
        })
    }
}

export default NvSlider;