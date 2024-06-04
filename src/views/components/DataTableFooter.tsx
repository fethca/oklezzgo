import { CloudDownload, Delete, FolderSpecial } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { GridFooter, GridFooterContainer } from '@mui/x-data-grid'
import { memo } from 'react'

type IFooterProps = {
  onDownload: () => void
  onDelete: () => void
  onFavorite: () => void
  rowSelected: boolean
}

export const DataTableFooter = memo(({ rowSelected, onDownload, onDelete, onFavorite }: IFooterProps): JSX.Element => {
  return (
    <GridFooterContainer className="data-grid__footer">
      <GridFooter></GridFooter>
      {rowSelected && (
        <div>
          <IconButton onClick={onDownload} color="primary" title="Download" aria-label="delete">
            <CloudDownload />
          </IconButton>
          <IconButton onClick={onDelete} color="primary" title="Delete" aria-label="delete">
            <Delete />
          </IconButton>
          <IconButton onClick={onFavorite} color="primary" title="Set favorite" aria-label="favorites">
            <FolderSpecial />
          </IconButton>
        </div>
      )}
    </GridFooterContainer>
  )
})
