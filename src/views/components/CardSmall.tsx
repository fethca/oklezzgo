import { IconButton, IconProps } from '@mui/material'
import { ReactElement, memo } from 'react'

type ICardSmallProps = {
  Bookmark?: ReactElement<IconProps>
  cover?: string
  label: string
  subLabel?: string
  labelAction: () => void
  Icon: ReactElement<IconProps>
  iconAction: () => void
  OverlayFooter: ReactElement<{ rating: number }>
  SecondIcon?: ReactElement<IconProps>
  secondIconAction?: () => void
}

const CardSmall = memo(
  ({
    Bookmark,
    cover,
    label,
    subLabel,
    labelAction,
    Icon,
    iconAction,
    OverlayFooter,
    SecondIcon,
    secondIconAction,
  }: ICardSmallProps): JSX.Element => {
    return (
      <div className="movie-item">
        <div className="movie-item__cover">
          <div className="bookmark">{Bookmark}</div>
          <div className="movie-item__cover-image-wrapper">
            <img className="movie-item__cover-image" src={cover || 'assets/posterholder.png'} />
          </div>
          <div className="movie-item__cover-overlay">
            <div className="movie-item__cover-overlay__main-action">
              <IconButton sx={{ width: '110px', height: '110px' }} onClick={iconAction}>
                {Icon}
              </IconButton>
            </div>
            <div className="movie-item__cover-overlay__secondary-action">
              <IconButton onClick={secondIconAction}>{SecondIcon}</IconButton>
            </div>
            <div className="movie-item__cover-overlay__rating">{OverlayFooter}</div>
          </div>
        </div>
        <span onClick={labelAction} className="movie-item__title" title={label}>
          {label}
        </span>
        <span style={{ color: 'grey', fontSize: 'smaller' }}>{subLabel}</span>
      </div>
    )
  },
)

CardSmall.displayName = 'CardSmall'
export { CardSmall }
