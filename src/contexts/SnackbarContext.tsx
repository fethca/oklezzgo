import { Alert, AlertColor, Snackbar } from '@mui/material'
import { createContext, useCallback, useContext, useState } from 'react'

type ISnackbar = {
  id: number
  message: string
  typeColor: AlertColor
  timeout?: number
}

type SnackBarContextActions = {
  showSnackBar: (message: string, typeColor: AlertColor, timeout?: number) => void
}

const SnackbarContext = createContext({} as SnackBarContextActions)

interface SnackBarContextProviderProps {
  children: React.ReactNode
}

const SnackBarProvider: React.FC<SnackBarContextProviderProps> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<ISnackbar[]>([])
  const [counter, setCounter] = useState(0)

  const showSnackBar = (message: string, typeColor: AlertColor, timeout?: number) => {
    setSnackbars((snacks) => [...snacks, { id: counter, message, typeColor, timeout }])
    setCounter(counter + 1)
  }

  const handleClose = useCallback((id: number) => {
    setSnackbars((snacks) => [...snacks.filter((snack) => snack.id !== id)])
  }, [])

  return (
    <SnackbarContext.Provider value={{ showSnackBar }}>
      {snackbars.map((snack) => (
        <Snackbar
          key={snack.id}
          open={true}
          autoHideDuration={snack.timeout || 6000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={() => handleClose(snack.id)}
        >
          <Alert
            onClose={() => handleClose(snack.id)}
            severity={snack.typeColor}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      ))}
      {children}
    </SnackbarContext.Provider>
  )
}

const useSnackBar = (): SnackBarContextActions => {
  const context = useContext(SnackbarContext)

  if (!context) {
    throw new Error('useSnackBar must be used within a SnackBarProvider')
  }

  return context
}

export { SnackBarProvider, useSnackBar }
