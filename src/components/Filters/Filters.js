import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import axios from 'axios';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Dialog from '@mui/material/Dialog';
import TabPanel from '@mui/lab/TabPanel';
import OutlinedInput from '@mui/material/OutlinedInput';
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
import ListItemText from '@mui/material/ListItemText';

const Separator = styled('div')(
    ({ theme }) => `
  height: ${theme.spacing(1)};
`,
);

const staffSizeMarks = [
    {
        value: 2,
        label: '2',
    },
    {
        value: 2000000,
        label: '2M',
    },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const yearMarks = [
    {
        value: 1700,
        label: '1700',
    },
    {
        value: 2022,
        label: '2022',
    },
];

const Filters = (props) => {
    const [open, setOpen] = React.useState(false);
    const [tabVal, settabVal] = React.useState('Фильтрация компаний');
    const [daliogTitle, setDialogTitle] = React.useState('Фильтрация компаний');
    const [departmentsData, setDepartmentsData] = React.useState([]);
    const [departmentNames, setdepartmentNames] = React.useState([]);

    const [companyName, setCompanyName] = React.useState('');
    const [ceoName, setCeoName] = React.useState('');
    const [dateRange, setDateRange] = React.useState([1980, 2000]);
    const [staffRange, setStaffRange] = React.useState([100000, 400000]);
    const [compInfo, setCompanyInfo] = React.useState({
        names: [],
        ceos: [],
        departments: []
    });
    const [prodInfo, setProductInfo] = React.useState({
        names: []
    });

    const [productName, setProductName] = React.useState('');
    const [productLifetime, setProductLifetime] = React.useState([1980, 2000]);
    const [isProductVerified, setIsProductVerified] = React.useState(false);

    const handleProductNameChange = (event) => {
        const {
            target: { value },
        } = event;
        setProductName(value);
    };

    const handleProductVerChange = (event) => {
        setIsProductVerified(event.target.checked);
    }

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

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setdepartmentNames(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleCompanyNameChange = (event) => {
        const {
            target: { value },
        } = event;
        setCompanyName(value);
    }

    const handleCeoNameChange = (event) => {
        const {
            target: { value },
        } = event;
        setCeoName(value);
    }

    const minTimeDistance = 1;
    const minStaffDistance = 0;

    const handleTimeRangeChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setDateRange([Math.min(newValue[0], dateRange[1] - minTimeDistance), dateRange[1]]);
        } else {
            setDateRange([dateRange[0], Math.max(newValue[1], dateRange[0] + minTimeDistance)]);
        }
    }

    const handleProductLifetimeChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setProductLifetime([Math.min(newValue[0], productLifetime[1] - minTimeDistance), productLifetime[1]]);
        } else {
            setProductLifetime([productLifetime[0], Math.max(newValue[1], productLifetime[0] + minTimeDistance)]);
        }
    }

    const handleStaffRangeChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setStaffRange([Math.min(newValue[0], staffRange[1] - minStaffDistance), staffRange[1]]);
        } else {
            setStaffRange([staffRange[0], Math.max(newValue[1], staffRange[0] + minStaffDistance)]);
        }
    }

    const clearFilters = () => {

        setCompanyName("");
        setCeoName("");
        setDateRange([1980, 2000]);
        setStaffRange([100000, 400000]);
        setdepartmentNames([]);

        setProductName("");
        setProductLifetime([1980, 2000]);
        setIsProductVerified(false);

        props.clearFilters();
        handleClose();
    }

    const applyCompanyFilters = () => {
        var departmentIds = [];
        departmentsData.map((item) => {
            if (departmentNames.includes(item.name)) {
                departmentIds.push(item.id);
            }
            return item;
        })

        const companyFilters = {
            companyName: companyName,
            departments: departmentIds,
            ceo: ceoName,
            minDate: JSON.stringify(dateRange[0]) + "-01-01T00:00:00Z",
            maxDate: JSON.stringify(dateRange[1]) + "-01-01T00:00:00Z",
            startStaffSize: staffRange[0],
            endStaffSize: staffRange[1]
        }

        console.log(companyFilters);

        axios.post('http://localhost:7328/filterCompany', companyFilters)
            .then(function (response) {
                console.log(response.data);
                props.changeNodesOpacity(response.data);
                handleClose();
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    const applyProductFilters = () => {

        const productFilters = {
            productName: productName,
            minDate: JSON.stringify(productLifetime[0]) + "-01-01T00:00:00Z",
            maxDate: JSON.stringify(productLifetime[1]) + "-01-01T00:00:00Z",
            isVerified: isProductVerified
        };

        console.log(productFilters);

        axios.post('http://localhost:7328/filterProduct', productFilters)
            .then((response) => {
                console.log(response.data);
                props.changeNodesOpacity(response.data);
                handleClose();
            })
            .catch((error) => {
                console.log(error);
            });
        
    }

    React.useEffect(() => {
        var companyInfo = {
            names: [],
            ceos: [],
            departments: []
        };

        var productInfo = {
            names: []
        }

        axios.get("http://localhost:7328/filterPresets")
            .then((response) => {
                response.data.companyFilters.companyNames.map(item => (
                    companyInfo.names.push(item)
                ))
                response.data.companyFilters.ceoNames.map(item => (
                    companyInfo.ceos.push(item)
                ))
                response.data.companyFilters.departments.map(item => (
                    companyInfo.departments.push(item.name)
                ))
                response.data.productFilters.productNames.map(item => (
                    productInfo.names.push(item)
                ))

                setDepartmentsData(response.data.companyFilters.departments);
            })
            .catch(e => {
                console.log(e);
            });

        setCompanyInfo(companyInfo);
        setProductInfo(productInfo);

    }, [])

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
                                    <TextField
                                        id="outlined-required"
                                        label="Наименование компании"
                                        onChange={handleCompanyNameChange}
                                        value={companyName}
                                    />

                                </FormControl>
                                <FormControl sx={{ m: 1, ml: -3, minWidth: 450 }}>
                                    <TextField
                                        id="outlined-required"
                                        label="Имя владельца"
                                        onChange={handleCeoNameChange}
                                        value={ceoName}
                                    />
                                </FormControl>
                                <Box sx={{ m: 1, ml: -3, width: 450 }}>
                                    <Typography id="track-false-slider" gutterBottom>
                                        Штат сотрудников
                                    </Typography>
                                    <Slider
                                        size="small"
                                        aria-labelledby="track-false-slider"
                                        defaultValue={[100000, 400000]}
                                        min={2}
                                        max={2000000}
                                        marks={staffSizeMarks}
                                        valueLabelDisplay="auto"
                                        onChange={handleStaffRangeChange}
                                        value={staffRange}
                                        disableSwap
                                    />
                                    <Separator />
                                    <Typography id="track-false-range-slider" gutterBottom>
                                        Время существования
                                    </Typography>
                                    <Slider
                                        size="small"
                                        aria-labelledby="track-false-range-slider"
                                        defaultValue={[1980, 2000]}
                                        min={1700}
                                        max={2022}
                                        marks={yearMarks}
                                        valueLabelDisplay="auto"
                                        onChange={handleTimeRangeChange}
                                        value={dateRange}
                                        disableSwap
                                    />
                                </Box>
                                <FormControl sx={{ m: 1, ml: -3, width: 450 }}>
                                    <InputLabel id="demo-multiple-checkbox-label">Отрасли</InputLabel>
                                    <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={departmentNames}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Отрасли" />}
                                        renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                    >
                                        {compInfo &&
                                            compInfo.departments.map(item => (
                                                <MenuItem key={Math.random().toString(36).substring(2, 9)} value={item}>
                                                    <Checkbox checked={departmentNames.indexOf(item) > -1} />
                                                    <ListItemText primary={item} />
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <Separator />
                                <Box sx={{ m: 1, ml: -3, width: 450 }}>
                                    <Button variant="contained" onClick={applyCompanyFilters}>Применить</Button>
                                    <Button onClick={clearFilters} variant="text">
                                        Сбросить
                                    </Button>
                                </Box>
                            </TabPanel>
                            <TabPanel value="Фильтрация продуктов">
                                <FormControl sx={{ m: 1, ml: -3, minWidth: 450 }}>
                                    <TextField
                                        id="outlined-required"
                                        label="Наименование продукта"
                                        value={productName}
                                        onChange={handleProductNameChange}
                                    />
                                </FormControl>
                                <Box sx={{ m: 1, ml: -3, width: 450 }}>
                                    <Typography id="track-false-range-slider" gutterBottom>
                                        Время существования
                                    </Typography>
                                    <Slider
                                        size="small"
                                        aria-labelledby="track-false-range-slider"
                                        defaultValue={[1980, 2000]}
                                        min={1700}
                                        max={2022}
                                        marks={yearMarks}
                                        valueLabelDisplay="auto"
                                        onChange={handleProductLifetimeChange}
                                        value={productLifetime}
                                        disableSwap
                                    />
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={isProductVerified} onChange={handleProductVerChange} />} label="Релиз подтвержден" />
                                    </FormGroup>
                                    <Separator />
                                    <Button onClick={applyProductFilters} variant="contained">Применить</Button>
                                    <Button onClick={clearFilters} variant="text">
                                        Сбросить
                                    </Button>
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