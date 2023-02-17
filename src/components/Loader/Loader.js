import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const Loader = () => {
    return (
        <Box data-testid = "loader" sx={{ width: '100%' }}>
            <LinearProgress />
        </Box>
    );
}

export default Loader;