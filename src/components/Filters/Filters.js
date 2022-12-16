import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import axios from 'axios';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Dialog from '@mui/material/Dialog';
import TabPanel from '@mui/lab/TabPanel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';

const Separator = styled('div')(
    ({ theme }) => `
  height: ${theme.spacing(1)};
`,
);

const staffSizeMarks = [
    {
        value: 0,
        label: '2',
    },
    {
        value: 100,
        label: '100K',
    },
];

const yearMarks = [
    {
        value: 0,
        label: '1700',
    },
    {
        value: 100,
        label: '2022',
    },
];

const Filters = ({ data }) => {
    const [open, setOpen] = React.useState(false);
    const [tabVal, settabVal] = React.useState('Фильтрация компаний');
    const [daliogTitle, setDialogTitle] = React.useState('Фильтрация компаний');
    const [compInfo, setCompanyInfo] = React.useState();

    React.useEffect(() => {
        var info = {
            names: [],
            ceos: [],
            departments: []
        };
        let query = '';
        for (let i = 0; i < data.nodes.length; ++i) {
            if (data.nodes[i].nodeType == "Компания") {
                query = "http://localhost:7328/company?id=" + data.nodes[i].id;
                axios.get(query).then((response) => {
                        info.names.push(response.data.name);
                        info.ceos.push(response.data.ceo);
                    })
                    .catch(e => {
                        console.log(e);
                    });

            }
        }
        axios.get("http://localhost:7328/departments").then((response) => {
            response.data.map(item => {
                info.departments.push(item.name);
            })
        })
        setCompanyInfo(info);
    }, [data])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTabChange = (event, newValue) => {
        settabVal(newValue);
        setDialogTitle(newValue);
    };

    return (
        <Toolbar>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleClickOpen}
            >
                <SettingsIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{daliogTitle}</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: 450, typography: 'body1' }}>
                        <TabContext value={tabVal}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                    <Tab label="Компании" value="Фильтрация компаний" />
                                    <Tab label="Продукты и релизы" value="Фильтрация продуктов" />
                                </TabList>
                            </Box>
                            <TabPanel value="Фильтрация компаний">
                                <FormControl sx={{ m: 1, ml: -3, minWidth: 450 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Наименование компании</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        label="Наименование компании"
                                    >
                                        {compInfo && compInfo.names.map(item => <MenuItem key = {Math.random().toString(36).substring(2, 9)} value={item}>{item}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ m: 1, ml: -3, minWidth: 450 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Имя владельца</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        label="Имя владельца"
                                    >
                                        {compInfo && compInfo.ceos.map(item => <MenuItem key = {Math.random().toString(36).substring(2, 9)} value={item}>{item}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Box sx={{ m: 1, ml: -3, width: 450 }}>
                                    <Typography id="track-false-slider" gutterBottom>
                                        Штат сотрудников
                                    </Typography>
                                    <Slider
                                        aria-labelledby="track-false-slider"
                                        defaultValue={[20, 37]}
                                        marks={staffSizeMarks}
                                    />
                                    <Separator />
                                    <Typography id="track-false-range-slider" gutterBottom>
                                        Время существования
                                    </Typography>
                                    <Slider
                                        aria-labelledby="track-false-range-slider"
                                        defaultValue={[20, 37]}
                                        marks={yearMarks}
                                    />
                                </Box>
                                <FormControl sx={{ m: 1, ml: -3, minWidth: 450 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Отрасли</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        label="Отрасли"
                                    >
                                        {compInfo && compInfo.departments.map(item => <MenuItem key = {Math.random().toString(36).substring(2, 9)} value={item}>{item}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <Separator />
                                <Box sx={{ m: 1, ml: -3, width: 450 }}>
                                    <Button variant="contained">Применить</Button>
                                    <Button variant="text">Сбросить</Button>
                                </Box>
                            </TabPanel>
                            <TabPanel value="Фильтрация продуктов">
                                <FormControl sx={{ m: 1, ml: -3, minWidth: 450 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Наименование продукта</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        label="Наименование продукта"
                                    >
                                        <MenuItem value={10}>Продукт А</MenuItem>
                                        <MenuItem value={21}>Продукт Б</MenuItem>
                                    </Select>
                                </FormControl>
                                <Box sx={{ m: 1, ml: -3, width: 450 }}>
                                    <Typography id="track-false-range-slider" gutterBottom>
                                        Время существования
                                    </Typography>
                                    <Slider
                                        aria-labelledby="track-false-range-slider"
                                        defaultValue={[20, 37]}
                                        marks={yearMarks}
                                    />
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox />} label="Релиз подтвержден" />
                                    </FormGroup>
                                    <Separator />
                                    <Button variant="contained">Применить</Button>
                                    <Button variant="text">Сбросить</Button>
                                </Box>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </DialogContent>
            </Dialog>
        </Toolbar>
    )
}

export default Filters;