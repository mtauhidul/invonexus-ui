import CategoryIcon from "@mui/icons-material/Category";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import QueueIcon from "@mui/icons-material/Queue";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import TagIcon from "@mui/icons-material/Tag";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import AddNewDocument from "./sections/addNewDocument/AddNewDocument";
import CategoryOptions from "./sections/category options/CategoryOptions";
import ReviewQueue from "./sections/reviewQueue/ReviewQueue";
import StatusOptions from "./sections/statusOptions/StatusOptions";
import TagOptions from "./sections/tagOptions/TagOptions";

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [tab, setTab] = React.useState("Document Queue");

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setSelectedIndex(0);
    setTab("Document Queue");
    navigate("/");
  };

  const menus = [
    "Document Queue",
    "Status Options",
    "Tag Options",
    "Category Options",
    "Add New Document",
  ];

  React.useEffect(() => {
    if (selectedIndex === 0) {
      setTab("Document Queue");
    } else if (selectedIndex === 1) {
      setTab("Status Options");
    } else if (selectedIndex === 2) {
      setTab("Tag Options");
    } else if (selectedIndex === 3) {
      setTab("Category Options");
    } else if (selectedIndex === 4) {
      setTab("Add New Document");
    }
  }, [selectedIndex]);

  const drawer = (
    <div>
      <Toolbar
        sx={{
          backgroundColor: "#2a454e",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontFamily: "Exo, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <img src={Logo} alt="logo" style={{ width: "24px" }} />
          InvoNexus
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menus.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={(event) => setSelectedIndex(index)}
            >
              <ListItemIcon>
                {(index === 0 && <QueueIcon />) ||
                  (index === 1 && <SettingsApplicationsIcon />) ||
                  (index === 2 && <TagIcon />) ||
                  (index === 3 && <CategoryIcon />) ||
                  (index === 4 && <NoteAddIcon />)}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Logout"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={(event) => {
                handleLogout();
              }}
            >
              <ListItemIcon>{index === 0 && <ExitToAppIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#2a454e",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {tab}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {selectedIndex === 0 && <ReviewQueue />}
        {selectedIndex === 1 && <StatusOptions />}
        {selectedIndex === 2 && <TagOptions />}
        {selectedIndex === 3 && <CategoryOptions />}
        {selectedIndex === 4 && <AddNewDocument />}
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
