import { EmblaOptionsType } from '@fethcat/embla-carousel'
import useEmblaCarousel from '@fethcat/embla-carousel-react'
import { ComponentType } from 'react'

type EmblaSlide = Record<string, unknown>
type EmblaProps<T extends EmblaSlide> = {
  slides: T[]
  Slide: ComponentType<{ props: T }>
  options?: EmblaOptionsType
}

export function EmblaCarousel<T extends EmblaSlide>({ slides, Slide, options }: EmblaProps<T>): JSX.Element {
  const [emblaRef] = useEmblaCarousel(options)

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <Slide props={slide} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
