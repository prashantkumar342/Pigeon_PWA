import { TabContext, TabPanel, TabList } from "@mui/lab"
import { Divider, Tab, Typography } from "@mui/material"
import { useState, } from "react"
import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"

function Form() {
  const [tabValue, setTabValue] = useState('1')
  const tabChange = (event, newValue) => {
    setTabValue(newValue)
  }
  return (
    <div className="
     h-[100vh] flex justify-center items-center
     ">
      <div className="
       bg-white w-[420px] max-sm:w-[350px] rounded-md p-[10px] shadow-xl outline outline-1
      ">
        <div className="text-center p-[5px] rounded-md" >
          <Typography variant='h5'>
            C4Chat
          </Typography>
        </div>
        <TabContext value={tabValue}>
          <TabList onChange={tabChange}>
            <Tab label="Login" sx={{textTransform:"none", fontFamily:"monospace", fontSize:"17px"}} value='1' />
            <Tab label="Register" sx={{ textTransform: "none", fontFamily:"monospace", fontSize:"17px" }} value='2' />
          </TabList>
          <Divider />
          <TabPanel value='1'>
            <LoginForm />
          </TabPanel>
          <TabPanel value='2'>
            <RegisterForm />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  )
}

export default Form