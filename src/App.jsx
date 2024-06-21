import { useState } from "react"
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

function App(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()
  const [data, setData] = useState([])
  const [pending, setPending] = useState(false)

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  const parse = async () => {
    await setPending(true)
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        setData(json)
        setPending(false)
      })
  }

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={pending}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h1">Aurora demo 2</Typography>
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
      <hr></hr>

      {files && files?.length > 0 && (
        <>
          <Button onClick={parse} variant="contained" color="success">
            start parsing
          </Button>
        </>
      )}
    </>
  )
}

export default App
