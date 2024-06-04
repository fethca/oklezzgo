import styled from '@emotion/styled'
import { IMovie } from '@fethcat/shared/types'
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid'
import { memo, useState } from 'react'
import { useSnackBar } from '../../contexts/SnackbarContext.js'
import { DataTableFooter } from './DataTableFooter.js'

const now = new Date()

const ageFormatter = (value: number) => {
  if (!value || isNaN(value)) return ''
  const publishDate = value * 1000
  const diffMs = now.getTime() - publishDate
  const diffMins = Math.round(diffMs / (1000 * 60))
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.5))
  const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.5 * 12))

  let result = `${diffYears} ans`
  if (diffMonths < 12) result = `${diffMonths} mois`
  if (diffDays < 30) result = `${diffDays} jours`
  if (diffHrs < 24) result = `${diffHrs} heures`
  if (diffMins < 60) result = `${diffMins} mins`
  return result
}

const columns: GridColDef[] = [
  { field: 'provider', headerName: 'Plateforme', minWidth: 100 },
  { field: 'name', headerName: 'Titre', minWidth: 200, flex: 1 },
  { field: 'publish_date', headerName: 'Age', minWidth: 100, valueFormatter: ageFormatter },
  { field: 'completed', headerName: 'Vues', minWidth: 100 },
  { field: 'seed', headerName: 'Peers', minWidth: 100 },
  { field: 'size', headerName: 'Taille', minWidth: 100 },
  { field: 'score', headerName: 'Score', minWidth: 100, editable: true },
]

type IDataTableProps = {
  movie: Omit<IMovie, 'opsDatas'>
  rows: { _id: string }[]
  pageSize: number
  handleUpdate: () => void
}

export const DataTable = memo(({ movie, rows, pageSize, handleUpdate }: IDataTableProps) => {
  const [rowSelected, setRowSelected] = useState<GridRowId[]>([])
  const { showSnackBar } = useSnackBar()

  const handleDownload = async () => {
    console.log('Rowselected', rowSelected)
    for (const id of rowSelected) {
      const url = `${id}`
      window.open(url, `_blank`)
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 200)
      })
    }
  }

  const handleSelect = (rowSelectionModel: GridRowSelectionModel) => {
    setRowSelected(rowSelectionModel)
  }

  const data = {
    pageSizeOptions: [pageSize, 100],
    rows: rows,
    columns: columns,
    onRowSelectionModelChange: handleSelect,
    autoHeight: pageSize > 5 ? true : false,
    checkboxSelection: true,
    getRowId: (row: { _id: string }) => row._id,
    slots: {
      footer: () => (
        <DataTableFooter
          onDownload={handleDownload}
          onDelete={() => {}}
          onFavorite={() => {}}
          rowSelected={rowSelected.length > 0}
        />
      ),
    },
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <StyledDataGrid
        {...data}
        getRowId={(row) => row.id}
        getRowClassName={(params) => (params.row.inDB ? 'already-saved' : '')}
      ></StyledDataGrid>
    </div>
  )
})

const StyledDataGrid = styled(DataGrid)(() => ({}))
