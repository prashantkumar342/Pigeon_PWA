import { useState } from "react";
import {
  IconButton,
  Tab,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import FriendList from "../Friends/FriendList";
import Peoples from "../Discover/Peoples";
import {
  setIsDrawer,
} from "../../redux/slices/global/globalSlice";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuIcon from "@mui/icons-material/Menu";
import ConversationList from "./ConversationList";
import { Message } from "@mui/icons-material";
import { useDispatch } from "react-redux";

function Chats() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState("1");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="flex flex-col h-screen max-sm:w-screen overflow-hidden border-gray border-r-2">
      <TabContext value={tabValue}>
        <div className="flex flex-col h-full">
          <div className="flex flex-row items-center pl-2  bg-white">
            <div className="mr-auto ml-2 my-2">
              <Typography
                variant="h5"
                sx={{ color: "purple", fontWeight: "bold" }}
                fontFamily="monospace"
              >
                Pigeon
              </Typography>
            </div>
            <div className="ml-auto p-1">
              {isSmallScreen ? (
                <IconButton
                  onClick={() => dispatch(setIsDrawer(true))}
                  sx={{
                    padding: "1px",
                    marginX: "3px",
                  }}
                >
                  <MenuIcon />
                </IconButton>
              ) : null}

              <IconButton
                sx={{
                  padding: "1px",
                  marginX: "3px",
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            {tabValue === "1" && (
              <TabPanel
                value="1"
                sx={{
                  flex: 1,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <ConversationList />
              </TabPanel>
            )}
            {tabValue === "2" && (
              <TabPanel
                value="2"
                sx={{
                  flex: 1,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <FriendList />
              </TabPanel>
            )}
            {tabValue === "3" && (
              <TabPanel
                value="3"
                sx={{
                  flex: 1,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Peoples />
              </TabPanel>
            )}
          </div>
          {/* tabs */}
          <div className="border-t border-l border-r-2 w-full flex justify-around z-1">
            <TabList
              onChange={handleTabChange}
              className="w-full flex justify-around"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "purple",
                  top: 0,
                  height: "3px",
                },
              }}
            >
              <Tab
                icon={<Message />}
                aria-label="Chats"
                value="1"
                className="text-purple-500 text-sm p-0 flex-1"
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    color: "purple",
                  },
                }}
              />
              <Tab
                icon={<Diversity3Icon />}
                aria-label="Friends"
                value="2"
                className="text-purple-500 text-sm p-0 flex-1"
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    color: "purple",
                  },
                }}
              />
              <Tab
                icon={<PersonSearchIcon />}
                aria-label="Find"
                value="3"
                className="text-purple-500 text-sm p-0 flex-1"
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    color: "purple",
                  },
                }}
              />
            </TabList>
          </div>
        </div>
      </TabContext>
    </div>
  );
}

export default Chats;
