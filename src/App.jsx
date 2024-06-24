import React, { useState } from "react"
import reactLogo from "./assets/react.svg"
import { useDropzone } from "react-dropzone"
import viteLogo from "/vite.svg"
import Dropzone from "react-dropzone"
import "./App.css"
import { Typography, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import axios from "axios"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

const columns = [
  { id: "amount", label: "Amount", minWidth: 170 },
  { id: "description", label: "Desc", minWidth: 100 },
  {
    id: "quantity",
    label: "Quantity",
    minWidth: 70,
  },
  {
    id: "reason",
    label: "Reason",
    minWidth: 70,
  },
  {
    id: "tax",
    label: "Tax",
    minWidth: 70,
  },
  {
    id: "unit_price",
    label: "Unit Price",
    minWidth: 70,
  },
]

function createData(name, code, population, size) {
  const density = population / size
  return { name, code, population, size, density }
}

function App(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()
  const [data, setData] = useState({})
  const [pending, setPending] = useState(false)

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const parse = async () => {
    await setPending(true)
    axios({
      url: `https://demoocr.runasp.net/v1/documents/parse`,
      method: "post",
      data: { file: acceptedFiles[0] },
      headers: { "Content-Type": "multipart/form-data" },
    }).then((response) => {
      console.log(response?.data)
      setData(response?.data)
      setPending(false)
    })
  }

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={pending}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h2">Superior Propane demo</Typography>
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput />
          </Button>
        </div>
        <aside>
          <ul>{files}</ul>
        </aside>
      </section>
      <hr className="my-2"></hr>

      {files && files?.length > 0 && (
        <>
          <Button className="my-2" onClick={parse} variant="contained" color="success">
            start parsing
          </Button>
        </>
      )}
      {data?.id && (
        <>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.line_items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row?.acct_}>
                        {columns.map((column) => {
                          const value = row[column.id]
                          return (
                            <TableCell className={row?.reason ? "bg-yellow-300" : ""} key={column.id} align={column.align}>
                              {column.format && typeof value === "number" ? column.format(value) : value}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={data?.line_items?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      )}
    </>
  )
}

export default App
