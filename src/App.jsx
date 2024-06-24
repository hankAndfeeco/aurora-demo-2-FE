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
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))

function App(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()
  const [data, setData] = useState({})
  const [rates, setRates] = useState([])
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
    await axios({
      url: `https://demoocr.runasp.net/v1/rate`,
      method: "get",
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      console.log(response?.data)
      setRates(response?.data)
      // setPending(false)
    })
    await axios({
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
          <Typography variant="h2">Pricing Sheet</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Service Description</StyledTableCell>
                  <StyledTableCell align="left">Alternate Description</StyledTableCell>
                  <StyledTableCell align="left">rate</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rates?.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell align="left">{row?.service_description}</StyledTableCell>
                    <StyledTableCell align="left">{row?.alternate_description}</StyledTableCell>
                    <StyledTableCell align="left">{row?.rate}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br></br>
          <Typography variant="h2">Parsing Result</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Amount</StyledTableCell>
                  <StyledTableCell align="left">Description</StyledTableCell>
                  <StyledTableCell align="left">Quantity</StyledTableCell>
                  <StyledTableCell align="left">Reason</StyledTableCell>
                  <StyledTableCell align="left">Tax</StyledTableCell>
                  <StyledTableCell align="left">Unit Price</StyledTableCell>
                  <StyledTableCell align="left">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.line_items?.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell align="left">{row?.amount}</StyledTableCell>
                    <StyledTableCell align="left">{row?.description}</StyledTableCell>
                    <StyledTableCell align="left">{row?.quantity}</StyledTableCell>
                    <StyledTableCell className={row?.reason ? "bg-yello-300" : ""} align="left">
                      <div className={row?.reason ? "bg-yello-300" : ""}>{row?.reason}</div>
                    </StyledTableCell>
                    <StyledTableCell align="left">{row?.tax}</StyledTableCell>
                    <StyledTableCell align="left">{row?.unit_price}</StyledTableCell>
                    <StyledTableCell align="left">
                      <CheckCircleIcon />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  )
}

export default App
