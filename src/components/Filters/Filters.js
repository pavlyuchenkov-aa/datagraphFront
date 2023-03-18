import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import axios from 'axios';
import moment from 'moment';
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
import { ITEM_HEIGHT, ITEM_PADDING_TOP, formatNumberToK } from '../../constants/globalVariables';
import { SERVER_URL } from '../../constants/routes'

const Separator = styled('div')(
    ({ theme }) => `
  height: ${theme.spacing(1)};
`,
);

const staffSizeMarks = [
    {
        value: null,
        label: '',
    },
    {
        value: null,
        label: '',
    },
];

const yearMarks = [
    {
        value: null,
        label: '',
    },
    {
        value: null,
        label: '',
    },
];

const yearMarksProd = [
    {
        value: null,
        label: '',
    },
    {
        value: null,
        label: '',
    },
];

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const minTimeDistance = 1;
const minStaffDistance = 0;

class Filters extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            open: false,
            tabVal: 'Фильтрация компаний',
            dialogTitle: 'Фильтрация компаний',
            departmentsData: [],
            departmentNames: [],
            productName: '',
            productLifetime: [1996, 2000],
            isProductVerified: false,
            companyName: '',
            ceoName: '',
            dateRange: [1980, 2000],
            staffRange: [100000, 400000],
            compInfo: {
                names: [],
                ceos: [],
                departments: [],
                minStaffSize: null,
                maxStaffSize: null,
                minDate: '',
                maxDate: ''
            },
            prodInfo: {
                names: [],
                minDate: '',
                maxDate: ''
            }
        };
    }

    componentDidMount() {
        var companyInfo = {
            names: [],
            ceos: [],
            departments: [],
            minStaffSize: null,
            maxStaffSize: null,
            minDate: '',
            maxDate: ''
        };

        var productInfo = {
            names: [],
            minDate: '',
            maxDate: ''
        }

        axios.get(SERVER_URL + "filterPresets")
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

                companyInfo.minStaffSize = response.data.companyFilters.minStaffSize;
                companyInfo.maxStaffSize = response.data.companyFilters.maxStaffSize;

                companyInfo.minDate = moment(response.data.companyFilters.minDate).utc().format('YYYY');
                companyInfo.maxDate = moment(response.data.companyFilters.maxDate).utc().format('YYYY');
                productInfo.minDate = moment(response.data.productFilters.minDate).utc().format('YYYY');
                productInfo.maxDate = moment(response.data.productFilters.maxDate).utc().format('YYYY');

                staffSizeMarks[0].value = companyInfo.minStaffSize;
                staffSizeMarks[1].value = companyInfo.maxStaffSize;
                staffSizeMarks[0].label = formatNumberToK(companyInfo.minStaffSize);
                staffSizeMarks[1].label = formatNumberToK(companyInfo.maxStaffSize);

                yearMarks[0].value = Number(companyInfo.minDate);
                yearMarks[1].value = Number(companyInfo.maxDate);
                yearMarks[0].label = companyInfo.minDate;
                yearMarks[1].label = companyInfo.maxDate;

                yearMarksProd[0].value = Number(productInfo.minDate);
                yearMarksProd[1].value = Number(productInfo.maxDate);
                yearMarksProd[0].label = productInfo.minDate;
                yearMarksProd[1].label = productInfo.maxDate;

                this.setState({departmentsData: response.data.companyFilters.departments});
            })
            .catch(e => {
                console.log(e);
            });

        this.setState({ compInfo: companyInfo });
        this.setState({ prodInfo: productInfo });
    }

    handleProductNameChange = (event) => {
        const {
            target: { value },
        } = event;
        this.setState({ productName: value })
    };

    handleProductVerChange = (event) => {
        this.setState({ isProductVerified: event.target.checked })
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    };

    handleClose = () => {
        this.setState({ open: false })
    };

    handleTabChange = (event, newValue) => {
        this.setState({ tabVal: newValue })
        console.log(newValue);
        this.setState({ dialogTitle: newValue })
    };

    handleChange = (event) => {
        const {
            target: { value },
        } = event;
        this.setState({ departmentNames: typeof value === 'string' ? value.split(',') : value })
    };

    handleCompanyNameChange = (event) => {
        const {
            target: { value },
        } = event;
        this.setState({ companyName: value })
    }

    handleCeoNameChange = (event) => {
        const {
            target: { value },
        } = event;
        this.setState({ ceoName: value })
    }

    handleTimeRangeChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            this.setState({ dateRange: [Math.min(newValue[0], this.state.dateRange[1] - minTimeDistance), this.state.dateRange[1]] })
        } else {
            this.setState({ dateRange: [this.state.dateRange[0], Math.max(newValue[1], this.state.dateRange[0] + minTimeDistance)] })
        }
    }

    handleProductLifetimeChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            this.setState({ productLifetime: [Math.min(newValue[0], this.state.productLifetime[1] - minTimeDistance), this.state.productLifetime[1]] })
        } else {
            this.setState({ productLifetime: [this.state.productLifetime[0], Math.max(newValue[1], this.state.productLifetime[0] + minTimeDistance)] })
        }
    }

    handleStaffRangeChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            this.setState({ staffRange: [Math.min(newValue[0], this.state.staffRange[1] - minStaffDistance), this.state.staffRange[1]] })
        } else {
            this.setState({ staffRange: [this.state.staffRange[0], Math.max(newValue[1], this.state.staffRange[0] + minStaffDistance)] })
        }
    }

    clearFilters = () => {

        this.setState({ companyName: "" });
        this.setState({ ceoName: "" });
        this.setState({ dateRange: [1980, 2000] });
        this.setState({ staffRange: [100000, 400000] });
        this.setState({ departmentNames: [] });
        this.setState({ productName: "" });
        this.setState({ productLifetime: [1996, 2000] });
        this.setState({ isProductVerified: false });

        this.props.clearFilters();
        this.handleClose();
    }

    applyCompanyFilters = () => {
        var departmentIds = [];
        this.state.departmentsData.map((item) => {
            if (this.state.departmentNames.includes(item.name)) {
                departmentIds.push(item.id);
            }
            return item;
        })

        const companyFilters = {
            companyName: this.state.companyName,
            departments: departmentIds,
            ceo: this.state.ceoName,
            minDate: JSON.stringify(this.state.dateRange[0]) + "-01-01T00:00:00Z",
            maxDate: JSON.stringify(this.state.dateRange[1]) + "-01-01T00:00:00Z",
            startStaffSize: this.state.staffRange[0],
            endStaffSize: this.state.staffRange[1]
        }

        console.log(companyFilters);

        axios.post(SERVER_URL + "filterCompany", companyFilters)
            .then((response) => {
                console.log(response.data);
                this.props.changeNodesOpacity(response.data);
                this.handleClose();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    applyProductFilters = () => {

        const productFilters = {
            productName: this.state.productName,
            minDate: JSON.stringify(this.state.productLifetime[0]) + "-01-01T00:00:00Z",
            maxDate: JSON.stringify(this.state.productLifetime[1]) + "-01-01T00:00:00Z",
            isVerified: this.state.isProductVerified
        };

        axios.post(SERVER_URL + "filterProduct", productFilters)
            .then((response) => {
                console.log(response.data)
                this.props.changeNodesOpacity(response.data);
                this.handleClose();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <Toolbar data-testid="filters">
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    onClick={this.handleClickOpen}
                >
                    <SettingsIcon />
                </IconButton>
                <Dialog data-testid="dialog" open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle data-testid="dialogTitle">{this.state.dialogTitle}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ width: 450, typography: 'body1' }}>
                            <TabContext value={this.state.tabVal}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList data-testid="tabListTest" onChange={this.handleTabChange} aria-label="lab API tabs example">
                                        <Tab data-testid="compTab" label="Компании" value="Фильтрация компаний" />
                                        <Tab data-testid="prodTab" label="Продукты и релизы" value="Фильтрация продуктов" />
                                    </TabList>
                                </Box>
                                <TabPanel value="Фильтрация компаний">
                                    <FormControl sx={{ m: 1, ml: -3, minWidth: 450 }}>
                                        <TextField
                                            id="outlined-required"
                                            inputProps={{ "data-testid": "companyNameInput" }}
                                            label="Наименование компании"
                                            onChange={this.handleCompanyNameChange}
                                            value={this.state.companyName}
                                        />
    
                                    </FormControl>
                                    <FormControl sx={{ m: 1, ml: -3, minWidth: 450 }}>
                                        <TextField
                                            id="outlined-required"
                                            inputProps={{ "data-testid": "ceoNameInput" }}
                                            label="Имя владельца"
                                            onChange={this.handleCeoNameChange}
                                            value={this.state.ceoName}
                                        />
                                    </FormControl>
                                    <Box sx={{ m: 1, ml: -3, width: 450 }}>
                                        <Typography id="track-false-slider" gutterBottom>
                                            Штат сотрудников
                                        </Typography>
                                        <Slider
                                            size="small"
                                            data-testid="compStateSizeSlider"
                                            aria-labelledby="track-false-slider"
                                            defaultValue={[100000, 400000]}
                                            min={this.state.compInfo.minStaffSize}
                                            max={this.state.compInfo.maxStaffSize}
                                            marks={staffSizeMarks}
                                            valueLabelDisplay="auto"
                                            onChange={this.handleStaffRangeChange}
                                            value={this.state.staffRange}
                                            disableSwap
                                        />
                                        <Separator />
                                        <Typography id="track-false-range-slider" gutterBottom>
                                            Время существования
                                        </Typography>
                                        <Slider
                                            size="small"
                                            data-testid="compLifeTimeSlider"
                                            aria-labelledby="track-false-range-slider"
                                            defaultValue={[1980, 2000]}
                                            min={Number(this.state.compInfo.minDate)}
                                            max={Number(this.state.compInfo.maxDate)}
                                            marks={yearMarks}
                                            valueLabelDisplay="auto"
                                            onChange={this.handleTimeRangeChange}
                                            value={this.state.dateRange}
                                            disableSwap
                                        />
                                    </Box>
                                    <FormControl sx={{ m: 1, ml: -3, width: 450 }}>
                                        <InputLabel id="demo-multiple-checkbox-label">Отрасли</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            inputProps={{ "data-testid": "departmentsSelect" }}
                                            value={this.state.departmentNames}
                                            onChange={this.handleChange}
                                            input={<OutlinedInput label="Отрасли" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {this.state.compInfo &&
                                                this.state.compInfo.departments.map(item => (
                                                    <MenuItem key={Math.random().toString(36).substring(2, 9)} value={item}>
                                                        <Checkbox checked={this.state.departmentNames.indexOf(item) > -1} />
                                                        <ListItemText primary={item} />
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                    <Separator />
                                    <Box sx={{ m: 1, ml: -3, width: 450 }}>
                                        <Button data-testid="applyCompBtn" variant="contained" onClick={this.applyCompanyFilters}>Применить</Button>
                                        <Button data-testid="resetBtn" onClick={this.clearFilters} variant="text">
                                            Сбросить
                                        </Button>
                                    </Box>
                                </TabPanel>
                                <TabPanel value="Фильтрация продуктов">
                                    <FormControl sx={{ m: 1, ml: -3, minWidth: 450 }}>
                                        <TextField
                                            id="outlined-required"
                                            inputProps={{ "data-testid": "productNameInput" }}
                                            label="Наименование продукта"
                                            value={this.state.productName}
                                            onChange={this.handleProductNameChange}
                                        />
                                    </FormControl>
                                    <Box sx={{ m: 1, ml: -3, width: 450 }}>
                                        <Typography id="track-false-range-slider" gutterBottom>
                                            Время существования
                                        </Typography>
                                        <Slider
                                            size="small"
                                            aria-labelledby="track-false-range-slider"
                                            data-testid="prodLifetimeSlider"
                                            defaultValue={[1996, 2000]}
                                            min={Number(this.state.prodInfo.minDate)}
                                            max={Number(this.state.prodInfo.maxDate)}
                                            marks={yearMarksProd}
                                            valueLabelDisplay="auto"
                                            onChange={this.handleProductLifetimeChange}
                                            value={this.state.productLifetime}
                                            disableSwap
                                        />
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox checked={this.state.isProductVerified} onChange={this.handleProductVerChange} />} label="Релиз подтвержден" />
                                        </FormGroup>
                                        <Separator />
                                        <Button data-testid="applyProdBtn" onClick={this.applyProductFilters} variant="contained">Применить</Button>
                                        <Button onClick={this.clearFilters} variant="text">
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

}

export default Filters;