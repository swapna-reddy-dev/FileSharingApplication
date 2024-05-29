import {AppBar, Box, Button, Grid, IconButton, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography} from "@mui/material"
import { useContext, useState } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { UsersContext } from "../ContextApi/usersContext";


export default function NavBar() {
    const {users,usersDispatch} = useContext(UsersContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
    // const token = localStorage.getItem('token')
    const handleLogOut = () => {
        handleClose();
        localStorage.clear();
        usersDispatch({type: 'HANDLE_LOGOUT'});
        navigate("/");
      };
  
    
    return (
        <Box sx={{ flexGrow: 1 }}>

            <AppBar
                position="fixed"
                style={{ backgroundColor: "#A00DB8", zIndex: 1000 }}
            >
                <Toolbar>
                    <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                        color="inherit"
                        fontWeight="bold"
                        >
                        File Sharing System
                        </Typography>
                    </Grid>
                    <Grid item>
                    <Stack direction="row" alignItems="center" spacing={1}>
                    {!users ? (
                    <>
                    <Button component={Link} to="/register" color="inherit">
                        SignUp
                    </Button>
                    <Button component={Link} to="/" color="inherit">
                        Login
                    </Button>
                    </>  
                ) : (
                    <>
                    <Tooltip title="Home">
                    <IconButton>
                    
                        <HomeRoundedIcon
                        style={{ fontSize: "40px", color: "#FFFFFF" }}
                        />
                   
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="View profile">
                        <IconButton onClick={handleClick} sx={{ p: 0 }}>
                        <FaUser style={{ color: "#FFFFFF", fontSize: "28px" }} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{
                        mt: "45px",
                        "& .MuiMenu-paper": {
                            backgroundColor: "white",
                            color: "#375ab2",
                            fontWeight: "bold",
                        },
                        }}
                        anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                        }}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <Typography variant="body1" textAlign="center" sx={{ px: 2, py: 1 }}>
                            {users.username}
                        </Typography>
                        <Typography variant="body1" sx={{ px: 2, py: 1 }}>
                            {users.email}
                        </Typography>
                        <MenuItem
                            onClick={handleLogOut}
                            style={{ textDecoration: "none", color: "#27438e" }}
                            >
                            Log Out
                        </MenuItem>
                    </Menu>
                    </>
                    )}
                    </Stack>
                    </Grid>
                    </Grid>
                </Toolbar>
                {/* <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                    color="#27438e"
                    fontWeight="bold"
            >
              File Sharing System
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                {!token ? (
                    <>
                    <Button>
                        SignUp
                    </Button>
                    <Button>
                        Login
                    </Button>
                    </>  
                ) : (
                    <>
                    <Tooltip title="Home">
                    <IconButton>
                    
                        <HomeRoundedIcon
                        style={{ fontSize: "40px", color: "#27438e" }}
                        />
                   
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="View profile">
                        <IconButton onClick={handleClick} sx={{ p: 0 }}>
                        <FaUser style={{ color: "#27438e", fontSize: "28px" }} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{
                        mt: "45px",
                        "& .MuiMenu-paper": {
                            backgroundColor: "white",
                            color: "#375ab2",
                            fontWeight: "bold",
                        },
                        }}
                        anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                        }}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <Typography variant="body1" textAlign="center" sx={{ px: 2, py: 1 }}>
                        Name
                        </Typography>
                        <Typography variant="body1" sx={{ px: 2, py: 1 }}>
                        email 
                        </Typography>
                        <MenuItem
                            // onClick={handleLogOut}
                            style={{ textDecoration: "none", color: "#27438e" }}
                            >
                            Log Out
                        </MenuItem>
                    </Menu>
                    </>
            )}
            </Stack> */}
            </AppBar>
        </Box>
    )
}