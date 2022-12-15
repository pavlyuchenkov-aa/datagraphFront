import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LogoutIcon from '@mui/icons-material/Logout';
import moment from 'moment';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import Loader from '../Loader/Loader';

const drawerWidth = 450;

const SidePanel = forwardRef((props, ref) => {
    const [selectedElement, setSelectedElement] = useState('companyNode');
    const [selectedElementData, setSelectedElementData] = useState();

    const showSelectedElementType = (elementType) => {
        setSelectedElement(elementType);
    };

    const showSelectedElementData = (elementData) => {
        setSelectedElementData(elementData);
    }

    useImperativeHandle(ref, () => {
        return {
            showSelectedElementType: showSelectedElementType,
            showSelectedElementData: showSelectedElementData
        };
    });

    const formatNumberToK = (num) => {
        return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num)
    }

    if (selectedElement == "companyNode") {
        return (
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
                }}
            >
                <Toolbar />
                {props.isFetching && <Loader />}
                {!props.isFetching &&
                    <Card sx={{ minWidth: 275 }} key={selectedElementData && selectedElementData.id}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="nodeAvatar">
                                    {selectedElementData && selectedElementData.name[0]}
                                </Avatar>
                            }
                            titleTypographyProps={{ variant: 'h6' }}
                            title={selectedElementData && "Компания " + selectedElementData.name}
                            subheader={selectedElementData && "от " + selectedElementData.ceo}
                        />
                        <CardContent >
                            <Typography variant="body2">
                                {selectedElementData && selectedElementData.description}
                            </Typography>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} style={{ display: 'flex', flexDirection: 'row' }}>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarTodayIcon sx={{ ml: -2 }} />
                                    </ListItemIcon>
                                    <ListItemText sx={{ ml: -5 }} secondary={selectedElementData && "Создан в " + moment(selectedElementData.year).utc().format('YYYY') + " году"} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarTodayIcon sx={{ ml: -2 }} />
                                    </ListItemIcon>
                                    <ListItemText sx={{ ml: -5 }} secondary={selectedElementData && selectedElementData.products.length + " продуктов"} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarTodayIcon sx={{ ml: -2 }} />
                                    </ListItemIcon>
                                    <ListItemText sx={{ ml: -5 }} secondary={selectedElementData && formatNumberToK(selectedElementData.staffSize)} />
                                </ListItem>
                            </List>
                            <Stack direction="row" spacing={1}>
                                {selectedElementData && selectedElementData.departments.map(item => <Chip key={item} label={item} />)}
                            </Stack>
                            <Card sx={{ mt: 2 }}>
                                <CardHeader
                                    titleTypographyProps={{ variant: 'h6' }}
                                    title="Продукты компании"
                                />
                                <CardContent
                                    style={{ maxHeight: 370 }}
                                    sx={{
                                        overflowY: 'scroll',
                                        "&::-webkit-scrollbar": {
                                            width: 7
                                        },
                                        "&::-webkit-scrollbar-track": {
                                            backgroundColor: "white"
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: "lightgrey",
                                            borderRadius: 2
                                        }
                                    }}
                                >
                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', mt: -4 }}>
                                        {selectedElementData && selectedElementData.products.map(item =>
                                            item.isVerified &&
                                            <ListItem key={item.id}>
                                                <ListItemIcon>
                                                    <StarIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={"Продукт " + item.name} secondary={"от " + moment(item.year).utc().format('YYYY') + " года"} />
                                            </ListItem>
                                        )}
                                    </List>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                }
            </Drawer>
        )
    }
    else if (selectedElement == "productNode") {
        return (
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
                }}
            >
                <Toolbar />
                {props.isFetching && <Loader />}
                {!props.isFetching &&
                    <Card sx={{ minWidth: 275 }} key={selectedElementData && selectedElementData.id}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="nodeAvatar">
                                    {selectedElementData && selectedElementData.name[0]}
                                </Avatar>
                            }
                            titleTypographyProps={{ variant: 'h6' }}
                            title={selectedElementData && "Продукт " + selectedElementData.name}
                            subheader={selectedElementData && "от компании " + selectedElementData.company.name}
                        />
                        <CardContent>
                            <Typography variant="body2">
                                {selectedElementData && selectedElementData.description}
                            </Typography>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} style={{ display: 'flex', flexDirection: 'row' }}>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarTodayIcon sx={{ ml: -2 }} />
                                    </ListItemIcon>
                                    <ListItemText sx={{ ml: -5 }} secondary={selectedElementData && "Создан в " + moment(selectedElementData.year).utc().format('YYYY') + " году"} />
                                </ListItem>
                            </List>
                            {
                                ((selectedElementData.link.length !== 0) && (RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(selectedElementData.link))) &&
                                <Chip label="Верифицированный продукт" component="a" href={selectedElementData && selectedElementData.link} color="success" icon={<LogoutIcon sx={{ fontSize: 15 }} />} clickable />
                            }
                            <Stack sx={{ mt: 1.5 }} direction="row" spacing={1}>
                                {selectedElementData && selectedElementData.departments.map(item => <Chip key={Math.random().toString(36).substring(2, 9)} label={item.name} />)}
                            </Stack>
                        </CardContent>
                    </Card>
                }
            </Drawer>
        )
    }
    else if (selectedElement === "link") {
        return (
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Card sx={{ minWidth: 275 }}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="time-selection">
                                T
                            </Avatar>
                        }
                        titleTypographyProps={{ variant: 'h6' }}
                        title="Временной диапазон"
                        subheader={selectedElementData.timeline}
                    />
                    <CardContent>
                        <Typography variant="h6">
                            Связанные элементы
                        </Typography>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                                <ListItemIcon>
                                    <StarIcon />
                                </ListItemIcon>
                                <ListItemText primary={selectedElementData.sourceNodeName} secondary={"от " + moment(selectedElementData.sourceNodeYear).utc().format('YYYY') + " года"} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <StarIcon />
                                </ListItemIcon>
                                <ListItemText primary={selectedElementData.targetNodeName} secondary={"от " + moment(selectedElementData.targetNodeYear).utc().format('YYYY') + " года"} />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Drawer>
        )
    }
});

export default SidePanel;
